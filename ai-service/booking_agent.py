# booking_agent.py
import os
from typing import TypedDict, Optional, List
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
import httpx
from dotenv import load_dotenv

load_dotenv()

# ── LLM for the booking agent (cheaper model for classification) ──
llm = ChatOpenAI(
    model="gpt-3.5-turbo",
    temperature=0,
    max_tokens=50,          # intent detection needs very short replies
    api_key=os.getenv("OPENAI_API_KEY"),
)

print("✅ LangGraph booking agent LLM initialized (OpenAI)")


# ── State definition ──────────────────────────────────────────
class BookingState(TypedDict):
    user_id:      str
    token:        str
    user_message: str
    intent:       str        # 'booking' | 'cancel' | 'info' | 'general'
    specialty:    Optional[str]
    doctor_id:    Optional[str]
    slot_id:      Optional[str]
    date:         Optional[str]
    time:         Optional[str]
    confirmed:    bool
    reply:        str
    doctors:      List[dict]
    slots:        List[dict]
    nestjs_url:   str


# ── Node 1: Detect intent ─────────────────────────────────────
async def detect_intent(state: BookingState) -> BookingState:
    """
    Classify the user message into one of 4 intents.
    Works for Arabic, English, and French.
    """
    prompt = f"""Classify this message into ONE of these intents:
- booking  (user wants to book/reserve/schedule a physiotherapy session)
- cancel   (user wants to cancel a session)
- info     (user asking about prices, availability, services)
- general  (general health question or other)

Message: "{state['user_message']}"

Reply with ONLY one word: booking, cancel, info, or general"""

    try:
        response = await llm.ainvoke([HumanMessage(content=prompt)])
        intent = response.content.strip().lower().split()[0]  # take first word only

        if intent not in ["booking", "cancel", "info", "general"]:
            intent = "general"

    except Exception as e:
        print(f"❌ Intent detection error: {e}")
        intent = "general"

    print(f"🎯 Intent detected: {intent}")
    return {**state, "intent": intent}


# ── Node 2: Find doctors by specialty ─────────────────────────
async def find_doctors(state: BookingState) -> BookingState:
    """Extract specialty and fetch real doctors from NestJS."""
    if state["intent"] != "booking":
        return state

    # Extract specialty from message
    specialty_prompt = f"""From this patient message, which physiotherapy specialty is needed?
Choose ONLY from: Musculoskeletal, Sports Medicine, Neurological, Orthopedic, Pediatric, Pain Management, Rehabilitation

Patient message: "{state['user_message']}"

Reply with ONLY the specialty name. If unsure, reply: Musculoskeletal"""

    try:
        response  = await llm.ainvoke([HumanMessage(content=specialty_prompt)])
        specialty = response.content.strip()
        if specialty not in ["Musculoskeletal", "Sports Medicine", "Neurological",
                             "Orthopedic", "Pediatric", "Pain Management", "Rehabilitation"]:
            specialty = "Musculoskeletal"
    except Exception:
        specialty = "Musculoskeletal"

    # Fetch real doctors from NestJS
    doctors = []
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"{state['nestjs_url']}/doctors",
                params={"specialty": specialty},
                headers={"Authorization": f"Bearer {state['token']}"},
            )
            if resp.status_code == 200:
                doctors = resp.json()[:3]
                print(f"✅ Found {len(doctors)} doctors for {specialty}")
    except Exception as e:
        print(f"❌ Error fetching doctors: {e}")

    # Build reply
    if doctors:
        reply = f"I found {len(doctors)} specialist(s) in {specialty}:\n"
        for i, d in enumerate(doctors, 1):
            name    = d.get("fullName", d.get("name", "Unknown"))
            rating  = d.get("rating", "N/A")
            price   = d.get("price", d.get("pricePerSession", "N/A"))
            reply  += f"{i}. Dr. {name} — ⭐{rating} — {price} QAR\n"
        reply += "\nWhich doctor would you like to book with?"
    else:
        reply = f"I can help you find a {specialty} specialist. Please browse available doctors below."

    return {**state, "specialty": specialty, "doctors": doctors, "reply": reply}


