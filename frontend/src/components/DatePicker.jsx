export default function DatePicker({ onSelect }) {
  return (
    <div className="p-4">
      <label className="block font-semibold mb-2">Select Date</label>
      <input
        type="date"
        className="border p-2 rounded"
        onChange={(e) => onSelect(e.target.value)}
      />
    </div>
  );
}
