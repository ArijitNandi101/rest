require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const mongodbConfig = require("./config/mongodb");
const app = express();
const ykdbRouter = require("./routes/ykdb");

app.use(express.json());
app.use("/yk",ykdbRouter);

const client = new MongoClient(
    process.env.DATABASE_URI,
    mongodbConfig,
);
async function connect(callBack){
    await client.connect(
        async function(err) {
        console.log("trying connection.");
        if(err){
            console.error(err.stack);
            console.log("connection failed.");
            process.emit("SIGINT");
            return;
        }
        console.log("client connected.");
        app.locals.ykdb = client.db();
        let cursor = await app.locals.ykdb.listCollections();
        let collections = await cursor.toArray();
        app.locals.ykdbCollectionNamesList = [];
        for(let collection of collections){
            app.locals.ykdbCollectionNamesList.push(collection.name);
        }
        if(callBack) callBack();
    });
}

module.exports = {
    app: app,
    client: client,
    connect: connect
}