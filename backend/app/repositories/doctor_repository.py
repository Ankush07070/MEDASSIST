from uuid import UUID

from sqlalchemy.orm import Session

from app.models.doctor import Doctor


class DoctorRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        doctor: Doctor,
    ) -> Doctor:

        self.db.add(doctor)
        self.db.commit()
        self.db.refresh(doctor)

        return doctor

    def get_all(self) -> list[Doctor]:

        return (
            self.db.query(Doctor)
            .order_by(Doctor.full_name)
            .all()
        )

    def get_by_id(
        self,
        doctor_id: UUID,
    ) -> Doctor | None:

        return (
            self.db.query(Doctor)
            .filter(Doctor.id == doctor_id)
            .first()
        )

    def get_by_hospital(
        self,
        hospital_id: UUID,
    ) -> list[Doctor]:

        return (
            self.db.query(Doctor)
            .filter(Doctor.hospital_id == hospital_id)
            .order_by(Doctor.full_name)
            .all()
        )

    def get_by_specialization(
        self,
        specialization: str,
    ) -> list[Doctor]:

        return (
            self.db.query(Doctor)
            .filter(
                Doctor.specialization.ilike(specialization)
            )
            .order_by(Doctor.full_name)
            .all()
        )

    def get_available(self) -> list[Doctor]:

        return (
            self.db.query(Doctor)
            .filter(Doctor.is_available == True)
            .order_by(Doctor.full_name)
            .all()
        )

    def delete(
        self,
        doctor: Doctor,
    ) -> None:

        self.db.delete(doctor)
        self.db.commit()