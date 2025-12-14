import { useState } from "react";

export default function RescheduleBooking({ bookingUid, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReschedule = async () => {
    if (!date || !time) {
      setError("Select date and time");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const start = new Date(`${date}T${time}`).toISOString();

      const res = await fetch(`http://localhost:8000/reschedule-booking/${bookingUid}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    start: new Date(`${date}T${time}`).toISOString(),
    reschedulingReason: "User requested reschedule"
  })
});


      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed");
      }

      const data = await res.json();
      onSuccess?.(data);
      setOpen(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "12px" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "10px",
          background: "#f59e0b",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
        }}
      >
        🔁 Reschedule Booking
      </button>

      {open && (
        <div style={{ marginTop: "10px" }}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          <input type="time" value={time} onChange={e => setTime(e.target.value)} />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button
            onClick={handleReschedule}
            disabled={loading}
            style={{
              marginTop: "8px",
              width: "100%",
              padding: "10px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
            }}
          >
            {loading ? "Rescheduling..." : "Confirm Reschedule"}
          </button>
        </div>
      )}
    </div>
  );
}
