
---

# 🧭 **PROJECT ARCHITECTURE (FULL)**

```
calbookingwebapp/
├── backend/
│   ├── venv/                     # Virtual environment for backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI root app, routes, CORS
│   │   ├── models.py             # Pydantic models (BookingRequest)
│   │   ├── database.py           # SQLite DB connection + init
│   │   ├── slot_engine.py        # Generates time slots
│   │   ├── cal.py                # Handles Cal.com API calls
│   │   ├── config.py             # Loads environment variables (.env)
│   ├── bookings.db               # SQLite DB
│   ├── requirements.txt          # FastAPI, Requests, Uvicorn, etc.
│   ├── .env                      # Contains CAL_API_KEY
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js            # Axios calls to backend (event types, slots, booking)
│   │   ├── components/
│   │   │   ├── EventTypeSelector.jsx
│   │   │   ├── DatePicker.jsx
│   │   │   ├── SlotGrid.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   └── BookingResult.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx           # Main UI Page
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── App.css
│   ├── package.json
│   └── vite.config.js
│
├── README.md                    # Project instructions
└── .gitignore
```

---

# 🧩 **WHAT EACH COMPONENT DOES**

## **Backend (FastAPI)**

### `main.py`

* Defines API routes:

  * `/event-types`
  * `/availability`
  * `/book`
* Enables CORS
* Orchestrates DB + Cal.com API

### `models.py`

Defines:

```python
class BookingRequest(BaseModel):
    event_type_id: int
    start: str
    end: str
    name: str
    email: str
```

### `slot_engine.py`

Generates time slots based on:

| Event                  |
| ---------------------- |
| 15, 30, 45, 60 minutes |

### `cal.py`

Sends POST request to Cal.com:

```json
{
  "eventTypeId": 4136397,
  "start": "...",
  "end": "...",
  "language": "en",
  "responses": { "name": "", "email": "" }
}
```

### `database.py`

* Creates functional SQLite database
* Stores bookings before sending to Cal

---

## **Frontend (React + Vite)**

### `api/api.js`

Handles calls:

* `getEventTypes()`
* `getAvailability()`
* `bookSlotAPI()`

### Components

#### ⭐ `EventTypeSelector.jsx`

Dropdown of your Cal.com event types.

#### ⭐ `DatePicker.jsx`

Calendar input.

#### ⭐ `SlotGrid.jsx`

Displays slots as buttons.

#### ⭐ `BookingForm.jsx`

Collects name + email + selected slot.

#### ⭐ `BookingResult.jsx`

Shows booking receipt info.

### Page

#### `Home.jsx`

Main page that stitches everything together.

### App Flow

`main.jsx → App.jsx → Home.jsx → Components`

---

# 🧠 **SYSTEM FLOW (How your app works)**

```
[ User ] 
   |
   | selects event type & date
   v
[ React Frontend ]
   |
   | GET /availability
   |
   v
[ FastAPI Backend ]
   |
   | generate slots (slot_engine.py)
   v
[ Frontend shows slots ]
   |
   | User enters name + email + slot
   |
   | POST /book
   v
[ FastAPI ]
   |
   | Insert booking into SQLite
   |
   | Send booking payload to Cal.com
   v
[ Cal.com API ]
   |
   | Returns booking ID, attendee info, status
   v
[ Frontend displays confirmation ]
```

---

# 📡 **HIGH LEVEL ARCHITECTURE**

```
       ┌────────────────────┐
       │      Frontend      │
       │   React + Vite     │
       └───────┬────────────┘
               |
               | Axios API Calls
               v
       ┌────────────────────┐
       │   FastAPI Backend  │
       │   Python (uvicorn) │
       └───────┬────────────┘
               |
       ┌───────┴────────────┐
       │  Slot Engine        │
       │  Database (SQLite)  │
       │  Cal.com API Client │
       └─────────┬──────────┘
                 |
                 v
        ┌────────────────────┐
        │     Cal.com API    │
        │   Booking Engine   │
        └────────────────────┘
```

---

