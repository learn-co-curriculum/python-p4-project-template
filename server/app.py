
import os
from flask import Flask,session

from flask_migrate import Migrate   
from flask_cors import CORS 
from resources.auth import auth_bp 
from resources.book import book_bp
from resources.borrowed_book import borrowed_bp,borrowed_api
from resources.comment import comment_bp
from resources.favourite import favourite_bp
from resources.profile import profile_bp
from resources.user import user_bp
from resources.bookdetail import bookdetail_bp
from models import db



app = Flask(__name__) 
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SECRET_KEY'] = 'my_secret_key'
app.config['SECRET_KEY'] =os.environ.get('SECRET_KEY','24238f7adc323ed79516259ca523ea68')
migrate = Migrate(app,db)

    
db.init_app(app)
   
# jwt.init_app(app)
    
    # Enable CORS
CORS(app) 




    # Import and register blueprints using relative imports

app.register_blueprint(auth_bp)
app.register_blueprint(book_bp)
app.register_blueprint(borrowed_bp)
app.register_blueprint(comment_bp)
app.register_blueprint(favourite_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(user_bp)
app.register_blueprint(bookdetail_bp)

# Initialize API and add resources
borrowed_api.init_app(app)

@app.route('/')
def index():
    text='Inkwell bookstore'
    return text


if __name__ == "__main__":
    app.run(debug=True, port=5555)
