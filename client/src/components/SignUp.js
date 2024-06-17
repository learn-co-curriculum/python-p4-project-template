import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

function SignUp(){
    const navigate = useNavigate()

    const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [checkPassword, setCheckPassword] = useState("")
    const [incorrectPassword, setIncorrectPassword] = useState(true)

    function createdNewUser(e) {
        e.preventDefault()
        if (userPassword === checkPassword && userPassword.length >= 8) {
            setIncorrectPassword(true)
            fetch('/api/users', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        username: userName,
                        email: userEmail,
                        password: userPassword
                    }
                )
            })
                .then(r => {
                    if (r.ok) {
                        return r.json()
                    }
                    else {
                        alert("Not Valid Login")
                        return undefined
                    }
                })
                .then(data => {
                    const userId = data.id
                    setUserId(userId)
                    setUserName("")
                    setUserEmail("")
                    setUserPassword("")
                    setCheckPassword("")
                    navigate(`/user/${userId}`)
                    setIsLoggedIn(true)
                })
                .catch(error => {
                    alert("Something went wrong. Please try again.")
                    console.error('Login failed:', error)
                })
        }
        else {
            setIncorrectPassword(false)
        }
    }

    return (
        <>
            <div>
                {/* <img className="w-12 m-6" src="/Logo.png" /> */}
                <h1 className="Form-Header">PenPrez</h1>
            </div>
            <div className="font-Body border-2 flex-col mx-32 rounded-3xl bg-white bg-opacity-25 backdrop-blur-lg shadow-lg p-6">
                <h2 className="font-Head select-none animate-colorAnimation text-center text-4xl m-8">Please type in information to create account:</h2>
                <form className="flex items-center flex-col" onSubmit={(e) => createdNewUser(e)}>
                    <div>
                        <h3 className="text-center select-none text-xl text-primaryPurple">Username:</h3>
                        <input className="inputs" id="username" autoComplete="off" onChange={(e) => setUserName(e.target.value)} />
                    </div>
                    <div>
                        <h3 className="text-center select-none text-xl text-primaryPurple">Email:</h3>
                        <input className="inputs" id="email" autoComplete="email" onChange={(e) => setUserEmail(e.target.value)} />
                    </div>
                    {incorrectPassword
                        ?
                        <>
                            <h3 className="text-center select-none text-xl text-primaryPurple">Password:</h3>
                            <input className="inputs" id="password" type="password" autoComplete="new-password" onChange={(e) => setUserPassword(e.target.value)} />
                            <h3 className="text-center select-none text-xl text-primaryPurple">Verify Password:</h3>
                            <input className="inputs" id="verifyPassword" type="password" autoComplete="new-password" onChange={(e) => setCheckPassword(e.target.value)} />
                            <button className="bg-lightBlue hover:bg-blue-500 shadow-xl text-white font-bold py-2 px-4 m-6 rounded" type="submit">Sign Up</button>
                        </>
                        :
                        <>
                            <h3 className="text-center text-xl text-primaryPurple">Password:</h3>
                            <input className="inputs-incorrect" id="password" type="password" autoComplete="new-password" onChange={(e) => setUserPassword(e.target.value)} />
                            <h4 className="m-4">Passwords are not the same or must be at least 8 characters in length. Please re-enter password</h4>
                            <h3 className="text-center text-xl text-primaryPurple">Verify Password:</h3>
                            <input className="inputs-incorrect" id="verifyPassword" type="password" autoComplete="new-password" onChange={(e) => setCheckPassword(e.target.value)} />
                            <h4 className="m-4">Passwords are not the same or must be at least 8 characters in length. Please re-enter password</h4>
                            <button className="bg-lightBlue hover:bg-blue-500 shadow-xl text-white font-bold py-2 px-4 m-6 rounded" type="submit">Sign Up</button>
                        </>
                    }
                </form>
            </div>
        </>
    )
}

export default SignUp;