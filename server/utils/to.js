/**
 * Handler which takes a promise and resolves with array signature `[result, err]`.
 * @param  {Promise} promise    Promise to handle
 * @param  {Boolean} extractErrorString Whether or not return the error message instead of error object.
 * @return {Promise<Array>}     Array with signature `[result, err]`
 */
module.exports = (promise, extractErrorString) => {
  return promise
    .then(data => {
      return [data, null];
    })
    .catch(err => {
      // console.error('Await error:', err);
      if (err instanceof Error && extractErrorString) {
        err = err.message || String(err);
      }
      return [undefined, err];
    });
};
