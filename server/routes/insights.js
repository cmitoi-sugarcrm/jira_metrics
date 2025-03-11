const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();
const JIRA_API_BASE_URL = process.env.JIRA_API_BASE_URL;
const JIRA_AUTH = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');

// Jira fixed statuses
const FIXED_STATUSES = ["Done", "Resolved", "Closed"];
// Priority levels
const PRIORITY_LABELS = ["P0", "P1", "P2", "P3", "P4"];

const formatDateForJira = (date) => {
    if (!date) return null; // Return null if no date is provided
    const d = new Date(date);
    if (isNaN(d.getTime())) return null; // Ensure valid date before converting
    return d.toISOString().split("T")[0].replace(/-/g, "/"); // Converts to yyyy/MM/dd
};


/**
 * Fetch issues from Jira with pagination handling
 */
const fetchAllIssues = async (jql) => {
    let allIssues = [];
    let startAt = 0;
    const maxResults = 100;

    // Ensure we are only searching for bugs
    const bugFilter = `issuetype = "Bug"`;
    jql = jql ? `${jql} AND ${bugFilter}` : bugFilter;

    try {
        while (true) {
            const response = await axios.get(`${JIRA_API_BASE_URL}/search`, {
                headers: { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
                params: { jql, startAt, maxResults, fields: "summary,labels,status,created,resolutiondate" },
            });

            allIssues = [...allIssues, ...response.data.issues];
            if (response.data.issues.length < maxResults) break;
            startAt += maxResults;
        }
        return allIssues;
    } catch (error) {
        console.error('Error fetching Jira issues:', error.response?.data || error.message);
        return [];
    }
};


/**
 * Get bug trends over periods
 */
router.get('/bug-trends', async (req, res) => {
    try {
        const { projectKey, periods } = req.query;
        const parsedPeriods = JSON.parse(periods);

        const periodData = await Promise.all(parsedPeriods.map(async (period) => {
            let jqlConditions = [`issuetype = "Bug"`]; // Ensure only bugs are counted

            if (projectKey) {
                const projectsQuery = `project IN (${projectKey.split(",").map(key => `"${key}"`).join(", ")})`;
                jqlConditions.push(projectsQuery);
            }

            jqlConditions.push(`created >= "${formatDateForJira(period.startDate)}" AND created <= "${formatDateForJira(period.endDate)}"`);

            const jql = jqlConditions.join(" AND ");

            console.log(`Fetching bug trends for projects: ${projectKey || "All Projects"}, Period: ${period.name}`);

            const issues = await fetchAllIssues(jql);

            // Remove duplicate issues that may exist across projects
            const uniqueIssues = new Map(issues.map(issue => [issue.id, issue]));

            // Count total filed and fixed
            const filedCount = uniqueIssues.size;
            const fixedCount = [...uniqueIssues.values()].filter(issue =>
                FIXED_STATUSES.includes(issue.fields.status?.name)
            ).length;

            // Count filed and fixed issues per priority
            const priorityCounts = PRIORITY_LABELS.reduce((acc, priority) => {
                acc[`${priority}_Filed`] = [...uniqueIssues.values()].filter(issue => issue.fields.labels.includes(priority)).length;
                acc[`${priority}_Fixed`] = [...uniqueIssues.values()].filter(issue =>
                    issue.fields.labels.includes(priority) && FIXED_STATUSES.includes(issue.fields.status?.name)
                ).length;
                return acc;
            }, {});

            // Count issues without a priority label
            const noLabelFiled = [...uniqueIssues.values()].filter(issue =>
                !issue.fields.labels.some(label => PRIORITY_LABELS.includes(label))
            ).length;
            const noLabelFixed = [...uniqueIssues.values()].filter(issue =>
                !issue.fields.labels.some(label => PRIORITY_LABELS.includes(label)) &&
                FIXED_STATUSES.includes(issue.fields.status?.name)
            ).length;

            return {
                name: period.name,
                Filed: filedCount,
                Fixed: fixedCount,
                ...priorityCounts,
                NL_Filed: noLabelFiled,
                NL_Fixed: noLabelFixed
            };
        }));

        res.json(periodData);
    } catch (error) {
        console.error('Error fetching bug trends:', error);
        res.status(500).json({ error: 'Failed to fetch bug trends' });
    }
});




/**
 * Get bug breakdown by priority (Filed vs Fixed)
 */
router.get('/priority-breakdown', async (req, res) => {
    try {
        const { projectKey, periods } = req.query;
        const parsedPeriods = periods ? JSON.parse(periods) : [];

        let jqlConditions = [];

        if (projectKey) {
            const projectsQuery = projectKey.split(",").map(key => `project = "${key}"`).join(" OR ");
            jqlConditions.push(projectsQuery);
        }

        if (parsedPeriods.length) {
            const periodQueries = parsedPeriods.map(period =>
                `(created >= "${formatDateForJira(period.startDate)}" AND created <= "${formatDateForJira(period.endDate)}")`
            );
            jqlConditions.push(`(${periodQueries.join(" OR ")})`);
        }

        const jql = jqlConditions.length ? jqlConditions.join(" AND ") : "";

        console.log(`Fetching priority breakdown for project: ${projectKey || "All Projects"}, Periods: ${periods || "All Time"}`);

        const issues = await fetchAllIssues(jql);

        const groupedData = PRIORITY_LABELS.map(priority => {
            const filedCount = issues.filter(issue => issue.fields.labels.includes(priority)).length;
            const fixedCount = issues.filter(issue =>
                issue.fields.labels.includes(priority) && FIXED_STATUSES.includes(issue.fields.status?.name)
            ).length;

            return { name: priority, Filed: filedCount, Fixed: fixedCount };
        });

        // Issues without a priority label
        const noLabelFiled = issues.filter(issue =>
            !issue.fields.labels.some(label => PRIORITY_LABELS.includes(label))
        ).length;

        const noLabelFixed = issues.filter(issue =>
            !issue.fields.labels.some(label => PRIORITY_LABELS.includes(label)) &&
            FIXED_STATUSES.includes(issue.fields.status?.name)
        ).length;

        groupedData.push({ name: "No Label", Filed: noLabelFiled, Fixed: noLabelFixed });

        res.json(groupedData);
    } catch (error) {
        console.error('Error fetching priority breakdown:', error);
        res.status(500).json({ error: 'Failed to fetch priority breakdown' });
    }
});


/**
 * Get open vs closed bug counts
 */
router.get('/open-closed-bugs', async (req, res) => {
    try {
        const { projectKey, periods } = req.query;
        const parsedPeriods = periods ? JSON.parse(periods) : [];

        let jqlConditions = [];

        if (projectKey) {
            const projectsQuery = projectKey.split(",").map(key => `project = "${key}"`).join(" OR ");
            jqlConditions.push(projectsQuery);
        }

        if (parsedPeriods.length) {
            const periodQueries = parsedPeriods.map(period => 
                `(created >= "${formatDateForJira(period.startDate)}" AND created <= "${formatDateForJira(period.endDate)}")`
            );
            jqlConditions.push(`(${periodQueries.join(" OR ")})`);
        }

        const jql = jqlConditions.length ? jqlConditions.join(" AND ") : "";

        console.log(`Fetching open vs closed bugs for project: ${projectKey || "All Projects"}, Periods: ${periods || "All Time"}`);

        const issues = await fetchAllIssues(jql);

        const openCount = issues.filter(issue => !FIXED_STATUSES.includes(issue.fields.status?.name)).length;
        const closedCount = issues.filter(issue => FIXED_STATUSES.includes(issue.fields.status?.name)).length;

        res.json({ open: openCount, closed: closedCount });
    } catch (error) {
        console.error('Error fetching open vs closed bugs:', error);
        res.status(500).json({ error: 'Failed to fetch open vs closed bugs' });
    }
});


/**
 * Get average resolution time per period
 */
router.get('/resolution-time', async (req, res) => {
    try {
        const { projectKey, periods } = req.query;
        const parsedPeriods = JSON.parse(periods);

        const resolutionTimes = await Promise.all(parsedPeriods.map(async (period) => {
            let jqlConditions = [];

            if (projectKey) {
                const projectsQuery = projectKey.split(",").map(key => `project = "${key}"`).join(" OR ");
                jqlConditions.push(projectsQuery);
            }

            jqlConditions.push(`created >= "${formatDateForJira(period.startDate)}" AND created <= "${formatDateForJira(period.endDate)}"`);
            jqlConditions.push(`status IN (${FIXED_STATUSES.map(s => `"${s}"`).join(", ")})`);

            const jql = jqlConditions.join(" AND ");

            console.log(`Fetching resolution time for project: ${projectKey || "All Projects"}, Period: ${period.name}`);

            const issues = await fetchAllIssues(jql);

            const totalDays = issues.reduce((sum, issue) => {
                if (!issue.fields.resolutiondate) return sum;
                const created = new Date(issue.fields.created);
                const resolved = new Date(issue.fields.resolutiondate);
                return sum + (resolved - created) / (1000 * 60 * 60 * 24); // Convert ms to days
            }, 0);

            return { name: period.name, AvgDays: issues.length ? (totalDays / issues.length).toFixed(2) : 0 };
        }));

        res.json(resolutionTimes);
    } catch (error) {
        console.error('Error fetching resolution time:', error);
        res.status(500).json({ error: 'Failed to fetch resolution time' });
    }
});


module.exports = router;
