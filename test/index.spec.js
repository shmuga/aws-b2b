const assert = require('assert');

const lib = require('../src');

describe('test for lib', () => {
  it('should compress', (cb) => {
    lib.compress({}, (err, result) => {
      assert.equal(null, err);
      assert.equal(result, 'eJyrrgUAAXUA+Q==');
      cb();
    });
  });

  it('should decompress', (cb) => {
    lib.decompress('eJyrrgUAAXUA+Q==', (err, result) => {
      assert.equal(null, err);
      assert.equal(JSON.stringify(result), "{}");
      cb();
    });
  });

  it('should compress and decompress', (cb) => {
    const obj = { data: 'ShouldBeDecompressed' } ;
    lib.compress(obj, (err, result) => {
      assert.equal(err, null);
      lib.decompress(result, (err, result) => {
        assert.equal(null, err);
        assert.equal(JSON.stringify(obj), JSON.stringify(result));
        cb();
      });
    });
  });

  it('should make success response', (cb) => {
    lib.sendResponse((err, result) => {
      assert.notEqual(null, result);
      assert.equal(result.data, 'eJyrVkpKLFKyApO1ABzdBCU=');
      cb();
    }, null, { bar: 'bar' });
  });

  it('should make error response for default error', (cb) => {
    lib.sendResponse((err, result) => {
      assert.notEqual(null, err);
      const parsedError = JSON.parse(err);
      assert.equal(parsedError.errors, 'Error');
      assert.equal(parsedError.message, 'Error happens');
      assert.notEqual(parsedError.stack, null);
      cb();
    }, new Error('Error happens'));
  });

  it('should make error response for object', (cb) => {
    lib.sendResponse((err, result) => {
      assert.notEqual(null, err);
      const parsedError = JSON.parse(err);
      assert.equal(parsedError.bar, 'baz');
      cb();
    }, { bar: 'baz' });
  });
});

