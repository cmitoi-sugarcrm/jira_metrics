import React, { useEffect, useState } from "react";
import Select from "react-select";
import { fetchProjects, fetchPeriods, fetchIssues, fetchLabels } from "../api/api";
import Chart from "../components/Chart";
import Table from "../components/Table";

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [projects, setProjects] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState([]);

  useEffect(() => {
    fetchPeriods().then(setPeriods);
    fetchProjects().then((data) => {
      setProjects(data.map((project) => ({
        value: project.key,
        label: project.name
      })));
    });
    fetchLabels().then((data) => {
      setLabels(data.map((label) => ({
        value: label,
        label: label
      })));
    });
  }, []);

  const loadIssues = async () => {
    const period = periods.find(p => p.name === selectedPeriod);
    const startDate = period ? period.startDate : null;
    const endDate = period ? period.endDate : null;

    const labelValues = selectedLabels.map(label => label.value);
    const data = await fetchIssues(selectedProject.value, startDate, endDate, labelValues);
    setIssues(data.issues);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Jira Metrics Dashboard</h1>

        {/* Select2 (React-Select) Projects Dropdown */}
        <div className="mb-4">
          <Select
            options={projects}
            value={selectedProject}
            onChange={setSelectedProject}
            placeholder="Select a Project..."
            className="w-full"
          />
        </div>

        {/* Period Selection */}
        <div className="mb-4">
          <select
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Period</option>
            {periods.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Label Filtering */}
        <div className="mb-4">
          <Select
            isMulti
            options={labels}
            value={selectedLabels}
            onChange={setSelectedLabels}
            placeholder="Filter by Labels..."
            className="w-full"
          />
        </div>

        <button
          onClick={loadIssues}
          className="w-full bg-blue-500 text-white py-2 py-2 rounded hover:bg-blue-600 transition"
        >
          Load Data
        </button>

        {/* Charts & Table */}
        <div className="mt-6">
          <Chart issues={issues} />
          <Table issues={issues} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
