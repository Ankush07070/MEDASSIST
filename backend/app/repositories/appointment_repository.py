from datetime import datetime
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.appointment import Appointment


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
    ) -> Appointment | None:

        return (
            self.db.query(Appointment)
            .filter(
                Appointment.id == appointment_id
            )
            .first()
        )

   

    def get_by_patient(
        self,
        patient_id: UUID,
    ) -> list[Appointment]:

        return (
            self.db.query(Appointment)
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
                Appointment.status == "booked",
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
                Appointment.status == "booked",
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