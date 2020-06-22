const Router = require("koa-router");
const router = new Router();
const namespace = "/sample";

router.get("/", async (ctx, { sample: modelSample }, { sample: serviceSample }) => {
  ctx.ok({ 
    docs: [], 
    message: [ modelSample.hi(), serviceSample.hello() ].join('-') 
  });
});

const middwares = [];
module.exports = {
  router,
  namespace,
  middwares
}
