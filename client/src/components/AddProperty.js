import React, { useState } from 'react';
import '../styles/AddProperty.css';
import {useFormik} from 'formik';
import { addPropertySchema } from '../schemas';

const onSubmit = async (values, actions) => {
    try {
        const response = await fetch('http://localhost:5555/properties', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Success:', data);
        console.log(data)

        // Reset the form after a successful submission
        actions.resetForm();
    } catch (error) {
        console.error('Error:', error);
    }
};

const AddProperty = () => {

 const {values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit} = useFormik({
    initialValues: {
        title:"",
        image:"",
        price:"",
        address:"",
        description:"",
    },
    validationSchema: addPropertySchema,
    onSubmit,

 })
 console.log(errors)

  return (
    <form onSubmit={handleSubmit} className='property-form-container'>
        <h1 className='property-form-title'>Add Property</h1>
        <label className='property-form-label'>
            Title:
            <input 
            className={`property-form-input ${errors.title && touched.title ? "input-error" : ""}`}
            type="text" value={values.title} 
            onChange={handleChange}
            onBlur={handleBlur} 
            name="title" />
            {errors.title && touched.title && (<p className="error">{errors.title}</p>)}
        </label>
        <br />
        <label className='property-form-label'>
            Image:
            <input 
            className={`${errors.image && touched.image ? "input-error" : ""} property-form-input`}
            type="text" value={values.image} 
            onChange={handleChange}
            onBlur={handleBlur}  
            name="image" />
            {errors.image && touched.image && (<p className="error">{errors.image}</p>)}
        </label>
            <br />
        <label className='property-form-label'>
            Price:
            <input 
            className={`property-form-input ${errors.image && touched.image ? "input-error" : ""}`}
            type="number" 
            value={values.price} 
            onChange={handleChange}
            onBlur={handleBlur}  
            name="price" />
            {errors.price && touched.price && <p className="error">{errors.price}</p>}
        </label>
        <br />
        <label className='property-form-label'>
            Location:
            <input 
            className={`property-form-input ${errors.address && touched.address ? "input-error" : ""}`}
            type="text" 
            value={values.address} 
            onChange={handleChange}
            onBlur={handleBlur}  
            name="address"/>
            {errors.address && touched.address && <p className="error">{errors.address}</p>}
        </label>
        <label className='property-form-label'>
            Description:
            <textarea 
            className={`property-form-input ${errors.image && touched.image ? "input-error" : ""}`}
            value={values.description} 
            onChange={handleChange}
            onBlur={handleBlur}  
            name="description" />
            {errors.description && touched.description && <p className="error">{errors.description}</p>}
        </label>
        <br />
        <button disabled={isSubmitting} className='property-form-button' type="submit">Add Property</button>
    </form>
  );
};

export default AddProperty;