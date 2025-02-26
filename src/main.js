require("dotenv").config();
import express, { json } from "express";
const app = express();
import database from "../src/database/database";

app.use(json());

import userController from "../src/controllers/";

