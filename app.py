import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key-please-change')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///instance/kanban.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": os.getenv('FRONTEND_URL', 'http://localhost:3000'),
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})

db = SQLAlchemy(app)

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    notes = db.Column(db.Text)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    referral = db.Column(db.Boolean, default=False)

def serialize_job(job):
    return {
        'id': job.id,
        'company': job.company,
        'position': job.position,
        'status': job.status,
        'notes': job.notes,
        'date_added': job.date_added.isoformat() if job.date_added else None,
        'referral': job.referral
    }

with app.app_context():
    # Add the new column if it doesn't exist
    try:
        with db.engine.connect() as conn:
            conn.execute('ALTER TABLE job ADD COLUMN referral BOOLEAN DEFAULT FALSE')
    except Exception as e:
        print(f"Column might already exist: {e}")
    
    db.create_all()
    
    # Check if we need to add sample data
    if Job.query.count() == 0:
        sample_jobs = [
            Job(company="Google", position="Software Engineer", status="Applied", notes="Applied through referral", referral=True),
            Job(company="Apple", position="Frontend Developer", status="Interviewing", notes="Technical interview scheduled"),
            Job(company="Microsoft", position="Full Stack Engineer", status="Intake", notes="Preparing application"),
            Job(company="Amazon", position="Senior Developer", status="Applied", notes="Applied through company website"),
            Job(company="Meta", position="Software Engineer", status="Offer", notes="Negotiating offer details", referral=True),
            Job(company="Netflix", position="UI Engineer", status="Rejected", notes="Will try again next year")
        ]
        for job in sample_jobs:
            db.session.add(job)
        db.session.commit()
    
@app.route('/api/jobs', methods=['GET', 'POST'])
def handle_jobs():
    if request.method == 'POST':
        data = request.json
        print("Received job data:", data)
        new_job = Job(
            company=data['company'],
            position=data['position'],
            status=data['status'],
            notes=data.get('notes', ''),
            referral=data.get('referral', False)
        )
        db.session.add(new_job)
        db.session.commit()
        print("Created new job:", new_job.id)
        return jsonify(serialize_job(new_job))
    else:
        jobs = Job.query.all()
        print("Fetching all jobs, count:", len(jobs))
        return jsonify([serialize_job(job) for job in jobs])

@app.route('/api/jobs/<int:job_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_job(job_id):
    job = Job.query.get_or_404(job_id)
    
    if request.method == 'GET':
        return jsonify(serialize_job(job))
    
    elif request.method == 'PUT':
        data = request.json
        job.company = data.get('company', job.company)
        job.position = data.get('position', job.position)
        job.status = data.get('status', job.status)
        job.notes = data.get('notes', job.notes)
        job.referral = data.get('referral', job.referral)
        db.session.commit()
        return jsonify(serialize_job(job))
    
    elif request.method == 'DELETE':
        db.session.delete(job)
        db.session.commit()
        return '', 204

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    host = os.getenv('HOST', '0.0.0.0')
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    app.run(host=host, port=port, debug=debug)
