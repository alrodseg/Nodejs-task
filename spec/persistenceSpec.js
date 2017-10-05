const app = require('../src/server'); // never used but required
const persistence = require('../src/persistence');
const fs = require('fs');

describe('In the persistence module,', () => {
  describe('incrementBy', () => {
    it('should be able to increment a key by a certain amount', (done) => {
      let prev;
      persistence.getValue('random', (err, reply) => {
        prev = parseInt(reply, 10) || 0;
      });
      persistence.incrementBy('random', 5, (err, reply) => {
        expect(reply).toBe(prev + 5);
        done();
      });
    });

    it('should return an error when an invalid amount is entered', (done) => {
      persistence.incrementBy('random', 'a', (err, reply) => {
        expect(err).toBeDefined();
        done();
      });
    });
  });

  describe('getValue', () => {
    it('should return the value from the random key previously set', (done) => {
      persistence.getValue('random', (err, reply) => {
        expect(reply).toBeDefined();
        done();
      });
    });

    it('should return undefined when fetching an unset value', (done) => {
      persistence.getValue('hiophaso[gap{oihsd', (err, reply) => {
        expect(err).toBe(null);
        expect(reply).toBeDefined();
        done();
      });
    });
  });

  describe('storeInFile', () => {
    it('should return an error when executed with invalid JSON', (done) => {
      persistence.storeInFile('test.txt', 'asd', (err, reply) => {
        expect(err).toBeDefined();
        done();
      });
    });

    it('should increase count key when count parameter is present', (done) => {
      let prev;
      persistence.getValue('count', (err, reply) => {
        prev = parseInt(reply, 10) || 0;
      });

      persistence.storeInFile('test.txt', { count: '3' }, (err, reply) => {
        expect(reply).not.toBe('OK');
        expect(parseInt(reply, 10) - prev).toBe(3);
        done();
      });
    });

    it('should respond with OK when count parameter is missing', (done) => {
      persistence.storeInFile('test.txt', { another: 'text' }, (err, reply) => {
        expect(reply).toBe('OK');
        done();
      });
    });

    it('should append the data to the selected file', (done) => {
      const json = '{"brand":"bmw","color":"blue"}';
      persistence.storeInFile('test.txt', { brand: 'bmw', color: 'blue' }, (err, reply) => {
        const file = fs.readFileSync('./test.txt').toString();

        expect(file.substr(file.length - json.length)).toBe(json);
        done();
      });
    });
  });
});
