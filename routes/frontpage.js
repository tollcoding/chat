var express = require('express');
var router = express.Router();
var User = require('models/user').User;
var HttpError = require('error').HttpError;
var async = require('async');

router.get('/',function(req,res){
    res.render("frontpage");
});
router.post('/',function(req,res, next){
    var username=req.body.user;
    var password=req.body.password;
    console.log("User name = "+username+", password is "+password);
    async.waterfall([
        function(callback) {
            User.findOne({username: username}, callback);
        },
        function(user, callback) {
            if(user) {
                if (user.checkPassword(password)) {
                    callback(null, user);
                }else {
                    next( new HttpError(403, "Password incorrect"));
                }
            }else {
                var user = new User({username: username, password: password});
                user.save(function(err) {
                    if (err) return next(err);
                    callback(null, user);
                });
            }
        }
    ], function(err, user) {
        if (err) return next(err);
        req.session.user = user._id;
        res.end();
    });
});

module.exports = router;