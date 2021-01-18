require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const ykdbRouter = require("./routes/ykdb");

app.use(express.json());
app.use("/yk",ykdbRouter);

const server = app.listen(
    process.env.PORT,
    () => console.log(`server strted on port ${process.env.PORT}`)
);

const client = new MongoClient(
    process.env.DATABASE_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
);
client.connect(async function(err) {
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
});

process.on('SIGINT', async function(code) {
    console.log("Closing database client connection.")
    await client.close();
    console.log("Database Connection closed. Exiting.");
    process.exit();
});