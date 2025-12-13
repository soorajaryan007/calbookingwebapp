import { useState } from "react";
import EventTypeSelector from "../components/EventTypeSelector";
import DatePicker from "../components/DatePicker";
import SlotGrid from "../components/SlotGrid";
import BookingForm from "../components/BookingForm";
import BookingResult from "../components/BookingResult";
import "../styles.css"; // Make sure styles are imported

export default function Home() {
  const [eventTypeId, setEventTypeId] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [result, setResult] = useState(null);

  return (
    <div className="booking-wrapper">
  <div className="booking-layout">

    {/* LEFT SIDE — Booking Form */}
    <div className="booking-card">

      <h2 className="section-title">Clinic Appointment Scheduler</h2>
      <p className="section-subtitle">
        Book a consultation with ease. Select a service, pick a date, choose a slot, and you're set.
      </p>

      {/* Event Types */}
      <div className="section-block">
        <label className="label">Consultation Type</label>
        <EventTypeSelector onSelect={setEventTypeId} />
      </div>

      {/* Date Picker */}
      {eventTypeId && (
        <div className="section-block">
          <label className="label">Select Date</label>
          <DatePicker onSelect={setDate} />
        </div>
      )}

      {/* Slots */}
      {eventTypeId && date && (
        <div className="section-block">
          <label className="label">Available Slots</label>
          <SlotGrid
            eventTypeId={eventTypeId}
            date={date}
            onSelect={setSelectedSlot}
          />
        </div>
      )}

      {/* Booking Form */}
      {selectedSlot && (
        <div className="section-block">
          <label className="label">Enter Your Details</label>
          <BookingForm
            selectedSlot={selectedSlot}
            eventTypeId={eventTypeId}
            setResult={setResult}
          />
        </div>
      )}

    </div>

    {/* RIGHT SIDE — Booking Result */}
    <div className="booking-result-wrapper">
      {result && (
        <div className="booking-result-card">
          <BookingResult result={result} />
        </div>
      )}
    </div>

  </div>
</div>
  );
}