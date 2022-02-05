const webpack = require('webpack');

module.exports = function override(config) {
  const { resolve, plugins } = config;

  // See https://github.com/WalletConnect/walletconnect-monorepo/issues/584
  resolve.fallback = {
    os: require.resolve('os-browserify/browser'),
    https: require.resolve('https-browserify'),
    http: require.resolve('stream-http'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util/'),
    url: require.resolve('url/'),
    assert: require.resolve('assert/'),
    crypto: require.resolve('crypto-browserify'),
  };
  plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  );

  return config;
};
