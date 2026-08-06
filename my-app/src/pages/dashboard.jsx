import React, { useState } from "react";
import "./dashboard.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import JobCard from "../components/JobCard";

const RECENT_JOBS = [
  { title: "Frontend Developer", company: "TCS", location: "Pune, Maharashtra", tag: "Full-time" },
  { title: "Java Developer", company: "Infosys", location: "Bengaluru, Karnataka", tag: "Full-time" },
  { title: "Web Developer Intern", company: "Wipro", location: "Remote", tag: "Internship" },
];

const ALL_JOBS = [
  ...RECENT_JOBS,
  { title: "Backend Developer", company: "Accenture", location: "Hyderabad, Telangana", tag: "Full-time" },
];

const APPLICATIONS = [
  { job: { title: "Frontend Developer", company: "TCS" }, status: "Under Review" },
  { job: { title: "Java Developer", company: "Infosys" }, status: "Interview Scheduled" },
];

function Dashboard({ onLogout, studentName = "Student" }) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="dashboard">

      <Navbar studentName={studentName} />

      <div className="content">

        <Sidebar
          studentName={studentName}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={onLogout}
        />

        <main className="main">

          {activeTab === "home" && (
            <>
              <div className="cards">
                <StatCard value="120" label="Total Jobs" />
                <StatCard value="18" label="Applied" />
                <StatCard value="12" label="Saved" />
              </div>

              <div className="recent">
                <h3>Recent Jobs</h3>
                <div className="job-list">
                  {RECENT_JOBS.map((job) => (
                    <JobCard key={job.title} job={job} />
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "jobs" && (
            <div className="recent">
              <h3>All Jobs</h3>
              <div className="job-list">
                {ALL_JOBS.map((job) => (
                  <JobCard key={job.title} job={job} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "applications" && (
            <div className="recent">
              <h3>My Applications</h3>
              <div className="job-list">
                {APPLICATIONS.map((app) => (
                  <JobCard key={app.job.title} job={app.job} status={app.status} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="recent">
              <h3>My Profile</h3>
              <p>Profile details go here.</p>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}

export default Dashboard;