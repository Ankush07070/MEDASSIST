from typing import List, Dict, Any

import chromadb


class VectorRepository:
    
    #Handles all interactions with ChromaDB.
    

    def __init__(self):
        self.client = chromadb.PersistentClient(
            path="chroma_db"
        )

        self.collection = self.client.get_or_create_collection(
            name="medical_reports"
        )

    def add_chunks(
        self,
        ids: List[str],
        embeddings: List[List[float]],
        documents: List[str],
        metadatas: List[Dict[str, Any]],
    ) -> None:
    
        #Store report chunks in ChromaDB.
        

        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
        )

    def search(
        self,
        embedding: List[float],
        patient_id: str,
        report_id: str | None = None,
        n_results: int = 5,
    ) -> Dict[str, Any]:

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
            n_results=n_results,
            where=where,
        )

    def delete_report(
        self,
        report_id: str,
    ) -> None:
        
        #Delete all vectors belonging to one report.
        

        self.collection.delete(
            where={
                "report_id": report_id
            }
        )

    def update_chunk(
        self,
        chunk_id: str,
        embedding: List[float],
        document: str,
        metadata: Dict[str, Any],
    ) -> None:
    
        #Update a single chunk.
        

        self.collection.update(
            ids=[chunk_id],
            embeddings=[embedding],
            documents=[document],
            metadatas=[metadata],
        )

    def get_chunk(
        self,
        chunk_id: str,
    ) -> Dict[str, Any]:
        
        #Fetch chunk by ID.
        

        return self.collection.get(
            ids=[chunk_id]
        )

    def get_patient_chunks(
        self,
        patient_id: str,
    ) -> Dict[str, Any]:
        
        #Retrieve every chunk belonging to a patient.
        

        return self.collection.get(
            where={
                "patient_id": patient_id
            }
        )

    def report_exists(
        self,
        report_id: str,
    ) -> bool:
        
        #Check whether vectors exist for a report.
        

        result = self.collection.get(
            where={
                "report_id": report_id
            }
        )

        return len(result["ids"]) > 0

    def count(self) -> int:
        
        #Return total number of vectors.
    

        return self.collection.count()