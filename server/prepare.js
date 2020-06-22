async function prepare() {
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
