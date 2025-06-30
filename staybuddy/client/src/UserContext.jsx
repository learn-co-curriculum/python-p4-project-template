import { createContext, useState, useEffect } from 'react';
// client/src/UserContext.jsx
import { jwtDecode } from 'jwt-decode'; // ✅ Correct way


export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.sub || decoded.identity });
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;