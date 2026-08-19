from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.roles import require_role
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import (
    UserResponse,
    DoctorUserCreate,
)
from app.services.auth_service import AuthService


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(
        get_current_user
    ),
):
    return current_user


@router.post(
    "/doctors",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_doctor_user(
    user_data: DoctorUserCreate,
    current_user: User = Depends(
        require_role("admin")
    ),
    db: Session = Depends(get_db),
):
    service = AuthService(db)

    try:
        return service.create_doctor_user(
            user_data
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )