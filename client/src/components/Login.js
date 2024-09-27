import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

function Login({users,currUser,loggedIn,setLogIn,setCurrentUser,xurl,addUser}) {

    const initValue = {
        name: "",
        username: "",
        password: "",
    }

    const [searchUserHold,setSearchUserHold] = useState(initValue)
    const [loginMode,setLoginMode] = useState(true)
    const navigate = useNavigate()
    // const history = useHistory()

    useEffect(()=>{
        if(users.find((user)=>user===currUser)){
            setLogIn(true)
        } else {
            setLogIn(false)
        }
    },[])
    function handleClick(e){
        console.log(users)
        setLoginMode(!loginMode)
    }
    function handleLoginChange(e){
        const {name,value} = e.target
        setSearchUserHold({
            ...searchUserHold,
            [name]: value,
        })
    }
    function handleLoginSubmit(e){
        e.preventDefault()
        const usernameCheck = users.find((user)=>user.username===searchUserHold.username)
        const passwordCheck = users.find((user)=>user.password===searchUserHold.password)
        if(usernameCheck !== undefined && passwordCheck !== undefined){
            setLogIn(true);
            setCurrentUser(users.find((user)=>user.username===searchUserHold.username))
            // history.push("/pets")
            navigate("/profile")
        }
    }
    function handleSignupChange(e){
        const {name,value} = e.target
        setSearchUserHold({
            ...searchUserHold,
            [name]: value,
        })
    }
    function handleSignupSubmit(e){
        e.preventDefault()
        console.log(searchUserHold)
        console.log(JSON.stringify(searchUserHold))
        fetch(`${xurl}/users`,{method:"POST",headers:{"Content-Type":"application/json"},body: JSON.stringify(searchUserHold)})
        .then(r=>{
            if(r.ok){
                const data = {
                    ...searchUserHold,
                    favorites:[],
                    adoptions:[],
                }
                addUser(data)
                navigate("/profile")
            }
        })
    }
    function handleSignout(e){
        setCurrentUser("")
    }
    if(currUser === ""){
    return (
        <div>
            {loginMode ? (
            <form onSubmit={handleLoginSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                    type="text"
                    id="username"
                    name="username"
                    onChange={handleLoginChange}
                    />
                    <br></br>
                    <label>Password:</label>
                    <input
                    type="text"
                    id="password"
                    name="password"
                    onChange={handleLoginChange}
                    />
                </div>
                <div>
                    <input type="submit"/>
                </div>
                
            </form>
            ):(
            <form onSubmit={handleSignupSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={handleSignupChange}
                    />
                    <br></br>
                    <label>Username:</label>
                    <input
                    type="text"
                    id="username"
                    name="username"
                    onChange={handleSignupChange}
                    />
                    <br></br>
                    <label>Password:</label>
                    <input
                    type="text"
                    id="password"
                    name="password"
                    onChange={handleSignupChange}
                    />
                </div>
                <div>
                    <input type="submit"/>
                </div>
                
            </form>
            )}

            {loginMode ? (
                <button onClick={handleClick}>Don't have an account? Signup!</button>
            ):(
                <button onClick={handleClick}>Already have an account? Signin!</button>
            )}

        </div>
    )}else{
        return(
        <div>
            <button onClick={handleSignout}>Sign out</button>
        </div>
        )
    }
}

export default Login;