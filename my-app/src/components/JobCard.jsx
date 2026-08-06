import React from "react";

export function StatusChip({ status }) {
  const tone = status === "Interview Scheduled" ? "chip-green" : "chip-blue";
  return <span className={`chip ${tone}`}>{status}</span>;
}

function JobCard({ job, status }) {
  return (
    <div className="job-card">
      <div className="job-card-logo">{job.company.charAt(0)}</div>
      <div className="job-card-body">
        <h4>{job.title}</h4>
        <p className="job-card-company">{job.company}</p>
        {job.location && <p className="job-card-location">{job.location}</p>}
      </div>
      {status ? <StatusChip status={status} /> : job.tag && (
        <span className="chip chip-blue">{job.tag}</span>
      )}
    </div>
  );
}

export default JobCard;