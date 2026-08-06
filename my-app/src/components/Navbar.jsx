import React from "react";

function Navbar({ studentName = "Student" }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">MP</div>
        <span>MyProject</span>
      </div>
      <input className="navbar-search" type="text" placeholder="Search jobs, companies..." />
      <div className="navbar-avatar">{studentName.charAt(0)}</div>
    </header>
  );
}

export default Navbar;