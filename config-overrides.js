// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack');

module.exports = {
  webpack(config) {
    return {
      ...config,
      plugins: [
        ...config.plugins,
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
      ],
      resolve: {
        ...config.resolve,
        extensions: [...config.resolve.extensions, '.ts', '.js'],
        alias: {
          ...config.resolve.alias,
          process: 'process/browser',
        },
        fallback: {
          ...config.resolve.fallback,
          fs: false,
          tls: false,
          net: false,
          path: false,
          zlib: false,
          http: false,
          https: false,
          crypto: false,
          os: false,
          url: false,
          assert: false,
          'crypto-browserify': require.resolve('crypto-browserify'),
          stream: require.resolve('stream-browserify'),
          buffer: require.resolve('buffer'),
          'process/browser': require.resolve('process/browser'),
        },
      },
      ignoreWarnings: [/Failed to parse source map/],
    };
  },
};
