const API_BASE_URL = 'http://127.0.0.1:5001';

export async function login(username, password) {
    try {
        const response = await fetch("http://127.0.0.1:5001/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        return response.json(); // Return the parsed JSON
    } catch (error) {
        console.error("Error in login API:", error);
        throw error;
    }
}

export async function register(username, password) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    return response.json();
}