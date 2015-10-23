var mongoose = require('mongoose');
//var bcrypt = require('bcrypt'); - Encriptar password

mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String, required: true, bcrypt: true
    },
    email: {
        type: String,
    },
    name: {
        type: String,
    },
    profileimage: {
        type: String,
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser, callback) {
    // Just works with bcrypt module installed
    /*bcrypt.hash(newUser.password, 10, function(err, hash){
     if(err)
     throw err;
     // Set hashed password
     newUser.password = hash;
     // Create user
     newUser.save(callback);
     });*/
    newUser.save(callback);
};

module.exports.findUserById = function (id, callback) {
    var query = {_id: id};
    User.findById(query, callback);
};

module.exports.findUserByUsername = function (username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    if (candidatePassword == hash) {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

// Just works with bcrypt module installed
/*module.exports.comparePassword = function (candidatePassword, hash, callback) {
 bcrypt.compare(candidatePassword, hash, function(err, isMatch){
 if(err)
 return callback(err);
 callback(null, isMatch);
 });
 }*/