import React from "react"; 
import Menu from "./Menu";
import Login from "./Login"

function Header() {
  // header page
  return (
    <header id="header">
      <h1>
        PenPrez.com , <Menu />, <Login />
      </h1>
    </header>
  );
}

export default Header;