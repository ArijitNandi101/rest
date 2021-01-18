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
        client.close();
        server.close();
        console.log("connection failed.")
        return;
    }
    console.log("client connected.");
    app.locals.yk = client.db(); 
});

process.on('SIGINT', async function(code) {
    console.log("Closing database client connection.")
    await client.close();
    console.log(`Database Connection closed. Exiting with code: ${code}`);
    process.exit();
});