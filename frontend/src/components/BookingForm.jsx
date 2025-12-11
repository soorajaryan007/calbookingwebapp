import { useState } from "react";
import { bookSlotAPI } from "../api/api";


export default function BookingForm({ selectedSlot, eventTypeId, setResult }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!selectedSlot) return null;

  const handleBooking = async () => {
    if (!name || !email) {
      alert("Please enter your name and email.");
      return;
    }

    const payload = {
      event_type_id: eventTypeId,
      start: selectedSlot.start,
      end: selectedSlot.end,
      name,
      email
    };

    console.log("BOOKING PAYLOAD →", payload);

    const res = await bookSlotAPI(payload);
    console.log("BOOK RESPONSE →", res.data);

    setResult(res.data);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Enter Patient Details</h3>

      <div style={{ marginBottom: "10px" }}>
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: "block", padding: "6px", width: "250px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", padding: "6px", width: "250px" }}
        />
      </div>

      <button onClick={handleBooking} style={{ padding: "10px 20px" }}>
        Book Appointment
      </button>
    </div>
  );
}
