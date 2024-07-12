from app import app
from models import db, User, BookClub, Book, Membership, Assignment
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt(app)

# bcrypt = Bcrypt(app)

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")

        # Drop all tables and recreate them
        db.drop_all()
        db.create_all()

        # Users
        u1 = User(username="user1", password="password1")
        u2 = User(username="user2", password="password2")
        u3 = User(username="user3", password="password3")
        u4 = User(username="user4", password="password4")

        db.session.add_all([u1, u2, u3, u4])
        db.session.commit()

        # Book Clubs
        bc1 = BookClub(name="Book Club 1", description="Description for Book Club 1")
        bc2 = BookClub(name="Book Club 2", description="Description for Book Club 2")
        bc3 = BookClub(name="Book Club 3", description="Description for Book Club 3")
        bc4 = BookClub(name="Book Club 4", description="Description for Book Club 4")

        # Adding members to each book club
        bc1.memberships.append(Membership(user=u1))
        bc2.memberships.extend([Membership(user=u2), Membership(user=u3)])
        bc3.memberships.append(Membership(user=u4))

        db.session.add_all([bc1, bc2, bc3, bc4])
        db.session.commit()

        # Books
        b1 = Book(
            title="Book 1",
            author="Author 1",
            description="Description for Book 1",
            image_url="http://example.com/book1.jpg"
        )
        b2 = Book(
            title="Book 2",
            author="Author 2",
            description="Description for Book 2",
            image_url="http://example.com/book2.jpg"
        )
        b3 = Book(
            title="Book 3",
            author="Author 3",
            description="Description for Book 3",
            image_url="http://example.com/book3.jpg"
        )
        b4 = Book(
            title="Book 4",
            author="Author 4",
            description="Description for Book 4",
            image_url="http://example.com/book4.jpg"
        )

        db.session.add_all([b1, b2, b3, b4])
        db.session.commit()

        # Assignments
        a1 = Assignment(book=b1, book_club=bc1)
        a2 = Assignment(book=b2, book_club=bc2)
        a3 = Assignment(book=b3, book_club=bc3)
        a4 = Assignment(book=b4, book_club=bc4)

        db.session.add_all([a1, a2, a3, a4])
        db.session.commit()

        print("Seeding finished.")