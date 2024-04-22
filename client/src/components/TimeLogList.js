import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';



function TimeLogList() {
  const { postTimeLog, deleteTimeLog, fetchAllTimeLogs, updateTimeLog } = useContext(AuthContext);
  const getCurrentPayrollStart = () => {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDayOfWeek);
    return startOfWeek;
  };

  const [selectedDate, setSelectedDate] = useState(getCurrentPayrollStart());
  const [data, setData] = useState([]);
  const [allTimeLogs, setAllTimeLogs] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(false); // Initialize isTableVisible to false
  
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editLogId, seteditLogId] = useState(null)
  const [newEntry, setNewEntry] = useState({
    date: '',
    clock_in: '00:00',
    clock_out: '00:00',
    hours_worked: '',
    total_hours: '',
    status: 'Pending'
  });
  const [noTimeLogMessage, setNoTimeLogMessage] = useState('');
  const [hoursForSelectedDate, setHoursForSelectedDate] = useState(0);
  const [submitClicked, setSubmitClicked] = useState(false);

  useEffect(() => {
    if (submitClicked) {
      fetchData();
    }
    fetchAllTimeLogs().then(data => {
      if (data) {
        const timeLogs = data.map(log => ({
          ...log,
          clock_in: log.clock_in || '00:00', // Ensuring there's always a default value
          clock_out: log.clock_out || '00:00'
        }));
        setAllTimeLogs(timeLogs);
      }
    });
  }, [selectedDate, submitClicked,isTableVisible]);

 
  const fetchData = () => {
    const timeLogsForSelectedDate = data.filter(entry => entry.date === selectedDate.toISOString().split('T')[0]);
    setNoTimeLogMessage(timeLogsForSelectedDate.length === 0 ? 'No time log present.' : '');
    let totalHours = 0;
    timeLogsForSelectedDate.forEach(log => {
      totalHours += parseFloat(log.hoursWorked);
    });
    setHoursForSelectedDate(totalHours);
  };


  const saveDataToBackend = (updatedData) => {
    // Logic to save data to backend
  };

  const updateDatabase = (logid) => {
    const updatedTimeLog = allTimeLogs.find(log => logid === log.id)
    updateTimeLog(logid, updatedTimeLog)
  };

  const handlePatch = (logid) => {
    seteditLogId(logid);
  }
  console.log(allTimeLogs)
  const handleEditPatch = async (newValue, rowIndex, field) => {
    console.log(`Handling edit patch for field ${field} with new value ${newValue}`);

    // Ensure the backend field names are used
    const backendField = field === 'clockIn' ? 'clock_in' : field === 'clockOut' ? 'clock_out' : field;

    setAllTimeLogs(prevData => {
        const updatedData = [...prevData];
        updatedData[rowIndex][backendField] = newValue; // Apply changes with the correct backend field name

        console.log(`Updated field ${field} for row ${rowIndex}:`, updatedData[rowIndex]);

        // Recalculate hours worked if clock_in or clock_out changes
        if (field === 'clockIn' || field === 'clockOut') {
            updatedData[rowIndex].hours_worked = calculateHoursWorked(
                updatedData[rowIndex].clock_in,
                updatedData[rowIndex].clock_out
            );
            console.log(`New hours worked for row ${rowIndex}:`, updatedData[rowIndex].hours_worked);

            // Recalculate total hours for the table
            const totalHours = updatedData.reduce((total, log) => total + parseFloat(log.hours_worked || 0), 0);
            updatedData.forEach(log => log.total_hours = totalHours.toFixed(2));
            console.log(`Total hours for all logs after update:`, totalHours);
        }

        return updatedData;
    });
  };

    // Assume updatedData is accessible here correctly
    

