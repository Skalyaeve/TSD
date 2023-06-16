const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const dotenv = require('dotenv');

const env = dotenv.config().parsed || {};
const envKeys = Object.keys(env).reduce((prev, next) => {
	prev[`process.env.${next}`] = JSON.stringify(env[next]);
	return prev;
}, {});

module.exports = {
	entry: './srcs/index.tsx',
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(jpg|png|svg|gif)$/,
				type: 'asset/resource',
			},
		]
	},
	plugins: [
		new webpack.DefinePlugin(envKeys),
		new HtmlWebpackPlugin({
			template: './srcs/index.html',
			filename: 'index.html',
			inject: 'body'
		})
	],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'main.js',
		publicPath: '/'
	},
	devtool: 'source-map',
	devServer: {
		static: { directory: path.join(__dirname, './srcs/resources/') },
		hot: true,
		historyApiFallback: true
	}
}