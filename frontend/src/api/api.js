import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export async function getEventTypes() {
  return axios.get(`${API_BASE}/event-types`);
}

export async function getAvailability(eventTypeId, date) {
  return axios.get(`${API_BASE}/availability`, {
    params: { event_type_id: eventTypeId, date },
  });
}

export async function bookSlotAPI(payload) {
  return axios.post(`${API_BASE}/book`, payload);
}
