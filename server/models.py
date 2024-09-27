from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates


from config import db, metadata


class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    username = db.Column(db.String)
    password = db.Column(db.String)

    adoptions = db.relationship("Adoption", backref="user", cascade="all, delete")
    favorites = db.relationship("Favorite", backref="user", cascade="all, delete")

    serialize_rules = ("-adoptions.user","-favorites.user",)

    # @validates("name")
    # def validate_names(self, key, value):
    #     if not value:
    #         raise ValueError("Requires name")
    #     return value
    # @validates("username")
    # def validate_no_copy(self,key,value):
    #     print(key)
    #     print(value)
    #     if not value:
    #         raise ValueError("Requires both password and username")
    #     if key == username and self.query.filter_by(username=value).one_or_none():
    #         raise ValueError("Username or Password already taken")
    #     # if key == password and self.query.filter_by(password=value).one_or_none():
    #     #     raise ValueError("Username or Password already taken")
    #     return value
    # @validates("password")
    # def validate_pass(self,key,value):
    #     print(key)
    #     print(value)
    #     if key == password and self.query.filter_by(password=value).one_or_none():
    #         raise ValueError("Username or Password already taken")
    #     return value


class Pet(db.Model, SerializerMixin):
    __tablename__ = "pets"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    breed = db.Column(db.String)
    type = db.Column(db.String)
    image = db.Column(db.String)

    adoptions = db.relationship("Adoption", backref="pet", cascade="all, delete")
    favorites = db.relationship("Favorite", backref="pet", cascade="all, delete")

    serialize_rules = ("-adoptions.pet","-favorites.pet",)

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
        "-user.favorites",
        "-pets.favorites",
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

class Favorite(db.Model, SerializerMixin):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    pet_id = db.Column(db.Integer, db.ForeignKey("pets.id"))

    serialize_rules = (
        "-user.favorites",
        "-pet.favorites",
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