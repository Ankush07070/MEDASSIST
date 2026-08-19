from datetime import datetime, timezone
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

        appointment_time = appointment_data.appointment_time

        # Make sure datetime is timezone-aware
        if appointment_time.tzinfo is None:
            appointment_time = appointment_time.replace(
                tzinfo=timezone.utc
            )

        # Check appointment is not in the past
        if appointment_time <= datetime.now(timezone.utc):
            raise ValueError(
                "Appointment time must be in the future."
            )

        # Check doctor exists
        doctor = (
            self.db.query(Doctor)
            .filter(
                Doctor.id == appointment_data.doctor_id
            )
            .first()
        )

        if not doctor:
            raise ValueError(
                "Doctor not found."
            )

        # Check doctor is available
        if not doctor.is_available:
            raise ValueError(
                "Doctor is currently unavailable."
            )

        # Check doctor already booked
        existing = self.repository.get_doctor_appointment(
            appointment_data.doctor_id,
            appointment_time,
        )

        if existing:
            raise ValueError(
                "Doctor is already booked at this time."
            )

        # Check patient already has appointment
        patient_existing = (
            self.repository.get_patient_appointment(
                current_user.id,
                appointment_time,
            )
        )

        if patient_existing:
            raise ValueError(
                "You already have an appointment at this time."
            )

        appointment = Appointment(
            patient_id=current_user.id,
            doctor_id=appointment_data.doctor_id,
            appointment_time=appointment_time,
            reason=appointment_data.reason,
            status="booked",
        )

        return self.repository.create(appointment)
 
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
                "Appointment not found."
            )

        # Only the patient who owns the appointment
        # can cancel it
        if appointment.patient_id != current_user.id:
            raise ValueError(
                "You cannot cancel this appointment."
            )

        # Terminal states cannot be cancelled
        if appointment.status == "cancelled":
            raise ValueError(
                "Appointment is already cancelled."
            )

        if appointment.status == "rejected":
            raise ValueError(
                "Rejected appointment cannot be cancelled."
            )

        if appointment.status == "completed":
            raise ValueError(
                "Completed appointment cannot be cancelled."
            )

        appointment_time = appointment.appointment_time
        if appointment_time.tzinfo is None:
            appointment_time = appointment_time.replace(tzinfo=timezone.utc)

        if appointment_time <= datetime.now(timezone.utc):
            raise ValueError(
                "Past appointments cannot be cancelled."
            )

        return self.repository.cancel(
            appointment
        )

    def update_appointment_status(
        self,
        appointment_id: UUID,
        current_user: User,
        new_status: str,
    ):

        appointment = self.repository.get_by_id(
            appointment_id
        )

        if not appointment:
            raise ValueError(
                "Appointment not found."
            )

        # Find doctor's profile
        doctor = (
            self.db.query(Doctor)
            .filter(
                Doctor.user_id == current_user.id
            )
            .first()
        )

        if not doctor:
            raise ValueError(
                "Doctor profile not found."
            )

        # Make sure appointment belongs to this doctor
        if appointment.doctor_id != doctor.id:
            raise ValueError(
                "You cannot modify this appointment."
            )

        # Validate status transition
        if appointment.status == "cancelled":
            raise ValueError(
                "Cancelled appointment cannot be modified."
            )

        if appointment.status == "rejected":
            raise ValueError(
                "Rejected appointment cannot be modified."
            )

        if appointment.status == "completed":
            raise ValueError(
                "Completed appointment cannot be modified."
            )

        appointment_time = appointment.appointment_time
        if appointment_time.tzinfo is None:
            appointment_time = appointment_time.replace(
                tzinfo=timezone.utc
            )
        now = datetime.now(timezone.utc)

        if new_status == "confirmed":

            if appointment.status != "booked":
                raise ValueError(
                    "Only booked appointments can be confirmed."
                )

            if appointment_time <= now:
                raise ValueError(
                    "Past appointments cannot be confirmed."
                )

        elif new_status == "rejected":

            if appointment.status != "booked":
                raise ValueError(
                    "Only booked appointments can be rejected."
                )

            if appointment_time <= now:
                raise ValueError(
                    "Past appointments cannot be rejected."
                )

        elif new_status == "completed":

            if appointment.status != "confirmed":
                raise ValueError(
                    "Only confirmed appointments can be completed."
                )

            if appointment_time > now:
                raise ValueError(
                    "An appointment can only be completed after its scheduled time."
                )

        else:
            raise ValueError(
                "Invalid appointment status."
            )

        return self.repository.update_status(
            appointment,
            new_status,
        )

    def get_my_appointments(
        self,
        current_user: User,
    ):

        return self.repository.get_by_patient(
            current_user.id
        )


    def get_doctor_appointments(
        self,
        current_user: User,
    ):

        doctor = (
            self.db.query(Doctor)
            .filter(
                Doctor.user_id == current_user.id
            )
            .first()
        )

        if not doctor:
            raise ValueError(
                "Doctor profile not found."
            )

        return self.repository.get_by_doctor(
            doctor.id
        )