require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();

app.use(express.json());

const server = app.listen(
    process.env.PORT,
    () => console.log(`server strted on port ${process.env.PORT}`)
);

const client = new MongoClient(
    process.env.DATABASE_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
);
client.connect(async function(err) {
    console.log("trying connection");
    if(err){
        console.error(err.stack);
        client.close();
        server.close();
        console.log("connection failed")
        return;
    }
    console.log("client connected");
});

process.on('SIGINT', (code) => {
    client.close();
    console.log(`Database Connection closed. Exiting with code: ${code}`);
    process.exit();
});