import time
from pathlib import Path

from google import genai

from app.core.config import settings


PROMPT_PATH = (
    Path(__file__).resolve().parent.parent
    / "prompts"
    / "report_summary.txt"
)


class GeminiService:

    def __init__(self):
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY,
        )

        with open(PROMPT_PATH, "r", encoding="utf-8") as f:
            self.prompt_template = f.read()

    def generate_summary(
        self,
        report_text: str,
    ) -> str:

        if not report_text or not report_text.strip():
            return "No text could be extracted from the report."

        prompt = self.prompt_template.replace(
            "{{REPORT}}",
            report_text,
        )

        for attempt in range(3):
            try:

                response = self.client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=prompt,
                )

                return response.text or "No AI summary generated."

            except Exception as e:

                if attempt == 2:
                    return f"AI Summary unavailable.\n\n{e}"

                time.sleep(3)