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
          <img src={Contract} alt="Contract" width="40" height="40" />
          <img src={Calendar_month} alt="Calendar_month" width="40" height="40" />
        </div>
        <div className="box">
          <img src={Info} alt="Info" width="40" height="40" />
          <img src={Settings} alt="Settings" width="40" height="40" />
        </div>
      </div>
      <div className="btn">
        <div className="circle" />
        <svg className="cross" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
          <rect y="11" width="25" height="3" fill="white" />
          <rect x="14" width="25" height="3" transform="rotate(90 14 0)" fill="white" />
        </svg>
      </div>
    </div>
  );
};

export default Footer;
