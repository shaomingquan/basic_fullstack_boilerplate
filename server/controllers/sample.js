const Router = require("koa-router");
const router = new Router();
const namespace = "/sample";

const middwares = [];
(module.exports = {
  router,
  namespace,
  middwares
}),
  router.get("/", async ctx => {
    ctx.ok({ docs: [] });
  });
