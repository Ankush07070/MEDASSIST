from datetime import datetime
from uuid import UUID

from sqlalchemy.orm import Session, joinedload, selectinload

from app.models.appointment import Appointment
from app.models.doctor import Doctor


class AppointmentRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        appointment: Appointment,
    ) -> Appointment:

        self.db.add(appointment)

        self.db.commit()

        self.db.refresh(appointment)

        return appointment

    def get_by_id(
        self,
        appointment_id: UUID,
        *,
        for_update: bool = False,
    ) -> Appointment | None:

        query = (
            self.db.query(Appointment)
            .options(
                selectinload(Appointment.doctor).selectinload(Doctor.hospital),
                selectinload(Appointment.patient),
            )
            .filter(Appointment.id == appointment_id)
        )

        if for_update:
            query = query.with_for_update()

        return query.first()

    def get_doctor_for_update(
        self,
        doctor_id: UUID,
    ) -> Doctor | None:
        return (
            self.db.query(Doctor)
            .filter(Doctor.id == doctor_id)
            .with_for_update()
            .first()
        )

    def get_by_patient(
        self,
        patient_id: UUID,
    ) -> list[Appointment]:

        return (
            self.db.query(Appointment)
            .options(
                joinedload(Appointment.doctor).joinedload(Doctor.hospital),
                joinedload(Appointment.patient)
            )
            .filter(
                Appointment.patient_id == patient_id
            )
            .order_by(
                Appointment.appointment_time.desc()
            )
            .all()
        )

    def get_by_doctor(
        self,
        doctor_id: UUID,
    ) -> list[Appointment]:

        return (
            self.db.query(Appointment)
            .options(
                joinedload(Appointment.doctor).joinedload(Doctor.hospital),
                joinedload(Appointment.patient),
            )
            .filter(
                Appointment.doctor_id == doctor_id
            )
            .order_by(
                Appointment.appointment_time.desc()
            )
            .all()
        )

    def get_doctor_appointment(
        self,
        doctor_id: UUID,
        appointment_time: datetime,
    ) -> Appointment | None:

        return (
            self.db.query(Appointment)
            .filter(
                Appointment.doctor_id == doctor_id,
                Appointment.appointment_time == appointment_time,
                Appointment.status.in_(["booked", "confirmed"]),
            )
            .first()
        )

    def get_patient_appointment(
        self,
        patient_id: UUID,
        appointment_time: datetime,
    ) -> Appointment | None:

        return (
            self.db.query(Appointment)
            .filter(
                Appointment.patient_id == patient_id,
                Appointment.appointment_time == appointment_time,
                Appointment.status.in_(["booked", "confirmed"]),
            )
            .first()
        )

    def cancel(
        self,
        appointment: Appointment,
    ) -> Appointment:

        appointment.status = "cancelled"

        self.db.commit()

        self.db.refresh(appointment)

        return appointment

    def update_status(
        self,
        appointment: Appointment,
        status: str,
    ) -> Appointment:

        appointment.status = status

        self.db.commit()
        self.db.refresh(appointment)

        return appointment