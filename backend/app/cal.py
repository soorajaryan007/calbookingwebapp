import os
import requests
from dotenv import load_dotenv

load_dotenv()

CAL_API_KEY = os.getenv("CAL_API_KEY")
BASE_URL = "https://api.cal.com/v2"

if not CAL_API_KEY:
    raise Exception("CAL_API_KEY missing in .env")

HEADERS = {
    "Authorization": f"Bearer {CAL_API_KEY}",
    "Content-Type": "application/json"
}

def get_event_types():
    url = f"{BASE_URL}/event-types"
    response = requests.get(url, headers=HEADERS)
    raw = response.json()

    groups = raw.get("data", {}).get("eventTypeGroups", [])
    if not groups:
        return {"status": "success", "events": []}

    events = groups[0].get("eventTypes", [])
    return {"status": "success", "events": events}


def send_booking_to_cal(event_type_id, start, end, name, email):
    url = f"{BASE_URL}/bookings"

    payload = {
        "eventTypeId": event_type_id,
        "start": start,
        "end": end,
        "timeZone": "Asia/Kolkata",
        "language": "en",
        "metadata": {},
        "responses": {
            "name": name,
            "email": email
        }
    }

    print("CAL.COM PAYLOAD →", payload)

    response = requests.post(url, json=payload, headers=HEADERS)

    try:
        return response.json()
    except:
        return {"status": "error", "message": "Invalid response from Cal.com"}


def cancel_booking_on_cal(booking_uid: str):
    url = f"{BASE_URL}/bookings/{booking_uid}/cancel"

    headers = {
        "Authorization": f"Bearer {CAL_API_KEY}",
        "Content-Type": "application/json",
        "cal-api-version": "v2",
    }

    payload = {
        "cancellationReason": "User requested cancellation",
        "cancelSubsequentBookings": True
    }

    response = requests.post(
        url,
        headers=headers,
        json=payload,
        timeout=10
    )

    response.raise_for_status()
    return response.json()



def reschedule_booking_on_cal(booking_uid: str, start: str, reason: str):
    url = f"{BASE_URL}/bookings/{booking_uid}/reschedule"

    headers = {
        "Authorization": f"Bearer {CAL_API_KEY}",
        "Content-Type": "application/json",
        "cal-api-version": "2024-08-13",
    }

    payload = {
        "start": start,  # MUST be ISO 8601
        "reschedulingReason": reason,
        "rescheduledBy": "patient",  # optional but nice
    }

    response = requests.post(
        url,
        headers=headers,
        json=payload,
        timeout=10
    )

    if response.status_code != 200:
        print("Cal reschedule error:", response.status_code, response.text)

    response.raise_for_status()
    return response.json()
