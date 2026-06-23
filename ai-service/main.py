# main.py
import os
import asyncio
from typing import Optional, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

from rag import retrieve_context, ingest_knowledge_base
from symptom_extractor import extract_symptoms
from booking_agent import booking_graph, BookingState

load_dotenv()

# ── Validate API key ──────────────────────────────────────────
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
FINE_TUNED_MODEL = os.getenv("OPENAI_FINE_TUNED_MODEL")
if not OPENAI_API_KEY:
    raise RuntimeError("❌ OPENAI_API_KEY is missing from .env")

app = FastAPI(title="PhysioAI Service", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Initialize LangChain + OpenAI ─────────────────────────────
FINE_TUNED_MODEL = os.getenv("OPENAI_FINE_TUNED_MODEL")

llm = ChatOpenAI(
    model=FINE_TUNED_MODEL or "gpt-3.5-turbo",
    temperature=0.1,
    max_tokens=200,
    api_key=OPENAI_API_KEY,
)

print(f"✅ Using model: {FINE_TUNED_MODEL or 'gpt-3.5-turbo (base, not fine-tuned)'}")
print("✅ LangChain + OpenAI initialized")


# ── Models ────────────────────────────────────────────────────
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []
    userProfile: Optional[dict] = None
    showDoctors: bool = False

class ChatResponse(BaseModel):
    reply: str
    usedRAG: bool
    extractedData: dict
    suggestDoctors: bool

class ExtractRequest(BaseModel):
    text: str


# ── Health ────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "physioai",
        "model": "gpt-3.5-turbo",
        "openai": bool(OPENAI_API_KEY),
    }


# ── Chat ──────────────────────────────────────────────────────
@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):

    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Run RAG + symptom extraction in parallel
    rag_context, extracted = await asyncio.gather(
        retrieve_context(req.message),
        extract_symptoms(req.message)
    )

    # Build profile text
    profile_text = ""
    if req.userProfile:
        conditions = [
            k for k, v in req.userProfile.items()
            if v is True and k in ["backPain", "jointPain", "sportsInjury", "neckIssues"]
        ]
        profile_text = f"""
PATIENT PROFILE:
- Age: {req.userProfile.get("age", "unknown")}
- Gender: {req.userProfile.get("gender", "unknown")}
- Activity Level: {req.userProfile.get("activityLevel", "unknown")}
- Conditions: {", ".join(conditions) or "none reported"}
"""

    # Build RAG context
    rag_text = ""
    if rag_context:
        rag_text = f"\nRELEVANT PHYSIOTHERAPY KNOWLEDGE:\n{rag_context}\n"

    if req.showDoctors:
        booking_instruction = """
- Specialists are being shown to the patient right now below this message.
- NEVER ask "which day works for you?" — the day is already determined.
- Just say something like: "Here are the available specialists for you. Please choose one to continue your booking."
- Maximum 2 sentences."""
    else:
        booking_instruction = """
- When patient says "I want to book" or similar → say "I can show you available specialists. Which day works for you?"
- Do NOT mention doctors unless patient explicitly asks to book."""

    # ── System prompt ─────────────────────────────────────────
    system_content = f"""You are PhysioAI, an expert physiotherapy assistant for a medical platform in Qatar.
{rag_text}
{profile_text}

LANGUAGE RULES — CRITICAL:
- Arabic message → respond ONLY in Arabic
- English message → respond ONLY in English
- French message → respond ONLY in French
- NEVER mix languages

BEHAVIOR RULES:
- When patient describes pain or symptoms → give medical advice ONLY (1-2 tips)
{booking_instruction}
- Maximum 3 sentences
- Be empathetic and concise"""

    # ── Build LangChain messages ──────────────────────────────
    messages = [SystemMessage(content=system_content)]

    # Add conversation history (last 8 messages)
    for msg in req.history[-8:]:
        role = msg.role.lower()
        if role in ("user", "human"):
            messages.append(HumanMessage(content=msg.content))
        else:
            messages.append(AIMessage(content=msg.content))

    # Add current message
    messages.append(HumanMessage(content=req.message))

    # ── Call OpenAI via LangChain ─────────────────────────────
    try:
        print(f"📨 Sending to OpenAI: {req.message[:60]}...")
        print(f"📚 RAG context used: {bool(rag_context)}")
        print(f"🔍 Extracted: {extracted}")

        response = await llm.ainvoke(messages)
        reply = response.content.strip()

        print(f"✅ OpenAI reply: {reply[:120]}...")

    except Exception as e:
        import traceback
        print("❌ OpenAI error:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")

    suggest_doctors = bool(extracted.get("specialty"))

    return ChatResponse(
        reply=reply,
        usedRAG=bool(rag_context),
        extractedData=extracted,
        suggestDoctors=suggest_doctors,
    )


