# Deluxe Motors Backend

#### Date: 2024/07/17

#### By Ray, Charity and Alex
## Description

Deluxe Motors Backend is a web application that provides an API for managing owners, vehicles, rentals, and features for a vehicle rental service. The backend is built with Flask and SQLAlchemy, with user authentication handled by Flask-Login.

## Project Setup

1. Clone the repository:

```
https://github.com/Rayngumi/Deluxe-motors.git
```

2. Install the dependencies:

```
pip install -r requirements.txt
```

3. Set up the database:

```
flask db upgrade
```

4. Start the backend server:

```
flask run
```

## Folder Structure

- **server/**: Contains the source code for the backend application.
  - **auth.py**: Handles user authentication and registration.
  - **config.py**: Configuration settings for Flask and SQLAlchemy.
  - **models.py**: Database models for Owner, Vehicle, Rental, Feature, User, and VehicleFeatures.
  - **app.py**: Main application file with route definitions and business logic.
  - **requirements.txt**: List of dependencies required for the project.

## API Endpoints

### Authentication
- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Log in an existing user.
- **GET /auth/logout**: Log out the current user.

### Owners
- **GET /owners**: Retrieve a list of all owners.
- **POST /owners**: Create a new owner.
- **GET /owners/<int:owner_id>**: Retrieve a specific owner by ID.
- **PATCH /owners/<int:owner_id>**: Update a specific owner by ID.
- **DELETE /owners/<int:owner_id>**: Delete a specific owner by ID.

### Vehicles
- **GET /vehicles**: Retrieve a list of all vehicles.
- **POST /vehicles**: Create a new vehicle.
- **GET /vehicles/<int:vehicle_id>**: Retrieve a specific vehicle by ID.
- **PATCH /vehicles/<int:vehicle_id>**: Update a specific vehicle by ID.
- **DELETE /vehicles/<int:vehicle_id>**: Delete a specific vehicle by ID.

### Rentals
- **GET /rentals**: Retrieve a list of all rentals.
- **POST /rentals**: Create a new rental.
- **GET /rentals/<int:rental_id>**: Retrieve a specific rental by ID.
- **PATCH /rentals/<int:rental_id>**: Update a specific rental by ID.
- **DELETE /rentals/<int:rental_id>**: Delete a specific rental by ID.

### Features
- **GET /features**: Retrieve a list of all features.
- **POST /features**: Create a new feature.
- **GET /features/<int:feature_id>**: Retrieve a specific feature by ID.
- **PATCH /features/<int:feature_id>**: Update a specific feature by ID.
- **DELETE /features/<int:feature_id>**: Delete a specific feature by ID.

### Likes
- **POST /api/likes**: Update likes for a specific vehicle.

## Support and Contact

For support or inquiries, please contact [Ray Ngumi](https://github.com/Rayngumi).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.