import React from "react";

function StatCard({ value, label }) {
  return (
    <div className="card">
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  );
}

export default StatCard;