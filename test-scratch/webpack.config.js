const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	entry: './server/authoritative_server/js/game.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'game.bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	}
};
