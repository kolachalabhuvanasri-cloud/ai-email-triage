import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use stable model
model = genai.GenerativeModel("gemini-1.5-flash")


def analyze_email(email_text: str):
    prompt = f"""
You are an AI email triage assistant.

Analyze the email and return ONLY valid JSON (no explanation, no markdown).

Format:
{{
  "category": "billing | bug | how-to | other",
  "urgency": "low | medium | high",
  "assigned_to": "Finance | Engineering | Support",
  "reason": "short explanation"
}}

Email:
{email_text}
"""

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return json.dumps({
            "category": "other",
            "urgency": "medium",
            "assigned_to": "Support",
            "reason": f"Error: {str(e)}"
        })


def safe_parse(response_text: str):
    try:
        # Extract JSON from response
        start = response_text.find("{")
        end = response_text.rfind("}") + 1
        json_str = response_text[start:end]

        return json.loads(json_str)

    except Exception:
        return {
            "category": "other",
            "urgency": "medium",
            "assigned_to": "Support",
            "reason": "Fallback parsing"
        }