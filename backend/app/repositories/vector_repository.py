from typing import List, Dict, Any

import chromadb


class VectorRepository:
    """
    Handles all interactions with ChromaDB.
    """

    def __init__(self):

        self.client = chromadb.PersistentClient(
            path="chroma_db"
        )

        self.collection = (
            self.client.get_or_create_collection(
                name="medical_reports"
            )
        )

    # ==================================================
    # ADD CHUNKS
    # ==================================================

    def add_chunks(
        self,
        ids: List[str],
        embeddings: List[List[float]],
        documents: List[str],
        metadatas: List[Dict[str, Any]],
    ) -> None:

        if not ids:
            return

        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
        )

    # ==================================================
    # SEARCH
    # ==================================================

    def search(
        self,
        embedding: List[float],
        patient_id: str,
        report_id: str | None = None,
        n_results: int = 5,
    ) -> Dict[str, Any]:

        if self.collection.count() == 0:

            return {
                "documents": [[]],
                "metadatas": [[]],
                "distances": [[]],
            }

        if report_id:

            where = {
                "$and": [
                    {
                        "patient_id": patient_id,
                    },
                    {
                        "report_id": report_id,
                    },
                ]
            }

        else:

            where = {
                "patient_id": patient_id,
            }

        return self.collection.query(
            query_embeddings=[embedding],
            n_results=min(
                n_results,
                self.collection.count(),
            ),
            where=where,
        )

    # ==================================================
    # DELETE REPORT
    # ==================================================

    def delete_report(
        self,
        report_id: str,
    ) -> None:

        self.collection.delete(
            where={
                "report_id": report_id
            }
        )

    # ==================================================
    # UPDATE CHUNK
    # ==================================================

    def update_chunk(
        self,
        chunk_id: str,
        embedding: List[float],
        document: str,
        metadata: Dict[str, Any],
    ) -> None:

        self.collection.update(
            ids=[chunk_id],
            embeddings=[embedding],
            documents=[document],
            metadatas=[metadata],
        )

    # ==================================================
    # GET CHUNK
    # ==================================================

    def get_chunk(
        self,
        chunk_id: str,
    ) -> Dict[str, Any]:

        return self.collection.get(
            ids=[chunk_id]
        )

    # ==================================================
    # GET PATIENT CHUNKS
    # ==================================================

    def get_patient_chunks(
        self,
        patient_id: str,
    ) -> Dict[str, Any]:

        return self.collection.get(
            where={
                "patient_id": patient_id
            }
        )

    # ==================================================
    # CHECK REPORT EXISTS
    # ==================================================

    def report_exists(
        self,
        report_id: str,
    ) -> bool:

        result = self.collection.get(
            where={
                "report_id": report_id
            }
        )

        return len(
            result.get("ids", [])
        ) > 0

    # ==================================================
    # COUNT
    # ==================================================

    def count(self) -> int:

        return self.collection.count()