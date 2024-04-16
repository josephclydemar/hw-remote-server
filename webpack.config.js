const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './temp-build/server.js',
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs',
    },
    target: 'node',
    mode: 'production',
    stats: 'errors-warnings',
    externals: [nodeExternals()],
};
