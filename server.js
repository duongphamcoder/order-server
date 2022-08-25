const { json } = require("express");
const express = require("express");
const cors = require("cors");
const app = express();

const connectServer = require("./config");

app.use(express.urlencoded());
app.use(json());
app.use(cors());

connectServer(app);
