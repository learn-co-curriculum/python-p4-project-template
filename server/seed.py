from datetime import datetime
from app import app, db
from models import User, Profile, Book, BookDetail, BorrowedBook, Comment, Favourite

def seed_db():
    with app.app_context():
        # Create sample users
        user1 = User(username='john_doe', email='john@example.com', password='password123')
        user1.set_password('password123')

        user2 = User(username='jane_doe', email='jane@example.com', password='password456')
        user2.set_password('password456')

        # Create sample profiles
        profile1 = Profile(user=user1, bio='Book lover', avatar='john_avatar.png', name='John Doe')
        profile2 = Profile(user=user2, bio='Avid reader', avatar='jane_avatar.png', name='Jane Doe')

        # Create sample books
        book1 = Book(title='Book One', author='Author A', description='A great book', isbn='1234567890', image='https://storage.googleapis.com/du-prd/books/images/9781501110375.jpg')
        book2 = Book(title='Book Two', author='Author B', description='Another great book', isbn='0987654321', image='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQquysRnTGiDsiEo4_SkQbJteaq29QXbudWtQ&s')

        # Create book details
        book_detail1 = BookDetail(book=book1, author='Author A', title='Book One', description='A detailed description of Book One', genre='Fiction', publication_year=2020)
        book_detail2 = BookDetail(book=book2, author='Author B', title='Book Two', description='A detailed description of Book Two', genre='Non-Fiction', publication_year=2021)

        # Create sample borrowed books
        borrowed_book1 = BorrowedBook(user=user1, book=book1, borrowed_date=datetime.utcnow(), return_date=datetime.utcnow())
        borrowed_book2 = BorrowedBook(user=user2, book=book2, borrowed_date=datetime.utcnow(), return_date=datetime.utcnow())

        # Create sample comments
        comment1 = Comment(user=user1, book=book1, text='Great read!', name='John Doe')
        comment2 = Comment(user=user2, book=book2, text='Very informative.', name='Jane Doe')

        # Create sample favourites
        favourite1 = Favourite(user=user1, book=book1, title='Book One')
        favourite2 = Favourite(user=user2, book=book2, title='Book Two')

        # Add all data to the session
        db.create_all()  # Create tables if they do not exist
        db.session.add_all([user1, user2, profile1, profile2, book1, book2, book_detail1, book_detail2, borrowed_book1, borrowed_book2, comment1, comment2, favourite1, favourite2])
        db.session.commit()

        print("Database seeded!")

if __name__ == '__main__':
    seed_db()
