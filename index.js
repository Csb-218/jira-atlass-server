const express = require('express');
require('dotenv').config()
const app = express();
const axios = require("axios")
const PORT = process.env.PORT;
const cors = require('cors');


// Define routes here

const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN
const jiraDomain = process.env.JIRA_DOMAIN;
const email = process.env.JIRA_EMAIL;

const jql = "status%20in%20(%22In%20progress%22%2C%20%22To%20do%22)%20OR%20assignee%20%3D%20currentUser()%20order%20by%20status";

const apiUrl = `https://${jiraDomain}/rest/api/3/search?jql=${jql}`;

app.use(cors());
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/issues/all', async (req, res) => {

    const response = await axios.get(apiUrl, {
        headers: {
            Authorization: `Basic ${Buffer.from(
                `${email}:${JIRA_API_TOKEN}`
            ).toString("base64")}`,
            Accept: "application/json",
        },
    });



    const {data} = await response;
    const { issues } = data;

    let cleanedIssues = [];
    issues.forEach((issue) => {
        const issueData = {
            id: issue.id,
            projectName: issue.fields.project.name,
            status: issue.fields.status.name,
            deadline: issue.fields.duedate,
        };
        cleanedIssues.push(issueData);
    });
    res.status(200).json(data);
})

