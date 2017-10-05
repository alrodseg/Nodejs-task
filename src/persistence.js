const redis = require('redis');
const fs = require('fs');

let client; // redis client object

// stringify with callback for any json size
function stringifyJson(data, next) {
  if (!data) {
    next(new Error('Invalid JSON object.'));
  } else {
    next(null, JSON.stringify(data));
  }
}

function connect(host, port) {
  client = redis.createClient(port, host, {
    retry_strategy(options) {
      // Errors for debugging
      // For production must be reviewed to ensure maximum uptime
      if (options.error && options.error.code === 'ECONNREFUSED') {
        return new Error('The server refused the connection');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        return new Error('Retry time exhausted');
      }
      if (options.attempt > 10) {
        return new Error('Reconnection attempts exhausted');
      }
      // reconnect after (ms)
      console.log('Database connection lost. Attempting to reconnect...');
      return Math.min(options.attempt * 200, 3000);
    },
  });

  client.on('connect', () => {
    console.log(`Successfully connected to database at ${host}:${port}.`);
  });
}

function getValue(key, callback) {
  console.log(`Attempting to fetch ${key} key...`);
  client.get(key, callback);
}

function incrementBy(key, amount, callback) {
  console.log(`Attempting to increment ${key} key by ${amount}...`);
  client.incrby(key, amount, callback);
}

// Appends JSON content from parameter "data" in the file "path"
// Path should be reviewed to work in different OS
function storeInFile(path, data, callback) {
  stringifyJson(data, (err, reply) => {
    console.log(`Attempting to append data to file at ${path}...`);
    fs.appendFile(path, reply, (err) => {
      if (err) {
        callback(new Error('JSON string couldn\'t be appended to the file.'));
      } else if (Object.prototype.hasOwnProperty.call(data, 'count')) {
        console.log('Data successfully stored. Count value FOUND.');
        incrementBy('count', data.count, callback);
      } else {
        console.log('Data successfully stored. Count value NOT FOUND.');
        callback(null, 'OK');
      }
    });
  });
}

module.exports = {
  connect,
  getValue,
  incrementBy,
  storeInFile,
};
