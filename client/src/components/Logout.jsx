import { useNavigate } from "react-router-dom";

const Logout = ({ handleLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    fetch("/api/logout", {method: "POST", credentials:"include"})
    .then(response => {
        if (response) {
            handleLogout()
            navigate("/login")
        }
        else {
            console.log("Failure to log out")
        }
    })
  };

  handleLogoutClick()
};

export default Logout;