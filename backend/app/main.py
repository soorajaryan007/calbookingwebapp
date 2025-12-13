from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from datetime import datetime
import pytz

from zoneinfo import ZoneInfo
from app.models import BookingRequest
from app.slot_engine import generate_slots
from app.database import get_connection
from app.cal import send_booking_to_cal, get_event_types
from app.cal import cancel_booking_on_cal

load_dotenv()

app = FastAPI(title="Clinic Booking API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "running", "message": "Backend OK"}


@app.get("/event-types")
def api_event_types():
    return get_event_types()


@app.get("/availability")
def availability(event_type_id: int, date: str):
    return generate_slots(event_type_id, date)


# ---------------------------------------------
# Convert IST → UTC for Cal.com
# ---------------------------------------------




def to_utc(iso_time_str):
    # Convert Z → +00:00 for fromisoformat()
    if iso_time_str.endswith("Z"):
        iso_time_str = iso_time_str.replace("Z", "+00:00")

    # Parse ISO string directly into datetime
    dt = datetime.fromisoformat(iso_time_str)

    # Convert FROM Asia/Kolkata TO UTC
    ist_time = dt.replace(tzinfo=ZoneInfo("Asia/Kolkata"))
    utc_time = ist_time.astimezone(ZoneInfo("UTC"))

    return utc_time.isoformat()




@app.post("/book")
def book(req: BookingRequest):
    # Convert times to UTC for Cal.com API
    start_utc = to_utc(req.start)
    end_utc = to_utc(req.end)

    # 1) Save locally to SQLite
    conn = get_connection()
    c = conn.cursor()
    c.execute(
        "INSERT INTO bookings (event_type_id, start, end, name, email) VALUES (?, ?, ?, ?, ?)",
        (req.event_type_id, req.start, req.end, req.name, req.email)
    )
    conn.commit()
    conn.close()

    # 2) Send to Cal.com (in UTC now)
    cal_response = send_booking_to_cal(
        req.event_type_id,
        start_utc,
        end_utc,
        req.name,
        req.email
    )
    if "data" not in cal_response or "uid" not in cal_response["data"]:
        return {
            "status": "error",
            "message": "Booking failed on Cal.com",
            "cal_response": cal_response
        }

    return {
    "status": "success",
    "booking_uid": cal_response["data"]["uid"],
    "start": req.start,
    "end": req.end,
    "name": req.name,
    "email": req.email
}




@app.delete("/cancel-booking/{booking_uid}")
def cancel_booking(booking_uid: str):
    cal_response = cancel_booking_on_cal(booking_uid)

    return {
        "status": "success",
        "cancelled": True,
        "cal_response": cal_response
    }
