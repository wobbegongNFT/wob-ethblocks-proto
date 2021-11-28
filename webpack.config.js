 const webpack = require("webpack");
 const path = require( 'path' );
 // const WebpackAssetsManifest = require("webpack-assets-manifest");
 // const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
 const TerserPlugin = require("terser-webpack-plugin");

 module.exports = {
	plugins: [

		new webpack.ProvidePlugin({
			"React": "react",
		}),
		new webpack.EnvironmentPlugin({
			"process.env.NODE_ENV": process.env.NODE_ENV
		}),
		// new BundleAnalyzerPlugin({
		// 	analyzerMode: "static",
		// 	openAnalyzer: false,
		// 	reportFilename: "webpack-bundle-analyzer-report.html"
		// }),
		// new WebpackAssetsManifest()

	],
	mode: 'development',
	entry: {
		main: "./src/index.js"
	},
	output: {
		// libraryTarget: "commonjs",
		path: path.resolve('./public'),
		filename: "main.js"
	},
	// optimization: {
	//   	usedExports: true,
	//   	minimize: true,
	//   	minimizer: [
	//    		new TerserPlugin()
	//   	]
 // 	},
	devtool: "eval-cheap-source-map",
	module: {
		rules: [
		    {
			    test: /\.m?js$/,
			    exclude: /(node_modules|bower_components)/,
			    use: {
			        loader: "babel-loader",
			        options: {presets: ["@babel/preset-env", ["@babel/preset-react"]],
			        	// ,plugins: ["@babel/plugin-transform-modules-commonjs"]
			        	// plugins: [["@babel/plugin-transform-runtime", { regenerator: true}]],
					}
			    }
		    },
			{
			    test: /\.css$/,
			    use: [
					'style-loader',
					'css-loader'
			    ]
			}
		]
	}
 };
