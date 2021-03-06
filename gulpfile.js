var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var _ = require("lodash");

// The development server
gulp.task("default", ["webpack-dev-server"]);

gulp.task("webpack-dev-server", function(callback) {
  var myConfig = _.cloneDeep(webpackConfig);
  myConfig.devtool = 'source-map';

  // Start a webpack-dev-server
	new WebpackDevServer(webpack(myConfig), {
		stats: {
			colors: true
		}
	}).listen(8080, "localhost", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
	});
});

// Production build
gulp.task("build", ["webpack:build"]);

gulp.task("webpack:build", function(cb) {
  var myConfig = _.cloneDeep(webpackConfig);
	myConfig.plugins = Array.prototype.concat(
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);

  // run webpack
	webpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
	});

  // pipe index.html file to dist folder and exit
  return gulp.src('./index.html').pipe(gulp.dest('./dist'))
});
