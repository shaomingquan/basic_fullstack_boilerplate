const { inject } = require("@utils");
const models = require("@models");
const services = require("@services");

async function prepare() {
  // inject models services to controllers
  inject.bind(models, services);
  inject.hijackKoaRouter();

  // db connect
}

async function prepared() {
  process.send && process.send("ready");
}

process.on("SIGINT", function() {
  // db disconnect
  // db.stop(function(err) {
  //   process.exit(err ? 1 : 0);
  // });
});

module.exports = { prepare, prepared };
