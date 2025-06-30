class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///staybuddy.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'super-secret-key'
