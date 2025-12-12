---

# **Clinic Scheduler —- Full-Stack Appointment Booking System**

A modern appointment-booking platform integrating **React**, **FastAPI**, **SQLite**, and **Cal.com API**.
Users can select an event type, pick a date, view generated time slots, and confirm a booking with name & email.
Each booking is **stored locally** and **synced with Cal.com** in real time.

---

## ✨ **Features**

* Fetch event types dynamically from **Cal.com API**
* Auto-generate available timeslots
* Create verified bookings (with name & email)
* Store bookings locally in **SQLite**
* Fully responsive React UI
* Clean backend architecture
* **Docker Support** for one-command startup
* Developer-friendly documentation

---

## 🏗️ **Project Architecture**

```
calbookingwebapp/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── cal.py
│   │   ├── slot_engine.py
│   │   ├── database.py
│   │   ├── config.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env   (not committed - holds API key)
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
│
└── docker-compose.yml
```

---

# 🐳 **1. Run the Entire App with Docker (Recommended)**

Running the stack via Docker is the easiest and fastest method.
No Python, Node.js, pip, or npm required on your machine.

---

## **1️⃣ Prerequisites**

Ensure Docker is installed:

```bash
docker --version
docker compose version
```

---

## **2️⃣ Add `.env` inside the backend folder**

Create the file:

```
backend/.env
```

Add your Cal.com API key:

```
CAL_API_KEY=cal_live_xxxxxxxxxxxxxxxxxxxx
```

> This file is ignored by Git and **must exist before building** the Docker image.

---

## **3️⃣ Start the full system**

From the project root:

```bash
docker compose up --build
```

Docker will:

✔ Build backend image
✔ Build frontend image
✔ Create network
✔ Start both containers

---

## **4️⃣ Access the Application**

| Service            | URL                                                      |
| ------------------ | -------------------------------------------------------- |
| Frontend (React)   | [http://localhost:5173](http://localhost:5173)           |
| Backend (FastAPI)  | [http://localhost:8000](http://localhost:8000)           |
| API Docs (Swagger) | [http://localhost:8000/docs](http://localhost:8000/docs) |

---

## **5️⃣ Stop containers**

```bash
docker compose down
```

---

## **6️⃣ Rebuild cleanly**

```bash
docker compose build --no-cache
docker compose up
```

---

# ⚙️ **2. Manual Local Setup (Optional)**

If not using Docker, you can run frontend and backend separately.

---

# 🔧 **Backend Setup (FastAPI)**

## **1️⃣ Navigate to backend**

```bash
cd backend
```

## **2️⃣ Create virtual environment**

```bash
python3 -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
```

## **3️⃣ Install dependencies**

```bash
pip install -r requirements.txt
```

## **4️⃣ Create `.env`**

```
CAL_API_KEY=cal_live_xxxxxxxxx
```

## **5️⃣ Run the server**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at:

```
http://localhost:8000
http://localhost:8000/docs
```

---

# 🖥️ **Frontend Setup (React + Vite)**

## **1️⃣ Navigate to frontend**

```bash
cd frontend
```

## **2️⃣ Install node dependencies**

> ⚠️ Vite requires **Node.js 20+**

```bash
npm install
```

## **3️⃣ Run the dev server**

```bash
npm run dev
```

Now open:

```
http://localhost:5173
```

---

# 🔑 **Cal.com API Setup**

1. Open: [https://app.cal.com/settings/developer](https://app.cal.com/settings/developer)
2. Create a **Personal Access Token**
3. Copy the key
4. Add it to `backend/.env`:

```
CAL_API_KEY=cal_live_xxxxxxx
```

5. Ensure your event types exist in Cal.com
   [https://app.cal.com/event-types](https://app.cal.com/event-types)

6. Ensure event duration matches your slot-engine logic:

   * Example: 15-minute event must have exactly `end - start = 15 minutes`

---

# 🔄 **Booking Workflow**

1. React loads event types from backend
2. User selects event + date
3. Backend returns generated time slots
4. User fills **name** and **email**
5. Backend:

   * Saves booking in SQLite
   * Sends booking request to Cal.com
6. React shows confirmation message

---

# 🧪 **Testing**

Check backend logs:

```bash
docker logs clinic-backend
```

or when running manually:

```bash
uvicorn app.main:app --reload
```

---

# 📁 **.gitignore**

Included to prevent leaking sensitive data:

```
backend/.env
backend/venv/
backend/__pycache__/
frontend/node_modules/
*.log
```

---




