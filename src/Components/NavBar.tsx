import React from "react";
import SignBt from "./SignBt";
import Logo from "../img/LOGO_9x3.svg";
import "../styles/NavBar.css";

const NavBar = () => {
  return (
    <div className="navbar">
      <img className="navbar_logo" src={Logo} />
      <SignBt />
    </div>
  );
};

export default NavBar;
