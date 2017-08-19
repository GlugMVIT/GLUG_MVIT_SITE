var express = require('express');
var router = express.Router();

var User = require('../models/users');

// Login
router.get('/', function(req, res){
    var admin = req.query.admin;
    if(admin)
        res.render('login',{admin:"admin"});
    else
	   res.render('login');
});

router.post('/',function(req, res) {
    User.getUserByUsername(req.body.username, function(err, user){
        if(err) throw err;

        if(!user){

            // if user is not found, then flash not found message.
            req.flash('error', 'Unknown user');
            res.redirect('/login');
        }
        else {
            // if user found then only check for password.
            User.comparePassword(req.body.password, user.password, function(err, isMatch){
                if(err) throw err;
                
                if(isMatch){

                    // if user found and password is corrent, create a session for the user,
                    // and flash user logged in message.
                    req.session.user = user;
                    req.flash('success_msg', 'You are successfully logged in');
                    res.redirect('/dashboard');
                } else {

                    // if password doesn't match, flash message for invalid password.
                    req.flash('error', 'Invalid Password');
                    res.redirect('/login');
                }
            });
        }
    });
});
module.exports = router;