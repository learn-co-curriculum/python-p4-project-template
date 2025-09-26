#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import datetime, date, timedelta

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Owner, Property, Booking, PropertyImage

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        
        # Create all tables first
        print("Creating database tables...")
        db.create_all()
        
        # Clear existing data
        print("Clearing existing data...")
        Booking.query.delete()
        PropertyImage.query.delete()
        Property.query.delete()
        Owner.query.delete()
        db.session.commit()

        # Create sample owners
        print("Creating owners...")
        owners = []
        for _ in range(5):
            owner = Owner(
                name=fake.name(),
                email=fake.unique.email(),
                phone=fake.phone_number()
            )
            owners.append(owner)
            db.session.add(owner)
        
        db.session.commit()
        print(f"Created {len(owners)} owners")

        # Create sample properties
        print("Creating properties...")
        properties = []
        property_names = [
            "Cozy Diani Beach House", "Mount Kenya Retreat", "Nairobi Downtown Loft", 
            "Naivasha Garden Villa", "Lake Victoria View Cabin", "Kisumu City Center Apartment",
            "Rustic Rift Valley Farmhouse", "Westlands Modern Penthouse", "Lamu Seaside Cottage"
        ]

        locations = [
            "Nairobi", "Mombasa", "Kisumu", "Nakuru", 
            "Eldoret", "Maasai Mara", "Mount Kenya", 
            "Diani Beach", "Lamu"
        ]
 
        amenities_options = [
            "WiFi, Kitchen, Pool, Air Conditioning",
            "WiFi, Fireplace, Mountain View, Hiking Trails",
            "WiFi, Gym, Rooftop Access, City View",
            "WiFi, Garden, BBQ Area, Pet Friendly",
            "WiFi, Boat Dock, Fishing, Lake Access",
            "WiFi, Balcony, Modern Kitchen, Parking",
            "WiFi, Farm Activities, Organic Garden, Peaceful",
            "WiFi, Luxury Amenities, Butler Service, Spa"
        ]

        for i in range(8):
            property = Property(
                name=property_names[i],
                description=fake.text(max_nb_chars=200),
                location=locations[i],
                price_per_night=randint(50, 500),
                max_guests=randint(2, 8),
                amenities=rc(amenities_options),
                owner=rc(owners)
            )
            properties.append(property)
            db.session.add(property)

        db.session.commit()
        print(f"Created {len(properties)} properties")

        # Create sample property images
        print("Creating property images...")
        sample_images = [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
            "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
            "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945",
            "https://images.unsplash.com/photo-1505142468610-359e7d316be0",
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
        ]
        
        property_images = []
        # Get fresh property instances from database
        fresh_properties = Property.query.all()
        
        for i, property in enumerate(fresh_properties):
            # Create 2-4 images per property
            num_images = randint(2, 4)
            for j in range(num_images):
                image = PropertyImage(
                    property_id=property.id,
                    image_url=rc(sample_images),
                    image_name=f"{property.name.replace(' ', '_').lower()}_image_{j+1}.jpg",
                    is_featured=(j == 0),  # First image is featured
                    upload_order=j
                )
                property_images.append(image)
                db.session.add(image)
        
        db.session.commit()
        print(f"Created {len(property_images)} property images")

        # Create sample bookings
        print("Creating bookings...")
        bookings = []
        booking_statuses = ['confirmed', 'confirmed', 'confirmed', 'cancelled']

        for _ in range(12):
            start_date = fake.date_between(start_date='-30d', end_date='+60d')
            end_date = start_date + timedelta(days=randint(1, 7))
        
            selected_property = rc(fresh_properties)
            days = (end_date - start_date).days
            total_price = selected_property.price_per_night * days
        
            booking = Booking(
                property_id=selected_property.id,
                guest_name=fake.name(),
                guest_email=fake.email(),
                check_in_date=start_date,
                check_out_date=end_date,
                total_price=total_price,
                booking_status=rc(booking_statuses)
           )
            bookings.append(booking)
            db.session.add(booking)

        db.session.commit()
        print(f"Created {len(bookings)} bookings")
        
        print("Seed completed successfully!")
        
        # Print summary
        print("\n--- DATABASE SUMMARY ---")
        print(f"Total Owners: {Owner.query.count()}")
        print(f"Total Properties: {Property.query.count()}")
        print(f"Total Property Images: {PropertyImage.query.count()}")
        print(f"Total Bookings: {Booking.query.count()}")
        
        # Show sample data
        print("\n--- SAMPLE OWNER ---")
        sample_owner = Owner.query.first()
        if sample_owner:
            print(f"Name: {sample_owner.name}")
            print(f"Email: {sample_owner.email}")
            print(f"Properties owned: {len(sample_owner.properties)}")
            
        print("\n--- SAMPLE PROPERTY ---")
        sample_property = Property.query.first()
        if sample_property:
            print(f"Name: {sample_property.name}")
            print(f"Location: {sample_property.location}")
            print(f"Price per night: ${sample_property.price_per_night}")
            print(f"Images: {len(sample_property.images)}")
            print(f"Bookings: {len(sample_property.bookings)}")
            if sample_property.images:
                featured_img = next((img for img in sample_property.images if img.is_featured), None)
                print(f"Featured image: {featured_img.image_url if featured_img else 'None'}")