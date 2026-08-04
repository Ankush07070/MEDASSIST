from sqlalchemy.orm import Session

from app.models.hospital import Hospital
from app.repositories.hospital_repository import HospitalRepository
from app.schemas.hospital import HospitalCreate


class HospitalService:

    def __init__(self, db: Session):
        self.repository = HospitalRepository(db)

    def create_hospital(
        self,
        hospital_data: HospitalCreate,
    ) -> Hospital:

        hospital = Hospital(
            name=hospital_data.name,
            address=hospital_data.address,
            city=hospital_data.city,
            state=hospital_data.state,
            phone=hospital_data.phone,
            email=hospital_data.email,
        )

        return self.repository.create(hospital)

    def get_all_hospitals(self):

        return self.repository.get_all()

    def get_hospital(
        self,
        hospital_id,
    ):

        hospital = self.repository.get_by_id(hospital_id)

        if not hospital:
            raise ValueError("Hospital not found")

        return hospital