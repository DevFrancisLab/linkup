from dataclasses import dataclass


def con(message):
    return f"CON {message}"


def end(message):
    return f"END {message}"


@dataclass(frozen=True)
class UssdRequest:
    session_id: str
    service_code: str
    phone_number: str
    text: str

    @property
    def selections(self):
        return [selection for selection in self.text.split("*") if selection]


MAIN_MENU = """Welcome to LinkUp
1. Upcoming Events
2. My Events
3. My Connections
4. Discover Events
5. Exit"""


def handle_ussd_request(request):
    """Return the next Africa's Talking USSD response for a session."""
    if not request.selections:
        return con(MAIN_MENU)

    responses = {
        "1": "Upcoming events will be available here soon.",
        "2": "Your events will be available here soon.",
        "3": "Your connections will be available here soon.",
        "4": "Event discovery will be available here soon.",
        "5": "Thanks for using LinkUp.",
    }
    response = responses.get(request.selections[0])
    if response is None:
        return con(f"Invalid selection.\n{MAIN_MENU}")
    return end(response)
