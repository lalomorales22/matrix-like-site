from datetime import datetime
import os
from flask import Flask, render_template, request, redirect, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.security import generate_password_hash, check_password_hash
import random
import pyfiglet

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

ASCII_FONTS = [
    'standard', 'banner', 'slant', 'digital', 'block', 
    'mini', 'small', 'big', 'script', 'shadow'
]

COMEDIC_QUOTES = [
    "404: Paradise not found",
    "sudo chmod 777 heaven",
    "while(life): try_not_to_sin()",
    "if(brain.exists()): matrix.enter()",
    "catch(Temptation) { repent(); }",
    "for(soul in purgatory): await redemption()",
    "class Human extends Divine { constructor() { super(); this.sinCount = 0; } }",
    "git commit -m 'Fixed sins in production'",
    "SELECT * FROM heaven WHERE good_deeds > sins",
    "pip install enlightenment",
    "// TODO: Fix humanity",
    "function escapeMatrix() { return 'There is no escape'; }",
    "Error: Reality.js not found",
    "npm install --save eternal-salvation"
]

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
    try:
        quote = random.choice(COMEDIC_QUOTES)
        return render_template('comedy.html', quote=quote, error=None)
    except Exception as e:
        app.logger.error(f"Error generating comedy quote: {str(e)}")
        return render_template('comedy.html', 
                             quote="Error 500: Humor.exe has stopped working", 
                             error="Failed to generate joke")

@app.route('/ascii-generator', methods=['GET', 'POST'])
def ascii_generator():
    generated_art = None
    if request.method == 'POST':
        text = request.form.get('text', '')
        font = request.form.get('font', 'standard')
        try:
            if font in ASCII_FONTS:
                fig = pyfiglet.Figlet(font=font)
                generated_art = fig.renderText(text)
        except Exception as e:
            flash('Error generating ASCII art')
            generated_art = None
    return render_template('ascii_generator.html', ascii_fonts=ASCII_FONTS, generated_art=generated_art)

@app.route('/update_theme', methods=['POST'])
def update_theme():
    try:
        theme = request.form.get('theme')
        border_style = request.form.get('border_style')
        
        if not theme or theme not in THEMES:
            flash('Invalid theme selected', 'error')
            return redirect(request.referrer or '/')
            
        if not border_style or border_style not in BORDER_STYLES:
            flash('Invalid border style selected', 'error')
            return redirect(request.referrer or '/')
        
        session['theme'] = theme
        session['border_style'] = border_style
            
        pref = models.ThemePreference(
            theme_name=theme,
            border_style=border_style
        )
        db.session.add(pref)
        db.session.commit()
        
        flash('Theme updated successfully', 'success')
        return redirect(request.referrer or '/')
        
    except Exception as e:
        app.logger.error(f"Error updating theme: {str(e)}")
        flash('Failed to update theme', 'error')
        return redirect(request.referrer or '/')