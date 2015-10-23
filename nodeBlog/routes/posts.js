var express = require('express');
var router = express.Router();

var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/show/:id', function (req, res, next) {
    var posts = db.get('posts');
    posts.findById(req.params.id, function (err, post) {
        res.render('show', {
            'title': post.title,
            'post': post
        });
    });
});

router.get('/add', function (req, res, next) {
    var categories = db.get('categories');

    categories.find({}, {}, function (err, categories) {
        res.render('addpost', {
            'title': 'Add Post',
            'categories': categories
        });
    });

});

router.post('/add', function (req, res, next) {
    // Get form values
    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;
    var author = req.body.author;
    var date = new Date();

    if (req.file) {
        var imageOriginalName = req.file.originalname;
        var imageName = req.file.filename;
        var imageMime = req.file.mimetype;
        var imagePath = req.file.path;
        var imageSize = req.file.size;
    } else {
        var imageName = 'noimage.png';
    }

    // Form validation
    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('body', 'Body field is required').notEmpty();

    // Check errors
    var errors = req.validationErrors();
    if (errors) {
        res.render('addpost', {
            errors: errors,
            title: title,
            body: body
        })
    } else {
        var posts = db.get('posts');

        // Submit to DB
        posts.insert({
            'title': title,
            'category': category,
            'body': body,
            'date': date,
            'author': author,
            'mainimage': imageName
        }, function (err, post) {
            if (err) {
                res.send('There was an issue submiting the post')
            } else {
                req.flash('success', 'Post Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
    }
});

router.post('/addcomment', function (req, res, next) {
    // Get form values
    var postid = req.body.postid;
    var name = req.body.name;
    var email = req.body.email;
    var body = req.body.body;
    var date = new Date();

    // Form validation
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email is not formated correctly').isEmail();
    req.checkBody('body', 'Body field is required').notEmpty();

    // Check errors
    var errors = req.validationErrors();
    if (errors) {
        var posts = db.get('posts');
        posts.findById(postid, function (err, post) {
            res.render('show', {
                errors: errors,
                post: post
            });
        });
    } else {
        var comment = {
            'name': name,
            'email': email,
            'body': body,
            'date': date
        };

        var posts = db.get('posts');

        posts.update({
                '_id': postid,
            },
            {
                $push: {'comments': comment}
            },
            function (err, doc) {
                if (err) {
                    throw err;
                } else {
                    req.flash('success', 'Comment Added');
                    res.location('/posts/show/' + postid);
                    res.redirect('/posts/show/' + postid);
                }
            });
    }
});

module.exports = router;
