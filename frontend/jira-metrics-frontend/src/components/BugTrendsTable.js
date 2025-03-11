import React from "react";

const BugTrendsTable = ({ issuesByPeriod }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Bugs Filed and Fixed Over Periods</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-4 border">Period</th>
              <th className="py-3 px-4 border">Total Filed</th>
              <th className="py-3 px-4 border">Total Fixed</th>
              <th className="py-3 px-4 border">NL Filed</th>
              <th className="py-3 px-4 border">NL Fixed</th>
              <th className="py-3 px-4 border">P0 Filed</th>
              <th className="py-3 px-4 border">P0 Fixed</th>
              <th className="py-3 px-4 border">P1 Filed</th>
              <th className="py-3 px-4 border">P1 Fixed</th>
              <th className="py-3 px-4 border">P2 Filed</th>
              <th className="py-3 px-4 border">P2 Fixed</th>
              <th className="py-3 px-4 border">P3 Filed</th>
              <th className="py-3 px-4 border">P3 Fixed</th>
              <th className="py-3 px-4 border">P4 Filed</th>
              <th className="py-3 px-4 border">P4 Fixed</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {issuesByPeriod.map((period, index) => (
              <tr key={index} className="hover:bg-gray-100 transition">
                <td className="py-3 px-4 border">{period.name}</td>
                <td className="py-3 px-4 border">{period.Filed}</td>
                <td className="py-3 px-4 border">{period.Fixed}</td>
                <td className="py-3 px-4 border">{period.NL_Filed || 0}</td>
                <td className="py-3 px-4 border">{period.NL_Fixed || 0}</td>
                <td className="py-3 px-4 border">{period.P0_Filed || 0}</td>
                <td className="py-3 px-4 border">{period.P0_Fixed || 0}</td>
                <td className="py-3 px-4 border">{period.P1_Filed || 0}</td>
                <td className="py-3 px-4 border">{period.P1_Fixed || 0}</td>
                <td className="py-3 px-4 border">{period.P2_Filed || 0}</td>
                <td className="py-3 px-4 border">{period.P2_Fixed || 0}</td>
                <td className="py-3 px-4 border">{period.P3_Filed || 0}</td>
                <td className="py-3 px-4 border">{period.P3_Fixed || 0}</td>
                <td className="py-3 px-4 border">{period.P4_Filed || 0}</td>
                <td className="py-3 px-4 border">{period.P4_Fixed || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BugTrendsTable;
