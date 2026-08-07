import time
from pathlib import Path
from typing import Any

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

        self.embedding_service = EmbeddingService()

        self.vector_repository = VectorRepository()

        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY,
        )

        with open(
            PROMPT_PATH,
            "r",
            encoding="utf-8",
        ) as f:

            self.prompt_template = f.read()

   

    def index_report(
        self,
        report_id: str,
        patient_id: str,
        text: str,
    ) -> None:

        print("=" * 60)
        print("INDEXING REPORT")
        print("=" * 60)

        chunks = self.chunker.chunk_text(text)

        print(f"Total chunks: {len(chunks)}")

        ids = []
        embeddings = []
        documents = []
        metadatas = []

        for index, chunk in enumerate(chunks):

            print(
                f"Generating embedding {index + 1}/{len(chunks)}"
            )

            embedding = self.embedding_service.generate_embedding(
                chunk
            )

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

        print("Saving vectors to ChromaDB...")

        self.vector_repository.add_chunks(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
        )

        print("Vectors stored successfully.")
        print("=" * 60)

  
    
    def retrieve_chunks(
        self,
        patient_id: str,
        question: str,
        report_id: str | None = None,
        n_results: int = 5,
    ) -> dict[str, Any]:

        embedding = self.embedding_service.generate_embedding(
            question
        )

        return self.vector_repository.search(
            embedding=embedding,
            patient_id=patient_id,
            report_id=report_id,
            n_results=n_results,
        )

   
    def build_context(
        self,
        search_results: dict[str, Any],
    ) -> tuple[str, list]:

        documents = search_results["documents"][0]

        metadatas = search_results["metadatas"][0]

        context = "\n\n".join(
            documents
        )

        sources = []

        for metadata in metadatas:

            sources.append(
                {
                    "report_id": metadata["report_id"],
                    "chunk_index": metadata["chunk_index"],
                }
            )

        return context, sources

    

    def answer_question(
        self,
        patient_id: str,
        question: str,
        report_id: str | None = None,
    ) -> dict:

        search_results = self.retrieve_chunks(
            patient_id=patient_id,
            question=question,
            report_id=report_id,
        )

        context, sources = self.build_context(
            search_results
        )

        prompt = (
            self.prompt_template
            .replace("{context}", context)
            .replace("{question}", question)
        )

        for attempt in range(3):

            try:

                response = self.client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=prompt,
                )

                return {
                    "answer": response.text,
                    "sources": sources,
                }

            except Exception as e:

                print(f"Attempt {attempt + 1} failed: {e}")

                if attempt == 2:
                    return {
                        "answer": f"AI is temporarily unavailable.\n\n{e}",
                        "sources": sources,
                    }

                time.sleep(3)