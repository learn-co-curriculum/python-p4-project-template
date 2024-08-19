import { useState, useEffect } from 'react'

function TransactionRequest({ createRequest, currentUser }) {

  const [amount, setAmount] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [users, setUsers] = useState([])

  useEffect(() =>{
    fetch('/users')
    .then(res => res.json())
    .then(data => setUsers(data.filter( user => user.id !== currentUser.id)))
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    createRequest({ amount:amount, requestee:selectedUser})
    setAmount('')
    setSelectedUser('')
  }

  const handleUserChange = e => setSelectedUser(e.target.value)
  const handleAmountChange = e => setAmount(e.target.value)

  return (
    <form onSubmit={handleSubmit}>

      <h3>Send Request:</h3>

      <select value = {selectedUser} onChange={handleUserChange} required>
        <option value = "" >Select a User</option>
        {users.map(user => 
            <option key = {user.id} name = "user" value = {user.id}>
            {user.username}
            </option>)
            }
        </select>
      
      <input
        type="text"
        onChange={handleAmountChange}
        value={amount}
      />

      <input type="submit" value={'Add Request'} />

    </form>
  )

}

export default TransactionRequest