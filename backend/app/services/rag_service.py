import time
from pathlib import Path

from google import genai

from app.core.config import settings
from app.repositories.vector_repository import VectorRepository
from app.services.chunking_service import ChunkingService
from app.services.embedding_service import EmbeddingService


PROMPT_PATH = (
    Path(__file__).resolve().parent.parent
    / "prompts"
    / "rag_prompt.txt"
)


class RAGService:

    def __init__(self):

        self.chunker = ChunkingService()

        self.embedding_service = (
            EmbeddingService()
        )

        self.vector_repository = (
            VectorRepository()
        )

        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

        with open(
            PROMPT_PATH,
            "r",
            encoding="utf-8",
        ) as f:

            self.prompt_template = f.read()

    # ==================================================
    # INDEX REPORT
    # ==================================================

    def index_report(
        self,
        report_id: str,
        patient_id: str,
        text: str,
    ) -> None:

        if not text or not text.strip():

            print(
                f"Skipping report {report_id}: "
                "no text available."
            )

            return

        print("=" * 60)
        print("INDEXING REPORT")
        print(f"Report ID: {report_id}")
        print("=" * 60)

        # Remove existing vectors first.
        # Prevents duplicate chunks when re-indexing.
        try:

            self.vector_repository.delete_report(
                report_id
            )

        except Exception as e:

            print(
                "Warning: could not remove "
                f"old vectors: {e}"
            )

        chunks = self.chunker.chunk_text(text)

        if not chunks:

            print("No chunks generated.")

            return

        print(
            f"Total chunks generated: {len(chunks)}"
        )

        ids = []
        embeddings = []
        documents = []
        metadatas = []

        for index, chunk in enumerate(chunks):

            if not chunk or not chunk.strip():
                continue

            print(
                f"Embedding chunk "
                f"{index + 1}/{len(chunks)}"
            )

            try:

                embedding = (
                    self.embedding_service
                    .generate_embedding(chunk)
                )

            except Exception as e:

                print(
                    f"Embedding failed for "
                    f"chunk {index}: {e}"
                )

                continue

            ids.append(
                f"{report_id}_{index}"
            )

            embeddings.append(
                embedding
            )

            documents.append(
                chunk
            )

            metadatas.append(
                {
                    "patient_id": patient_id,
                    "report_id": report_id,
                    "chunk_index": index,
                }
            )

        if not ids:

            print(
                "No chunks were successfully embedded."
            )

            return

        print(
            f"Saving {len(ids)} vectors..."
        )

        self.vector_repository.add_chunks(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
        )

        print(
            "Report indexed successfully."
        )

        print("=" * 60)

    # ==================================================
    # RETRIEVE RELEVANT CHUNKS
    # ==================================================

  
    def retrieve_chunks(
        self,
        patient_id: str,
        question: str,
        report_id: str | None = None,
        n_results: int = 5,
    ) -> dict:

        question = question.strip()

        if not question:

            return {
                "documents": [[]],
                "metadatas": [[]],
                "distances": [[]],
            }

        # Keep retrieval focused.
        n_results = max(
            1,
            min(n_results, 10),
        )

        # Generate embedding for the patient's question.
        embedding = (
            self.embedding_service
            .generate_embedding(question)
        )

        # VectorRepository handles:
        #
        # 1. Patient-level isolation
        # 2. Optional report-level filtering
        #
        # report_id=None
        #   → search across patient's reports
        #
        # report_id=<id>
        #   → search only that report

        return self.vector_repository.search(
            embedding=embedding,
            patient_id=patient_id,
            report_id=report_id,
            n_results=n_results,
        )
        

    # ==================================================
    # BUILD CONTEXT
    # ==================================================

    def build_context(
        self,
        search_results: dict,
    ) -> str:

        documents_data = (
            search_results.get("documents")
            or []
        )

        if not documents_data:
            return ""

        documents = (
            documents_data[0]
            if documents_data[0]
            else []
        )

        if not documents:
            return ""

        context_parts = []
        seen_chunks = set()

        for document in documents:

            if not document or not document.strip():
                continue

            normalized = " ".join(
                document.split()
            ).strip().lower()

            if not normalized:
                continue

            if normalized in seen_chunks:
                continue

            seen_chunks.add(normalized)

            context_parts.append(
                document.strip()
            )

        return "\n\n".join(
            context_parts
        )
    # ==================================================
    # ANSWER QUESTION
    # ==================================================

    def answer_question(
        self,
        patient_id: str,
        question: str,
        report_id: str | None = None,
    ) -> dict:

        question = question.strip()

        if not question:

            return {
                "answer": (
                    "Please enter a question "
                    "about your medical reports."
                )
            }

        # ----------------------------------------------
        # Retrieve relevant report chunks
        # ----------------------------------------------

        try:

            search_results = (
                self.retrieve_chunks(
                    patient_id=patient_id,
                    question=question,
                    report_id=report_id,
                    n_results=5,
                )
            )

        except Exception as e:

            print(
                f"Retrieval failed: {e}"
            )

            return {
                "answer": (
                    "I could not retrieve information "
                    "from your uploaded reports."
                )
            }

        # ----------------------------------------------
        # Build context
        # ----------------------------------------------

        context = self.build_context(
            search_results
        )

        # ----------------------------------------------
        # No relevant information
        # ----------------------------------------------

        if not context.strip():

            return {
                "answer": (
                    "I could not find that information "
                    "in your uploaded reports."
                )
            }

        # ----------------------------------------------
        # Build RAG prompt
        # ----------------------------------------------

        prompt = (
            self.prompt_template
            .replace(
                "{context}",
                context,
            )
            .replace(
                "{question}",
                question,
            )
        )

        # ----------------------------------------------
        # Generate answer
        # ----------------------------------------------

        for attempt in range(3):

            try:

                response = (
                    self.client.models
                    .generate_content(
                        model=settings.GEMINI_MODEL,
                        contents=prompt,
                    )
                )

                answer = (
                    response.text.strip()
                    if response.text
                    else (
                        "I could not generate "
                        "an answer from your "
                        "uploaded reports."
                    )
                )

                return {
                    "answer": answer
                }

            except Exception as e:

                print(
                    f"Gemini attempt "
                    f"{attempt + 1} failed: {e}"
                )

                if attempt < 2:

                    time.sleep(2)

        # ----------------------------------------------
        # Final fallback
        # ----------------------------------------------

        return {
            "answer": (
                "AI is temporarily unavailable. "
                "Please try again later."
            )
        }