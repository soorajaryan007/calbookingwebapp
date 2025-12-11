from datetime import datetime, timedelta

def generate_slots(event_type_id: int, date: str):
    # date format expected: "2025-12-29"
    base_date = datetime.strptime(date, "%Y-%m-%d")

    # raw time slots
    raw_times = [
        "09:00",
        "10:00",
        "11:00",
        "14:00",
        "15:00"
    ]

    # TEMP FIX: duration always 30 minutes
    duration_minutes = 30

    slots = []

    for time_str in raw_times:
        # split hour and minute
        hour, minute = map(int, time_str.split(":"))

        # create start datetime
        start_dt = base_date.replace(hour=hour, minute=minute, second=0)

        # create end datetime
        end_dt = start_dt + timedelta(minutes=duration_minutes)

        # push ISO timestamps
        slots.append({
            "start": start_dt.isoformat() + "Z",
            "end": end_dt.isoformat() + "Z"
        })

    return {
        "event_type_id": event_type_id,
        "date": date,
        "slots": slots
    }
