import React from "react";
import { Link } from "react-router-dom";
// import Contract from "/src/img/contract.svg";
import Calendar_month from "../img/calendar_month_h.svg";
import Contract from "../img/contract_h.svg";
import Info from "../img/info_h.svg";
import Settings from "../img/settings_h.svg";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer_bar">
        <div className="box">
          <img src={Info} alt="Contract" className="icon" />
          <Link to="/">
            <img src={Calendar_month} alt="Calendar_month" className="icon" />
          </Link>
        </div>
        <div className="box">
          <Link to="/rule">
            <img src={Contract} alt="Info" className="icon" />
          </Link>
          <img src={Settings} alt="Settings" className="icon" />
        </div>
      </div>
      <Link to="/apply">
        <div className="btn frame">
          <div className="circle frame" />
          <svg className="cross" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
            <rect y="11" width="25" height="3" fill="white" />
            <rect x="14" width="25" height="3" transform="rotate(90 14 0)" fill="white" />
          </svg>
        </div>
      </Link>
    </div>
  );
};

export default Footer;
