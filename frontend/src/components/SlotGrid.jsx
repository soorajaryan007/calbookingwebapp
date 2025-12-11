import { getAvailability } from "../api/api";
import { useState, useEffect } from "react";

export default function SlotGrid({ eventTypeId, date, onSelect }) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (!eventTypeId || !date) return;

    getAvailability(eventTypeId, date).then((res) => {
      setSlots(res.data.slots || []);
    });
  }, [eventTypeId, date]);

  if (!eventTypeId || !date) return null;

  return (
    <div>
      <h3>Available Slots</h3>
      <div className="grid">
        {slots.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s)}
            className="slot-btn"
          >
            {s.start.slice(11, 16)} → {s.end.slice(11, 16)}
          </button>
        ))}
      </div>
    </div>
  );
}
