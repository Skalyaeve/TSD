// Importation de la bibliothèque path pour travailler avec les chemins de fichiers
const path = require('path')
// Importation du plugin HtmlWebpackPlugin pour générer le fichier HTML
const HtmlWebpackPlugin = require("html-webpack-plugin")
// Exportation de la configuration Webpack
module.exports = [
	{
		// Nom de la configuration
		name: "back-client",
		// Entrée de l'application
		entry: './headless/dist/headless.js',
		// Activation du plugin HTML Webpack
		plugins: [
			new HtmlWebpackPlugin({
				template: 'headless/template.html',
				filename: 'index.html',
				inject: 'body'
			})
		],
		// Dossier et fichier de sortie pour le bundle
		output: {
			path: path.resolve(__dirname, 'headless/bundle'),
			filename: 'game.headless.bundle.js'
		},
		// Configuration des loaders pour traiter différents types de fichiers
		module: {
			rules: [
				{
					test: /\.(js)$/,
					include: [/server\/authoritative_server/],
					exclude: [/node_modules/],
					use: { loader: 'babel-loader' }
				},
				{
					test: /\.(png)$/i,
					include: [/server\/authoritative_server/],
					exclude: [/node_modules/],
					use: { loader: 'file-loader' }
				}
			]
		}
	}
]