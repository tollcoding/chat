var express = require('express');
var router = express.Router();
var User = require('models/user').User;
var HttpError = require('error').HttpError;
var ObjectID = require('mongodb').ObjectID;

router.get('/', function(req, res, next) {

    User.find({}, function(err, users) {
        if (err) return next(err);
        res.json(users);
    })
});

router.get('/:id', function(req, res, next) {
    try {
        var id = new ObjectID(req.params.id);
    } catch (e) {
        return next(404);
    }

    User.findById(id, function(err, user) { // ObjectID
        if (err) return next(err);
        if (!user) {
            return next(new HttpError(404, "User not found"));
        }
        res.json(user);
    });

});
module.exports = router;
