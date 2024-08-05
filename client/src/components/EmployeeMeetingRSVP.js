import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

const EmployeeMeetingRSVP = ({ meeting }) => {
  const formik = useFormik({
    initialValues: {
      rsvp: meeting.rsvp !== undefined ? meeting.rsvp : "true",
    },
    validationSchema: yup.object({
      rsvp: yup.boolean().required('RSVP is required'),
    }),
    onSubmit: (values) => {

      fetch(`http://localhost:4000/employee_meetings/${meeting.employee_id}/${meeting.meeting_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rsvp: values.rsvp }),
      })
      .then(res => res.json())
      .then(updatedEmployee => console.log(`ID: ${updatedEmployee.employee_id} | Updated Employee: ${updatedEmployee.employee} | RSVP: ${updatedEmployee.rsvp}`))
      .catch((error) => {
        console.error('Error updating employee:', error);
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className='employee-meeting'>
      <label>
        Meeting: {meeting.meeting} | RSVP:
        <select
          name="rsvp"
          value={formik.values.rsvp.toString()}
          onChange={(e) => formik.setFieldValue('rsvp', e.target.value === 'true')}
          onBlur={formik.handleBlur}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        {formik.errors.rsvp && formik.touched.rsvp && (
          <p style={{ color: 'red' }}>{formik.errors.rsvp}</p>
        )}
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

export default EmployeeMeetingRSVP;

