import React, { useEffect, useState } from "react";
import {
    fetchPeriods, fetchProjects, fetchBugTrends, fetchPriorityBreakdown, fetchOpenClosedBugs, fetchResolutionTime
} from "../api/api";
import ProjectSelector from "../components/ProjectSelector";
import BugTrendsTable from "../components/BugTrendsTable";
import BugTrendsChart from "../components/BugTrendsChart";
// import PriorityBreakdownChart from "../components/PriorityBreakdownChart";
// import OpenClosedBugsChart from "../components/OpenClosedBugsChart";

const Insights = () => {
    const [periods, setPeriods] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [issuesByPeriod, setIssuesByPeriod] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPeriods()
            .then(setPeriods)
            .catch(() => setError("Failed to fetch periods"));

        fetchProjects()
            .then((data) => {
                setProjects(data.map(project => ({ value: project.key, label: project.name })));
            })
            .catch(() => setError("Failed to fetch projects"));
    }, []);

    const loadInsights = async () => {
        if (!periods.length || loading) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const projectKeys = selectedProjects.map(project => project.value).join(",");

            const bugTrendsData = await fetchBugTrends(periods, projectKeys);
            setIssuesByPeriod(bugTrendsData);
        } catch (err) {
            setError("Failed to load insights");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Insights - Bug Analysis</h1>

                {/* Project Selection */}
                <ProjectSelector
                    projects={projects}
                    selectedProjects={selectedProjects}
                    setSelectedProjects={setSelectedProjects}
                />

                <button
                    onClick={loadInsights}
                    disabled={loading}
                    className={`w-full px-6 py-2 rounded-lg transition ${
                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                >
                    {loading ? "Loading..." : "Load Insights"}
                </button>

                {/* Error Message */}
                {error && <div className="mt-4 text-red-600">{error}</div>}

                {/* Loading Indicator */}
                {loading && <div className="mt-4 text-gray-700">Fetching data, please wait...</div>}

                {/* Bug Trends Table */}
                {!loading && !error && issuesByPeriod.length > 0 && (
                    <>
                        <BugTrendsTable issuesByPeriod={issuesByPeriod} />
                        <BugTrendsChart issuesByPeriod={issuesByPeriod} />
                    </>
                )}
            </div>
        </div>
    );
};

export default Insights;
