#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api

# Add your model imports
from models import Pet, User, Adoption

# Views go here!


@app.route("/")
def index():
    return "<h1>Project Server</h1>"


class UserList(Resource):
    def get(self):
        return_list = [u.to_dict() for u in User.query.all()]
        return make_response(return_list, 200)


api.add_resource(UserList, "/users")


class PetList(Resource):
    def get(self):
        rtrn_list = [p.to_dict() for p in Pet.query.all()]
        return make_response(rtrn_list, 200)


api.add_resource(PetList, "/pets")


if __name__ == "__main__":
    app.run(port=5555, debug=True)
