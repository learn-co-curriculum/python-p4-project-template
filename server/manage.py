from flask_migrate import Migrate
from flask import Flask
from config import app, db

migrate = Migrate(app, db)

if __name__ == '__main__':
    from flask.cli import CLI
    cli = CLI(app)
    cli.main()