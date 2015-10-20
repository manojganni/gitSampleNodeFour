var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();


router.get('/', function (req, res) {
    console.log("in");
    
    req.on('end', function () {
        console.log('Received the information on start');
        //res.send('Sent the information!!!');
    });
    

    res.render('index', { user : req.user });
});


router.get('/index', function (myreq, res) {
    
    myreq.on('end', function () {
        console.log('Received the information from index');
        //res.send('Sent the information!!!');
    });

    res.render('index', { user : myreq.user });
    //res.render('index', { user : myreq.session.passport.user });
});


router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function (req, res, next) {
    

    Account.register(new Account({ username : req.body.username, education : req.body.education }), req.body.password, function(err, account) {
        if (err) {
          return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});


router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function (req, res, next) {
    

    console.log("find status : This is from callback after authenticatiaon");
    req.session.save(function (err) {
        console.log("entered req session save...");
        if (err) {
            return next(err);
        }
        console.log("entered save.. ");
        res.redirect('/index');
    });
});

router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
