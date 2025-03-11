import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Chart = ({ issues }) => {
  // Define Jira statuses that count as "fixed"
  const fixedStatuses = ["Done", "Resolved", "Closed"]; // Adjust based on your Jira workflow

  // Define priority levels + "No Label" category
  const priorityLevels = ["P0", "P1", "P2", "P3", "P4", "No Label"];

  // Group issues by priority level
  const groupedData = priorityLevels.map(priority => {
    if (priority === "No Label") {
      // Count issues that do NOT have a P label
      const filedCount = issues.filter(issue => 
        !issue.fields.labels.some(label => priorityLevels.includes(label))
      ).length;
      
      const fixedCount = issues.filter(issue => 
        !issue.fields.labels.some(label => priorityLevels.includes(label)) && 
        fixedStatuses.includes(issue.fields.status?.name)
      ).length;

      return { name: priority, Filed: filedCount, Fixed: fixedCount };
    } else {
      // Count issues per priority label
      const filedCount = issues.filter(issue => issue.fields.labels.includes(priority)).length;
      const fixedCount = issues.filter(
        issue => issue.fields.labels.includes(priority) && fixedStatuses.includes(issue.fields.status?.name)
      ).length;

      return { name: priority, Filed: filedCount, Fixed: fixedCount };
    }
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mt-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Filed vs. Fixed Issues by Priority</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={groupedData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Filed" fill="#3498db" />
          <Bar dataKey="Fixed" fill="#2ecc71" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
