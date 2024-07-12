import React, { createContext, useCallback, useState, useEffect } from 'react';

const UserContext = createContext();



const UserProvider = ({ children }) => {
    const [user, setUser] = useState();

    const getUser = useCallback(() => fetch('/check_session', { credentials: 'include' }).then(response => response.json())
        .then(data => {
            if (data.id) {
                setUser(data);
            } else {
                setUser(null)
            }
        })
        .catch(e => {
            setUser(null)
        }), [])


    useEffect(() => {
        getUser()

    }, [getUser]);

    const login = (userData) => setUser(userData);

    const logout = () => {
        fetch('/logout', {
            method: 'DELETE',
            credentials: 'include',
        })
            .then(response => {
                if (response.ok) {
                    setUser(null);
                }
            })
            .catch(error => {
                console.error('Logout failed:', error);
            });
    };

    return (
        <UserContext.Provider value={{ user, login, logout, setUser, getUser }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };