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
		entry: './server/authoritative_server/bundling/game.js',
		// Activation du plugin HTML Webpack
		plugins: [new HtmlWebpackPlugin()],
		// Dossier et fichier de sortie pour le bundle
		output: {
			path: path.resolve(__dirname, 'server/authoritative_server/dist'),
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
	},
	{
		// Nom de la configuration
		name: "front-client",
		// Entrée de l'application
		entry: './server/public/bundling/game.js',
		// Activation du plugin HTML Webpack
		plugins: [new HtmlWebpackPlugin()],
		// Permet aux navigateurs d'afficher des messages d'erreur de débogage plus précis
		devtool: 'source-map',
		// Dossier et fichier de sortie pour le bundle
		output: {
			path: path.resolve(__dirname, 'server/public/dist'),
			filename: 'game.client.bundle.js'
		},
		// Configuration du serveur de développement de Webpack
		devServer: {
			static: { directory: path.join(__dirname, 'server/public/dist') },
			hot: true,
			historyApiFallback: true,
			port: 42042
		},
		// Configuration des loaders pour traiter différents types de fichiers
		module: {
			rules: [
				{
					test: /\.(js)$/,
					include: [/server\/public/],
					use: { loader: 'babel-loader' }
				},
				{
					test: /\.(png)$/i,
					include: [/server\/public/],
					use: { loader: 'file-loader' }
				}
			]
		}
	}
]