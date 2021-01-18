require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const ykRouter = require("./routes/yk");

app.use(express.json());
app.use("/yk",ykRouter);

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
});

process.on('SIGINT', async function(code) {
    console.log("Closing database client connection.")
    await client.close();
    console.log("Database Connection closed. Exiting.");
    process.exit();
});