from uuid import UUID

from sqlalchemy.orm import Session

from app.models.appointment import Appointment
from app.models.doctor import Doctor
from app.models.user import User
from app.repositories.appointment_repository import AppointmentRepository
from app.schemas.appointment import AppointmentCreate


class AppointmentService:

    def __init__(self, db: Session):
        self.db = db
        self.repository = AppointmentRepository(db)

    def book_appointment(
        self,
        appointment_data: AppointmentCreate,
        current_user: User,
    ) -> Appointment:

        # Check if doctor exists
        doctor = (
            self.db.query(Doctor)
            .filter(Doctor.id == appointment_data.doctor_id)
            .first()
        )

        if not doctor:
            raise ValueError("Doctor not found")

        # Check doctor's availability
        existing = self.repository.get_doctor_appointment(
            appointment_data.doctor_id,
            appointment_data.appointment_time,
        )

        if existing:
            raise ValueError(
                "Doctor is already booked at this time."
            )

        appointment = Appointment(
            patient_id=current_user.id,
            doctor_id=appointment_data.doctor_id,
            appointment_time=appointment_data.appointment_time,
            reason=appointment_data.reason,
        )

        return self.repository.create(appointment)

    def get_my_appointments(
        self,
        current_user: User,
    ):
        return self.repository.get_by_patient(
            current_user.id
        )

    def cancel_appointment(
        self,
        appointment_id: UUID,
        current_user: User,
    ):

        appointment = self.repository.get_by_id(
            appointment_id
        )

        if not appointment:
            raise ValueError(
                "Appointment not found"
            )

        if appointment.patient_id != current_user.id:
            raise ValueError(
                "You cannot cancel this appointment"
            )

        return self.repository.cancel(
            appointment
        )