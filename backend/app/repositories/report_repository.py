from uuid import UUID

from sqlalchemy.orm import Session

from app.models.report import Report


class ReportRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        report: Report,
    ) -> Report:

        self.db.add(report)
        self.db.commit()
        self.db.refresh(report)

        return report

    def get_by_patient(
        self,
        patient_id: UUID,
    ) -> list[Report]:

        return (
            self.db.query(Report)
            .filter(Report.patient_id == patient_id)
            .all()
        )

    def get_by_id(
    self,
    report_id: str,
    ):
       return (
        self.db.query(Report)
        .filter(Report.id == report_id)
        .first()
        ) 