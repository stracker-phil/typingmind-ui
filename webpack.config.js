const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

module.exports = {
	mode: 'development',
	entry: {
		main: './src/index.js',
		'dev-main': './src/dev-main.js',
		'theme/claude': './src/theme/claude/theme.js',
		'theme/purple': './src/theme/purple/theme.js',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		allowedHosts: 'all',
		compress: true,
		port: 9000,
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader',
				],
			}, {
				test: /\.svg$/,
				use: 'raw-loader',
				include: path.resolve(__dirname, 'src/theme'),
			},
		],
	},
	plugins: [
		new RemoveEmptyScriptsPlugin(), new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
	],
};
