const webpack = require('webpack');

module.exports = function () {

  const plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      },
      __DEVTOOLS__: true,
    }),
    {
      apply(compiler) {
        compiler.plugin('watchRun', function () {
          console.log('\u001bc');
        });
      }
    }
  ];

  return {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: ['regenerator-runtime/runtime', './src/index.tsx'],
    output: {
      filename: 'app.js',
      path: `${process.cwd()}/dist/`,
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      mainFields: ['webpack', 'browser', 'main']
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'style-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'css-loader',
              options: {
                url: false,
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.[tj]sx?$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-typescript',
                '@babel/preset-react',
                ['@babel/preset-env', {
                  targets: { ie: '11' }
                }]
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties'
              ]
            }
          }
        }
      ]
    }
  };
};

