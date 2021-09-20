import { app } from '../index';
import request from 'supertest';

// these tests are performed on test collection set in database
// just for testing purpose
describe('Api endpoints tests', () => {

  it('Hello World API Request', async () => {
    const response = await request(app).get('/');
    expect(response.text).toEqual('Hello World!');
    expect(response.status).toEqual(200);
  });

  it('Fetch all test docs', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual("Data Fetched");
    expect(response.body.data.length).toEqual(6);
  });

  it('Fetch one test doc based on id', async () => {
    const response = await request(app).get('/test/1');
    expect(response.status).toEqual(200);
    expect(response.body.code).toEqual("Data Fetched");
  });

  it('Gives error on wrong id', async () => {
    const response = await request(app).get('/test/6');
    expect(response.status).toEqual(400);
    expect(response.body.code).toEqual("ServerError");
  });
});

