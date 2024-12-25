const { default: axios } = require("axios");
const express = require("express");
const bodyparser = require("body-parser");
const app = express();

const daprUrl = process.env.NODE_DAPR;
const stateStoreName = `statestore`;
const stateUrl = `http://localhost:3500/v1.0/state/${stateStoreName}`;

app.use(bodyparser.json());

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.get("/metadata", async (req, res) => {
	const response = await axios.get(daprUrl + "/metadata");
	return res.json(response.data);
});

app.get("/healthz", async (req, res) => {
	const response = await axios.get(daprUrl + "/healthz");
	return res.json(response.data);
});

//statestore
app.post("/statestore", async (req, res) => {
	const { key, value } = req.body;
	console.log(req.body);

	if (!key || !value) {
		return res.status(400).json({ status: "Bad Data" });
	}

	try {
		const state = [
			{
				key: key,
				value: value,
			},
		];

		await axios.post(stateUrl, state);
		return res.status(201).json({ status: "state saved" });
	} catch (error) {
		res.status(500).json(error);
	}
});

//get state
app.get("/statestore/:key", async (req, res) => {
	const { key } = req.params;

	try {
		const response = await axios.get(`${stateUrl}/${key}`);
		console.log(response.data);

		if (response.data) {
			res.json({ key: key, value: response.data });
		} else {
			res.status(404).json({ error: "Key not found" });
		}
	} catch (err) {
		if (error.response && error.response.status === 404) {
			res.status(404).json({ error: "Key not found" });
		} else {
			res.status(500).json({ error: error.message });
		}
	}
});

app.listen(7200, "0.0.0.0", () => {
	console.log("Server started on port " + 7200);
});
