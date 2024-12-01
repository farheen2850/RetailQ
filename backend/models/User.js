const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.methods.matchPassword = async function (password) {
  console.log(password, 'pass')
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);