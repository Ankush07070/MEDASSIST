import uuid

import cloudinary
import cloudinary.uploader

from app.core.config import settings


cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)


class CloudinaryStorage:

    @staticmethod
    def upload_report(file, user_id):

        report_id = str(uuid.uuid4())

        public_id = f"medassist/reports/{user_id}/{report_id}"

        result = cloudinary.uploader.upload(
            file.file,
            resource_type="raw",
            public_id=public_id,
            overwrite=False,
        )

        return {
            "url": result["secure_url"],
            "public_id": public_id,
        }

    @staticmethod
    def delete_report(public_id):

        cloudinary.uploader.destroy(
            public_id,
            resource_type="raw",
        )