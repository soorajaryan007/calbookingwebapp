import React from "react";
import { API } from "../api";

function BookingForm({ selectedSlot, eventTypeId, date, setResult }) {
  if (!selectedSlot) return null;

  const handleBooking = async () => {
    const start = `${date}T${selectedSlot}:00Z`;

    // Calculate END time based on 30 mins (or use event length if needed)
    const [h, m] = selectedSlot.split(":");
    const endDate = new Date(`${date}T${selectedSlot}:00Z`);
    endDate.setMinutes(endDate.getMinutes() + 30);
    const end = endDate.toISOString();

    const payload = {
      event_type_id: eventTypeId,
      start,
      end,
      name: "Sooraj",
      email: "test@example.com"
    };

    console.log("Sending booking payload:", payload);

    try {
      const res = await fetch(`${API}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log("BOOK RESPONSE:", data);
      setResult(data);
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  return (
    <div>
      <h3>Confirm Booking</h3>
      <button onClick={handleBooking}>Book Slot</button>
    </div>
  );
}

export default BookingForm;
