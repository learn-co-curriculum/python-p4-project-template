// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';
import { Formik } from 'formik';
import { Link } from "react-router-dom";

function SignUp({ setIsLoggedIn, setUserId }) {

    const navigate = useNavigate()
    
    function createdNewUser(e) {
        
            fetch('/signup', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(e)
            })
                .then(r => {
                    if (r.ok) {
                        return r.json()
                    }
                    else {
                        alert("Incorrect Login")
                        return undefined
                    }
                })
                .then(data => { 
                
                    const userId = data.id
                    setUserId(userId)
                    navigate(`/user/${userId}`)
                    setIsLoggedIn(true)
                })
                .catch(error => {
                    alert("Something went wrong. Please try again.")
                    console.error('Login failed:', error)
                })
    }

    let createUserSchema = yup.object().shape({
        first_name: yup.string().max(40, 'First name too Long!').required(), 
        last_name: yup.string().max(40, 'Last name too Long!').required(),
        username: yup.string().max(20, 'Username too Long!').required(),
        password: yup.string().max(20, 'Password too Long!').required(),
        password_confirmation: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required(), 
        email: yup.string().email('Invalid email').required()
    
    
    })

    

    return (
        <>
        <div className="signup-container">
            <h1 className="signup-header">RecipeBook</h1>
            <Formik
                initialValues={{
                    first_name: '', 
                    last_name: '',
                    username: '',
                    email: '',
                    password: '',
                    password_confirmation: ''
                }}
                validationSchema={createUserSchema}
                onSubmit={createdNewUser}
            >
                {(props) => {
                    const { values: {
                        first_name, 
                        last_name,
                        email,
                        username,
                        password,
                        password_confirmation
                    },
                        handleChange, handleSubmit, errors } = props
                    return (<form className="signup-form" onSubmit={handleSubmit}>
                        <p>* Required Fields</p>

                        <label htmlFor="name">* First Name: </label>
                        <input onChange={handleChange} value={first_name}
                            type="text" name="first_name" />
                        <p className="errorText">{errors.name}</p> 

                        <label htmlFor="name">* Last Name: </label>
                        <input onChange={handleChange} value={last_name}
                            type="text" name="last_name" />
                        <p className="errorText">{errors.name}</p>

                        <label htmlFor="email">* Email Address: </label>
                        <input onChange={handleChange} value={email}
                            type="email" name="email" />
                        <p className="errorText">{errors.email}</p>

                        <label htmlFor="username">* Username: </label>
                        <input onChange={handleChange} value={username}
                            type="text" name="username" />
                        <p className="errorText">{errors.username}</p>

                        <label htmlFor="password">* Password: </label>
                        <input onChange={handleChange} value={password}
                            type="text" name="password" />
                        <p className="errorText">{errors.password}</p>

                        <label htmlFor="password_confirmation">* Confirm Password: </label>
                        <input onChange={handleChange} value={password_confirmation}
                            type="text" name="password_confirmation" />
                        <p className="errorText">{errors.password_confirmation}</p>

                        <button type="submit">Sign Up</button>

                    </form>)
                }}
            </Formik>
            <div className="login-link">
                <p>Already have an account? <Link to="/login">Log In</Link></p>
            </div>

        </div>

        </>
    )
}

export default SignUp;