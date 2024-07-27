from models import db, Freelancer, Project, Client
from flask_migrate import Migrate
from flask import Flask, request, make_response, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
import os

app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

migrate = Migrate(app, db)

db.init_app(app)

api = Api(app)

@app.route("/")
def index():
    return "<h1>Freelancing Project Management</h1>"

class Freelancers(Resource):
    def get(self):
        response_dict_list = [n.to_dict() for n in Freelancer.query.all()]
        response = make_response(
            jsonify(response_dict_list),
            200,
        )
        return response
    
    def post(self):
        try:
            new_record = Freelancer(
                name=request.json["name"],
                username=request.json["username"],
                email=request.json["email"],
                rate=request.json["rate"]
            )

            db.session.add(new_record)
            db.session.commit()
            response = new_record.to_dict()
            return make_response(jsonify(response), 201)

        except Exception as e:
            return make_response(jsonify({"errors": [str(e)]}), 400)

class FreelancerByID(Resource):
    def get(self, id):
        response_dict = Freelancer.query.filter_by(id=id).first()
        if response_dict:
            response = make_response(
                jsonify(response_dict.to_dict()),
                200,
            )
        else:
            response = make_response(
                jsonify({"error": "freelancer not found"}),
                404
            )
        return response

    def delete(self, id):
        freelancer = Freelancer.query.filter_by(id=id).first()
        if freelancer:
            db.session.delete(freelancer)
            db.session.commit()
            response_dict = {"message": "Freelancer successfully deleted"}
            response = make_response(
                jsonify(response_dict),
                200
            )
        else:
            response = make_response(
                jsonify({"error": "Freelancer not found"}),
                404
            )
        return response

    def put(self, id):
        freelancer = Freelancer.query.filter_by(id=id).first()
        if freelancer:
            try:
                freelancer.name = request.json.get("name", freelancer.name)
                freelancer.username = request.json.get("username", freelancer.username)
                freelancer.email = request.json.get("email", freelancer.email)
                freelancer.rate = request.json.get("rate", freelancer.rate)

                db.session.commit()
                response = make_response(
                    jsonify(freelancer.to_dict()),
                    200
                )
            except Exception as e:
                response = make_response(
                    jsonify({"errors": [str(e)]}),
                    400
                )
        else:
            response = make_response(
                jsonify({"error": "Freelancer not found"}),
                404
            )
        return response

    def patch(self, id):
        freelancer = Freelancer.query.filter_by(id=id).first()
        if freelancer:
            try:
                for key, value in request.json.items():
                    if hasattr(freelancer, key):
                        setattr(freelancer, key, value)
                db.session.commit()
                response = make_response(
                    jsonify(freelancer.to_dict()),
                    200
                )
            except Exception as e:
                response = make_response(
                    jsonify({"errors": [str(e)]}),
                    400
                )
        else:
            response = make_response(
                jsonify({"error": "Freelancer not found"}),
                404
            )
        return response

class Clients(Resource):
    def get(self):
        response_dict_list = [n.to_dict() for n in Client.query.all()]
        response = make_response(
            jsonify(response_dict_list),
            200,
        )
        return response
    
    def post(self):
        try:
            new_record = Client(
                name=request.json["name"],
                username=request.json["username"],
                email=request.json["email"]
            )

            db.session.add(new_record)
            db.session.commit()
            response = new_record.to_dict()
            return make_response(jsonify(response), 201)

        except Exception as e:
            return make_response(jsonify({"errors": [str(e)]}), 400)

