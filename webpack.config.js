module.exports = {
  context: __dirname,
  name: 'pantheon_game',
  entry: './app/js/index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist/',
    publicPath: './'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|svg|mp3)$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js']
  }
}
