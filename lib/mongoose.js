var mongoose = require('mongoose')
var config = require('../config')

mongoose.connect((process.env.NODE_ENV != 'production' ? 'mongodb://localhost/chat' : config.get('mongoose:uri')), config.get('mongoose:options'))

module.exports = mongoose
