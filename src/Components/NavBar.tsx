import React from "react";
import SignBt from "./SignBt";
import "../styles/NavBar.css";

const NavBar = () => {
  return (
    <div className="navbar">
      <img className="navbar_logo" src="/src/img/LOGO_9x3.svg" />
      <SignBt />
    </div>
  );
};

export default NavBar;
