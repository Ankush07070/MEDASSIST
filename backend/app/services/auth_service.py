from sqlalchemy.orm import Session

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import (
    UserCreate,
    UserLogin,
    Token,
    DoctorUserCreate,
)


class AuthService:

    def __init__(self, db: Session):
        self.user_repository = UserRepository(db)

    def register_user(
        self,
        user_data: UserCreate,
    ) -> User:

        existing_user = self.user_repository.get_by_email(
            user_data.email
        )

        if existing_user:
            raise ValueError(
                "Email already registered"
            )

        hashed_password = hash_password(
            user_data.password
        )

        user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            hashed_password=hashed_password,
        )

        return self.user_repository.create(user)

    def login_user(
        self,
        user_data: UserLogin,
    ) -> Token:

        # Find user by email
        user = self.user_repository.get_by_email(
            user_data.email
        )

        if not user:
            raise ValueError(
                "Invalid email or password"
            )

        # Verify password
        if not verify_password(
            user_data.password,
            user.hashed_password,
        ):
            raise ValueError(
                "Invalid email or password"
            )

        # Generate JWT
        access_token = create_access_token(
            subject=str(user.id),
        )

        return Token(
            access_token=access_token,
        )

    def create_doctor_user(
            self,
            user_data: DoctorUserCreate,
        ) -> User:

        existing_user = self.user_repository.get_by_email(
            user_data.email
        )

        if existing_user:
            raise ValueError(
                "Email already registered"
            )

        hashed_password = hash_password(
            user_data.password
        )

        user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            hashed_password=hashed_password,
            role="doctor",
        )

        return self.user_repository.create(user)