const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const ZipPluginForChrome = require("./plugins/zip-plugin-for-chrome");
const srcDir = path.join(__dirname, "..", "src");
const contentScriptDir = path.join(srcDir, "content-scripts");
const { version } = require("../public/manifest.json");

function getPlugins() {
  let plugins;
  plugins = [
    new CopyPlugin({
      patterns: [{ from: ".", to: "../", context: "public" }],
      options: {},
    }),
    new ZipPluginForChrome({
      buildZipOverride: false, // Only build zip file when NODE_ENV is production unless set to true
      name: "prod.zip",
      directory: "dist",
      version,
    }),
  ];

  return plugins;
}

module.exports = {
  entry: {
    settings: path.join(srcDir, "settings.tsx"),
    dtx: path.join(contentScriptDir, "dtx.ts"),
    "dtx-summary": path.join(contentScriptDir, "dtx-summary.ts"),
    "dtx-login": path.join(contentScriptDir, "dtx-login.ts"),
    "dtx-item": path.join(contentScriptDir, "dtx-item.ts"),
    "dtx-period-overview": path.join(contentScriptDir, "dtx-period-overview.ts"),
    "my-preferences": path.join(contentScriptDir, "my-preferences.ts"),
    global: path.join(contentScriptDir, "global.ts"),
  },
  output: {
    path: path.join(__dirname, "../dist/js"),
    filename: "[name].js",
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      chunks(chunk) {
        return chunk.name !== "background";
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: getPlugins(),
};
