import { useEffect, useState } from "react";
import { getEventTypes } from "../api/api";

export default function EventTypeSelector({ onSelect }) {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    getEventTypes().then((res) => {
      const events = res.data.events || [];
      setTypes(events);
    });
  }, []);

  return (
    <div>
      <label>Consultation Type</label>
      <select onChange={(e) => onSelect(e.target.value)}>
        <option value="">Select Event Type</option>
        {types.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title} ({t.length} min)
          </option>
        ))}
      </select>
    </div>
  );
}
