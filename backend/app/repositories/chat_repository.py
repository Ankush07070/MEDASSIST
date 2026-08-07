from uuid import UUID

from sqlalchemy.orm import Session

from app.models.chat import Chat


class ChatRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        patient_id: UUID,
        report_id: UUID | None,
        question: str,
        answer: str,
    ) -> Chat:

        chat = Chat(
            patient_id=patient_id,
            report_id=report_id,
            question=question,
            answer=answer,
        )

        self.db.add(chat)
        self.db.commit()
        self.db.refresh(chat)

        return chat

    def get_history(
        self,
        patient_id: UUID,
        limit: int = 20,
    ) -> list[Chat]:

        return (
            self.db.query(Chat)
            .filter(Chat.patient_id == patient_id)
            .order_by(Chat.created_at.desc())
            .limit(limit)
            .all()
        )