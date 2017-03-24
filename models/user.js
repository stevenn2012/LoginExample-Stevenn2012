var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local:{
        email: String,
        password: String,      
    },
    facebook:{
        id: String,
        token: String,
        email: String,
        name: String
    }
});

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
}

userSchema.methods.hashPassword = function(password){
    var user = this;
    bcrypt.hash(password, null, null, function(error, hash){
        if(error){
            return next(error);
        }else{
            user.local.password = hash;
        }
    });
}

module.exports = mongoose.model('user', userSchema);