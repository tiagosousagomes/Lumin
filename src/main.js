require("dotenv").config();
const express = require("express");
const app = express();
const database = require("../src/database/database");

app.use(express.json());

const userController = require("../src/controllers/")

