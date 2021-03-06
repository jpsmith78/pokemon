const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: {type:String, unique:true, required:true},
  password: {type:String, required:true},
  pokeBalls: {type:Number},
  userWins: {type:Number},
  userLosses: {type:Number}

});

const User = mongoose.model('User', userSchema);

module.exports = User;
