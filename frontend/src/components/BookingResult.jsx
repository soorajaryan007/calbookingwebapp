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

  const data = result.cal_response.data;

  return (
    <div className="success">
      <h3>Booking Confirmed ✔</h3>
      <p><strong>Patient:</strong> {data.responses.name}</p>
      <p><strong>Email:</strong> {data.attendees[0].email}</p>
      <p><strong>Date:</strong> {data.startTime.slice(0, 10)}</p>
      <p><strong>Time:</strong> {data.startTime.slice(11, 16)}</p>
      <p><strong>Ends:</strong> {data.endTime.slice(11, 16)}</p>
      <p><strong>Booking ID:</strong> {data.id}</p>
    </div>
  );
}
