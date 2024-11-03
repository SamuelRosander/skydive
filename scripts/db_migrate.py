import sys
import os

sys.path.insert(0, os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..')))

from dotenv import load_dotenv
from skydive import create_app
from skydive.extensions import db

load_dotenv()

app = create_app()
with app.app_context():
    db.create_all()
