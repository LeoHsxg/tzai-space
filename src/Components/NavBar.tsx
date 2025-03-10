import React from "react";
import SignBt from "./SignBt";
import Logo from "../img/LOGO_9x3.svg";

const NavBar = () => {
  return (
    <div className="flex w-full h-[80px] px-8 py-4 justify-between items-center z-50">
      <img className="w-16 h-6" src={Logo} />
      <SignBt />
    </div>
  );
};

export default NavBar;
