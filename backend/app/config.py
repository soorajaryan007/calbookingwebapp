from dotenv import load_dotenv
import os

load_dotenv()

CAL_API_KEY = os.getenv("CAL_API_KEY")
TIMEZONE = os.getenv("TIMEZONE", "Asia/Kolkata")
BASE_URL = "https://api.cal.com/v2"
