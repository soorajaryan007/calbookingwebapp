import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Fetch event types
export const getEventTypes = () => API.get("/event-types");

// Fetch availability
export const getAvailability = (eventTypeId, date) =>
  API.get(`/availability?event_type_id=${eventTypeId}&date=${date}`);

// Create booking
export const createBooking = (data) => API.post("/book", data);

export default API;
