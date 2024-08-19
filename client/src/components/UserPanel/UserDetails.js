import React from 'react'

export default function UserDetails({currentUser, setCurrentUser}) {

    const handleLogout = () =>{
        fetch('/logout', {
            method:'DELETE'
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => setCurrentUser(null))
    }

  return (
    <div>
        <h2>Welcome {currentUser.username}</h2>
        <button onClick = {handleLogout}>Logout</button>
    </div>
  )
}
