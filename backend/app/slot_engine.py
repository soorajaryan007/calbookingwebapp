from datetime import datetime, timedelta, time
from zoneinfo import ZoneInfo
from app.database import get_connection

# -----------------------------
# Configuration
# -----------------------------
DURATIONS = {
    4136379: 30,
    4136388: 15,
    4136397: 45,
    4136398: 60,
}

CLINIC_TZ = ZoneInfo("Asia/Kolkata")

WORK_START = time(9, 0)
WORK_END = time(17, 0)

BREAK_START = time(13, 0)
BREAK_END = time(14, 0)

# -----------------------------
# Fetch already booked slots
# GLOBAL BLOCKING (any event)
# -----------------------------


def parse_db_time(value: str) -> datetime:
    if value.endswith("Z"):
        value = value.replace("Z", "+00:00")
    dt = datetime.fromisoformat(value)
    return dt.astimezone(CLINIC_TZ)


def get_booked_slots(date: str):
    conn = get_connection()
    c = conn.cursor()

    c.execute(
        """
        SELECT start, end FROM bookings
        WHERE start LIKE ?
        """,
        (f"{date}%",),
    )

    rows = c.fetchall()
    conn.close()

    booked = []
    for start, end in rows:
        booked.append({
            "start": parse_db_time(start),
            "end": parse_db_time(end),
        })

    return booked


# -----------------------------
# Overlap check
# -----------------------------
def overlaps(slot_start, slot_end, booked_slots):
    for b in booked_slots:
        if slot_start < b["end"] and slot_end > b["start"]:
            return True
    return False

# -----------------------------
# Slot generation
# -----------------------------
def generate_slots(event_type_id: int, date: str):
    if event_type_id not in DURATIONS:
        return {
            "status": "error",
            "message": "Invalid event type"
        }

    duration = DURATIONS[event_type_id]
    base_date = datetime.strptime(date, "%Y-%m-%d").date()

    now_ist = datetime.now(CLINIC_TZ)

    # 🔑 GLOBAL booked slots (all events)
    booked_slots = get_booked_slots(date)

    slots = []

    current = datetime.combine(base_date, WORK_START, tzinfo=CLINIC_TZ)
    end_of_day = datetime.combine(base_date, WORK_END, tzinfo=CLINIC_TZ)

    while current + timedelta(minutes=duration) <= end_of_day:
        slot_end = current + timedelta(minutes=duration)

        # Skip lunch break
        if slot_end.time() <= BREAK_START or current.time() >= BREAK_END:

            # Skip past slots
            if current > now_ist:
                # Skip slots already booked (ANY event)
                if not overlaps(current, slot_end, booked_slots):
                    slots.append({
                        "start": current.isoformat(),
                        "end": slot_end.isoformat(),
                    })

        current += timedelta(minutes=duration)

    return {
        "status": "success",
        "event_type_id": event_type_id,
        "date": date,
        "duration_minutes": duration,
        "timezone": "Asia/Kolkata",
        "slots": slots,
    }
