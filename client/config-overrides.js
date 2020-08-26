/*eslint-disable*/
const {
  addBabelPlugin,
  addDecoratorsLegacy,
  addLessLoader,
  addWebpackAlias
} = require("customize-cra");

const path = require("path");

// https://ant.design/docs/react/customize-theme-cn#Ant-Design-%E7%9A%84%E6%A0%B7%E5%BC%8F%E5%8F%98%E9%87%8F
const Theme = {
  "primary-color": "#0052ff",
  "link-color": "#0052FF"
};

module.exports = {
  webpack: function(config, env) {
    // enable legacy decorators babel plugin
    config = addDecoratorsLegacy()(config);

    config = addWebpackAlias({
      "@": path.resolve(__dirname, "src/")
    })(config);

    // https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining#via-babelrc-recommended
    config = addBabelPlugin("@babel/plugin-proposal-optional-chaining")(config);

    // less loader and maimai theme
    // http://lesscss.org/usage/#less-options
    config = addLessLoader({
      modifyVars: Theme,
      javascriptEnabled: true
    })(config);

    // see(config)
    return config;
  }
};
