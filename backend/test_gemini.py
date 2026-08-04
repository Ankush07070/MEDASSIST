from app.services.gemini_service import GeminiService

service = GeminiService()

text = """
Hemoglobin: 9.5 g/dL

Blood Sugar: 145 mg/dL

Vitamin D: Low
"""

print(service.generate_summary(text))