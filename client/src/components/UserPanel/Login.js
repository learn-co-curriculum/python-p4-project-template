import React from 'react'
import { useState } from 'react'
import "./Login&Signup.css"

export default function Login({setCurrentUser}) {
    //states
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) =>{
        e.preventDefault()
        fetch('/login', {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'
            }, 
            body:JSON.stringify(
                {username, password}
            )
        })
        .then(res => {
            if (res.ok) {
                res.json()
                .then(data => setCurrentUser(data))
            } else{
                alert('Invalid username or password')
            }
        })
    }

  return (

    <form className='user-form' onSubmit={handleSubmit}>

    <h2>Login</h2>

    <input type="text"
    onChange={e => setUsername(e.target.value)}
    value={username}
    placeholder='username'
    />

    <input type="text"
    onChange={e => setPassword(e.target.value)}
    value={password}
    placeholder='password'
    />

    <input type="submit"
    value='Login'
    />

  </form>
  )
}
