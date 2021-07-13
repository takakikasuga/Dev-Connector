const mongoose = require('mongoose');

// データの型を決める
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  avatar: {
    type: String,
    require: true
  },
  data: {
    type: Date,
    // デフォルトで日付が入る
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