# ── Ingest knowledge base ─────────────────────────────────────
@app.post("/ingest")
async def ingest():
    return await ingest_knowledge_base()


# ── Chat with LangGraph agent ─────────────────────────────────
@app.post("/chat/agent")
async def chat_with_agent(req: ChatRequest, token: str = ""):
    """
    Uses LangGraph to detect booking intent.
    Falls back to regular OpenAI chat for general questions.
    """
    rag_context, extracted = await asyncio.gather(
        retrieve_context(req.message),
        extract_symptoms(req.message)
    )

    initial_state: BookingState = {
        "user_id":      req.userProfile.get("userId", "") if req.userProfile else "",
        "token":        token,
        "user_message": req.message,
        "intent":       "",
        "specialty":    None,
        "doctor_id":    None,
        "slot_id":      None,
        "date":         None,
        "time":         None,
        "confirmed":    False,
        "reply":        "",
        "doctors":      [],
        "slots":        [],
        "nestjs_url":   os.getenv("NESTJS_URL", "http://localhost:3001"),
    }

    result = await booking_graph.ainvoke(initial_state)

    # LangGraph handled a booking intent
    if result.get("reply") and result.get("intent") == "booking":
        return {
            "reply":          result["reply"],
            "usedRAG":        bool(rag_context),
            "extractedData":  extracted,
            "suggestDoctors": bool(result.get("doctors")),
            "matchedDoctors": result.get("doctors", []),
            "intent":         result.get("intent"),
        }

    # Fallback → regular chat
    return await chat(req)

@app.post("/extract")
async def extract(req: ExtractRequest):
    """Extract specialty from conversation context."""
    extracted = await extract_symptoms(req.text)
    return extracted


# ── Analytics endpoints ───────────────────────────────────────
try:
    import redis
    import json
    from analytics.kpi_engine  import get_all_kpis, get_revenue_trend, get_bookings_by_specialty
    from analytics.forecasting  import forecast_bookings_arima, forecast_revenue
    from analytics.segmentation import rfm_segmentation
    from analytics.ml_models    import train_noshow_model, get_anomalies

    r = redis.Redis(host="localhost", port=6379, db=1)
    CACHE_TTL = 300

    def get_cached(key: str, fn):
        try:
            cached = r.get(key)
            if cached:
                return json.loads(cached)
        except Exception:
            pass
        result = fn()
        try:
            r.setex(key, CACHE_TTL, json.dumps(result, default=str))
        except Exception:
            pass
        return result

    @app.get("/analytics/kpis")
    async def get_kpis():
        return get_cached("kpis:all", get_all_kpis)

    @app.get("/analytics/revenue-trend")
    async def revenue_trend(days: int = 30):
        return get_cached(f"kpis:revenue:{days}", lambda: get_revenue_trend(days))

    @app.get("/analytics/specialty-breakdown")
    async def specialty_breakdown():
        return get_cached("kpis:specialty", get_bookings_by_specialty)

    @app.get("/analytics/forecast/bookings")
    async def forecast_bookings(days: int = 7):
        return {"forecast": forecast_bookings_arima(days)}

    @app.get("/analytics/forecast/revenue")
    async def forecast_rev(days: int = 7):
        return {"forecast": forecast_revenue(days)}

    @app.get("/analytics/segmentation")
    async def segmentation():
        return get_cached("kpis:segmentation", rfm_segmentation)

    @app.get("/analytics/noshow-model")
    async def noshow_model():
        return train_noshow_model()

    @app.get("/analytics/anomalies")
    async def anomalies():
        return {"anomalies": get_anomalies()}

    @app.post("/analytics/refresh")
    async def refresh_cache():
        for key in r.scan_iter("kpis:*"):
            r.delete(key)
        return {"refreshed": True}

    print("✅ Analytics endpoints loaded")

except ImportError as e:
    print(f"⚠️  Analytics not loaded (missing packages): {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)