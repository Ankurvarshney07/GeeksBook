const mongoose = require('mongoose');
const review = new mongoose.Schema({
    taskprovider:{
        type : String,
        requires : true,
    },
    taskworker : {
        type : String,
        required : true,
    },
    rating :{
        type : String,
        required : true
    }
})

module.exports = mongoose.model('review',review)