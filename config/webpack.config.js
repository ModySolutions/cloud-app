const path = require('path');
const defaults = require('@wordpress/scripts/config/webpack.config.js');

module.exports = {
    ...defaults,
    entry: {
        'app': path.resolve(process.cwd(), 'src/app/scripts', 'app.js'),
        'editor': path.resolve(process.cwd(), 'src/app/scripts', 'editor.js'),
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
        ]
    }
};