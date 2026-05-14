"""
VITALIS AI — FastAPI Backend
Advanced Healthcare Intelligence System
"""

import os
import json
import uuid
from typing import Optional
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="VITALIS AI CORE")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sessions = {}

class MessageRequest(BaseModel):
    session_id: Optional[str] = None
    message: str

@app.post("/api/triage")
async def triage(request: MessageRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="API Key Missing")
    
    # Simple direct response for Vitalis demo
    model = genai.GenerativeModel("gemini-2.0-flash")
    
    prompt = f"""You are VITALIS CORE, a futuristic healthcare AI. 
    A patient says: {request.message}
    
    Respond as a high-end medical OS. Be professional, empathetic, and sci-fi in tone.
    Suggest 2 follow up questions.
    
    Respond in JSON format:
    {{
        "ai_message": "...",
        "follow_up_question": "..."
    }}"""
    
    try:
        response = model.generate_content(prompt)
        data = json.loads(response.text.strip().replace('```json', '').replace('```', ''))
        return {
            "session_id": request.session_id or str(uuid.uuid4()),
            **data,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "ai_message": "Neural link unstable. I've noted your symptoms and I'm analyzing the telemetry.",
            "follow_up_question": "Can you describe the onset of these symptoms?",
            "session_id": str(uuid.uuid4())
        }

@app.get("/health")
async def health():
    return {"status": "healthy", "system": "VITALIS_CORE_ACTIVE"}
