
---

# **Clinic Scheduler — Full-Stack Appointment Booking App**

A minimal full-stack scheduling system built using:

* **Frontend:** React + Vite
* **Backend:** FastAPI (Python)
* **Database:** SQLite
* **External API:** Cal.com (Booking engine)

This app allows users to select an event type, pick a date, view available slots, enter name/email, and book an appointment.
All bookings get stored locally (SQLite) and also created in **Cal.com** via its REST API.

---

# **📦 Features**

✔ Fetch consultation/event types from Cal.com
✔ Auto-generate available time slots
✔ Store bookings locally in SQLite
✔ Create bookings in Cal.com (with name/email support)
✔ Fully functional React UI
✔ Developer-friendly clean architecture

---

---

# **🛠️ Project Structure**

```
calbookingwebapp/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── cal.py
│   │   ├── slot_engine.py
│   │   ├── database.py
│   │   ├── config.py
│   ├── bookings.db
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

# **🚀 1. Backend Setup (FastAPI)**

### **📌 Prerequisites**

* Python 3.10 or higher
* pip

---

## **1️⃣ Navigate to backend folder**

```bash
cd backend
```

---

## **2️⃣ Create virtual environment**

```bash
python3 -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
```

---

## **3️⃣ Install dependencies**

```bash
pip install -r requirements.txt
```

---

## **4️⃣ Add your `.env` file**

Create:

```
backend/.env
```

Paste:

```
CAL_API_KEY=your_cal_com_api_key_here
```

---

## **5️⃣ Initialize the database**

SQLite DB will auto-create when backend starts.

---

## **6️⃣ Run FastAPI backend**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend is now running at:

```
http://localhost:8000
```

API docs available at:

```
http://localhost:8000/docs
```

---

# **🖥️ 2. Frontend Setup (React + Vite)**

### **📌 Prerequisites**

* Node.js 18+
* npm or yarn

---

## **1️⃣ Navigate to frontend folder**

```bash
cd frontend
```

---

## **2️⃣ Install dependencies**

```bash
npm install
```

---

## **3️⃣ Start the React dev server**

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# **🔑 3. Cal.com API Setup**

You must connect your backend to Cal.com’s booking engine.

---

## **1️⃣ Create Developer API Key**

Go to:

👉 [https://app.cal.com/settings/developer](https://app.cal.com/settings/developer)

Create a **Personal Access Token**
Copy the key (looks like `cal_live_xxxxxxxx`).

---

## **2️⃣ Add to `.env`**

Inside `backend/.env`:

```
CAL_API_KEY=cal_live_xxxxxxxxxxxxxxxxxxxxx
```

---

## **3️⃣ Ensure your Cal.com event types exist**

Go to:

👉 [https://app.cal.com/event-types](https://app.cal.com/event-types)

Create event types such as:

* General Consultation (30 min)
* Follow-Up (15 min)
* Physical Exam (45 min)
* Specialist (60 min)

The backend fetches these types dynamically using the API.

---

## **4️⃣ Ensure the event length matches your slot duration**

If your event is **15 minutes**, your `start` and `end` times must be exactly 15 minutes apart.

Example Valid Booking Payload:

```json
{
  "eventTypeId": 4136397,
  "start": "2025-12-31T10:00:00.000Z",
  "end": "2025-12-31T10:15:00.000Z",
  "language": "en",
  "responses": {
    "name": "Sooraj Aryan",
    "email": "test@example.com"
  }
}
```

---

# **📡 End-to-End Flow**

1. Frontend requests **event types** → backend → Cal.com API
2. User selects event + date
3. Frontend requests **available slots** → backend
4. Backend generates slot list
5. User enters **name/email** and confirms booking
6. Backend:

   * Stores booking in SQLite
   * Sends booking request to Cal.com
7. Cal.com confirms ≫ Frontend shows booking details

---

# **🧪 Testing**

Check backend logs for booking payloads:

```bash
uvicorn app.main:app --reload
```

Use browser DevTools → Network tab to see API calls.

---

# **🐞 Common Issues**

### **❌ CORS error**

Add this in FastAPI (already included):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **❌ Invalid event length**

Make sure your `end - start` matches your event type duration.

### **❌ Missing CAL_API_KEY**

Ensure `.env` file exists in backend folder.

---


# **🎉 You’re Ready to Run the App!**

