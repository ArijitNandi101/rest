const { app, client, connect } = require("./app");
let server = null;
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

process.on('SIGINT', async function(code) {
    console.log("Closing database client connection.");
    await client.close();
    if(server) server.close();
    console.log("Database Connection closed. Exiting.");
    process.exit();
});

module.exports = server;