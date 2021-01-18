// Extended: https://swagger.io/specification/#infoObject
module.exports = {
    swaggerDefinition: {
        components: {},
        info: {
            title: "Demo REST API Application",
            descrition: `A RESTful API with a single endpoint that 
                        fetches the data in the provided  MongoDB 
                        collection and return the results in the 
                        requested format.`,
            contact: {
                name: "Arijit Nandi",
                email: "arijitn001@gmail.com"
            },
            servers: ["http://localhost:3030"],
            version: "1.0.0"
        }
    },
    apis: ["app.js","./routes/*.js"]
};