class ClientByID(Resource):
    def get(self, id):
        response_dict = Client.query.filter_by(id=id).first()
        if response_dict:
            response = make_response(
                jsonify(response_dict.to_dict()),
                200,
            )
        else:
            response = make_response(
                jsonify({"error": "client not found"}),
                404
            )
        return response

    def delete(self, id):
        client = Client.query.filter_by(id=id).first()
        if client:
            db.session.delete(client)
            db.session.commit()
            response_dict = {"message": "Client successfully deleted"}
            response = make_response(
                jsonify(response_dict),
                200
            )
        else:
            response = make_response(
                jsonify({"error": "Client not found"}),
                404
            )
        return response

    def put(self, id):
        client = Client.query.filter_by(id=id).first()
        if client:
            try:
                client.name = request.json.get("name", client.name)
                client.username = request.json.get("username", client.username)
                client.email = request.json.get("email", client.email)

                db.session.commit()
                response = make_response(
                    jsonify(client.to_dict()),
                    200
                )
            except Exception as e:
                response = make_response(
                    jsonify({"errors": [str(e)]}),
                    400
                )
        else:
            response = make_response(
                jsonify({"error": "Client not found"}),
                404
            )
        return response

    def patch(self, id):
        client = Client.query.filter_by(id=id).first()
        if client:
            try:
                for key, value in request.json.items():
                    if hasattr(client, key):
                        setattr(client, key, value)
                db.session.commit()
                response = make_response(
                    jsonify(client.to_dict()),
                    200
                )
            except Exception as e:
                response = make_response(
                    jsonify({"errors": [str(e)]}),
                    400
                )
        else:
            response = make_response(
                jsonify({"error": "Client not found"}),
                404
            )
        return response

class Projects(Resource):
    def get(self):
        response_dict_list = [p.to_dict() for p in Project.query.all()]
        response = make_response(
            jsonify(response_dict_list),
            200,
        )
        return response

    def post(self):
        try:
            new_record = Project(
                title=request.json["title"],
                description=request.json["description"],
                rate=request.json["rate"],
                freelancer_id=request.json["freelancer_id"],
                client_id=request.json["client_id"]
            )

            db.session.add(new_record)
            db.session.commit()
            response = new_record.to_dict()
            response['client'] = new_record.client.to_dict(only=('id', 'name'))
            response['freelancer'] = new_record.freelancer.to_dict(only=('id', 'name'))
            return make_response(jsonify(response), 201)

        except Exception as e:
            return make_response(jsonify({"errors": [str(e)]}), 400)

class ProjectByID(Resource):
    def get(self, id):
        project = Project.query.filter_by(id=id).first()
        if project:
            response = make_response(
                jsonify(project.to_dict()),
                200,
            )
        else:
            response = make_response(
                jsonify({"error": "project not found"}),
                404
            )
        return response

    def delete(self, id):
        project = Project.query.filter_by(id=id).first()
        if project:
            db.session.delete(project)
            db.session.commit()
            response_dict = {"message": "Project successfully deleted"}
            response = make_response(
                jsonify(response_dict),
                200
            )
        else:
            response = make_response(
                jsonify({"error": "Project not found"}),
                404
            )
        return response

    def put(self, id):
        project = Project.query.filter_by(id=id).first()
        if project:
            try:
                data = request.json
                project.title = data.get("title", project.title)
                project.description = data.get("description", project.description)
                project.rate = data.get("rate", project.rate)
                project.freelancer_id = data.get("freelancer_id", project.freelancer_id)
                project.client_id = data.get("client_id", project.client_id)

                db.session.commit()
                response = make_response(
                    jsonify(project.to_dict()),
                    200
                )
            except Exception as e:
                response = make_response(
                    jsonify({"errors": [str(e)]}),
                    400
                )
        else:
            response = make_response(
                jsonify({"error": "project not found"}),
                404
            )
        return response

    def patch(self, id):
        project = Project.query.filter_by(id=id).first()
        if project:
            try:
                data = request.json
                for key, value in data.items():
                    if hasattr(project, key):
                        setattr(project, key, value)
                db.session.commit()
                response = make_response(
                    jsonify(project.to_dict()),
                    200
                )
            except Exception as e:
                response = make_response(
                    jsonify({"errors": [str(e)]}),
                    400
                )
        else:
            response = make_response(
                jsonify({"error": "project not found"}),
                404
            )
        return response

api.add_resource(Freelancers, "/freelancers")
api.add_resource(FreelancerByID, "/freelancers/<int:id>")
api.add_resource(Clients, "/clients")
api.add_resource(ClientByID, "/clients/<int:id>")
api.add_resource(Projects, "/projects")
api.add_resource(ProjectByID, "/projects/<int:id>")

if __name__ == "__main__":
    app.run(port=5555, debug=True)
