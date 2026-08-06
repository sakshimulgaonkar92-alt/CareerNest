import React, { useState } from "react";
import "./dashboard.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

const TABS = [
  { id: "home", label: "Home" },
  { id: "users", label: "Users" },
  { id: "reports", label: "Reports" },
  { id: "profile", label: "Profile" },
];

const USERS = [
  { name: "Rohan Sharma", role: "Student", email: "rohan@example.com" },
  { name: "Your Company", role: "Employer", email: "hr@yourcompany.com" },
  { name: "Priya Nair", role: "Recruiter", email: "priya@agency.com" },
];

function AdminDashboard({ onLogout, studentName = "Admin" }) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="dashboard">
      <Navbar studentName={studentName} />

      <div className="content">
        <Sidebar
          studentName={studentName}
          roleLabel="Admin"
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={onLogout}
        />

        <main className="main">
          {activeTab === "home" && (
            <div className="cards">
              <StatCard value={USERS.length} label="Total Users" />
              <StatCard value="4" label="Jobs Posted" />
              <StatCard value="2" label="Applications" />
            </div>
          )}

          {activeTab === "users" && (
            <div className="recent">
              <h3>All Users</h3>
              <div className="job-list">
                {USERS.map((u) => (
                  <div className="job-card" key={u.email}>
                    <div className="job-card-logo">{u.name.charAt(0)}</div>
                    <div className="job-card-body">
                      <h4>{u.name}</h4>
                      <p className="job-card-company">{u.role}</p>
                      <p className="job-card-location">{u.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="recent">
              <h3>Reports</h3>
              <p>Platform-wide stats go here (jobs posted, applications, active users).</p>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="recent">
              <h3>Admin Profile</h3>
              <p>Admin account details go here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;