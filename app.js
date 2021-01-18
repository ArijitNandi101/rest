require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const server = app.listen(
    process.env.PORT,
    () => console.log(`server strted on port ${process.env.PORT}`)
);
