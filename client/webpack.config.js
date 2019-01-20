const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = () => {

  /**
   * Call dotenv and it will return an object with parsed keys.
   */
  const env = dotenv.config().parsed;

  /**
   * Reduce the environment keys to an object.
   */
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  /**
   * Return your webpack config entry and module rules
   * It instructors to compile everything down and put it in bundle.js in the /dist directory.
   * Instruct the app to let it know we are using hot module updating,
   * .env keys and a dev server.
   */
  return {
    entry: './src/index.js',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        }
      ]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx']
    },
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: 'bundle.js'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin(envKeys)
    ],
    devServer: {
      contentBase: './dist',
      hot: true
    }
  };
};
