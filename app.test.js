const { app } = require('./app')
const supertest = require('supertest')
const request = supertest(app);

it('test post end point', async (done) => {
    const response = await request.post('/yk/inventory');
    expect(response.status).toBe(400);
    expect(response.body.code).toBe(1);
    expect(response.body).toMatchResponsePayloadStructure(
        {"code": null,"msg": null,"records": null}
    );
    done();
});

it('test post end point', async (done) => {
    const response = await (request.post('/yk/inventory')
    .set('Content-Type', 'application/json'));
    console.log(response.body);
    //expect(response.status).toBe(400);
    //expect(response.body.code).toBe(2);
    expect(response.body).toBe(
        {"code": null,"msg": null,"records": null}
    );
    done();
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