const path = require('path');

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
    externals: {
        express: 'express',
        mongoose: 'mongoose',
        uuid: 'uuid',
        dotenv: 'dotenv',
        socketio: 'socket.io',
        datefns: 'date-fns',
    },
};
