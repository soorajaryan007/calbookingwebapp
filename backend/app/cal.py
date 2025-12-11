import os
import requests
from dotenv import load_dotenv

load_dotenv()

CAL_API_KEY = os.getenv("CAL_API_KEY")

if not CAL_API_KEY:
    raise Exception("CAL_API_KEY missing from .env")

BASE_URL = "https://api.cal.com/v2"

HEADERS = {
    "Authorization": f"Bearer {CAL_API_KEY}",
    "Content-Type": "application/json"
}

# -------------------------------------------------------
# 1) FETCH EVENT TYPES  (Used by frontend dropdown)
# -------------------------------------------------------
def get_event_types():
    url = f"{BASE_URL}/event-types"
    response = requests.get(url, headers=HEADERS)

    print("RAW EVENT TYPES RESPONSE →", response.text)

    try:
        data = response.json()

        groups = data.get("data", {}).get("eventTypeGroups", [])

        if not groups:
            return {"status": "success", "events": []}

        # Extract from first group
        events = groups[0].get("eventTypes", [])

        return {
            "status": "success",
            "events": events
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}


    return {
        "status": "success",
        "events": events
    }

# -------------------------------------------------------
# 2) SEND BOOKING TO CAL.COM
# -------------------------------------------------------
def send_booking_to_cal(event_type_id, start, name, email):
    url = f"{BASE_URL}/bookings"

    payload = {
        "eventTypeId": event_type_id,
        "start": start,
        "timeZone": "Asia/Kolkata",
        "language": "en",
        "responses": {
            "name": name,
            "email": email
        },
        "metadata": {}
    }

    response = requests.post(url, json=payload, headers=HEADERS)

    try:
        return response.json()
    except:
        return {"status": "error", "message": "Invalid response from Cal.com"}
