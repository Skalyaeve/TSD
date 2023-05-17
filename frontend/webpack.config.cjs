const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: './src/index.tsx',
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
				test: /\.(png)$/i,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'dist/img'
					}
				}]
			}
		]
	},
	resolve: {
		extensions: [
			'.js',
			'.ts',
			'.tsx',
			'.mjs',
			'.cjs',
			'.json',
			'.wasm'
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
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
		static: { directory: path.join(__dirname, './src/resources/') },
		hot: true,
		historyApiFallback: true
	}
}