from fastapi import FastAPI
from pydantic import BaseModel
from gemini_service import analyze_email, safe_parse

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ CORS (important for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmailRequest(BaseModel):
    email: str

@app.post("/analyze")
def analyze(req: EmailRequest):
    raw = analyze_email(req.email)
    parsed = safe_parse(raw)

    return {
        "category": parsed["category"],
        "urgency": parsed["urgency"],
        "assigned_to": parsed["assigned_to"],
        "reason": parsed["reason"]
    }