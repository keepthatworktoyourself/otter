const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // TODO: remove w/ webpack 5
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = function(env) {
  const production = env === 'prod';

  const css_extract_plugin = new MiniCssExtractPlugin({
    filename: 'iceberg.css',
    sourceMap: false,
  });

  const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, 'demo/index.html'),
    filename: './index.html',
  });

  return {
    mode: production ? 'production' : 'development',
    entry: path.resolve(__dirname, 'demo/index.jsx'),
    output: {
      path: path.resolve(__dirname, 'demo/dist'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          resolve: {
            extensions: [ '.js', '.jsx' ],
          },
          include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'demo'),
          ],
          exclude: /(node_modules|bower_components|build)/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.s?css$/,
          use: [
            production ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: require('cssnano')({
                  discardComments: { removeAll: true },
                }),
              },
            },
            'fast-sass-loader',
          ],
        },
      ],
    },
    plugins: [ css_extract_plugin, htmlWebpackPlugin ],
    devServer: {
      port: 3000,
    },
  };
};

