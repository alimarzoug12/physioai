# booking_agent.py
from typing import TypedDict, Optional, List
from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
from langchain.schema import SystemMessage, HumanMessage
import httpx
import json

llm = ChatOllama(model="llama3.2:3b", temperature=0)


# ── State ─────────────────────────────────────────────────────
class BookingState(TypedDict):
    user_id: str
    token: str
    user_message: str
    intent: str              # 'booking' | 'cancel' | 'info' | 'general'
    specialty: Optional[str]
    doctor_id: Optional[str]
    slot_id: Optional[str]
    date: Optional[str]
    time: Optional[str]
    confirmed: bool
    reply: str
    doctors: List[dict]
    slots: List[dict]
    nestjs_url: str


# ── Node 1: Detect intent ─────────────────────────────────────
async def detect_intent(state: BookingState) -> BookingState:
    prompt = f"""
Classify this message into ONE of these intents:
- booking (user wants to book a session)
- cancel (user wants to cancel a session)
- info (user asking about services/prices/availability)
- general (general health question)

Message: "{state['user_message']}"

Reply with ONLY one word: booking, cancel, info, or general
"""
    response = await llm.ainvoke([HumanMessage(content=prompt)])
    intent = response.content.strip().lower()

    if intent not in ['booking', 'cancel', 'info', 'general']:
        intent = 'general'

    print(f"🎯 Intent detected: {intent}")
    return {**state, "intent": intent}


# ── Node 2: Find doctors by specialty ─────────────────────────
async def find_doctors(state: BookingState) -> BookingState:
    if state['intent'] != 'booking':
        return state

    # Extract specialty from message
    prompt = f"""
From this message, what medical specialty is needed?
Choose from: Musculoskeletal, Sports Medicine, Neurological, 
Orthopedic, Pediatric, Pain Management, Rehabilitation

Message: "{state['user_message']}"

Reply with ONLY the specialty name, or "Musculoskeletal" if unsure.
"""
    response = await llm.ainvoke([HumanMessage(content=prompt)])
    specialty = response.content.strip()

    # Call NestJS to get doctors
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"{state['nestjs_url']}/doctors",
                params={"specialty": specialty},
                headers={"Authorization": f"Bearer {state['token']}"}
            )
            if resp.status_code == 200:
                doctors = resp.json()[:3]
            else:
                doctors = []
    except Exception as e:
        print(f"❌ Error fetching doctors: {e}")
        doctors = []

    reply = f"I found {len(doctors)} specialist(s) for {specialty}. "
    if doctors:
        reply += "Here are the available doctors:\n"
        for i, d in enumerate(doctors, 1):
            reply += f"{i}. Dr. {d.get('fullName', 'Unknown')} — {d.get('rating', 'N/A')}⭐ — {d.get('price', 'N/A')} QAR\n"
        reply += "\nWhich doctor would you like to book with?"
    else:
        reply += "Please browse available doctors in the app."

    return {**state, "specialty": specialty, "doctors": doctors, "reply": reply}


# ── Node 3: Check available slots ────────────────────────────
async def check_slots(state: BookingState) -> BookingState:
    if not state.get('doctor_id') or not state.get('date'):
        return state

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"{state['nestjs_url']}/doctors/{state['doctor_id']}/slots",
                params={"date": state['date']},
                headers={"Authorization": f"Bearer {state['token']}"}
            )
            if resp.status_code == 200:
                slots = resp.json()
            else:
                slots = []
    except Exception as e:
        print(f"❌ Error fetching slots: {e}")
        slots = []

    if slots:
        reply = f"Available slots on {state['date']}:\n"
        for slot in slots[:5]:
            reply += f"• {slot.get('startTime')} – {slot.get('endTime')}\n"
        reply += "\nWhich time works for you?"
    else:
        reply = f"No available slots on {state['date']}. Please choose another date."

    return {**state, "slots": slots, "reply": reply}


# ── Node 4: Confirm booking ───────────────────────────────────
async def confirm_booking(state: BookingState) -> BookingState:
    if not state.get('slot_id'):
        return state

    reply = (
        f"To confirm your booking:\n"
        f"📅 Date: {state.get('date')}\n"
        f"🕐 Time: {state.get('time')}\n"
        f"Do you confirm? (yes/no)"
    )
    return {**state, "reply": reply}


# ── Node 5: Create booking ────────────────────────────────────
async def create_booking(state: BookingState) -> BookingState:
    if not state.get('confirmed') or not state.get('slot_id'):
        return state

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                f"{state['nestjs_url']}/bookings",
                json={
                    "doctorId": state['doctor_id'],
                    "slotId": state['slot_id'],
                    "sessionType": "CLINIC",
                },
                headers={"Authorization": f"Bearer {state['token']}"}
            )
            if resp.status_code == 201:
                reply = "✅ Your appointment has been successfully booked! You will receive a confirmation shortly."
            else:
                reply = "❌ Booking failed. The slot may no longer be available. Please try again."
    except Exception as e:
        print(f"❌ Booking error: {e}")
        reply = "❌ Could not complete booking. Please try again."

    return {**state, "reply": reply}


# ── Node: General response ────────────────────────────────────
async def general_response(state: BookingState) -> BookingState:
    return {**state, "reply": ""}  # handled by main chat in main.py


# ── Router: decide next node based on intent ──────────────────
def route_intent(state: BookingState) -> str:
    intent = state.get('intent', 'general')
    if intent == 'booking':
        return 'find_doctors'
    elif intent == 'cancel':
        return 'general_response'
    else:
        return 'general_response'


# ── Build the LangGraph ───────────────────────────────────────
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

    graph.add_edge("find_doctors",    "check_slots")
    graph.add_edge("check_slots",     "confirm_booking")
    graph.add_edge("confirm_booking", "create_booking")
    graph.add_edge("create_booking",  END)
    graph.add_edge("general_response", END)

    return graph.compile()


booking_graph = build_booking_graph()
print("✅ LangGraph booking agent initialized")