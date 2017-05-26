var mongoose = require('mongoose');
var config = require('../config');

if (process.env.NODE_ENV != 'production') {
    var uri = 'mongodb://localhost/chat';
}else {
    var uri = config.get('mongoose:uri');
}
console.log('DataBase connection: '+ uri);

mongoose.connect(uri, config.get('mongoose:options'));

module.exports = mongoose;
