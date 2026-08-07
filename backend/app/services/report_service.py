import os
import tempfile
from uuid import UUID

import requests
from fastapi import UploadFile

from app.database.session import SessionLocal
from app.models.report import Report
from app.models.user import User
from app.repositories.report_repository import ReportRepository
from app.services.gemini_service import GeminiService
from app.services.rag_service import RAGService
from app.utils.cloudinary_storage import CloudinaryStorage
from app.utils.pdf_extractor import PDFExtractor


class ReportService:

    def __init__(self, db):
        self.repository = ReportRepository(db)
        self.gemini_service = GeminiService()
        self.rag_service = RAGService()

    def upload_report(
        self,
        file: UploadFile,
        current_user: User,
    ) -> Report:

        print("=" * 60)
        print("Uploading report...")

        upload = CloudinaryStorage.upload_report(
            file=file,
            user_id=current_user.id,
        )

        print("Uploaded to Cloudinary")

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

        report = self.repository.create(report)

        print(f"Report created with ID: {report.id}")
        print("=" * 60)

        return report

    def process_report(
        self,
        report_id: UUID,
    ):

        print()
        print("=" * 60)
        print("process_report() started")
        print(f"Report ID: {report_id}")
        print("=" * 60)

        db = SessionLocal()
        report = None
        temp_path = None

        try:

            print("Creating repository...")
            repository = ReportRepository(db)

            print("Fetching report...")
            report = repository.get_by_id(report_id)

            if report is None:
                raise Exception("Report not found.")

            print("Downloading PDF from Cloudinary...")

            response = requests.get(report.file_url)
            response.raise_for_status()

            print("PDF downloaded successfully.")

            with tempfile.NamedTemporaryFile(
                suffix=".pdf",
                delete=False,
            ) as temp_file:

                temp_file.write(response.content)
                temp_path = temp_file.name

            print(f"Temporary file created: {temp_path}")

            print("Extracting text...")

            report.extracted_text = PDFExtractor.extract_text(
                temp_path
            )

            if not report.extracted_text.strip():
                raise Exception(
                    "No text extracted from report."
                )

            print("Text extraction completed.")
            print(
                f"Extracted {len(report.extracted_text)} characters."
            )

            print("Generating AI summary...")

            report.ai_summary = (
                self.gemini_service.generate_summary(
                    report.extracted_text
                )
            )

            print("AI summary generated.")

            print("Starting RAG indexing...")

            self.rag_service.index_report(
                report_id=str(report.id),
                patient_id=str(report.patient_id),
                text=report.extracted_text,
            )

            print("✅ RAG indexing completed successfully.")

            if report.ai_summary.startswith(
                "AI Summary unavailable"
            ):
                report.processing_status = "failed"
            else:
                report.processing_status = "completed"

            print("Saving report to database...")

            db.commit()

            print("Database updated.")

            if report.cloudinary_public_id:

                print("Deleting Cloudinary file...")

                CloudinaryStorage.delete_report(
                    report.cloudinary_public_id
                )

                print("Cloudinary file deleted.")

            report.file_url = None
            report.cloudinary_public_id = None

            db.commit()

            print("Cloudinary references removed from database.")

            print("=" * 60)
            print("Report processing completed successfully.")
            print("=" * 60)

        except Exception as e:

            print("=" * 60)
            print("PROCESS REPORT FAILED")
            print(type(e).__name__)
            print(e)
            print("=" * 60)

            if report:
                report.processing_status = "failed"
                db.commit()

        finally:

            if (
                temp_path
                and os.path.exists(temp_path)
            ):
                os.remove(temp_path)
                print("Temporary file deleted.")

            db.close()

            print("Database session closed.")

    def my_reports(
        self,
        current_user: User,
    ):
        return self.repository.get_by_patient(
            current_user.id
        )