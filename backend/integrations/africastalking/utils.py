import re

KENYAN_PHONE_NUMBER_PATTERN = re.compile(r"^(?:\+?254|0)([17]\d{8})$")


def normalize_kenyan_phone_number(phone_number):
    """Return a Kenyan mobile number in E.164 format."""
    normalized = re.sub(r"[\s()\-]", "", phone_number or "")
    match = KENYAN_PHONE_NUMBER_PATTERN.fullmatch(normalized)
    if not match:
        raise ValueError("Use a valid Kenyan mobile number.")
    return f"+254{match.group(1)}"


def mask_phone_number(phone_number):
    return f"{phone_number[:4]}****{phone_number[-3:]}"
