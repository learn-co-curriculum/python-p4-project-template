import { useState, useEffect } from 'react'
import UserPanel from "./UserPanel/UserPanel"

function App() {

  //states
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, isLoading] = useState(true)

  // if(loading){
  //   return <h1>Loading...</h1>
  // }

  useEffect(() =>{
    fetch('/check_session')
    .then(res => {
      if (res.status == 200){
        res.json()
        .then(data => setCurrentUser(data))
      }
    })

  }, [] )

  return (
    <div className = "App">
      <h1>FlatPay</h1>
      <UserPanel currentUser = {currentUser} setCurrentUser = {setCurrentUser}/>


    </div>

  )
}

export default App
