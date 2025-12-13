import { useEffect, useState } from "react";
import { cancelBookingAPI } from "../api/api";

export default function BookingResult({ result }) {
  if (!result) return null;

  // ❌ Booking failed
  if (result.status !== "success") {
  const errorMessage =
    result?.message ||
    result?.cal_response?.error?.message ||
    "Unable to complete booking. Please try again.";

  const errorCode =
    result?.cal_response?.error?.code || null;

  return (
    <div className="booking-result error">
      <h3 style={{ color: "#dc2626" }}>Booking Failed ❌</h3>

      <p style={{ marginTop: "8px", color: "#374151" }}>
        {errorMessage}
      </p>

      {errorCode && (
        <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}>
          Error code: <strong>{errorCode}</strong>
        </p>
      )}

      <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "12px" }}>
        Please select a different date or try again later.
      </p>
    </div>
  );
}


  // ✅ Data comes DIRECTLY from backend (flat structure)
  const bookingUid = result.booking_uid;
  const name = result.name || "N/A";
  const email = result.email || "N/A";
  const date = result.start?.slice(0, 10) || "N/A";
  const start = result.start?.slice(11, 16) || "N/A";
  const end = result.end?.slice(11, 16) || "N/A";

  const [secondsLeft, setSecondsLeft] = useState(30);
  const [cancelled, setCancelled] = useState(false);
  const [loading, setLoading] = useState(false);

  // ⏱ Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  // ❌ Cancel booking
  const handleCancel = async () => {
    if (!bookingUid) return;

    setLoading(true);
    try {
      await cancelBookingAPI(bookingUid);
      setCancelled(true);
    } catch (err) {
      alert("Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  // 🚫 Cancelled UI
  if (cancelled) {
    return (
      <div className="booking-result cancelled">
        <h3>Booking Cancelled ❌</h3>
        <p>Your appointment has been cancelled.</p>
      </div>
    );
  }

  // ✅ Success UI
  return (
    <div className="booking-result success">
      <h3>Booking Confirmed ✔</h3>

      <p style={{ fontSize: "12px", color: "#888" }}>
        Booking UID: {bookingUid}
      </p>

      <p><strong>Patient:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Time:</strong> {start}</p>
      <p><strong>Ends:</strong> {end}</p>

      {secondsLeft > 0 && (
        <button
          onClick={handleCancel}
          disabled={loading}
          style={{
            marginTop: "14px",
            padding: "10px",
            width: "100%",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Cancelling..."
            : `Cancel Booking (${secondsLeft}s)`}
        </button>
      )}
    </div>
  );
}
