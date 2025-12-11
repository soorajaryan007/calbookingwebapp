import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

export default function Home() {
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [bookingResult, setBookingResult] = useState(null);

  // ---------------------------------------------------------
  // LOAD EVENT TYPES
  // ---------------------------------------------------------
  useEffect(() => {
    fetch(`${API}/event-types`)
      .then((res) => res.json())
      .then((data) => {
        console.log("EVENT TYPES RESPONSE:", data);

        if (Array.isArray(data?.events)) {
          setEventTypes(data.events);
        } else {
          console.warn("No event types found");
        }
      })
      .catch((err) => console.error("Event Type Error", err));
  }, []);

  // ---------------------------------------------------------
  // LOAD AVAILABLE SLOTS
  // ---------------------------------------------------------
  const loadSlots = () => {
    if (!selectedEvent || !date) {
      alert("Select event type and date first.");
      return;
    }

    fetch(`${API}/availability?event_type_id=${selectedEvent}&date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("SLOT DATA:", data);
        setSlots(data?.slots || []);
      })
      .catch((err) => {
        console.error("Slot load error:", err);
        setSlots([]);
      });
  };

  // ---------------------------------------------------------
  // BOOK SLOT
  // ---------------------------------------------------------
  const bookSlot = (slot) => {
    const startISO = new Date(slot.start).toISOString();
    const endISO = new Date(slot.end).toISOString();

    const payload = {
      event_type_id: selectedEvent,
      start: startISO,
      end: endISO,
      name: "Sooraj",
      email: "test@example.com",
    };

    console.log("PAYLOAD SENT:", payload);

    fetch(`${API}/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("BOOKING RESULT:", data);
        setBookingResult(data);
      })
      .catch((err) => console.error("Booking Error:", err));
  };

  // ---------------------------------------------------------
  // FORMAT HELPERS
  // ---------------------------------------------------------
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // ---------------------------------------------------------
  // RENDER UI
  // ---------------------------------------------------------
  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Clinic Scheduler</h1>

      {/* EVENT SELECTOR */}
      <label>Choose Event Type: </label>
      <select
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
      >
        <option value="">Select…</option>

        {eventTypes.map((e) => (
          <option key={e.id} value={e.id}>
            {e.title}
          </option>
        ))}
      </select>

      <br />
      <br />

      {/* DATE PICKER */}
      <label>Select Date:</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ marginLeft: "10px" }}
      />

      <button onClick={loadSlots} style={{ marginLeft: "10px" }}>
        Show Slots
      </button>

      {/* SLOTS */}
      <h2>Available Slots</h2>

      {slots.length === 0 ? (
        <p>No slots found</p>
      ) : (
        slots.map((slot, idx) => (
          <div
            key={idx}
            style={{
              padding: "8px",
              margin: "5px 0",
              border: "1px solid #ccc",
              width: "350px",
            }}
          >
            {slot.start} → {slot.end}

            <button
              onClick={() => bookSlot(slot)}
              style={{ marginLeft: "10px" }}
            >
              Book
            </button>
          </div>
        ))
      )}

      {/* BOOKING RESULT UI */}
      <h2>Booking Result</h2>

      {!bookingResult && <p>None</p>}

      {bookingResult && bookingResult.status === "success" && (
        <div
          style={{
            padding: "15px",
            background: "#E6FFEA",
            border: "2px solid #28A745",
            borderRadius: "10px",
            width: "420px",
            lineHeight: "1.6",
          }}
        >
          <h3 style={{ color: "#1D7A32" }}>Booking Confirmed ✔</h3>

          <p>
            <strong>Patient:</strong>{" "}
            {bookingResult.cal_response.data.user.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {bookingResult.cal_response.data.attendees[0].email}
          </p>

          <p>
            <strong>Event Type:</strong>{" "}
            {
              eventTypes.find(
                (e) =>
                  e.id === bookingResult.cal_response.data.eventTypeId
              )?.title
            }
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {formatDate(bookingResult.cal_response.data.startTime)}
          </p>

          <p>
            <strong>Time:</strong>{" "}
            {formatTime(bookingResult.cal_response.data.startTime)} to{" "}
            {formatTime(bookingResult.cal_response.data.endTime)}
          </p>

          <p>
            <strong>Location:</strong> Google Meet
          </p>

          <p>
            <strong>Booking ID:</strong>{" "}
            {bookingResult.cal_response.data.id}
          </p>
        </div>
      )}

      {bookingResult && bookingResult.status !== "success" && (
        <div
          style={{
            padding: "15px",
            background: "#FFECEC",
            border: "2px solid #FF2E2E",
            borderRadius: "10px",
            width: "420px",
          }}
        >
          <h3 style={{ color: "red" }}>Booking Failed ✖</h3>
          <pre>{JSON.stringify(bookingResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
