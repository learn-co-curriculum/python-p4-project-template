from app import create_app, db

app = create_app()

@app.route('/')
def home():
    return "Hello, Flask!"

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables
    app.run(debug=True, port=5000)
