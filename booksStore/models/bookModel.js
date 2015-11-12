'use strict';

var mongoose = require('mongoose');

var bookModel = function(){
    var bookSchema = mongoose.Schema({
        title: String,
        category: String,
        description: String,
        author: String,
        publisher: String,
        price: Number,
        cover: String
    });

    bookSchema.methods.truncText = function(length) {
        if(this.description)
            return this.description.substring(0, length);
        else
            return "";
    };

    return mongoose.model('Book', bookSchema);
};

module.exports = new bookModel();