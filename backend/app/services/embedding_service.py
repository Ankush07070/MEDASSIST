from google import genai

from app.core.config import settings


class EmbeddingService:
    def __init__(self):
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

    def generate_embedding(
        self,
        text: str,
    ) -> list[float]:

        response = self.client.models.embed_content(
            model=settings.GEMINI_EMBEDDING_MODEL,
            contents=text,
        )

        return response.embeddings[0].values