export default function DatePicker({ onSelect }) {
  return (
    <div className="p-4">
      <label className="block mb-2 font-semibold">Select Date</label>
      <input
        type="date"
        className="border p-2 rounded w-full"
        onChange={(e) => onSelect(e.target.value)}
      />
    </div>
  );
}
