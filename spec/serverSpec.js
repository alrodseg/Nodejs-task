const request = require('request');
const fs = require('fs');
const app = require('../src/server'); // never used but required

const baseUrl = 'http://127.0.0.1:8888';

describe('GET /count', () => {
  it('should return 200 on GET', (done) => {
    request.get(`${baseUrl}/count`, (error, response, body) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should only return a series of numbers', (done) => {
    request.get(`${baseUrl}/count`, (error, response, body) => {
      expect(body).toBeDefined();
      expect(body).toMatch('[0-9]*'); // must be numbers
      expect(body).not.toMatch('^(?!.*[0-9])'); // must not contain other characters than numbers
      done();
    });
  });

  it('should return 403 on POST', (done) => {
    request.post(`${baseUrl}/count`, { json: true, body: {} }, (error, response, body) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  it('should return 403 on PUT', (done) => {
    request.put(`${baseUrl}/count`, { json: true, body: {} }, (error, response, body) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  it('should return 403 on PATCH', (done) => {
    request.patch(`${baseUrl}/count`, { json: true, body: {} }, (error, response, body) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  it('should return 403 on DELETE', (done) => {
    request.delete(`${baseUrl}/count`, { json: true, body: {} }, (error, response, body) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });
});

describe('POST /track', () => {
  it('should return 201 on POST', (done) => {
    request.post(`${baseUrl}/track`, { json: true, body: {} }, (error, response, body) => {
      expect(response.statusCode).toBe(201);
      done();
    });
  });

  it('should increase count key when count parameter is present', (done) => {
    let count;
    request.get(`${baseUrl}/count`, (error, response, body) => {
      count = parseInt(body, 10);
    });

    request.post(`${baseUrl}/track`, { json: true, body: { count: '3' } }, (error, response, body) => {
      expect(body).not.toBe('OK');
      expect(parseInt(body, 10) - count).toBe(3);
      done();
    });
  });

  it('should respond with OK when count parameter is missing', (done) => {
    request.post(`${baseUrl}/track`, { json: true, body: { another: 'text' } }, (error, response, body) => {
      expect(body).toBe('OK');
      done();
    });
  });

  it('should append the data to the selected file', (done) => {
    const json = '{"brand":"bmw","color":"blue"}';
    request.post(`${baseUrl}/track`, { json: true, body: { brand: 'bmw', color: 'blue' } }, (error, response, body) => {
      const file = fs.readFileSync('./test.txt').toString();

      expect(file.substr(file.length - json.length)).toBe(json);
      done();
    });
  });

  it('should return 403 on GET', (done) => {
    request.get(`${baseUrl}/track`, (error, response, body) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  it('should return 403 on PUT', (done) => {
    request.put(`${baseUrl}/track`, { json: true, body: {} }, (error, response, body) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  it('should return 403 on PATCH', (done) => {
    request.patch(`${baseUrl}/track`, { json: true, body: {} }, (error, response, body) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  it('should return 403 on DELETE', (done) => {
    request.delete(`${baseUrl}/track`, { json: true, body: {} }, (error, response, body) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });
});

describe('HTTP methods elsewhere', () => {
  it('should return 403 on GET', (done) => {
    request.get(`${baseUrl}`, (error, response, body) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  it('should return 403 on POST', (done) => {
    request.post(`${baseUrl}`, { json: true, body: {} }, (error, response, body) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  it('should return 403 on PUT', (done) => {
    request.put(`${baseUrl}`, { json: true, body: {} }, (error, response, body) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  it('should return 403 on PATCH', (done) => {
    request.patch(`${baseUrl}`, { json: true, body: {} }, (error, response, body) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  it('should return 403 on DELETE', (done) => {
    request.delete(`${baseUrl}`, { json: true, body: {} }, (error, response, body) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });
});
