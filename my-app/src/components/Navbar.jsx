import React from "react";
import logoMark from "../assets/careernest-logomark.png";

function Navbar({ studentName = "Student" }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <img src={logoMark} alt="CareerNest" className="navbar-logo" />
        <span>CareerNest</span>
      </div>
      <input className="navbar-search" type="text" placeholder="Search jobs, companies..." />
      <div className="navbar-avatar">{studentName.charAt(0)}</div>
    </header>
  );
}

export default Navbar;