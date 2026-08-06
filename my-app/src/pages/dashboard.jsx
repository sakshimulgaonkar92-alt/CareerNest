import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import JobCard from "../components/JobCard";
import api from "../api/axios";

const STATUS_LABELS = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview: "Interview Scheduled",
  hired: "Hired",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

function Dashboard({ onLogout, studentName = "Student" }) {
  const [activeTab, setActiveTab] = useState("home");
  const [stats, setStats] = useState({ totalApplications: 0, statusCounts: [] });
  const [recentJobs, setRecentJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboardData() {
      try {
        const [dashboardRes, jobsRes, applicationsRes] = await Promise.all([
          api.get("/dashboard"),
          api.get("/jobs?limit=6&status=open"),
          api.get("/applications/my"),
        ]);

        if (cancelled) return;

        setStats(dashboardRes.data);
        setRecentJobs(jobsRes.data.jobs.slice(0, 3));
        setAllJobs(jobsRes.data.jobs);

        const mappedApplications = applicationsRes.data.map((app) => ({
          job: {
            title: app.jobId?.title || "Untitled role",
            company: app.jobId?.employerId?.companyName || "Unknown company",
            location: app.jobId?.location,
          },
          status: STATUS_LABELS[app.status] || app.status,
        }));
        setApplications(mappedApplications);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboardData();

    // Poll every 30s so the dashboard stays "real-time" without a full page reload
    const interval = setInterval(loadDashboardData, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const shortlistedCount =
    stats.statusCounts?.find((s) => s._id === "shortlisted")?.count || 0;
  const interviewCount =
    stats.statusCounts?.find((s) => s._id === "interview")?.count || 0;

  const mapJobForCard = (job) => ({
    title: job.title,
    company: job.employerId?.companyName || "Unknown company",
    location: job.location,
    tag: job.jobType?.replace("_", "-"),
  });

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
          {loading && <p style={{ padding: 20 }}>Loading your dashboard…</p>}

          {!loading && activeTab === "home" && (
            <>
              <div className="cards">
                <StatCard value={stats.totalApplications ?? 0} label="Total Applications" />
                <StatCard value={shortlistedCount} label="Shortlisted" />
                <StatCard value={interviewCount} label="Interviews" />
              </div>

              <div className="recent">
                <h3>Recent Jobs</h3>
                <div className="job-list">
                  {recentJobs.length === 0 && <p>No open jobs right now.</p>}
                  {recentJobs.map((job) => (
                    <JobCard key={job._id} job={mapJobForCard(job)} />
                  ))}
                </div>
              </div>
            </>
          )}

          {!loading && activeTab === "jobs" && (
            <div className="recent">
              <h3>All Jobs</h3>
              <div className="job-list">
                {allJobs.map((job) => (
                  <JobCard key={job._id} job={mapJobForCard(job)} />
                ))}
              </div>
            </div>
          )}

          {!loading && activeTab === "applications" && (
            <div className="recent">
              <h3>My Applications</h3>
              <div className="job-list">
                {applications.length === 0 && <p>You haven't applied to any jobs yet.</p>}
                {applications.map((app, i) => (
                  <JobCard key={i} job={app.job} status={app.status} />
                ))}
              </div>
            </div>
          )}

          {!loading && activeTab === "profile" && (
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