# ── Node 3: Check available slots ────────────────────────────
async def check_slots(state: BookingState) -> BookingState:
    """Fetch available slots for a specific doctor and date."""
    if not state.get("doctor_id") or not state.get("date"):
        return state

    slots = []
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"{state['nestjs_url']}/doctors/{state['doctor_id']}/slots",
                params={"date": state["date"]},
                headers={"Authorization": f"Bearer {state['token']}"},
            )
            if resp.status_code == 200:
                slots = resp.json()
    except Exception as e:
        print(f"❌ Error fetching slots: {e}")

    if slots:
        reply  = f"Available slots on {state['date']}:\n"
        for slot in slots[:5]:
            reply += f"• {slot.get('startTime')} – {slot.get('endTime')}\n"
        reply += "\nWhich time works for you?"
    else:
        reply = f"No available slots on {state['date']}. Please choose another date."

    return {**state, "slots": slots, "reply": reply}


# ── Node 4: Ask for confirmation ──────────────────────────────
async def confirm_booking(state: BookingState) -> BookingState:
    if not state.get("slot_id"):
        return state

    reply = (
        f"To confirm your booking:\n"
        f"📅 Date: {state.get('date')}\n"
        f"🕐 Time: {state.get('time')}\n\n"
        f"Reply 'yes' to confirm or 'no' to cancel."
    )
    return {**state, "reply": reply}


# ── Node 5: Create booking ────────────────────────────────────
async def create_booking(state: BookingState) -> BookingState:
    if not state.get("confirmed") or not state.get("slot_id"):
        return state

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                f"{state['nestjs_url']}/bookings",
                json={
                    "doctorId":    state["doctor_id"],
                    "slotId":      state["slot_id"],
                    "sessionType": "CLINIC",
                },
                headers={"Authorization": f"Bearer {state['token']}"},
            )
            if resp.status_code == 201:
                reply = "✅ Your appointment has been successfully booked! You will receive a confirmation shortly."
            else:
                reply = "❌ Booking failed. The slot may no longer be available. Please try again."
    except Exception as e:
        print(f"❌ Booking error: {e}")
        reply = "❌ Could not complete booking. Please try again."

    return {**state, "reply": reply}


# ── Node: General (fallback) ──────────────────────────────────
async def general_response(state: BookingState) -> BookingState:
    """Fallback — reply is empty, main.py handles it with regular chat."""
    return {**state, "reply": ""}


# ── Router ────────────────────────────────────────────────────
def route_intent(state: BookingState) -> str:
    intent = state.get("intent", "general")
    if intent == "booking":
        return "find_doctors"
    return "general_response"


# ── Build LangGraph ───────────────────────────────────────────
def build_booking_graph():
    graph = StateGraph(BookingState)

    graph.add_node("detect_intent",    detect_intent)
    graph.add_node("find_doctors",     find_doctors)
    graph.add_node("check_slots",      check_slots)
    graph.add_node("confirm_booking",  confirm_booking)
    graph.add_node("create_booking",   create_booking)
    graph.add_node("general_response", general_response)

    graph.set_entry_point("detect_intent")

    graph.add_conditional_edges(
        "detect_intent",
        route_intent,
        {
            "find_doctors":     "find_doctors",
            "general_response": "general_response",
        }
    )

    graph.add_edge("find_doctors",     "check_slots")
    graph.add_edge("check_slots",      "confirm_booking")
    graph.add_edge("confirm_booking",  "create_booking")
    graph.add_edge("create_booking",   END)
    graph.add_edge("general_response", END)

    return graph.compile()


booking_graph = build_booking_graph()
print("✅ LangGraph booking graph compiled")