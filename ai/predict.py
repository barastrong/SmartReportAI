import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-3-flash-preview")


def generate_ai_report(data: dict):
    """
    data = {
        sleepHours: int,
        exerciseMinutes: int,
        mood: int (1-5),
        stress: int (1-5) -> SEMAKIN RENDAH SEMAKIN BAIK
        discipline: int (1-5),
        empathy: int (1-5)
    }
    """

    prompt = f"""
Kamu adalah AI evaluator kesehatan & karakter manusia.

ATURAN:
- Stres RENDAH itu BAGUS
- Jangan sebut skor mentah input
- Bahasa Indonesia profesional & suportif
- Jangan pakai if else atau template kaku

DATA USER:
- Jam tidur: {data['sleepHours']} jam
- Olahraga: {data['exerciseMinutes']} menit
- Mood: {data['mood']}/5
- Stres: {data['stress']}/5
- Disiplin: {data['discipline']}/5
- Empati: {data['empathy']}/5

OUTPUT FORMAT WAJIB (JSON):
{{
  "Physical": {{
    "label": "...",
    "score": 0-100,
    "summary": "..."
  }},
  "Mental": {{
    "label": "...",
    "score": 0-100,
    "summary": "..."
  }},
  "Character": {{
    "label": "...",
    "score": 0-100,
    "summary": "..."
  }},
  "Summary": "ringkasan akhir AI"
}}
"""

    response = model.generate_content(prompt)
    text = response.text.strip()

    # amankan kalau Gemini nambahin ```json
    text = text.replace("```json", "").replace("```", "")

    return eval(text)
