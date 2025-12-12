export default function BookingResult({ result }) {
  if (!result) return null;

  if (result.status !== "success") {
    return (
      <div className="error">
        <h3>Booking Failed ❌</h3>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  }

  // -----------------------------
  // SAFE EXTRACTION BLOCK (ADD THIS)
  // -----------------------------
  const data = result.cal_response?.data || {};

  const name = data.responses?.name || "N/A";
  const email = data.attendees?.[0]?.email || "N/A";
  const date = data.startTime?.slice(0, 10) || "N/A";
  const start = data.startTime?.slice(11, 16) || "N/A";
  const end = data.endTime?.slice(11, 16) || "N/A";
  const bookingId = data.id || "N/A";
  // -----------------------------

  return (
    <div className="success">
      <h3>Booking Confirmed ✔</h3>

      <p><strong>Patient:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Time:</strong> {start}</p>
      <p><strong>Ends:</strong> {end}</p>
      <p><strong>Booking ID:</strong> {bookingId}</p>
    </div>
  );
}
