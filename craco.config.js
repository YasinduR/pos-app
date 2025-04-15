const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add all necessary fallbacks
      webpackConfig.resolve.fallback = {
        ...(webpackConfig.resolve.fallback || {}), // Preserve existing fallbacks
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "path": require.resolve("path-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "buffer": require.resolve("buffer/")
      };

      // Add plugins for global variables
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );

      return webpackConfig;
    }
  }
};