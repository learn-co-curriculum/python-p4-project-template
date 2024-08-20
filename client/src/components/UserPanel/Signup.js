import React from 'react'
import { useState } from 'react'
import "./Login&Signup.css"


export default function Signup({setCurrentUser}) {

    //states
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) =>{
        e.preventDefault()
        fetch('/signup', {
            method:'POST',
            headers:{
                'Content-Type':'application/json', 
                'Accept':'application/json'
            }, 
            body:JSON.stringify({
                username, password
            })
        })
        .then(res =>{
            if (res.ok){
                res.json()
                .then( data => setCurrentUser(data))
            } else{
                res.json()
                .then( data => alert(data.error))
            }
        })
    }

  return (
    <form className='user-form' onSubmit={handleSubmit}>

        <h2>Signup</h2>

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
        value='Signup'
        />

    </form>
  )
}
