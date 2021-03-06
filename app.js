require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const mongodbConfig = require("./config/mongodb");
const app = express();
const ykdbRouter = require("./routes/ykdb");

//application-level middleware
app.use(express.json());
app.use("/yk",ykdbRouter);

const client = new MongoClient(
    process.env.DATABASE_URI,
    mongodbConfig,
);
/**
 *  Uses a MongoClient object to connect to a database uri as speciied in the environment configuration.
 *  After successful connection, queries the database and saves the names of all collections to be used 
 *  for request validation later.
 * @returns {Promise} - the promise is resolved after a successful database connection otherwise rejected 
 */
function connect(){
    return new Promise((resolve,reject) => {
        client.connect(
            async function(err) {
            if(err){
                console.log(err.stack)
                reject(err);
            }
            app.locals.ykdb = client.db();
            let cursor = await app.locals.ykdb.listCollections();
            let collections = await cursor.toArray();
            app.locals.ykdbCollectionNamesList = [];
            for(let collection of collections){
                app.locals.ykdbCollectionNamesList.push(collection.name);
            }
            resolve();
        })
    });
}

module.exports = {
    app: app,
    client: client,
    connect: connect
}