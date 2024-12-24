const { default: axios } = require("axios");
const express = require("express");

const app = express();

const daprUrl = `http://localhost:3500/v1.0`;
const stateStoreName = `statestore`;
const stateUrl = `http://localhost:3500/v1.0/state/${stateStoreName}`;


app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.get("/metadata", async (req, res) => {
	const response = await axios.get(daprUrl + "/metadata");
	return res.json(response.data);
});

app.get('/healthz', async (req,res) => {
	const response = await axios.get(daprUrl + "/healthz");
	return res.json(response.data)
})

app.listen(7200, "0.0.0.0", () => {
	console.log("Server started on port " + 7200);
});
