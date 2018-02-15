const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';


module.exports = {
    context: path.join(__dirname, 'src'),
    entry: {
        app: './app/app'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.(mp3|m4a)$/,
                use: 'file-loader',
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.(css|scss|sass)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'sass-loader']
                }),
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader?name=[path][name].[ext]',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 80
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            // the webp option will enable WEBP
                            webp: {
                                quality: 75
                            }
                        }
                    },
                ],
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        inline: true,
        open: true,
        hot: true,
        historyApiFallback: true,
        stats: 'errors-only' // cmd line printout

    },
    resolve: {
        alias: {
            'styles': path.resolve(__dirname, 'src/css'),
            'images': path.resolve(__dirname, 'src/images')
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
            inject: 'body',
            filename: 'index.html',
            minify: {
                collapseWhitespace: true,
                preserveLineBreaks: true
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common'
        }),
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true,
            disable: !isProduction
        })
    ]
};