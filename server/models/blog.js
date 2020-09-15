const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var blogSchema = new Schema({

    auther: {
        type: String,
        require: true,
    },
    views : {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },

    content: {
        type: String,
        require: true,
    },
    date: {
        type: String,
        require: true,
    },
    tags:[{
        tag: {
            type: String,
        }
    }]
     
});

module.exports = blogSchema = mongoose.model("blog",blogSchema);
