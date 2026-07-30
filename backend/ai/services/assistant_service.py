from .groq_service import generate_chat_completion
from .prompt_service import build_messages, parse_assistant_response


def respond_to_assistant_request(context, history, message):
    """Generate every assistant reply through the configured AI provider."""
    content = generate_chat_completion(build_messages(context, history, message))
    return parse_assistant_response(content)
