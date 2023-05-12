const path = require('path');

module.exports = [
	{
		entry: './server/authoritative_server/js/game.js',
		output: {
			path: path.resolve(__dirname, 'server/authoritative_server/dist'),
			filename: 'game.headless.bundle.js'
		},
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /\.js$/,
					include: [
						/server\/authoritative_server/
					],
					use: {
						loader: 'babel-loader'
					}
				},
				{
					test: /\.(png)$/i,
					use: [{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'dist/img',
						},
					},],
				}
			]
		}
	},
	{
		entry: './server/public/js/game.js',
		output: {
			path: path.resolve(__dirname, 'server/public/dist'),
			filename: 'game.client.bundle.js'
		},
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /\.js$/,
					include: [
						/server\/public/
					],
					use: {
						loader: 'babel-loader'
					}
				},
				{
					test: /\.(png)$/i,
					use: [{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'dist/img',
						},
					},],
				}
			]
		}
	},
]