from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.chat import (
    ChatHistoryItem,
    ChatRequest,
    ChatResponse,
)
from app.services.chat_service import ChatService
from app.services.rag_service import RAGService


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


# =========================================================
# SEND CHAT MESSAGE
# =========================================================

@router.post(
    "",
    response_model=ChatResponse,
)
def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    # -----------------------------------------------------
    # Validate question
    # -----------------------------------------------------

    question = request.question.strip()

    if not question:

        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty.",
        )

    # -----------------------------------------------------
    # Validate report_id
    # -----------------------------------------------------

    report_uuid: UUID | None = None

    if request.report_id:

        try:

            report_uuid = UUID(
                str(request.report_id)
            )

        except ValueError:

            raise HTTPException(
                status_code=400,
                detail="Invalid report_id.",
            )

    # -----------------------------------------------------
    # RAG
    # -----------------------------------------------------

    try:

        rag = RAGService()

        response = rag.answer_question(
            patient_id=str(current_user.id),
            question=question,
            report_id=(
                str(report_uuid)
                if report_uuid
                else None
            ),
        )

    except Exception as e:

        print(
            f"RAG error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "MEDASSIST AI could not process "
                "your question right now."
            ),
        )

    # -----------------------------------------------------
    # Save conversation
    # -----------------------------------------------------

    answer = (
        response.get("answer")
        if response
        else None
    )

    if answer:

        try:

            chat_service = ChatService(db)

            chat_service.save_chat(
                patient_id=current_user.id,
                report_id=report_uuid,
                question=question,
                answer=answer,
            )

        except Exception as e:

            # Saving history must not break
            # a successful AI response.

            print(
                f"Failed to save chat history: {e}"
            )

    # -----------------------------------------------------
    # Return AI answer only
    # -----------------------------------------------------

    return {
        "answer": answer
    }


# =========================================================
# CHAT HISTORY
# =========================================================

@router.get(
    "/history",
    response_model=list[ChatHistoryItem],
)
def get_chat_history(
    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    chat_service = ChatService(db)

    chats = chat_service.get_chat_history(
        patient_id=current_user.id,
        limit=limit,
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