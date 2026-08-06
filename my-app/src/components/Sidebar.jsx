import React from "react";

const DEFAULT_TABS = [
  { id: "home", label: "Home" },
  { id: "jobs", label: "Jobs" },
  { id: "applications", label: "Applications" },
  { id: "profile", label: "Profile" },
];

function Sidebar({
  studentName = "Student",
  roleLabel = "Job Seeker",
  tabs = DEFAULT_TABS,
  activeTab,
  onTabChange,
  onLogout,
}) {
  return (
    <aside className="sidebar">
      <div className="profile-card">
        <div className="profile-avatar">{studentName.charAt(0)}</div>
        <h3>{studentName}</h3>
        <p>{roleLabel}</p>
      </div>

      <nav className="side-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <button className="logout-btn" onClick={onLogout}>Logout</button>
    </aside>
  );
}

export default Sidebar;