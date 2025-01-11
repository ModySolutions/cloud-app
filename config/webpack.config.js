const path = require('path');
const defaults = require('@wordpress/scripts/config/webpack.config.js');

module.exports = {
    ...defaults,
    entry: {
        'app': path.resolve(process.cwd(), 'src/scripts', 'app.js'),
        'editor': path.resolve(process.cwd(), 'src/scripts', 'editor.js'),
        'auth': path.resolve(process.cwd(), 'src/scripts', 'auth.js'),
        'site': path.resolve(process.cwd(), 'src/scripts', 'site.js'),
        'account': path.resolve(process.cwd(), 'src/scripts', 'account.js'),
    },
    output: {
        filename: '[name].js',
        path: path.resolve(process.cwd(), 'dist'),
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
    }
};