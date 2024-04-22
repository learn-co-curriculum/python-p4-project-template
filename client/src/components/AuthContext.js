import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (formData) => {
    console.log('Logging in user:', formData);
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
  
      localStorage.setItem('token', data.access_token);
      console.log('Logged in successfully', data);
      return true; // Indicate success
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Rethrow to be handled in the component
    }
  };
  const register = async (formData) => {
    console.log(formData)
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Registration failed');
      }
  
      console.log('User registered successfully');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const fetchAllTimeLogs = async () => {
    try {
      const response = await fetch('/timelogs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ensure the token is sent with the request
        }
      });
      if (!response.ok) throw new Error('Failed to fetch timelogs');
      const data = await response.json();
      return (data.timeLogs);
      
    } catch (error) {
      console.error('Error fetching all time logs:', error);
    }
};

  

  const postTimeLog = async (timeLogData) => {
    console.log('timelogsdataobject',timeLogData[0])
    const time_log = {
      date:timeLogData[0].date,
      clock_in:timeLogData[0].clockIn,
      clock_out:timeLogData[0].clockOut,
      hours_worked:timeLogData[0].hoursWorked,
      total_hours:timeLogData[0].totalHours,
      status:timeLogData[0].status

    }
    try {
      const response = await fetch('/timelogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`  
        },
        body: JSON.stringify(time_log),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to post time log');
      }
  
      console.log('Time log posted successfully');
      return response.json(); // Assuming the backend sends back some data
    } catch (error) {
      console.error('Error posting time log:', error.message);
      throw error; // Rethrow for handling by calling components
    }
  };

  const updateTimeLog = async (timeLogId, updateData) => {
    try {
      const response = await fetch(`/timelogs/${timeLogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updateData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update time log');
      }
  
      console.log('Time log updated successfully');
      return response.json();
    } catch (error) {
      console.error('Error updating time log:', error.message);
      throw error;
    }
  };


  const saveDataToBackend = async (allTimeLogs) => {
    try {
      const response = await fetch('/update-timelogs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(allTimeLogs)
      });
      if (!response.ok) throw new Error('Failed to update timelogs');
      console.log('Time logs updated successfully');
    } catch (error) {
      console.error('Error updating time logs:', error);
    }
  };
  const deleteTimeLog = async (timeLogId) => {
    try {
      const response = await fetch(`/timelogs/${timeLogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      // Check if the response has content
      if (!response.ok) {
        const text = await response.text(); // Read response as text to check if it's empty or not
        throw new Error(text || 'Failed to delete time log');
      }
  
      // Handle empty response gracefully
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json") || response.status === 204) {
        return {}; // Assume no content to parse
      }
  
      return response.json(); // Parse JSON only if the response is not empty
    } catch (error) {
      console.error('Error deleting time log:', error.message);
      throw error; // Re-throw the error for further handling
    }
  };

  

  const logout = async () => {
    console.log('Logging out user');
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    console.log('Token:', token); // Log token for debugging
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include JWT token
            },
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        // Clear user state after successful logout
        setUser(null);
        // Remove token from local storage
        localStorage.removeItem('token');
        console.log('Logged out successfully');
    } catch (error) {
        console.error('Logout error:', error);
    }
};
  return (
    <AuthContext.Provider value={{ user, login, register, logout, postTimeLog, fetchAllTimeLogs, updateTimeLog, deleteTimeLog, saveDataToBackend }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
