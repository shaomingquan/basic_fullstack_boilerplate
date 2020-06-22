const isNodeError = err =>
  err instanceof TypeError ||
  err instanceof RangeError ||
  err instanceof ReferenceError ||
  err instanceof SyntaxError;

const extractErrorString = err => {
  if (isNodeError(err)) {
    return err.message;
  } else {
    if (err instanceof Error) return err.message || String(err);
    else return err;
  }
};

module.exports = app => {
  /* centralized error handling:
   *   write error to log file
   *   save error and request information to database if ctx.request match condition
   *   ...
   */
  app.on("error", (err, ctx) => {
    /**
     * report to ac.in, sentry, pm2 log files
     */
    if (isNodeError(err)) {
      console.error("JS runtime error: ", err);
    } else {
      /**
       * you should know every app error, so reporters ignore it
       */
      console.error("App error: ", err);
    }
  });

  // middleware to catch all errors
  return async (ctx, next) => {
    try {
      await next();
      if (ctx.body && ctx.body.error) {
        ctx.body.error = extractErrorString(ctx.body.error);
      }
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = {
        error: extractErrorString(err)
      };
    }
  };
};
