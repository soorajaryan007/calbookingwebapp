import { useState } from "react";
import { bookSlotAPI } from "../api/api";

export default function BookingForm({ selectedSlot, eventTypeId, setResult }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (!selectedSlot) {
      alert("Please select a time slot first.");
      return;
    }

    if (!name || !email) {
      alert("Please enter your name and email.");
      return;
    }

    const payload = {
      event_type_id: eventTypeId,
      start: selectedSlot.start,
      end: selectedSlot.end,
      name,
      email,
    };

    try {
      setLoading(true);
      console.log("BOOKING PAYLOAD →", payload);

      const res = await bookSlotAPI(payload);
      console.log("BOOK RESPONSE →", res.data);

      setResult(res.data);
    } catch (err) {
      console.error("BOOKING ERROR →", err);
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Enter Patient Details</h3>

      <div style={{ marginBottom: "12px" }}>
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {!selectedSlot && (
        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "10px" }}>
          Please select a time slot to enable booking.
        </p>
      )}

      <button
        className="book-btn"
        onClick={handleBooking}
        disabled={!selectedSlot || loading}
      >
        {loading ? "Booking..." : "Book Appointment"}
      </button>
    </div>
  );
}
