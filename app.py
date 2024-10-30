from datetime import datetime
import os
from flask import Flask, render_template, request, redirect, flash, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.security import generate_password_hash, check_password_hash
import random

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "divine_matrix_key"
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
db.init_app(app)

with app.app_context():
    import models
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/inspiration')
def inspiration():
    inspirations = [
        "The path to enlightenment is coded in the matrix",
        "In the digital realm, we find our true selves",
        "Binary wisdom flows through the cosmic network"
    ]
    return render_template('inspiration.html', quote=random.choice(inspirations))

@app.route('/journal', methods=['GET', 'POST'])
def journal():
    if request.method == 'POST':
        entry = models.JournalEntry(
            content=request.form['content'],
            created_at=datetime.utcnow()
        )
        db.session.add(entry)
        db.session.commit()
        flash('Entry saved successfully')
    entries = models.JournalEntry.query.order_by(models.JournalEntry.created_at.desc()).all()
    return render_template('journal.html', entries=entries)

@app.route('/comedy')
def comedy():
    comedic_quotes = [
        "404: Paradise not found",
        "sudo chmod 777 heaven",
        "while(life): try_not_to_sin()"
    ]
    return render_template('comedy.html', quote=random.choice(comedic_quotes))
