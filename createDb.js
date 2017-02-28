var mongoose = require('./lib/mongoose');
mongoose.set('debug', true);
var async = require('async');

// 1. drop database
// 2. create & save 3 users
// 3. close connection

async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers
], function(err, results) {
    console.log(arguments);
    mongoose.disconnect();
    process.exit(err ? 255 : 0);
});

function open (callback) {
    mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModels(callback) {
    require('./models/user');

    async.each(Object.keys(mongoose.models), function(modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUsers(callback) {
    var users = [
        {username: 'Вася', password: 'sepervasya'},
        {username: 'Петя', password: '123'},
        {username: 'admin', password: 'thetruehero'}
    ];

    async.each(users, function(userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}