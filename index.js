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

const jql = "project%20%3D%20HSP";

const apiUrl = `https://${jiraDomain}/rest/api/3/search`;

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

    console.log(response?.data)

    const {data} = await response;
    
    res.status(200).json({ issues: data});
})

