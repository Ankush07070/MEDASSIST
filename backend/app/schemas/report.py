from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ReportResponse(BaseModel):
    id: UUID
    file_name: str
    file_url: str | None
    report_type: str
    extracted_text: str | None
    ai_summary: str | None
    processing_status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)