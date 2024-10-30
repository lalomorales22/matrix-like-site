from datetime import datetime
import os
from flask import Flask, render_template, request, redirect, flash, session, jsonify
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

THEMES = {
    'matrix': {
        'primary': '#9b30ff',
        'secondary': '#4b0082',
        'text': '#e0e0e0'
    },
    'cyberpunk': {
        'primary': '#ff0055',
        'secondary': '#00ff9f',
        'text': '#ffffff'
    },
    'retro': {
        'primary': '#00ff00',
        'secondary': '#008800',
        'text': '#cccccc'
    }
}

BORDER_STYLES = {
    'single': ['┌', '─', '┐', '│', '└', '┘'],
    'double': ['╔', '═', '╗', '║', '╚', '╝'],
    'bold': ['┏', '━', '┓', '┃', '┗', '┛'],
    'dashed': ['┌', '╌', '┐', '┊', '└', '┘']
}

with app.app_context():
    import models
    db.create_all()

@app.context_processor
def inject_themes():
    return dict(
        themes=THEMES,
        border_styles=BORDER_STYLES,
        current_theme=session.get('theme', 'matrix'),
        current_border=session.get('border_style', 'double')
    )

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

@app.route('/theme', methods=['POST'])
def update_theme():
    theme = request.form.get('theme')
    border_style = request.form.get('border_style')
    
    if theme and theme in THEMES:
        session['theme'] = theme
    if border_style and border_style in BORDER_STYLES:
        session['border_style'] = border_style
        
    pref = models.ThemePreference(
        theme_name=theme or 'matrix',
        border_style=border_style or 'double'
    )
    db.session.add(pref)
    db.session.commit()
    
    return redirect(request.referrer or '/')
