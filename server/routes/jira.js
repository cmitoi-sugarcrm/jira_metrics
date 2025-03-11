const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const JIRA_API_BASE_URL = process.env.JIRA_API_BASE_URL;
const JIRA_AUTH = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');

const formatDateForJira = (date) => {
    if (!date) return null; // Return null if no date is provided
    const d = new Date(date);
    if (isNaN(d.getTime())) return null; // Ensure valid date before converting
    return d.toISOString().split("T")[0].replace(/-/g, "/"); // Converts to yyyy/MM/dd
};



router.get('/issues', async (req, res) => {
    const { projectKey, startDate, endDate, labels } = req.query;

    let jqlConditions = [`issuetype = "Bug"`]; // Ensures only bugs are retrieved

    if (projectKey) {
        jqlConditions.push(`project = "${projectKey}"`);
    }

    if (startDate && endDate) {
        const formattedStartDate = formatDateForJira(startDate);
        const formattedEndDate = formatDateForJira(endDate);
        jqlConditions.push(`created >= "${formattedStartDate}" AND created <= "${formattedEndDate}"`);
    }

    if (labels) {
        jqlConditions.push(`labels IN (${labels})`);
    }

    const jql = jqlConditions.join(" AND ");

    let allIssues = [];
    let startAt = 0;
    const maxResults = 100;

    try {
        while (true) {
            const response = await axios.get(`${JIRA_API_BASE_URL}/search`, {
                headers: { Authorization: `Basic ${JIRA_AUTH}`, Accept: 'application/json' },
                params: { jql, startAt, maxResults, fields: "summary,labels,status" },
            });

            allIssues = [...allIssues, ...response.data.issues];

            if (response.data.issues.length < maxResults) break;

            startAt += maxResults;
        }

        res.json({ total: allIssues.length, issues: allIssues });
    } catch (error) {
        console.error('Error fetching Jira issues:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch Jira issues' });
    }
});



/**
 * Fetch all Jira projects
 */
router.get('/projects', async (req, res) => {
    try {
        let allProjects = [];
        let startAt = 0;
        const maxResults = 50; // Safe limit per request

        while (true) {
            const response = await axios.get(`${JIRA_API_BASE_URL}/project/search`, {
                headers: {
                    Authorization: `Basic ${JIRA_AUTH}`,
                    Accept: 'application/json',
                },
                params: { startAt, maxResults },
            });

            allProjects = [...allProjects, ...response.data.values];

            if (response.data.values.length < maxResults) break;

            startAt += maxResults;
        }

        // Extract relevant project details
        const projects = allProjects.map(project => ({
            id: project.id,
            key: project.key,
            name: project.name,
        }));

        res.json(projects);
    } catch (error) {
        console.error('Error fetching Jira projects:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch Jira projects' });
    }
});


router.get('/labels', async (req, res) => {
    try {
        const response = await axios.get(`${JIRA_API_BASE_URL}/label`, {
            headers: {
                Authorization: `Basic ${JIRA_AUTH}`,
                Accept: 'application/json',
            }
        });

        res.json(response.data.values); // Jira API returns labels in `values`
    } catch (error) {
        console.error('Error fetching Jira labels:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch Jira labels' });
    }
});


module.exports = router;
