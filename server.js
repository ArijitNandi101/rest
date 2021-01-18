const { app, client, connect } = require("./app");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const swaggerOptions = require("./config/swagger");

let swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));

let server = null;
/**
 * after successu connection, the express server is started on PORT
 * provided in environment configuration
 */
connect().then(() => {
    server = app.listen(
        process.env.PORT,
        async () => {
            console.log(`server strted on port ${process.env.PORT}`);
        }
    );
}).catch((err) => {
    console.log(err.stack)
    process.emit("SIGINT");
});

/**
 * on receiving a interrupt the application closes database connection if open
 * and stops server if running and exits.
 */
process.on('SIGINT', async function(code) {
    console.log("Closing database client connection.");
    await client.close();
    if(server) server.close();
    console.log("Database Connection closed. Exiting.");
    process.exit();
});

module.exports = server;