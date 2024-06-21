from config import app, db
from models import User, Property, Visit, FavoriteProperty, Review
from datetime import datetime
from faker import Faker

faker = Faker()

with app.app_context():
    
    ##User.query.delete()
    ##Property.query.delete()
    ##Visit.query.delete()
    ##FavoriteProperty.query.delete()
    ##Review.query.delete()
    
    db.create_all()

    # Create users
    users = []
    for i in range(5):
        user = User(
            username=faker.user_name(),
            email=faker.email()
        )
        user.set_password('password123')
        db.session.add(user)
        users.append(user)
        print(f"User {i+1}: {user.username} created")

    db.session.commit()

    # Create properties
    properties = []
    images = [
        "https://www.anderslasaterarchitects.com/wp-content/uploads/2017/11/00-cornelio_facade_featureimage.png",
        "https://www.wpi.edu/sites/default/files/styles/1x_500x300/public/2023-06/Oak%20House_500x300_front.jpg?itok=orhb027n",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdv62Yhl4oRnUCwFAIb8na8om8T7wDk7mwCg&s",
        "https://d194ip2226q57d.cloudfront.net/images/Delaware_Cox-Mansion_By-Brandon-Al.a6ec9647.fill-500x300.jpg",
        "https://nightsbeforechristmas.com/wp-content/uploads/2022/09/The-Ohlendorf-Home_Out-scaled-e1716487716872-500x300.jpg",
        "https://nightsbeforechristmas.com/wp-content/uploads/2022/09/The-Bellamy-Home_Panned-out-500x300.jpg",
        "https://i0.wp.com/apexhomesllc.com/wp-content/uploads/2024/02/HOME_Our-Homes_Apex-Homes_Brier-B-House.png?resize=500%2C300&ssl=1",
        "https://danielwaynehomes.com/wp-content/uploads/2017/09/500-wide-foursome-home-03.jpg",
        "https://i.guim.co.uk/img/media/bf97c6e7e6539a3865b9ffbe0520bae5cec504f6/0_400_6000_3600/500.jpg?quality=85&auto=format&fit=max&s=47fa38b3812601b150ae9e18c11a8ca7",
        "https://www.fisherrealtync.com/wp-content/uploads/2023/12/185-Lake-House-Trail-4088349-01-500x300.jpg"
    ]
    for user in users:
        for i in range(2):
            property = Property(
                title=faker.sentence(nb_words=3),
                image=f"https://loremflickr.com/640/480/house?random={faker.uuid4()}",
                description=faker.text(),
                image=images[len(properties)],
                price=faker.random_number(digits=6),
                address=faker.address(),
                owner_id=user.id
            )
            db.session.add(property)
            properties.append(property)
            print(f"Property {property.title} for user {user.username} created")

    db.session.commit()

    # Create visits
    for i in range(10):
        visit = Visit(
            user_id=faker.random_element(users).id,
            property_id=faker.random_element(properties).id,
            scheduled_date=faker.future_datetime(end_date='+30d'),
            status='pending'
        )
        db.session.add(visit)
        print(f"Visit {i+1} scheduled for property {visit.property_id}")

    db.session.commit()

    # Create favorite properties
    for user in users:
        for i in range(3):
            favorite_property = FavoriteProperty(
                user_id=user.id,
                property_id=faker.random_element(properties).id,
                added_at=datetime.now()
            )
            db.session.add(favorite_property)
            print(f"Favorite property {favorite_property.property_id} added for user {user.username}")

    db.session.commit()

    # Create reviews
    for property in properties:
        for i in range(3):
            review = Review(
                content=faker.text(),
                rating=faker.random_int(min=1, max=5),
                user_id=faker.random_element(users).id,
                property_id=property.id,
                created_at=datetime.now()
            )
            db.session.add(review)
            print(f"Review {i+1} for property {property.title} by user {review.user_id} created")

    db.session.commit()

    print("Database seeded successfully.")