const calculateHoursWorked = (clock_in, clock_out) => {
    const [startHour, startMinute] = clock_in.split(':').map(Number);
    const [endHour, endMinute] = clock_out.split(':').map(Number);
    let hours = endHour - startHour;
    let minutes = endMinute - startMinute;

    if (minutes < 0) {
        hours -= 1;
        minutes += 60;
    }

    if (hours < 0) {
        hours += 24; // Handle overnight shifts
    }

    const totalHours = (hours + minutes / 60).toFixed(2);
    console.log(`Calculated hours worked from ${clock_in} to ${clock_out}: ${totalHours}`);
    return totalHours;
};

 

  const handleCellEdit = (newValue, rowIndex, field, isAllTimeLog) => {
    setData(prevData => {
      const updatedData = [...prevData];
      updatedData[rowIndex][field] = newValue;
      if (!isAllTimeLog) {
        if (field === 'clockIn' || field === 'clockOut') {
          const clockIn = updatedData[rowIndex].clockIn;
          const clockOut = updatedData[rowIndex].clockOut;
          let totalHours = 0;
          if (clockIn && clockOut) {
            const [hoursIn, minutesIn] = clockIn.split(':').map(Number);
            const [hoursOut, minutesOut] = clockOut.split(':').map(Number);
            totalHours = (hoursOut - hoursIn) + (minutesOut - minutesIn) / 60;
            if (totalHours < 0) totalHours += 24;
          }
          updatedData[rowIndex].hoursWorked = totalHours.toFixed(2);
          let totalWorkedHours = 0;
          updatedData.forEach(entry => {
            if (!isNaN(entry.hoursWorked)) {
              totalWorkedHours += parseFloat(entry.hoursWorked);
            }
          });
          updatedData[rowIndex].totalHours = totalWorkedHours.toFixed(2);
        }
        saveDataToBackend(updatedData);
      }
      return updatedData;
    });
  };

  

  const handleSaveSubmit = () => {
    setEditingRowIndex(null);
    postTimeLog(data).then(log => console.log(log));
  };

  const handleEditRow = (rowIndex) => {
    setEditingRowIndex(rowIndex);
  };
  
 
  const handleDeleteRow = (timeLogId) => {
    deleteTimeLog(timeLogId)
      .then(() => {
        // Successfully deleted on the backend, now update UI
        setAllTimeLogs(prevData => prevData.filter(log => log.id !== timeLogId));
        console.log('Deletion successful');
      })
      .catch(error => {
        console.error('Error deleting time log:', error);
      });
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleCreateLog = () => {
    setIsTableVisible(true); // Set isTableVisible to true when Create Time Log is clicked
  };

  const handleViewTimeLogs = () => {
    setIsTableVisible(false); // Set isTableVisible to false when View Time Logs is clicked
  };



  const handleAddNewEntry = () => {
    const updatedData = [...data, newEntry];
    setData(updatedData);
    saveDataToBackend(updatedData);
    setNewEntry({
      date: '',
      clock_in: '00:00',
      clock_out: '00:00',
      hours_worked: '',
      total_hours: '',
      status: 'Pending'
    });
  };
  console.log(allTimeLogs)
  const handleSubmit = () => {
    setSubmitClicked(true);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
  };

  return (
    <div className="time-log-list-container">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <button onClick={handleCreateLog}>Create Time Log</button>
        <button onClick={handleViewTimeLogs}>View Time Logs</button>
      </div>
      {isTableVisible ? (
        <>
          <h2 className="create-entry-header">Create Entry</h2>
          <div className="calendar-dropdown">
            <label htmlFor="selectedDate">Select Date:</label>
            <input
              type="date"
              id="selectedDate"
              name="selectedDate"
              value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
              onChange={e => handleDateChange(new Date(e.target.value))}
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
          <div className="admin-dashboard-content">
            {noTimeLogMessage && <p>{noTimeLogMessage}</p>}
            {data.length > 0 && (
              <table className="time-log-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Hours Worked</th>
                    <th>Total Hours</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((entry, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>
                        {editingRowIndex === rowIndex ? (
                          <input
                            type="date"
                            value={entry.date}
                            onChange={e => handleCellEdit(e.target.value, rowIndex, 'date', false)}
                          />
                        ) : (
                          entry.date
                        )}
                      </td>
                      <td>
                        {editingRowIndex === rowIndex ? (
                          <input
                            type="time"
                            value={entry.clockIn}
                            onChange={e => handleCellEdit(e.target.value, rowIndex, 'clockIn', false)}
                          />
                        ) : (
                          formatTime(entry.clockIn)
                        )}
                      </td>
                      <td>
                        {editingRowIndex === rowIndex ? (
                          <input
                            type="time"
                            value={entry.clockOut}
                            onChange={e => handleCellEdit(e.target.value, rowIndex, 'clockOut', false)}
                          />
                        ) : (
                          formatTime(entry.clockOut)
                        )}
                      </td>
                      <td>{entry.hoursWorked}</td>
                      <td>{entry.totalHours}</td>
                      <td>{entry.status}</td>
                      <td>
                        {editingRowIndex === rowIndex ? (
                          <button onClick={() => handleSaveSubmit()}>Save</button>
                        ) : (
                          <>
                            <button onClick={() => handleEditRow(rowIndex)}>Edit</button>
                            <button onClick={() => handleDeleteRow(rowIndex)}>Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="button-container">
              <button className="plus-button" onClick={handleAddNewEntry}>
                <span role="img" aria-label="plus-sign">+</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="hours-table">
         <h3 className="view-timelogs-header">View Timelogs</h3>
          <table className="table-style">
            <thead>
              <tr>
                <th>Date</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Hours Worked</th>
                <th>Total Hours</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allTimeLogs.map((log, index) => (
                <tr key={index}>
                  <td>
                    {editLogId === log.id ? (
                      <input
                        type="date"
                        value={log.date}
                        onChange={e => handleEditPatch(e.target.value, index, 'date', false)}
                      />
                    ) : (
                      log.date
                    )}
                  </td>
                  <td>
                    {editLogId === log.id ? (
                      <input
                        type="time"
                        value={log.clockIn}
                        onChange={e => handleEditPatch(e.target.value, index, 'clockIn', false)}
                      />
                    ) : (
                      formatTime(log.clock_in)
                    )}
                  </td>
                  <td>
                    {editLogId === log.id ? (
                      <input
                        type="time"
                        value={log.clockOut}
                        onChange={e => handleEditPatch(e.target.value, index, 'clockOut', false)}
                      />
                    ) : (
                      formatTime(log.clock_out)
                    )}
                  </td>
                  <td>{log.hours_worked}</td>
                  <td>{log.total_hours}</td>
                  <td>{log.status}</td>
                  <td>
                    {editLogId === log.id ? (
                      <button onClick={() => updateDatabase(log.id)}>Update</button>
                    ) : (
                      <>
                        <button onClick={() => handlePatch(log.id)}>Edit</button>
                        <button onClick={() => handleDeleteRow(log.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default TimeLogList;
