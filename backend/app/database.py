import sqlite3

DB_NAME = "clinic.db"

def get_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

# Create bookings table if missing
def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type_id INTEGER,
            start TEXT,
            end TEXT,
            name TEXT,
            email TEXT
        )
    """)

    conn.commit()
    conn.close()

init_db()
