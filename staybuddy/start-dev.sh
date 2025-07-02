#!/bin/bash

# StayBuddy Development Server Startup Script

echo "Starting StayBuddy Development Environment..."

# Function to check if a port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "Port $1 is already in use"
        return 1
    else
        echo "Port $1 is available"
        return 0
    fi
}

# Check if Python is available
if ! command -v python &> /dev/null; then
    echo "Python is not installed. Please install Python to run the backend server."
    exit 1
fi

# Check if Node is available
if ! command -v npm &> /dev/null; then
    echo "Node.js/npm is not installed. Please install Node.js to run the frontend."
    exit 1
fi

echo "Checking ports..."
check_port 3000
check_port 5000

echo ""
echo "Starting backend server on port 5000..."
cd server
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies if needed
if [ ! -f ".deps_installed" ]; then
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
    touch .deps_installed
fi

# Start backend server in background
echo "Starting Flask server..."
python app.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "Starting frontend server on port 3000..."
cd ../client

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

# Start frontend server
echo "Starting React development server..."
npm start &
FRONTEND_PID=$!

echo ""
echo "Development servers started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap 'echo "Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID; exit' INT
wait
