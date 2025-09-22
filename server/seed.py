#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Station, Pump, Staff, Sale, sale_staff

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("🌱 Starting seed...")

        # Clear existing data
        Sale.query.delete()
        Staff.query.delete()
        Pump.query.delete()
        Station.query.delete()
        db.session.commit()

        # Create sample stations
        stations = []
        station_names = [
            "Shell Downtown",
            "Total Energy Plaza",
            "Kenol Kobil Junction",
            "Rubis Highway",
            "Vivo Energy Center"
        ]

        for name in station_names:
            station = Station(
                name=name,
                location=fake.city()
            )
            stations.append(station)
            db.session.add(station)

        db.session.commit()

        # Create pumps for each station
        pumps = []
        for station in stations:
            for i in range(randint(2, 4)):  # 2-4 pumps per station
                pump = Pump(
                    pump_number=i + 1,
                    station_id=station.id
                )
                pumps.append(pump)
                db.session.add(pump)

        db.session.commit()

        # Create staff for each station
        staff_members = []
        roles = ["Attendant", "Manager", "Cashier", "Supervisor"]
        for station in stations:
            for _ in range(randint(3, 6)):  # 3-6 staff per station
                staff = Staff(
                    name=fake.name(),
                    role=rc(roles),
                    station_id=station.id
                )
                staff_members.append(staff)
                db.session.add(staff)

        db.session.commit()

        # Create sample sales
        fuel_types = ["Diesel", "Unleaded", "Premium", "Super"]
        sales = []
        for _ in range(50):  # Create 50 sample sales
            pump = rc(pumps)
            staff = rc(staff_members)

            # Generate realistic sale data
            fuel_type = rc(fuel_types)
            litres = round(rc([10, 15, 20, 25, 30, 40, 50]), 1)
            price_per_litre = {
                "Diesel": 120.50,
                "Unleaded": 145.30,
                "Premium": 155.80,
                "Super": 165.20
            }.get(fuel_type, 145.30)

            total_amount = round(litres * price_per_litre, 2)

            sale = Sale(
                fuel_type=fuel_type,
                litres=litres,
                price_per_litre=price_per_litre,
                total_amount=total_amount,
                pump_id=pump.id
            )

            # Add staff to sale relationship
            sale.staff.append(staff)
            sales.append(sale)
            db.session.add(sale)

        db.session.commit()

        print("✅ Seed completed!")
        print(f"📊 Created {len(stations)} stations")
        print(f"⛽ Created {len(pumps)} pumps")
        print(f"👥 Created {len(staff_members)} staff members")
        print(f"💰 Created {len(sales)} sales")
        print("🎯 Dashboard should now have data to display!")
