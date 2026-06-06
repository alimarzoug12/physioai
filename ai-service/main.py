# main.py
import os
import asyncio
from typing import Optional, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

from rag import retrieve_context, ingest_knowledge_base
from symptom_extractor import extract_symptoms
from booking_agent import booking_graph, BookingState

load_dotenv()

app = FastAPI(title="PhysioAI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Initialize LangChain LLM ──────────────────────────────────
llm = ChatOllama(
    model="llama3.2:3b",
    temperature=0.1,   # very low = more consistent
    num_predict=120,
)

print("✅ LangChain + Ollama initialized")


# ── Models ────────────────────────────────────────────────────
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []
    userProfile: Optional[dict] = None

class ChatResponse(BaseModel):
    reply: str
    usedRAG: bool
    extractedData: dict
    suggestDoctors: bool


# ── Health ────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "service": "physioai", "model": "llama3.2:3b"}


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
        profile_text = f"""
PATIENT PROFILE:
- Age: {req.userProfile.get('age', 'unknown')}
- Gender: {req.userProfile.get('gender', 'unknown')}
- Activity Level: {req.userProfile.get('activityLevel', 'unknown')}
- Conditions: {', '.join([
    k for k, v in req.userProfile.items()
    if v is True and k in ['backPain', 'jointPain', 'sportsInjury', 'neckIssues']
]) or 'none reported'}
"""

    # Build RAG context
    rag_text = ""
    if rag_context:
        rag_text = f"\nRELEVANT MEDICAL KNOWLEDGE:\n{rag_context}\n"

    # System prompt
    system_content = f"""You are PhysioAI, an expert physiotherapy assistant for a medical platform in Qatar.

{rag_text}
{profile_text}

LANGUAGE RULES (MOST IMPORTANT):
- Detect the language of the user message
- If user writes in Arabic → respond ONLY in Arabic, never mix with English
- If user writes in English → respond ONLY in English
- If user writes in French → respond ONLY in French
- NEVER mix languages in the same response

RESPONSE RULES:
- Maximum 3 sentences, be very concise
- Be empathetic and professional
- When patient has pain: give 1 tip and say doctors will appear below
- When patient asks to book: say the available doctors are shown below, ask them to click Book
- NEVER invent doctor names, times, or slots
- NEVER say you have booked anything — the system handles bookings
"""

    # ── Build LangChain messages ──────────────────────────────
    messages = [SystemMessage(content=system_content)]

    # Add conversation history (last 8 messages)
    for msg in req.history[-8:]:
        role = msg.role.lower()
        if role in ('user', 'human'):
            messages.append(HumanMessage(content=msg.content))
        else:
            messages.append(AIMessage(content=msg.content))

    # Add current message
    messages.append(HumanMessage(content=req.message))

    # ── Call LangChain + Ollama ───────────────────────────────
    try:
        print(f"📨 Sending to LangChain/Ollama: {req.message[:50]}...")
        print(f"📚 RAG context used: {bool(rag_context)}")

        response = await llm.ainvoke(messages, config={"max_tokens": 150})
        reply = response.content

        print(f"✅ LangChain reply: {reply[:100]}...")

    except Exception as e:
        import traceback
        print("❌ LangChain/Ollama error:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

    suggest_doctors = bool(extracted.get("specialty"))

    return ChatResponse(
        reply=reply,
        usedRAG=bool(rag_context),
        extractedData=extracted,
        suggestDoctors=suggest_doctors
    )


# ── Ingest knowledge base into ChromaDB ──────────────────────
@app.post("/ingest")
async def ingest():
    return await ingest_knowledge_base()

# ── New chat endpoint with LangGraph ─────────────────────────
@app.post("/chat/agent")
async def chat_with_agent(req: ChatRequest, token: str = ""):
    """
    Uses LangGraph to handle booking intents automatically.
    Falls back to regular chat for general questions.
    """
    rag_context, extracted = await asyncio.gather(
        retrieve_context(req.message),
        extract_symptoms(req.message)
    )

    # Run LangGraph to detect intent
    initial_state: BookingState = {
        "user_id":     req.userProfile.get("userId", "") if req.userProfile else "",
        "token":       token,
        "user_message": req.message,
        "intent":      "",
        "specialty":   None,
        "doctor_id":   None,
        "slot_id":     None,
        "date":        None,
        "time":        None,
        "confirmed":   False,
        "reply":       "",
        "doctors":     [],
        "slots":       [],
        "nestjs_url":  os.getenv("NESTJS_URL", "http://localhost:5000"),
    }

    result = await booking_graph.ainvoke(initial_state)

    # If LangGraph handled it (booking intent) → return its reply
    if result.get("reply") and result.get("intent") == "booking":
        return {
            "reply": result["reply"],
            "usedRAG": bool(rag_context),
            "extractedData": extracted,
            "suggestDoctors": bool(result.get("doctors")),
            "matchedDoctors": result.get("doctors", []),
            "intent": result.get("intent"),
        }

    # Otherwise → use regular LangChain chat
    return await chat(req)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)