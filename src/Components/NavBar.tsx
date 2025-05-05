import React from "react";
import SignBt from "./SignBt";
import Logo from "../img/LOGO_9x3.svg";
import NavLinks from "./NavLinks";
const NavBar = () => {
  return (
    <div className="flex w-full h-20 px-8 py-4 md:h-16 md:px-6 justify-between items-center z-50 md:border-solid border-b-2 border-gray-200">
      <img className="w-16 h-6 md:mx-4" src={Logo} />
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <NavLinks />
        </div>
        <SignBt />
      </div>
    </div>
  );
};

export default NavBar;
