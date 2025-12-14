import { useEffect, useState } from "react";
import axios from "axios";

export default function SlotGrid({ eventTypeId, date, onSelect }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!eventTypeId || !date) {
      setSlots([]);
      return;
    }

    setLoading(true);
    setError("");

    axios
      .get("http://127.0.0.1:8000/availability", {
        params: {
          event_type_id: eventTypeId,
          date: date,
        },
      })
      .then((res) => {
        console.log("Availability response:", res.data);

        if (res.data?.status === "success" && Array.isArray(res.data.slots)) {
          setSlots(res.data.slots);
        } else {
          setSlots([]);
          setError("No slots returned");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch slots", err);
        setSlots([]);
        setError("Failed to load slots");
      })
      .finally(() => setLoading(false));
  }, [eventTypeId, date]);

  return (
    <div style={{ marginTop: 16 }}>
      <h3 style={{ marginBottom: 10 }}>Available Slots</h3>

      {loading && <div style={{ color: "#666" }}>Loading slots…</div>}

      {!loading && error && (
        <div style={{ color: "#dc2626" }}>{error}</div>
      )}

      {!loading && !error && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {slots.length > 0 ? (
            slots.map((slot, idx) => {
              const start = slot.start
                ? slot.start.slice(11, 16)
                : "—";

              const end = slot.end
                ? slot.end.slice(11, 16)
                : "—";

              return (
                <button
                  key={idx}
                  onClick={() => onSelect(slot)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #dbeafe",
                    background: "#eef2ff",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  {start} → {end}
                </button>
              );
            })
          ) : (
            <div style={{ color: "#777" }}>
              No slots available for this date
            </div>
          )}
        </div>
      )}
    </div>
  );
}
