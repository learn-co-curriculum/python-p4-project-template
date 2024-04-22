import React, { useState } from 'react';

function TimeLogForm() {
  const [formData, setFormData] = useState({
    date: '',
    clockIn: '',
    clockOut: '',
    hoursWorked: '',
    totalHours: '',
    status: 'Pending'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Send form data to the backend
      // const response = await fetch('/timelogs', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      // const data = await response.json();
      // console.log('New Time Log:', data);

      // Mock data for demonstration
      console.log('New Time Log:', formData);
      // Clear form data
      setFormData({
        date: '',
        clockIn: '',
        clockOut: '',
        hoursWorked: '',
        totalHours: '',
        status: 'Pending'
      });
    } catch (error) {
      console.error('Error creating time log:', error);
    }
  };

  return (
    <div>
      <h2>Time Log Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <label>Clock In:</label>
        <input type="time" name="clockIn" value={formData.clockIn} onChange={handleChange} required />
        <label>Clock Out:</label>
        <input type="time" name="clockOut" value={formData.clockOut} onChange={handleChange} required />
        <label>Hours Worked:</label>
        <input type="text" name="hoursWorked" value={formData.hoursWorked} onChange={handleChange} required />
        <label>Total Hours:</label>
        <input type="text" name="totalHours" value={formData.totalHours} onChange={handleChange} required />
        <label>Status:</label>
        <input type="text" name="status" value={formData.status} onChange={handleChange} required />
        <button type="submit">Add Time Log</button>
      </form>
    </div>
  );
}

export default TimeLogForm;
