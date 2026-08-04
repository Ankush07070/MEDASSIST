import os
import tempfile
from uuid import UUID

import requests
from fastapi import UploadFile
from app.services.gemini_service import GeminiService

from app.database.session import SessionLocal
from app.models.report import Report
from app.models.user import User
from app.repositories.report_repository import ReportRepository
from app.utils.cloudinary_storage import CloudinaryStorage
from app.utils.pdf_extractor import PDFExtractor


class ReportService:

    def __init__(self, db):
        self.repository = ReportRepository(db)

    def upload_report(
        self,
        file: UploadFile,
        current_user: User,
    ) -> Report:

        upload = CloudinaryStorage.upload_report(
            file=file,
            user_id=current_user.id,
        )

        report = Report(
            patient_id=current_user.id,
            file_name=file.filename,
            file_url=upload["url"],
            cloudinary_public_id=upload["public_id"],
            report_type=file.content_type,
            extracted_text=None,
            ai_summary=None,
            processing_status="processing",
        )

        return self.repository.create(report)

    def process_report(
        self,
        report_id: UUID,
    ):

        db = SessionLocal()
        report = None
        temp_path = None

        try:
            repository = ReportRepository(db)

            report = repository.get_by_id(report_id)

            if report is None:
                return

            # Download PDF from Cloudinary
            response = requests.get(report.file_url)

            response.raise_for_status()

            # Save temporarily
            with tempfile.NamedTemporaryFile(
                suffix=".pdf",
                delete=False,
            ) as temp_file:

                temp_file.write(response.content)
                temp_path = temp_file.name

            # Extract text
            report.extracted_text = PDFExtractor.extract_text(
                temp_path
            )

            from app.services.gemini_service import GeminiService

            gemini = GeminiService()

            summary = gemini.generate_summary(
                report.extracted_text
            )

            report.ai_summary = summary

            if summary.startswith("AI Summary unavailable"):
                report.processing_status = "failed"
            else:
                report.processing_status = "completed"

            db.commit()

            # Delete PDF from Cloudinary
            if report.cloudinary_public_id:
                CloudinaryStorage.delete_report(
                    report.cloudinary_public_id
                )

            # Remove Cloudinary references
            report.file_url = None
            report.cloudinary_public_id = None

            db.commit()

        except Exception as e:

            print(e)

            if report:
                report.processing_status = "failed"
                db.commit()

        finally:

            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)

            db.close()

    def my_reports(
        self,
        current_user: User,
    ):
        return self.repository.get_by_patient(
            current_user.id
        )