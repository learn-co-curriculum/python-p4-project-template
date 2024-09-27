import React, { useState } from "react";





function UserForm({ handleProf, currUser, deleteUsr }) {

    const initialVal = {
        name: currUser.name,
        username: currUser.username,
        password: currUser.password,
    }
    const [uForm, setUform] = useState(initialVal)

    const handleOnChange = (event) => {
        const { name, value } = event.target
        setUform({ ...uForm, [name]: value })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        handleProf(uForm)
    }



    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="update-user-form">
                <h3>Update Profile</h3>
                <input
                    type="text"
                    name="name"
                    onChange={handleOnChange}
                    value={uForm.name}
                />
                <br />
                <input
                    type="text"
                    name="username"
                    onChange={handleOnChange}
                    value={uForm.username}
                />
                <br />
                <input
                    type="text"
                    name="password"
                    onChange={handleOnChange}
                    value={uForm.password}
                />
                <br />
                <button type="submit">Submit</button>

            </form>

            <button onClick={deleteUsr}>Delete Account</button>

        </div>

    )
}

export default UserForm;