const mongoose = require('mongoose');


const geekuser = new mongoose.Schema({

    fullname:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
    },
    mobile:{
        type: String,
        require: true,
    },
    skill:{
        type: String,
        require: true,
    },
    password:{
        type: String,
        require: true,
    },
    confirmpassword:{
        type: String,
        require: true,
    }
    

})

module.exports = mongoose.model('geekuser', geekuser);