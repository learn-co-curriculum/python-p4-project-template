import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Login({ setIsLoggedIn, setUserId }) {

    const [loginUser, setLoginUser] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const navigate = useNavigate()

    function logIn(e) {
        e.preventDefault()
        fetch('/api/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    username: loginUser,
                    password: loginPassword
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
                if (data === undefined) {
                    alert("Something went wrong. Please try again.")
                }
                else {
                    const userId = data.id
                    setUserId(userId)
                    setLoginPassword("")
                    setLoginUser("")
                    navigate(`/user/${userId}`)
                    setIsLoggedIn(true)
                }
            })
    }

    return (
        <>
            <div>
                {/* <img className=logo src="/Logo.png" /> */}
                <h1>PenPrez</h1>
            </div>
            <div>
                <h2>Welcome to PenPrez</h2>
                <form className="flex items-center flex-col" onSubmit={(e) => logIn(e)}>
                    <div>
                        <h3 className="text-center text-xl select-none text-primaryPurple">Username:</h3>
                        <input id="username" className="inputs" autoComplete="username" onChange={(e) => setLoginUser(e.target.value)} />
                    </div>
                    <div>
                        <h3 className="text-center text-xl select-none text-primaryPurple">Password:</h3>
                        <input id="password" className="inputs" autoComplete="current-password" type="password" onChange={(e) => setLoginPassword(e.target.value)} />
                    </div>
                    <button className="bg-lightBlue hover:bg-blue-500 shadow-xl text-white font-bold py-2 px-4 m-6 rounded" type="submit">Log In</button>
                </form>
                <h3 className="text-center select-none m-5">New to PenPrez? <Link className="text-primaryBlue border-b-2 border-primaryBlue hover:border-primaryPurple hover:text-primaryPurple" to="/signup">Sign Up</Link></h3>
            </div>
        </>
    )
}

export default Login