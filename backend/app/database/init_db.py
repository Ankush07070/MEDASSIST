from app.database.base import Base
from app.database.session import engine

from app.models.user import User
from app.models.report import Report
from app.models.chat import Chat
from app.models.doctor import Doctor
from app.models.hospital import Hospital
from app.models.appointment import Appointment


def init_db():
    Base.metadata.create_all(bind=engine)