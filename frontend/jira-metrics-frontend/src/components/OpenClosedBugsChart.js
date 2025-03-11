import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const pieColors = ["#e74c3c", "#2ecc71"];

const OpenClosedBugsChart = ({ openClosedBugs }) => {
  const data = [
    { name: "Open", value: openClosedBugs.open },
    { name: "Closed", value: openClosedBugs.closed }
  ];

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold">Open vs. Closed Bugs</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value">
            {pieColors.map((color, index) => (
              <Cell key={index} fill={color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OpenClosedBugsChart;
