import React from "react";

const Table = ({ issues }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mt-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Issue List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-50 border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Key</th>
              <th className="py-2 px-4 border">Summary</th>
              <th className="py-2 px-4 border">Priority (Label)</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} className="hover:bg-gray-100 transition">
                <td className="py-2 px-4 border">{issue.key}</td>
                <td className="py-2 px-4 border">{issue.fields.summary}</td>
                <td className="py-2 px-4 border">
                  {issue.fields.labels.find(label => label.startsWith("P")) || "None"}
                </td>
                <td className="py-2 px-4 border">{issue.fields.status?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
