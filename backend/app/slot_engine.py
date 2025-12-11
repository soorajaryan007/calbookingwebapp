from datetime import datetime, timedelta

DURATIONS = {
    4136379: 30,
    4136388: 15,
    4136397: 45,
    4136398: 60,
}

def generate_slots(event_type_id: int, date: str):
    base_date = datetime.strptime(date, "%Y-%m-%d")

    raw_times = ["09:00", "10:00", "11:00", "14:00", "15:00"]
    duration = DURATIONS.get(event_type_id, 30)

    slots = []

    for time_str in raw_times:
        hour, minute = map(int, time_str.split(":"))
        start_dt = base_date.replace(hour=hour, minute=minute, second=0)
        end_dt = start_dt + timedelta(minutes=duration)

        slots.append({
            "start": start_dt.isoformat() + "Z",
            "end": end_dt.isoformat() + "Z"
        })

    return {
        "status": "success",
        "event_type_id": event_type_id,
        "date": date,
        "duration": duration,
        "slots": slots
    }
