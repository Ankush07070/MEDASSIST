from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str
    report_id: Optional[str] = None


class ChatResponse(BaseModel):
    answer: str
    


class ChatHistoryItem(BaseModel):
    id: str
    question: str
    answer: str
    report_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True