/**
 * 为了让eslint 的vscode pluggin 能在打开client的上级目录可以正常工作，在上级目录也安装了eslint-plugin-react
 */

/**
 * 使用react.recomend为基础，有选择的关闭一些react的提示
 */
const {
  deprecatedRules,
  configs: {
    recommended: { rules = {} }
  }
} = require("eslint-plugin-react");
const disabledReactRecoRules = {
  "react/no-find-dom-node": true,
  "react/prop-types": true
};
const enabledReactRecoRules = Object.keys(rules).reduce((ret, rule) => {
  if (disabledReactRecoRules[rule] || deprecatedRules[rule.split(":")[1]])
    return ret;
  ret[rule] = rules[rule];
  return ret;
}, {});

/**
 * 这块主体就是用的eslint-plugin生成的
 */
module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ["eslint:recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["react"],
  rules: Object.assign({}, enabledReactRecoRules),

  // 使用babel替代eslint内置引擎，
  parser: "babel-eslint"
};
