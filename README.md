# Job Application Kanban Board

A modern, interactive Kanban board to track your job application pipeline. Built with Flask backend and React + TypeScript frontend.

## Features

- Drag-and-drop interface for easy status updates
- Add, edit, and delete job applications
- Track company, position, status, and notes
- Mark applications with referral status
- Responsive design that works on all devices
- Persistent storage using SQLite database

## Tech Stack

### Backend
- Flask
- SQLAlchemy
- SQLite
- Flask-CORS

### Frontend
- React
- TypeScript
- Material-UI
- DND Kit (for drag and drop)
- Vite (build tool)

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm 8 or higher
- Git

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/job-kanban.git
cd job-kanban
```

2. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

3. Set up the backend:
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize the database (first time only)
python app.py init-db

# Run the Flask server
python app.py
```

4. Set up the frontend:
```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

5. Open your browser:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

## Environment Variables

The following environment variables can be configured in your `.env` file:

```
# Flask Settings
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# Database Settings
DATABASE_URL=sqlite:///instance/kanban.db

# Server Settings
PORT=5001
HOST=0.0.0.0

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## Usage

- Add new jobs using the "Add New Job" button in the top right
- Drag cards between columns to update status
- Click "Edit" to modify job details
- Click "Delete" to remove a job application
- Toggle "Referral" status when adding or editing jobs

## Columns

1. Not Started - Jobs you're interested in but haven't applied to yet
2. Applied - Applications submitted
3. Interview - Interview process ongoing
4. Offer - Received job offer
5. Rejected - Application rejected or withdrawn

## Troubleshooting

1. **Database Issues**:
   - If you get database errors, try removing the `instance` folder and reinitializing:
     ```bash
     rm -rf instance/
     python app.py init-db
     ```

2. **Port Conflicts**:
   - If port 5001 is in use, modify the `PORT` in `.env`
   - If port 5173 is in use, use `npm run dev -- --port 3000` to run on a different port

3. **CORS Issues**:
   - Ensure the `FRONTEND_URL` in `.env` matches your frontend's actual URL
   - Check that both backend and frontend servers are running

4. **Node Modules Issues**:
   - If you get dependency errors, try:
     ```bash
     rm -rf frontend/node_modules
     rm frontend/package-lock.json
     cd frontend && npm install
     ```

## Deployment

1. Set up your production environment variables:
   - Set `FLASK_ENV=production`
   - Set a strong `SECRET_KEY`
   - Configure `DATABASE_URL` for your production database
   - Set `FRONTEND_URL` to your production frontend URL

2. For the backend:
   - Use a production-grade WSGI server (e.g., Gunicorn)
   - Set up a proper database (e.g., PostgreSQL)
   - Configure proper logging
   - Set up SSL/TLS

3. For the frontend:
   - Build the production bundle: `npm run build`
   - Deploy the contents of the `dist` directory
   - Configure your web server (e.g., Nginx)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
