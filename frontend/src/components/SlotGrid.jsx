import { getAvailability } from "../api/api";
import { useEffect, useState } from "react";

export default function SlotGrid({ eventTypeId, date, onSelect }) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (!eventTypeId || !date) return;

    getAvailability(eventTypeId, date).then(res => {
      if (res.data.status === "success") {
        setSlots(res.data.slots);
      }
    });
  }, [eventTypeId, date]);

  if (!eventTypeId || !date) return null;

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-2">Available Slots</h3>
      <div className="grid grid-cols-2 gap-3">
        {slots.map((s, i) => (
          <button
            key={i}
            className="border rounded p-2 hover:bg-blue-200"
            onClick={() => onSelect(s)}
          >
            {s.start.slice(11, 16)} → {s.end.slice(11, 16)}
          </button>
        ))}
      </div>
    </div>
  );
}
