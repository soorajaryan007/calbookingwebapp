import sqlite3
import os

DB_NAME = "clinic.db"

def get_connection():
    conn = sqlite3.connect(DB_NAME)
    return conn

# initialize table
conn = get_connection()
c = conn.cursor()
c.execute("""
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type_id INTEGER,
    start TEXT,
    end TEXT,
    name TEXT,
    email TEXT
);
""")
conn.commit()
conn.close()
