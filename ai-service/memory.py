# memory.py — Redis conversation memory with in-memory fallback
import os
import json

try:
    import redis
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
    r = redis.from_url(REDIS_URL, decode_responses=True)
    r.ping()
    print("✅ Redis memory connected")
    REDIS_AVAILABLE = True
except Exception as e:
    print(f"⚠️  Redis not available: {e} — using in-memory fallback")
    REDIS_AVAILABLE = False
    _store: dict = {}

MEMORY_TTL = 60 * 60 * 24  # 24 hours


def _key(user_id: str) -> str:
    return f"chat_memory:{user_id}"


def save_message(user_id: str, role: str, content: str) -> None:
    msg = {"role": role, "content": content}
    if REDIS_AVAILABLE:
        history = get_history(user_id)
        history.append(msg)
        if len(history) > 20:
            history = history[-20:]
        r.setex(_key(user_id), MEMORY_TTL, json.dumps(history))
    else:
        key = f"history:{user_id}"
        if key not in _store:
            _store[key] = []
        _store[key].append(msg)
        if len(_store[key]) > 20:
            _store[key] = _store[key][-20:]


def get_history(user_id: str) -> list:
    if REDIS_AVAILABLE:
        data = r.get(_key(user_id))
        return json.loads(data) if data else []
    return _store.get(f"history:{user_id}", [])


def clear_memory(user_id: str) -> None:
    if REDIS_AVAILABLE:
        r.delete(_key(user_id))
    else:
        _store.pop(f"history:{user_id}", None)


def save_context(user_id: str, key: str, value) -> None:
    ctx_key = f"context:{user_id}"
    if REDIS_AVAILABLE:
        ctx = get_context(user_id)
        ctx[key] = value
        r.setex(ctx_key, MEMORY_TTL, json.dumps(ctx))
    else:
        if ctx_key not in _store:
            _store[ctx_key] = {}
        _store[ctx_key][key] = value


def get_context(user_id: str) -> dict:
    ctx_key = f"context:{user_id}"
    if REDIS_AVAILABLE:
        data = r.get(ctx_key)
        return json.loads(data) if data else {}
    return _store.get(ctx_key, {})