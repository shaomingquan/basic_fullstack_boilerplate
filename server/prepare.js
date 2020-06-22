const { inject } = require('./utils')
const models = require('./models')
const services = require('./services')

async function prepare() {
  // inject models services to controllers
  inject.bind(models, services)
  inject.hijackKoaRouter()

  // TODO, mongodb connect
}

async function prepared() {
  process.send && process.send("ready");
}

process.on("SIGINT", function() {
  // TODO, mongodb disconnect
  // db.stop(function(err) {
  //   process.exit(err ? 1 : 0);
  // });
});

module.exports = { prepare, prepared };
