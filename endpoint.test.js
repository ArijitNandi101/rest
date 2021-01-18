const { app, client, connect } = require("./app");
const supertest = require('supertest')
const request = supertest(app);

describe('post request to yk db', () => {
    beforeAll(async (done) => {
        connect().then(done); 
    });
    afterAll(async (done) => {
        await client.close();
        done();
    });
    test("db connection function adds database variables to app.locals", async (done) => {
        expect(app.locals.ykdb).not.toBe(undefined);
        expect(app.locals.ykdbCollectionNamesList).not.toBe(undefined);
        done();
    });
    it('content type', async (done) => {
        const response = await request.post('/yk/inventory');
        expect(response.status).toBe(400);
        expect(response.body.code).toBe(1);
        expect(response.body).toMatchResponsePayloadStructure(
            {"code": null,"msg": null,"records": null}
        );
        done();
    });
    it('collection name', async (done) => {
        const response = await (request.post('/yk/random')
        .set('Content-Type', 'application/json'));
        expect(response.status).toBe(400);
        expect(response.body.code).toBe(2);
        expect(response.body).toMatchResponsePayloadStructure(
            {"code": null,"msg": null,"records": null}
        );
        done();
    });
    it('no payload', async (done) => {
        const response = await (request.post('/yk/inventory')
        .set('Content-Type', 'application/json'));
        expect(response.status).toBe(400);
        expect(response.body.code).toBe(3);
        expect(response.body).toMatchResponsePayloadStructure(
            {"code": null,"msg": null,"records": null}
        );
        done();
    });
    it('missing payload value: startDate', async (done) => {
        const response = await (request.post('/yk/inventory')
        .set('Content-Type', 'application/json')
        .send({
            "endDate": "2018-02-02",
            "minCount": 3,
            "maxCount": 5
        }));
        expect(response.status).toBe(400);
        expect(response.body.code).toBe(3);
        expect(response.body).toMatchResponsePayloadStructure(
            {"code": null,"msg": null,"records": null}
        );
        done();
    });
    it('missing payload value: endDate', async (done) => {
        const response = await (request.post('/yk/inventory')
        .set('Content-Type', 'application/json')
        .send({
            "startDate": "2016-01-26",
            "minCount": 3,
            "maxCount": 5
        }));
        expect(response.status).toBe(400);
        expect(response.body.code).toBe(3);
        expect(response.body).toMatchResponsePayloadStructure(
            {"code": null,"msg": null,"records": null}
        );
        done();
    });
    it('missing payload value: minCount', async (done) => {
        const response = await (request.post('/yk/inventory')
        .set('Content-Type', 'application/json')
        .send({
            "startDate": "2016-01-26",
            "endDate": "2018-02-02",
            "maxCount": 5
        }));
        expect(response.status).toBe(400);
        expect(response.body.code).toBe(3);
        expect(response.body).toMatchResponsePayloadStructure(
            {"code": null,"msg": null,"records": null}
        );
        done();
    });
    it('missing payload value: maxCount', async (done) => {
        const response = await (request.post('/yk/inventory')
        .set('Content-Type', 'application/json')
        .send({
            "startDate": "2016-01-26",
            "endDate": "2018-02-02",
            "minCount": 3
        }));
        expect(response.status).toBe(400);
        expect(response.body.code).toBe(3);
        expect(response.body).toMatchResponsePayloadStructure(
            {"code": null,"msg": null,"records": null}
        );
        done();
    });
    it('wrong payload data format: startDate', async (done) => {
        const response = await (request.post('/yk/inventory')
        .set('Content-Type', 'application/json')
        .send({
            "startDate": "2016-01-26",
            "endDate": "2018-072-02",
            "minCount": 3,
            "maxCount": 5
        }));
        expect(response.status).toBe(400);
        expect(response.body.code).toBe(4);
        expect(response.body).toMatchResponsePayloadStructure(
            {"code": null,"msg": null,"records": null}
        );
        done();
    });
    it('wrong payload data format: endDate', async (done) => {
        const response = await (request.post('/yk/inventory')
        .set('Content-Type', 'application/json')
        .send({
            "startDate": "2016-01-26",
            "endDate": "2018--02-02",
            "minCount": 3,
            "maxCount": 5
        }));
        expect(response.status).toBe(400);
        expect(response.body.code).toBe(4);
        expect(response.body).toMatchResponsePayloadStructure(
            {"code": null,"msg": null,"records": null}
        );
        done();
    });
    it('wrong payload data format: minCount is a non-integer string', async (done) => {
        const response = await (request.post('/yk/inventory')
        .set('Content-Type', 'application/json')
        .send({
            "startDate": "2016-01-26",
            "endDate": "2018-02-02",
            "minCount": "a3",
            "maxCount": 5
        }));
        expect(response.status).toBe(400);
        expect(response.body.code).toBe(4);
        expect(response.body).toMatchResponsePayloadStructure(
            {"code": null,"msg": null,"records": null}
        );
        done();
    });
    it('playload format: minCount is integer string', async (done) => {
        const response = await (request.post('/yk/inventory')
        .set('Content-Type', 'application/json')
        .send({
            "startDate": "2016-01-26",
            "endDate": "2018-02-02",
            "minCount": "3",
            "maxCount": 5
        }));
        expect(response.status).toBe(400);
        expect(response.body.code).toBe(4);
        expect(response.body).toMatchResponsePayloadStructure(
            {"code": null,"msg": null,"records": null}
        );
        done();
    });
    it('wrong payload data format: maxCount is null', async (done) => {
        const response = await (request.post('/yk/inventory')
        .set('Content-Type', 'application/json')
        .send({
            "startDate": "2016-01-26",
            "endDate": "2018-02-02",
            "minCount": 3,
            "maxCount": null
        }));
        expect(response.status).toBe(400);
        expect(response.body.code).toBe(4);
        expect(response.body).toMatchResponsePayloadStructure(
            {"code": null,"msg": null,"records": null}
        );
        done();
    });
    it('wrong payload data format: maxCount is negative', async (done) => {
        const response = await (request.post('/yk/inventory')
        .set('Content-Type', 'application/json')
        .send({
            "startDate": "2016-01-26",
            "endDate": "2018-02-02",
            "minCount": 3,
            "maxCount": -20
        }));
        expect(response.status).toBe(400);
        expect(response.body.code).toBe(4);
        expect(response.body).toMatchResponsePayloadStructure(
            {"code": null,"msg": null,"records": null}
        );
        done();
    });
    it('wrong payload data format: maxCount is a float', async (done) => {
        const response = await (request.post('/yk/inventory')
        .set('Content-Type', 'application/json')
        .send({
            "startDate": "2016-01-26",
            "endDate": "2018-02-02",
            "minCount": 3,
            "maxCount": 2.3
        }));
        expect(response.status).toBe(400);
        expect(response.body.code).toBe(4);
        expect(response.body).toMatchResponsePayloadStructure(
            {"code": null,"msg": null,"records": null}
        );
        done();
    });
    it('correct payload format', async (done) => {
        const response = await (request.post('/yk/inventory')
        .set('Content-Type', 'application/json')
        .send({
            "startDate": "2016-01-26",
            "endDate": "2018-02-02",
            "minCount": 3,
            "maxCount": 5
        }));
        expect(response.status).toBe(200);
        expect(response.body.code).toBe(0);
        expect(response.body).toMatchResponsePayloadStructure(
            {"code": null,"msg": null,"records": null}
        );
        done();
    });
});
// describe('POST /inventory', function() {
//     it('responds with json', function(done) {
//       request(app)
//         .post('/yk/inventory')
//         .set('Accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .end(function(err, res) {
//             if (err) return done(err);
//             return done();
//         });
//     });
//   });