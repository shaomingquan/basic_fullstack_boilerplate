require("module-alias/register");
const Koa = require("koa");
const Router = require("koa-router");
const http = require("http");
const koaRespond = require("koa-respond");
const koaBody = require("koa-body");
const logger = require("koa-logger");
const session = require("koa-session");
const _ = require("lodash");
const { wait: newWait } = require("@utils");

// env
const config = require("config");
const { is_dev, port } = config;

// middlewares
const {
  "error-handler": errorHandler,
  "static-server": staticServer
} = require("@middlewares");

const { prepare, prepared } = require("./prepare");

// bootstrap
(async () => {
  await prepare();
  await main();
  prepared();
})();

/**
 * Koa App
 */
async function main() {
  const app = new Koa();

  /**
   * raw server bind with Koa, do what you like with it
   */
  const server = http.createServer(app.callback());

  // error handler
  app.use(errorHandler(app));

  // logger
  is_dev && app.use(logger());

  // static server
  app.use(staticServer({ ...config.serve_static, api_root: config.api_root }));

  // body parser
  config.koa_body && app.use(koaBody(config.koa_body));

  /**
   * syntax sugar: isomorphic get and post under this component
   */
  app.use(async (ctx, next) => {
    if (ctx.request.method.toUpperCase() === "GET") {
      // get fake body
      const { _body } = ctx.query;
      let body = {};
      try {
        body = JSON.parse(_body);
        // eslint-disable-next-line no-empty
      } catch (e) {}
      ctx.request.body = body;
    }
    await next();
  });

  // response sugar
  app.use(koaRespond());

  /**
   * required keys to prevent cookies to be hijacked
   */
  if (config.cookie_encrypt_keys && config.session) {
    app.keys = config.cookie_encrypt_keys; // Key used to encrypt the cookie.
    app.use(session(config.session, app));
  }

  // tree shape router
  // top router instance
  const appRouter = new Router();
  const apiRouter = new Router();

  // entries
  const controllers = require("@controllers");
  for (const { router, namespace, middwares } of Object.values(controllers)) {
    if (
      !_.isString(namespace) ||
      !_.isArray(middwares) ||
      !(router instanceof Router)
    ) {
      continue;
    }
    apiRouter.use(namespace, ...middwares, router.routes());
  }
  appRouter.use(config.api_root, apiRouter.routes());
  app.use(appRouter.routes());

  // start server
  const wait = newWait();
  server.listen(port, () => {
    console.log(
      `Server started on port ${port}. Mode: ${process.env.NODE_ENV}.`
    );
    wait.pass();
  });
  await wait.wait;
}
