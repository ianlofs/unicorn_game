module.exports = {
  context: __dirname + '/',
  name: 'pantheon_game',
  entry: './app/pantheon_game.js',
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    path: __dirname + "/app/"
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
        test: /\.html$/,
        loader: 'html-loader'
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
