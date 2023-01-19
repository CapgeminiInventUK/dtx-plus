const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = (env, argv) => {
  console.log(`This is the Webpack 'mode': ${argv.mode}`);

  return merge(common, {
    devtool: "inline-source-map",
    mode: "development",
  });
};
