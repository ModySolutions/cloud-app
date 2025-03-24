const path = require('path');
const defaults = require('@wordpress/scripts/config/webpack.config.js');
const webpack = require('webpack')
const dotenv = require('dotenv')

const env = dotenv.config().parsed
const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next])
    return prev
}, {})

module.exports = (env) => ({
    ...defaults,
    entry: {
        'app': path.resolve(process.cwd(), 'resources/scripts', 'app.js'),
        'editor': path.resolve(process.cwd(), 'resources/scripts', 'editor.js'),
        'auth': path.resolve(process.cwd(), 'resources/scripts', 'auth.js'),
        'site': path.resolve(process.cwd(), 'resources/scripts', 'site.js'),
        'account': path.resolve(process.cwd(), 'resources/scripts', 'account.js'),
    },
    output: {
        filename: '[name].js',
        path: path.resolve(process.cwd(), 'dist'),
    },
    resolve: {
        ...defaults.resolve,
        ...{
            alias: {
                ...defaults.resolve.alias,
                ...{
                    '@modycloud': path.resolve(process.cwd(), 'resources/scripts'),
                    '@mcscss': path.resolve(process.cwd(), 'resources/scss'),
                }
            }
        }
    },
    module: {
        ...defaults.module,
        rules: [
            ...defaults.module.rules,
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react'],
                    },
                },
            },
        ]
    },
    plugins: [
        ...defaults.plugins,
        new webpack.DefinePlugin(envKeys)
    ]
});