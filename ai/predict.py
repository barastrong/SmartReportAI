import google.genai as genai
import os
import sys
import json
import threading
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Variable untuk store result
result_container = {"result": None, "error": None}
timeout_flag = {"triggered": False}


def generate_ai_report_thread(data: dict):
    """Run AI report generation di thread terpisah"""
    try:
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
    "summary": "Deskripsi singkat tentang kondisi fisik (2-3 kalimat): kualitas tidur, aktivitas olahraga, dan energi keseluruhan."
  }},
  "Mental": {{
    "label": "...",
    "score": 0-100,
    "summary": "Deskripsi singkat tentang kesehatan mental (2-3 kalimat): tingkat stres, mood, dan keseimbangan emosional."
  }},
  "Character": {{
    "label": "...",
    "score": 0-100,
    "summary": "Deskripsi singkat tentang karakter (2-3 kalimat): disiplin, empati, dan integritas diri."
  }},
  "Summary": "ringkasan akhir AI (2-3 kalimat) - rekomendasi positif untuk perbaikan"
}}
"""

        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
        )
        
        text = response.text.strip()
        text = text.replace("```json", "").replace("```", "")
        result_container["result"] = json.loads(text)
    except Exception as e:
        result_container["error"] = str(e)


if __name__ == "__main__":
    try:
        # Baca input dari stdin
        input_data = sys.stdin.read()
        data = json.loads(input_data)

        # Jalankan AI generation di thread terpisah dengan timeout 5 menit
        thread = threading.Thread(target=generate_ai_report_thread, args=(data,))
        thread.daemon = True
        thread.start()
        thread.join(timeout=300)  # 5 menit = 300 detik

        # Check apakah thread masih jalan (timeout)
        if thread.is_alive():
            timeout_flag["triggered"] = True
            print(
                json.dumps(
                    {"error": "AI analysis timeout - took longer than 5 minutes"}
                ),
                file=sys.stderr,
            )
            sys.exit(1)

        # Check error
        if result_container["error"]:
            print(json.dumps({"error": result_container["error"]}), file=sys.stderr)
            sys.exit(1)

        # Output hasil
        if result_container["result"]:
            print(json.dumps(result_container["result"]))
        else:
            print(
                json.dumps({"error": "No result from AI analysis"}),
                file=sys.stderr,
            )
            sys.exit(1)

    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON input: {str(e)}"}), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)
