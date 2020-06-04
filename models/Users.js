var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var usersSchema = new Schema({
    username:{type: String,
        required: true,
        unique: true,
        },
    name:String,
    password:String,
    sorting:String
});

var Users = mongoose.model('Users', usersSchema);
module.exports = Users;