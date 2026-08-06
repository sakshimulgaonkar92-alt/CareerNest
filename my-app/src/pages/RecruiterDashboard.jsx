import React, { useState } from "react";
import "./dashboard.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import JobCard from "../components/JobCard";

const TABS = [
  { id: "home", label: "Home" },
  { id: "listings", label: "Job Listings" },
  { id: "candidates", label: "Candidates" },
  { id: "interviews", label: "Interviews" },
  { id: "profile", label: "Profile" },
];

const LISTINGS = [
  { title: "React Developer", company: "Client: TCS", location: "Pune, Maharashtra", tag: "Full-time" },
  { title: "DevOps Engineer", company: "Client: Infosys", location: "Bengaluru, Karnataka", tag: "Full-time" },
];

const CANDIDATES = [
  { job: { title: "React Developer", company: "Candidate: Aditya Verma" }, status: "Under Review" },
];

const INTERVIEWS = [
  { job: { title: "React Developer", company: "Aditya Verma -- Fri, 10:00 AM" }, status: "Interview Scheduled" },
];

function RecruiterDashboard({ onLogout, studentName = "Recruiter" }) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="dashboard">
      <Navbar studentName={studentName} />

      <div className="content">
        <Sidebar
          studentName={studentName}
          roleLabel="Recruiter"
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={onLogout}
        />

        <main className="main">
          {activeTab === "home" && (
            <>
              <div className="cards">
                <StatCard value={LISTINGS.length} label="Active Listings" />
                <StatCard value={CANDIDATES.length} label="Candidates" />
                <StatCard value={INTERVIEWS.length} label="Interviews" />
              </div>

              <div className="recent">
                <h3>Recent Listings</h3>
                <div className="job-list">
                  {LISTINGS.map((job) => (
                    <JobCard key={job.title} job={job} />
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "listings" && (
            <div className="recent">
              <h3>Job Listings</h3>
              <div className="job-list">
                {LISTINGS.map((job) => (
                  <JobCard key={job.title} job={job} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "candidates" && (
            <div className="recent">
              <h3>Candidates</h3>
              <div className="job-list">
                {CANDIDATES.map((c) => (
                  <JobCard key={c.job.title} job={c.job} status={c.status} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "interviews" && (
            <div className="recent">
              <h3>Scheduled Interviews</h3>
              <div className="job-list">
                {INTERVIEWS.map((i) => (
                  <JobCard key={i.job.title} job={i.job} status={i.status} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="recent">
              <h3>Agency Profile</h3>
              <p>Agency details go here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default RecruiterDashboard;