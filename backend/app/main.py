from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.models import BookingRequest
from app.slot_engine import generate_slots
from app.database import get_connection
from app.cal import send_booking_to_cal, get_event_types

load_dotenv()

app = FastAPI(title="Clinic Booking API")

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


@app.post("/book")
def book(req: BookingRequest):
    # store locally
    conn = get_connection()
    c = conn.cursor()
    c.execute(
        "INSERT INTO bookings (event_type_id, start, end, name, email) VALUES (?, ?, ?, ?, ?)",
        (req.event_type_id, req.start, req.end, req.name, req.email)
    )
    conn.commit()
    conn.close()

    # send to Cal.com
    cal_response = send_booking_to_cal(
        req.event_type_id,
        req.start,
        req.end,
        req.name,
        req.email
    )

    return {
        "status": "success",
        "local_saved": True,
        "cal_response": cal_response
    }
