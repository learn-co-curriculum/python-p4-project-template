import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EmployeeMeetingRSVP from './EmployeeMeetingRSVP';

const EmployeeMoreInfo = () => {
  const params = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/employees/${params.id}`)
      .then(res => res.json())
      .then(activeEmployee => {
        if (!activeEmployee.manager) {
          activeEmployee.manager = { name: 'N/A', department: 'N/A' };
        }
        console.log('Fetched employee:', activeEmployee);
        setEmployee(activeEmployee);
      });
  }, [params.id]);

  

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className='employee-meeting' key={employee.id}>
        <h2>{employee.name}</h2>
        <h4>Hire Date: {employee.hire_date}</h4>
        <h4>Manager: {employee.manager.name}</h4>
        <h4>Department: {employee.manager.department}</h4>
        <h4>Meetings:</h4>
      </div>
        {employee.employee_meetings.map((emp_meeting) => (
          <EmployeeMeetingRSVP
            key={emp_meeting.meeting_id}
            meeting={emp_meeting}
          />
        ))}
    </div>
  );
};

export default EmployeeMoreInfo;



