var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/register', function (req, res, next) {
    res.render('register', {
        'title': 'Register'
    });
});

router.post('/register', function (req, res, next) {
    // Get form information
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    var profileImageName;

    // Check for image file
    if (req.files) {
        console('Uploading file');
        // File info
        var profileImageOriginalName = req.files.profileimage.originalname;
        profileImageName = req.files.profileimage.name;
        var profileImageMime = req.files.profileimage.mimetype;
        var profileImagePath = req.files.profileimage.path;
        var profileImageExt = req.files.profileimage.extension;
        var profileImageSize = req.files.profileimage.size;
    } else {
        // Set default image
        profileImageName = 'noimage.png';
    }

    // Form validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(
        req.body.password);

    // Check for errors
    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            username: username
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            profileimage: profileImageName
        });

        // Create user
        User.createUser(newUser, function (err, user) {
            if (err) {
                throw err;
            }
            console.log(user);
        });

        // Success message
        req.flash('success', 'You are registered and may log in');
        res.location('/');
        res.redirect('/');
    }

});

router.get('/login', function (req, res, next) {
    res.render('login', {
        'title': 'Login'
    });
});

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findUserById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(function (username, password, done) {
    User.findUserByUsername(username, function (err, user) {
        if (err)
            throw err;
        if (!user) {
            console.log('Unknown user');
            return done(null, false, {message: 'Unknown user'});
        }

        User.comparePassword(password, user.password, function (err, isMatch) {
            if (err)
                throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                console.log('Invalid password');
                return done(null, false, {message: 'Invalild password'});
            }
        });
    });
}));

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: 'Invalid username or password'
}), function (req, res) {
    // If user is authenticate
    console.log('Authentication successful');
    req.flash('success', 'You are logged in');
    res.redirect('/');
});

router.get('/logout', function (req, res) {
    req.logout();
    console.log('Logout successful');
    req.flash('success', 'You have logged out');
    res.redirect('/users/login');
});

module.exports = router;
