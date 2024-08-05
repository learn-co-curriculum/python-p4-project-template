import React, { useEffect, useState } from "react";
import Employees from "./EmployeeCard";
import { useFormik } from "formik";
import * as yup from "yup";

function EmployeeCardList() {
    const [employeeList, setEmployeeList] = useState([]);

    useEffect(() => {
        fetch("/employees")
            .then((r) => r.json())
            .then((employees) => setEmployeeList(employees))
    }, []);

    const formSchema = yup.object().shape({
        name: yup.string().required("Must enter a name").max(15),
        hire_date: yup.date(),
        manager_id: yup.number().positive().integer().max(2)
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            hire_date: "",
            manager_id: "",
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch("/employees", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values, null, 2),
            })
            .then((res) => res.json())
            .then((newEmployee) => {
                setEmployeeList([...employeeList, newEmployee]);
                if (newEmployee.id) {
                    console.log(newEmployee.id);
                }
            });
        },
    });

    const handleDeleteEmployee = (id) => {
        console.log(`Attempting to delete employee with id: ${id}`);
        fetch(`/employees/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            setEmployeeList(employeeList.filter(employee => employee.id !== id));
        })
    };

    const handleUpdateEmployee = (updatedEmployee) => {
        setEmployeeList(employeeList.map(employee => 
            employee.id === updatedEmployee.id ? updatedEmployee : employee
        ));
    };

    return (
        <div>
            <h1>Employees</h1>
            <form onSubmit={formik.handleSubmit}>
                <input
                    id="name"
                    type="text"
                    placeholder="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}>{formik.errors.name}</p>
                <input
                    id='hire_date'
                    type="date"
                    placeholder="Hire Date"
                    value={formik.values.hire_date}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}>{formik.errors.hire_date}</p>
                <input
                    id='manager_id'
                    type="number"
                    placeholder="Manager ID"
                    value={formik.values.manager_id}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}>{formik.errors.manager_id}</p>
                <button type="submit">Add Employee</button>
            </form>

            {employeeList.map((employee) => (
                <Employees
                    employee={employee}
                    key={employee.id}
                    onDelete={handleDeleteEmployee}
                    onUpdate={handleUpdateEmployee}
                />
            ))}
        </div>
    );
}

export default EmployeeCardList;
