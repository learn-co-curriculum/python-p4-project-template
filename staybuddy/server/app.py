from app import create_app, db
import os


app = create_app()

@app.route('/')
def home():
    return {"message": "StayBuddy Backend API", "status": "running"}

# Initialize database tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
