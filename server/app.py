from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User, Expense
from config import Config
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
CORS(app)

# Initialize database tables
with app.app_context():
    db.create_all()

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to Budget Buddy API"}), 200

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "User already exists"}), 400

    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        return jsonify({"message": "Login successful!"}), 200
    return jsonify({"message": "Invalid username or password"}), 401

@app.route("/expenses", methods=["GET", "POST"])
def expenses():
    username = request.headers.get("Username")

    if not username:
        return jsonify({"message": "Unauthorized"}), 401

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    if request.method == "GET":
        expenses = Expense.query.filter_by(user_id=user.id).all()
        return jsonify([
            {
                "id": exp.id,
                "name": exp.name,
                "amount": exp.amount,
                "category": exp.category,
                "date": exp.date.isoformat(),
            }
            for exp in expenses
        ]), 200

    if request.method == "POST":
        data = request.get_json()
        try:
            # Convert date string to a Python date object
            date_object = datetime.strptime(data.get("date"), "%Y-%m-%d").date()

            expense = Expense(
                name=data.get("name"),
                amount=float(data.get("amount")),
                category=data.get("category"),
                date=date_object,
                user_id=user.id,
            )
            db.session.add(expense)
            db.session.commit()
            return jsonify({
                "id": expense.id,
                "name": expense.name,
                "amount": expense.amount,
                "category": expense.category,
                "date": expense.date.isoformat(),
            }), 201
        except Exception as e:
            print(f"Error while creating expense: {e}")
            return jsonify({"message": "Failed to create expense"}), 500

@app.route("/expenses/<int:expense_id>", methods=["DELETE", "PATCH"])
def manage_expense(expense_id):
    username = request.headers.get("Username")
    if not username:
        return jsonify({"message": "Unauthorized"}), 401

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    expense = Expense.query.get(expense_id)
    if not expense or expense.user_id != user.id:
        return jsonify({"message": "Expense not found"}), 404

    if request.method == "DELETE":
        db.session.delete(expense)
        db.session.commit()
        return jsonify({"message": "Expense deleted successfully"}), 200

    if request.method == "PATCH":
        data = request.get_json()
        if "name" in data:
            expense.name = data["name"]
        if "amount" in data:
            expense.amount = float(data["amount"])
        if "category" in data:
            expense.category = data["category"]
        if "date" in data:
            expense.date = datetime.strptime(data["date"], "%Y-%m-%d").date()
        db.session.commit()
        return jsonify({
            "id": expense.id,
            "name": expense.name,
            "amount": expense.amount,
            "category": expense.category,
            "date": expense.date.isoformat(),
        }), 200

if __name__ == "__main__":
    app.run(debug=True, port=5001)