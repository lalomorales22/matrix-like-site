from app import db
from datetime import datetime

class JournalEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Inspiration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quote = db.Column(db.String(500), nullable=False)
    author = db.Column(db.String(100))
