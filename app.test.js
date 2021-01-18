const { client, connect, app } = require("./app");

test("client has proper db URI", () => {
    expect(client.s.url).toBe(process.env.DATABASE_URI);
});