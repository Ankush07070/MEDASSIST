from sqlalchemy.orm import Session

from app.models.hospital import Hospital


class HospitalRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        hospital: Hospital,
    ) -> Hospital:

        self.db.add(hospital)
        self.db.commit()
        self.db.refresh(hospital)

        return hospital

    def get_all(self):

        return (
            self.db.query(Hospital)
            .all()
        )

    def get_by_id(
        self,
        hospital_id,
    ):

        return (
            self.db.query(Hospital)
            .filter(Hospital.id == hospital_id)
            .first()
        )