from uuid import UUID

from sqlalchemy.orm import Session

from app.models.chat import Chat
from app.repositories.chat_repository import ChatRepository


class ChatService:

    def __init__(self, db: Session):
        self.repository = ChatRepository(db)

    def save_chat(
        self,
        patient_id: UUID,
        report_id: UUID | None,
        question: str,
        answer: str,
    ) -> Chat:

        return self.repository.create(
            patient_id=patient_id,
            report_id=report_id,
            question=question,
            answer=answer,
        )

    def get_chat_history(
        self,
        patient_id: UUID,
        limit: int = 20,
    ) -> list[Chat]:

        return self.repository.get_history(
            patient_id=patient_id,
            limit=limit,
        )