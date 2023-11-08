/* eslint-disable no-undef */
const { override, addBabelPlugin, useBabelRc, addWebpackPlugin, addWebpackModuleRule } = require("customize-cra");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

const rewiredMap = () => (config) => {
  config.devtool = config.mode === "development" ? "eval-source-map" : 'source-map';
  config.externals = {
    'nostr-tools': 'NostrTools'
  }
  if (config.mode !== "development") {
    config.devtool = false;

    config.optimization.runtimeChunk = "single";
    config.optimization.splitChunks = {
      chunks: "all",
      minChunks: 1,
      cacheGroups: {
        baseChunks: {
          name: "base.chunks",
          test: (module) =>
            /react|react-dom|react-router-dom|react-redux|redux|axios|dayjs|lodash/.test(module.context),
          priority: 20
        },
        uiChunks: {
          name: "ui.chunks",
          test: (module) => /antd|@ant-design\/icons|echarts|emoji-mart/.test(module.context),
          priority: 10
        },
        default: {
          name: "common.chunks",
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    };
  }

  return config;
};

module.exports = override(
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useBabelRc(),
  rewiredMap(),
  addWebpackModuleRule({
    test: /\.po$/,
    use: { loader: "@lingui/loader" }
  }),
  addWebpackPlugin(
    new ProgressBarPlugin()
  )
);
