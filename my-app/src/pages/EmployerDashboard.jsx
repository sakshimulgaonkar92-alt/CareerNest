import React, { useState } from "react";
import "./dashboard.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import JobCard from "../components/JobCard";

const TABS = [
  { id: "home", label: "Home" },
  { id: "myjobs", label: "My Jobs" },
  { id: "applicants", label: "Applicants" },
  { id: "profile", label: "Profile" },
];

// TODO (Day 2): replace with GET /api/jobs?postedBy=me
const MY_JOBS = [
  { title: "Frontend Developer", company: "Your Company", location: "Pune, Maharashtra", tag: "Full-time" },
  { title: "Backend Developer", company: "Your Company", location: "Remote", tag: "Full-time" },
];

// TODO (Day 3): replace with GET /api/applications?jobId=...
const APPLICANTS = [
  { job: { title: "Frontend Developer", company: "Applicant: Rohan Sharma" }, status: "Under Review" },
  { job: { title: "Backend Developer", company: "Applicant: Priya Nair" }, status: "Interview Scheduled" },
];

function EmployerDashboard({ onLogout, studentName = "Employer" }) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="dashboard">
      <Navbar studentName={studentName} />

      <div className="content">
        <Sidebar
          studentName={studentName}
          roleLabel="Employer"
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={onLogout}
        />

        <main className="main">
          {activeTab === "home" && (
            <>
              <div className="cards">
                <StatCard value={MY_JOBS.length} label="Jobs Posted" />
                <StatCard value={APPLICANTS.length} label="Total Applicants" />
                <StatCard value="1" label="Interviews Scheduled" />
              </div>

              <div className="recent">
                <h3>Your Recent Jobs</h3>
                <div className="job-list">
                  {MY_JOBS.map((job) => (
                    <JobCard key={job.title} job={job} />
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "myjobs" && (
            <div className="recent">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>My Job Postings</h3>
                <button className="logout-btn" style={{ width: "auto", padding: "8px 16px" }}>
                  + Post a Job
                </button>
              </div>
              <div className="job-list">
                {MY_JOBS.map((job) => (
                  <JobCard key={job.title} job={job} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "applicants" && (
            <div className="recent">
              <h3>Applicants</h3>
              <div className="job-list">
                {APPLICANTS.map((app) => (
                  <JobCard key={app.job.title} job={app.job} status={app.status} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="recent">
              <h3>Company Profile</h3>
              <p>Company details go here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default EmployerDashboard;