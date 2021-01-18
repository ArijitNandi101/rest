const { app, client, connect } = require("./app");

const server = app.listen(
    process.env.PORT,
    async () => {
        console.log(`server strted on port ${process.env.PORT}`);
        await connect();
    }
);

process.on('SIGINT', async function(code) {
    console.log("Closing database client connection.");
    await client.close();
    await server.close();
    console.log("Database Connection closed. Exiting.");
    process.exit();
});

module.exports = server;