var zlib = require('zlib');

function decompress(data, callback) {
  zlib.inflate(new Buffer(data, 'base64'), function (err, buffer) {
    if (err) {
      callback(err);
    } else {
      try {
        var data = JSON.parse(buffer.toString());
        if (data.errors) {
          callback(data);
        } else {
          callback(null, data);
        }
      } catch (e) {
        callback(new Error('Can\'t parse data.'));
      }
    }
  });
}

function receiveResponse(response, callback) {
  try {
    const err = JSON.parse(response);
    callback(err);
  } catch (e) { // not error than decompress response
    decompress(response, callback);
  }
}

function compress(data, callback) {
  zlib.deflate(JSON.stringify(data), function (err, buffer) {
    if (err) {
      callback(err);
    } else {
      callback(null, buffer.toString('base64'));
    }
  });
}

function stringifyError(err) {
  return JSON.stringify({
    errors: err.name,
    message: err.message,
    stack: err.stack,
  });
}

function sendResponse(callbackFunction, err, data) {
  // if we are trying to sendResponse success response
  if (data && err === null) {
    compress(data, (err, result) => {
      if (err) {
        callbackFunction(stringifyError(err));
        return;
      }
      callbackFunction(null, { data: result });
    });
    return;
  }

  // if we are trying to respond with instance of Error
  if (err instanceof Error) {
    callbackFunction(stringifyError(err));
    return;
  }

  // if we are trying to sendResponse error object
  if (Object.prototype.toString(err) === '[object Object]') {
    callbackFunction(JSON.stringify(err));
    return;
  }
}

module.exports = {
  receiveResponse,
  sendResponse,
  decompress,
  compress,
};
