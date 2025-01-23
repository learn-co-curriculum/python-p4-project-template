import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import * as yup from "yup";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const EditRoutineForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [routine, setRoutine] = useState([{}]);
    const [errors, setErrors] = useState(false);
    
    useEffect(() => {
        fetch("/api/routines/"+id)
        .then((res) => {
            if(!res.ok){
                setErrors("Error: Failed to load the requested resource. ID: "+id)
                console.log("Error: "+res.status)
            }
            return res.json()
        })
        .then((data) => {
            setRoutine(data);
        })
        .catch(error => console.log(error));
    }, []);

    const formSchema = yup.object().shape({
        current_weight: yup
          .number()
          .positive()
          .integer()
          .required("Must enter value")
          .typeError("Please enter an Integer")
          .max(100),
        initial_weight: yup
          .number()
          .positive()
          .integer()
          .required("Must enter value")
          .typeError("Please enter an Integer")
          .max(100),
        current_reps: yup
          .number()
          .positive()
          .integer()
          .required("Must enter value")
          .typeError("Please enter an Integer")
          .max(100),
        initial_reps: yup
          .number()
          .positive()
          .integer()
          .required("Must enter value")
          .typeError("Please enter an Integer")
          .max(100),
        current_sets: yup
          .number()
          .positive()
          .integer()
          .required("Must enter value")
          .typeError("Please enter an Integer")
          .max(100),
        initial_sets: yup
          .number()
          .positive()
          .integer()
          .required("Must enter value")
          .typeError("Please enter an Integer")
          .max(100),
        day_of_the_week: yup
          .number()
          .positive()
          .integer()
          .required("Must select a day")
          .typeError("Please select a day")
          .max(7),
        priority: yup
          .number()
          .positive()
          .integer()
          .required("Must enter value")
          .typeError("Please enter an Integer")
          .max(10),
    });
   
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
          current_weight: routine.current_weight,
          initial_weight: routine.initial_weight,
          current_reps: routine.current_reps,
          initial_reps: routine.initial_reps,
          current_sets: routine.current_sets,
          initial_sets: routine.initial_sets,
          day_of_the_week: routine.day_of_the_week,
          priority: routine.priority
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
          fetch("/api/routines/"+id, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values, null, 2),
          }).then((res) => {
            if (res.status === 202) {
                navigate('/');
            }
          });
        },
    });
    
    if(!routine) return <p>Loading Routine Data...</p>
    if(errors) return <p>{errors}</p>

    return (
        <Container>
            <Form noValidate onSubmit={formik.handleSubmit} >
                
                <Row className="pb-2 justify-content-between">
                    <Col xs={6}>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlNumberDayWeek">
                            <Form.Label>Day</Form.Label>
                            <Form.Select 
                                aria-label="Default select example"
                                value={formik.values.day_of_the_week}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.day_of_the_week}
                                name={"day_of_the_week"}
                            >
                                <option>Select day of the week</option>
                                <option value="1">Monday</option>
                                <option value="2">Tuesday</option>
                                <option value="3">Wednesday</option>
                                <option value="4">Thursday</option>
                                <option value="5">Friday</option>
                                <option value="6">Saturday</option>
                                <option value="7">Sunday</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.day_of_the_week}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group className="mb-3" controlId="formRange">
                            <Form.Label>Priority</Form.Label>
                            <Form.Range 
                                value={formik.values.priority}
                                onChange={formik.handleChange}
                                //isInvalid={!!formik.errors.priority}
                                name={"priority"}
                                min={1}
                                max={10}
                            />
                            <Form.Text className="text-muted">
                                Set priority between 1-10
                            </Form.Text>
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.priority}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                
                
                
                <Row className="pb-2 justify-content-between">
                    <Col xs={6}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlNumberWeightInitial">
                            <Form.Label>Initial Weight</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Initial" 
                                value={formik.values.initial_weight}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.initial_weight}
                                name={"initial_weight"}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.initial_weight}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlNumberWeightCurrent">
                            <Form.Label>Current Weight</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Current" 
                                value={formik.values.current_weight}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.current_weight}
                                name={"current_weight"}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.current_weight}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                
                <Row className="pb-2 justify-content-between">
                    <Col xs={6}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlNumberRepsInitial">
                            <Form.Label>Initial Reps</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Initial" 
                                value={formik.values.initial_reps}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.initial_reps}
                                name={"initial_reps"}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.initial_reps}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlNumberRepsCurrent">
                            <Form.Label>Current Reps</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Current" 
                                value={formik.values.current_reps}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.current_reps}
                                name={"current_reps"}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.current_reps}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="pb-2 justify-content-between">
                    <Col xs={6}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlNumberSetsInitial">
                            <Form.Label>Initial Sets</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Initial" 
                                value={formik.values.initial_sets}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.initial_sets}
                                name={"initial_sets"}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.initial_sets}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlNumberSetsCurrent">
                            <Form.Label>Current Sets</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Current" 
                                value={formik.values.current_sets}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.current_sets}
                                name={"current_sets"}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.current_sets}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="primary" type="submit">
                    Save
                </Button>
            </Form>
        </Container>
    );
}

export default EditRoutineForm;
