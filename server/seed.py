from datetime import datetime, timedelta
from faker import Faker
from config import app, db
from models import User, Product, Transaction

def seed_data(num_users=10, num_products=20, num_transactions=50):
    fake = Faker()  # Create the Faker instance here
    print("Starting seed...")
    
    # Generate users
    for _ in range(num_users):
        user = User(
            email=fake.email(),
            companyName=fake.company(),
            country=fake.country(),
            city=fake.city()
        )
        user.set_password('password')  # Set a default password for now
        db.session.add(user)

    # Generate products
    for _ in range(num_products):
        product = Product(
            name=fake.word().capitalize(),
            sku=fake.uuid4(),  # Directly use fake.uuid4() for SKU
            description=fake.sentence(),
            quantity=fake.random_int(min=1, max=100),
            price=fake.random_int(min=10, max=1000),
            supplier=fake.company()
        )
        db.session.add(product)

    # Generate transactions
    users = User.query.all()
    products = Product.query.all()

    for _ in range(num_transactions):
        user = fake.random_element(users)
        product = fake.random_element(products)

        transaction = Transaction(
            user_id=user.id,
            product_id=product.id,
            date=fake.date_time_between(start_date='-1y', end_date='now'),
            quantity=fake.random_int(min=1, max=10),
            total_price=product.price * fake.random_int(min=1, max=5)
        )
        db.session.add(transaction)
        db.session.commit()

  

if __name__ == '__main__':
    with app.app_context():
        seed_data()