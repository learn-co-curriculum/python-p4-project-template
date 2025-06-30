# Backend Server Setup

The frontend is configured to connect to a Flask backend server running on `http://localhost:5000`.

## To start the backend server:

1. **Navigate to the server directory:**

   ```bash
   cd staybuddy/server
   ```

2. **Install Python dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Flask server:**
   ```bash
   python app.py
   ```

The server should start and be available at `http://localhost:5000`. Once running, the frontend forms and API calls will work properly.

## API Endpoints Available:

- `POST /auth/login` - User login
- `POST /auth/signup` - User signup
- `GET /auth/check_session` - Check user session
- `GET /stays` - Get all stays
- `GET /stays/:id` - Get stay details
- `POST /bookings` - Create booking
- `GET /bookings` - Get user bookings

## Database:

The app uses SQLite database (`app.db`) which will be created automatically when you first run the server.
