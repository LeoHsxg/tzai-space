import React from "react";
import "../styles/Footer.css";
// import Contract from "/src/img/contract.svg";
import Calendar_month from "../img/calendar_month.svg";
import Contract from "../img/contract.svg";
import Info from "../img/info.svg";
import Settings from "../img/settings.svg";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer_bar">
        <div className="box">
          <img src={Info} alt="Contract" className="icon" />
          <img src={Calendar_month} alt="Calendar_month" className="icon" />
        </div>
        <div className="box">
          <img src={Contract} alt="Info" className="icon" />
          <img src={Settings} alt="Settings" className="icon" />
        </div>
      </div>
      <div className="btn frame">
        <div className="circle frame" />
        <svg className="cross" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
          <rect y="11" width="25" height="3" fill="white" />
          <rect x="14" width="25" height="3" transform="rotate(90 14 0)" fill="white" />
        </svg>
      </div>
    </div>
  );
};

export default Footer;
