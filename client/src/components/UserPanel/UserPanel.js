import React from 'react'
import SignUp from './Signup'
import Login from './Login'
import UserDetails from './UserDetails'
import Transactions from '../Transaction/Transactions'

export default function UserPanel({currentUser, setCurrentUser}) {

    if (!currentUser){  
    return (
        <div>
            <SignUp currentUser = {currentUser} setCurrentUser = {setCurrentUser}/>
            <Login currentUser = {currentUser} setCurrentUser = {setCurrentUser}/>
        </div>
        )
    } else{
        return (
            <>
                <UserDetails currentUser = {currentUser} setCurrentUser = {setCurrentUser}/>
                <Transactions currentUser = {currentUser}/>
            </>
        )
    }
}
