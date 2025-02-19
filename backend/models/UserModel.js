// models/UserModel.js
const mongoose = require('mongoose');
console.log("model")
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'partner'], required: true },
  rating: { type: Number, default:0 },
});

module.exports = mongoose.model('User', UserSchema);
