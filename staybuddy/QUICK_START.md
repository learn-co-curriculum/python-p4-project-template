# Quick Start Guide - StayBuddy

## ✅ FIXED - App is now working!

Both frontend and backend servers are now running automatically using a mock backend for development.

## Current Status

✅ **Frontend**: React app running on http://localhost:3000
✅ **Backend**: Mock API server running on http://localhost:5000
✅ **All API endpoints working**: Login, signup, stays, bookings

## How to Use

The app now includes a **mock backend** that provides:

- User authentication (login/signup)
- Demo stays and bookings data
- All API endpoints needed for development

**Test credentials:**

- Email: `demo@example.com`
- Password: `password123`

Or create a new account using the signup form.

## Development Commands

```bash
cd staybuddy/client
npm run start:dev    # Starts both frontend and mock backend
npm start           # Starts only frontend (if backend running separately)
```

## Switching to Real Backend

To use the real Flask backend instead of the mock:

1. Install Python dependencies:

   ```bash
   cd staybuddy/server
   pip install -r requirements.txt
   ```

2. Update package.json:

   ```bash
   "start:backend": "cd ../server && python3 app.py"
   ```

3. Restart: `npm run start:dev`
