# symptom_extractor.py

import json
import re
import httpx


DEFAULT_RESPONSE = {
    "symptoms": [],
    "bodyPart": None,
    "severity": None,
    "duration": None,
    "specialty": None,
}


async def extract_symptoms(message: str) -> dict:
    """Extract structured medical data from a user message."""

    prompt = f"""
You are a medical data extractor.

Return ONLY valid JSON.

Extract medical info from:
"{message}"

Return this JSON structure exactly:

{{
  "symptoms": ["list of symptoms mentioned"],
  "bodyPart": "affected body part or null",
  "severity": "mild or moderate or severe or null",
  "duration": "how long they had it or null",
  "specialty": "one of: Musculoskeletal, Sports Medicine, Neurological, Orthopedic, Pediatric, Pain Management, Rehabilitation, or null"
}}
"""

    try:

        async with httpx.AsyncClient(timeout=60.0) as client:

            response = await client.post(
                "http://localhost:11434/api/chat",
                json={
                    "model": "llama3.2:3b",
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "stream": False
                }
            )

        response.raise_for_status()

        data = response.json()

        text = data["message"]["content"]

        # Remove markdown blocks if model adds them
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

        # Try to repair incomplete JSON        
        if not text.endswith("}"):
            text += "}"

        try:
            parsed = json.loads(text)

        except Exception:

            match = re.search(r"\{[\s\S]*\}", text)

            if not match:
                print("❌ No JSON found in model response")
                print(text)
                return DEFAULT_RESPONSE

            parsed = json.loads(match.group())

        return {
            "symptoms": parsed.get("symptoms", []),
            "bodyPart": parsed.get("bodyPart"),
            "severity": parsed.get("severity"),
            "duration": parsed.get("duration"),
            "specialty": parsed.get("specialty"),
        }

    except json.JSONDecodeError as e:

        print("❌ JSON decode error:", e)

    except httpx.HTTPError as e:

        print("❌ HTTP error:", e)

    except Exception as e:

        print("❌ Symptom extraction error:", e)

    return DEFAULT_RESPONSE