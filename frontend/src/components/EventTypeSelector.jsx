import { useEffect, useState } from "react";
import { getEventTypes } from "../api/api";

export default function EventTypeSelector({ onSelect }) {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    getEventTypes().then(res => {
      const eventTypes = res.data.data.eventTypeGroups[0].eventTypes;
      setTypes(eventTypes);
    });
  }, []);

  return (
    <div className="p-4">
      <label className="block mb-2 font-semibold">Select Consultation Type</label>
      <select
        className="border p-2 rounded w-full"
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Choose Type</option>
        {types.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title} ({t.length} min)
          </option>
        ))}
      </select>
    </div>
  );
}
