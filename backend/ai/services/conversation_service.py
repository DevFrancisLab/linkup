from uuid import uuid4

from django.core.cache import cache

CONVERSATION_TTL_SECONDS = 2 * 60 * 60
MAX_CONVERSATION_MESSAGES = 8


def get_session_id(session_id=None):
    return str(session_id or uuid4())


def _cache_key(user_id, session_id):
    return f"ai:conversation:{user_id}:{session_id}"


def get_conversation_history(user, session_id):
    """Return the short-lived history for one user's current AI session."""
    return cache.get(_cache_key(user.id, session_id), [])


def store_conversation_exchange(user, session_id, message, reply):
    history = get_conversation_history(user, session_id)
    history.extend(
        [
            {"role": "user", "content": message},
            {"role": "assistant", "content": reply},
        ]
    )
    cache.set(
        _cache_key(user.id, session_id),
        history[-MAX_CONVERSATION_MESSAGES:],
        CONVERSATION_TTL_SECONDS,
    )
