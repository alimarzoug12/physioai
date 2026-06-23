# symptom_extractor.py
import os
import json
import re
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

DEFAULT_RESPONSE = {
    "symptoms":  [],
    "bodyPart":  None,
    "severity":  None,
    "duration":  None,
    "specialty": None,
}

# ── Fast keyword fallback (no API call needed) ────────────────
KEYWORD_MAP = {
    "back":           "Musculoskeletal",
    "lower back":     "Musculoskeletal",
    "spine":          "Musculoskeletal",
    "neck":           "Musculoskeletal",
    "shoulder":       "Musculoskeletal",
    "joint":          "Musculoskeletal",
    "عمود":           "Musculoskeletal",   # Arabic: spine
    "رقبة":           "Musculoskeletal",   # Arabic: neck
    "ظهر":            "Musculoskeletal",   # Arabic: back
    "dos":            "Musculoskeletal",   # French: back
    "nuque":          "Musculoskeletal",   # French: neck
    "knee":           "Orthopedic",
    "ركبة":           "Orthopedic",        # Arabic: knee
    "genou":          "Orthopedic",        # French: knee
    "hip":            "Orthopedic",
    "fracture":       "Orthopedic",
    "bone":           "Orthopedic",
    "sport":          "Sports Medicine",
    "athlete":        "Sports Medicine",
    "muscle":         "Sports Medicine",
    "strain":         "Sports Medicine",
    "sprain":         "Sports Medicine",
    "إصابة":          "Sports Medicine",   # Arabic: injury
    "blessure":       "Sports Medicine",   # French: injury
    "stroke":         "Neurological",
    "nerve":          "Neurological",
    "numbness":       "Neurological",
    "parkinson":      "Neurological",
    "السكتة":         "Neurological",      # Arabic: stroke
    "عصب":            "Neurological",      # Arabic: nerve
    "pain":           "Pain Management",
    "chronic":        "Pain Management",
    "ألم":            "Pain Management",   # Arabic: pain
    "douleur":        "Pain Management",   # French: pain
    "surgery":        "Rehabilitation",
    "rehabilitation": "Rehabilitation",
    "rehab":          "Rehabilitation",
    "recovery":       "Rehabilitation",
    "إعادة تأهيل":    "Rehabilitation",    # Arabic
    "rééducation":    "Rehabilitation",    # French
    "child":          "Pediatric",
    "pediatric":      "Pediatric",
    "scoliosis":      "Pediatric",
}


def detect_specialty_from_keywords(message: str) -> str | None:
    """Fast keyword-based specialty detection — works for all 3 languages."""
    msg_lower = message.lower()
    for keyword, specialty in KEYWORD_MAP.items():
        if keyword in msg_lower:
            return specialty
    return None


async def extract_symptoms(message: str) -> dict:
    """
    Extract structured medical data using OpenAI GPT.
    Falls back to keyword detection if OpenAI fails.
    """
    # Fast keyword fallback first
    keyword_specialty = detect_specialty_from_keywords(message)

    prompt = f"""You are a medical data extractor. Return ONLY valid JSON, no explanation, no markdown.

Extract medical information from this patient message:
"{message}"

Return exactly this JSON structure:
{{
  "symptoms": ["list of symptoms mentioned"],
  "bodyPart": "affected body part or null",
  "severity": "mild or moderate or severe or null",
  "duration": "how long they had it or null",
  "specialty": "one of: Musculoskeletal, Sports Medicine, Neurological, Orthopedic, Pediatric, Pain Management, Rehabilitation, or null"
}}

Rules:
- If message is in Arabic, extract in English but keep severity/duration in original if unclear
- If no medical info found, return null for all fields except symptoms (empty array)
- For specialty, choose the MOST relevant one based on body part and symptoms"""

    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            max_tokens=200,
            response_format={"type": "json_object"},  # forces JSON output
        )

        text = response.choices[0].message.content.strip()

        parsed = json.loads(text)

        # Use keyword specialty as fallback if GPT returns null
        specialty = parsed.get("specialty") or keyword_specialty

        result = {
            "symptoms":  parsed.get("symptoms", []),
            "bodyPart":  parsed.get("bodyPart"),
            "severity":  parsed.get("severity"),
            "duration":  parsed.get("duration"),
            "specialty": specialty,
        }

        print(f"🔍 Extracted: {result}")
        return result

    except json.JSONDecodeError as e:
        print(f"❌ JSON decode error: {e}")
        return {**DEFAULT_RESPONSE, "specialty": keyword_specialty}

    except Exception as e:
        print(f"❌ Symptom extraction error: {e}")
        return {**DEFAULT_RESPONSE, "specialty": keyword_specialty}