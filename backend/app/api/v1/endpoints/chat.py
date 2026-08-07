from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.schemas.chat import ChatHistoryItem

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService
from app.services.rag_service import RAGService

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post(
    "",
    response_model=ChatResponse,
)
def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    rag = RAGService()

    chat_service = ChatService(db)

    response = rag.answer_question(
        patient_id=str(current_user.id),
        question=request.question,
        report_id=request.report_id,
    )

    if response["answer"]:

        try:

            chat_service.save_chat(
                patient_id=current_user.id,
                report_id=(
                    UUID(request.report_id)
                    if request.report_id
                    else None
                ),
                question=request.question,
                answer=response["answer"],
            )

        except Exception as e:

            print(f"Failed to save chat: {e}")

    return response

@router.get(
    "/history",
    response_model=List[ChatHistoryItem],
)
def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    chat_service = ChatService(db)

    chats = chat_service.get_chat_history(
        patient_id=current_user.id,
    )

    return [
        ChatHistoryItem(
            id=str(chat.id),
            question=chat.question,
            answer=chat.answer,
            report_id=(
                str(chat.report_id)
                if chat.report_id
                else None
            ),
            created_at=chat.created_at,
        )
        for chat in chats
    ]