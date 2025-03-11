import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PriorityBreakdownChart = ({ priorityData }) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold">Filed vs. Fixed by Priority</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={priorityData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Filed" fill="#e74c3c" />
          <Bar dataKey="Fixed" fill="#2ecc71" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriorityBreakdownChart;
