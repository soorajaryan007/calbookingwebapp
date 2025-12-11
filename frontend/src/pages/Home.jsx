import { useState } from "react";
import EventTypeSelector from "../components/EventTypeSelector";
import DatePicker from "../components/DatePicker";
import SlotGrid from "../components/SlotGrid";
import BookingForm from "../components/BookingForm";
import BookingResult from "../components/BookingResult";

export default function Home() {
  const [eventTypeId, setEventTypeId] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [result, setResult] = useState(null);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Clinic Booking</h1>

      <EventTypeSelector onSelect={setEventTypeId} />

      {eventTypeId && <DatePicker onSelect={setDate} />}

      {eventTypeId && date && (
        <SlotGrid
          eventTypeId={eventTypeId}
          date={date}
          onSelect={setSelectedSlot}
        />
      )}

      {selectedSlot && (
        <BookingForm
          selectedSlot={selectedSlot}
          eventTypeId={eventTypeId}
          setResult={setResult}
        />
      )}

      {result && <BookingResult result={result} />}
    </div>
  );
}
