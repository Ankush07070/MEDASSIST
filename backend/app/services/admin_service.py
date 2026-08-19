from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User
from app.models.doctor import Doctor
from app.models.hospital import Hospital
from app.repositories.user_repository import UserRepository
from app.repositories.doctor_repository import DoctorRepository
from app.schemas.admin import AdminDoctorCreate


class AdminService:

    def __init__(self, db: Session):
        self.db = db
        self.user_repository = UserRepository(db)
        self.doctor_repository = DoctorRepository(db)

    def create_doctor(
        self,
        data: AdminDoctorCreate,
    ) -> Doctor:

        # -----------------------------------
        # Check email
        # -----------------------------------

        existing_user = self.user_repository.get_by_email(
            data.email
        )

        if existing_user:
            raise ValueError(
                "Email already registered"
            )

        # -----------------------------------
        # Check hospital
        # -----------------------------------

        hospital = (
            self.db.query(Hospital)
            .filter(
                Hospital.id == data.hospital_id
            )
            .first()
        )

        if not hospital:
            raise ValueError(
                "Hospital not found"
            )

        # -----------------------------------
        # Create doctor user account
        # -----------------------------------

        user = User(
            full_name=data.full_name,
            email=data.email,
            hashed_password=hash_password(
                data.password
            ),
            role="doctor",
        )

        self.db.add(user)
        self.db.flush()

        # -----------------------------------
        # Create doctor profile
        # -----------------------------------

        doctor = Doctor(
            user_id=user.id,
            full_name=data.full_name,
            specialization=data.specialization,
            qualification=data.qualification,
            experience=data.experience,
            consultation_fee=data.consultation_fee,
            hospital_id=data.hospital_id,
            is_available=True,
        )

        self.db.add(doctor)

        self.db.commit()
        self.db.refresh(doctor)

        return doctor