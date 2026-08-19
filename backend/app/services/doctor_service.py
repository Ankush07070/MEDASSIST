from uuid import UUID

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.doctor import Doctor
from app.models.hospital import Hospital
from app.repositories.doctor_repository import DoctorRepository
from app.schemas.doctor import DoctorCreate
from app.repositories.appointment_repository import AppointmentRepository

class DoctorService:

    def __init__(self, db: Session):
        self.repository = DoctorRepository(db)
        self.repository_appointment = AppointmentRepository(db)
        self.db = db

    def create_doctor(
        self,
        doctor_data: DoctorCreate,
    ) -> Doctor:

        # Check user exists
        user = (
            self.db.query(User)
            .filter(User.id == doctor_data.user_id)
            .first()
        )

        if not user:
            raise ValueError("User not found")

        # User must have doctor role
        if user.role != "doctor":
            raise ValueError(
                "User must have doctor role"
            )

        # Prevent duplicate doctor profile
        existing_doctor = (
            self.repository.get_by_user_id(
                doctor_data.user_id
            )
        )

        if existing_doctor:
            raise ValueError(
                "Doctor profile already exists"
            )

        # Check hospital exists
        hospital = (
            self.db.query(Hospital)
            .filter(
                Hospital.id == doctor_data.hospital_id
            )
            .first()
        )

        if not hospital:
            raise ValueError(
                "Hospital not found"
            )

        doctor = Doctor(
            user_id=doctor_data.user_id,
            full_name=doctor_data.full_name,
            specialization=doctor_data.specialization,
            qualification=doctor_data.qualification,
            experience=doctor_data.experience,
            consultation_fee=doctor_data.consultation_fee,
            hospital_id=doctor_data.hospital_id,
        )

        return self.repository.create(doctor)

    def get_all_doctors(self):
        return self.repository.get_all()

    def get_doctor(
        self,
        doctor_id: UUID,
    ):

        doctor = self.repository.get_by_id(doctor_id)

        if not doctor:
            raise ValueError("Doctor not found")

        return doctor

    def get_doctors_by_hospital(
        self,
        hospital_id: UUID,
    ):
        return self.repository.get_by_hospital(
            hospital_id
        )

    def get_doctors_by_specialization(
        self,
        specialization: str,
    ):
        return self.repository.get_by_specialization(
            specialization
        )

    def get_available_doctors(self):
        return self.repository.get_available()

    def get_my_profile(
        self,
        user_id: UUID,
    ) -> Doctor:

        doctor = self.repository.get_by_user_id(
            user_id
        )

        if not doctor:
            raise ValueError(
                "Doctor profile not found"
            )

        return doctor

    def update_my_profile(
        self,
        user_id: UUID,
        data: dict,
    ) -> Doctor:

        doctor = self.repository.get_by_user_id(
            user_id
        )

        if not doctor:
            raise ValueError(
                "Doctor profile not found"
            )

        return self.repository.update(
            doctor,
            data,
        )

    def get_my_appointments(
        self,
        user_id: UUID,
    ):
        doctor = self.repository.get_by_user_id(
            user_id
        )

        if not doctor:
            raise ValueError(
                "Doctor profile not found"
            )
            
        return self.repository_appointment.get_by_doctor(
            doctor.id
        )