from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates


from config import db, metadata

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String)
    lname = db.Column(db.String)

    adoptions = db.relationship("Adoption", backref="user")

    serialize_rules = ("-adoptions.user",)

    @validates("fname", "lname")
    def validate_names(self, key, value):
        if not value:
            raise ValueError("Needs valid first and or last name")
        return value


class Pet(db.Model, SerializerMixin):
    __tablename__ = "pets"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    breed = db.Column(db.String)
    type = db.Column(db.String)

    adoptions = db.relationship("Adoption", backref="pet")

    serialize_rules = ("-adoptions.pet",)

    @validates("name", "type", "breed")
    def validate_animal(self, key, value):
        if not value or len(value) < 1:
            raise ValueError("Input must be valid")
        return value

#     # this validates types of animal and type of breed within sort of animal
#     # if key == 'type':
#     #     return value


class Adoption(db.Model, SerializerMixin):
    __tablename__ = "adoptions"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    pet_id = db.Column(db.Integer, db.ForeignKey("pets.id"))

    serialize_rules = (
        "-user.adoptions",
        "-pet.adoptions",
    )

    @validates("user_id", "pet_id")
    def validate_ids(self, key, value):
        if not value or type(value) != int:
            raise ValueError("Not in the database")
        if key == "user_id" and User.query.filter_by(id=value).one_or_none() == None:
            raise ValueError("Not in the database")
        if key == "pet_id" and Pet.query.filter_by(id=value).one_or_none() == None:
            raise ValueError("Not in the database")
        return value
