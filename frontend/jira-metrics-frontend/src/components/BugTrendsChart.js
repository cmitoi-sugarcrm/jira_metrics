import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const BugTrendsChart = ({ issuesByPeriod }) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold">Bug Trends Over Releases</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={issuesByPeriod}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Filed" stroke="#3498db" />
          <Line type="monotone" dataKey="Fixed" stroke="#2ecc71" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BugTrendsChart;
