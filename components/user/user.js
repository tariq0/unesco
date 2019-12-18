const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
  firstName: String, 
  lastName: String, 
  password: String,
  phone: String,
  email: {
    type: String,
    index: { unique: true }
  },
  address: {
    country: String,
    city: String
  },
  facebookId: String,
  birthDate: Date,
  job: String,
  role: { type: String, default: "user" },
  isVerified: { type: Boolean, default: false }
});

// hashing the password
userSchema.methods.setPassword = async function(password) {
  this.password = await bcrypt.hash(password, config.get("bcrypt.saltRounds"));
};

// verifyning password
userSchema.methods.verifyPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// generating jwt tokens
userSchema.methods.generateToken = function() {
  const data = {
    _id: this._id,
    role: this.role
  };

  return jwt.sign(data, config.get("jwt.secret"), {
    expiresIn: config.get("jwt.options.expiresIn")
  });
};

userSchema.statics.verifyToken = function(token) {
  try {
    const decoded = jwt.verify(token, config.get("jwt.secret"));
    return decoded;
  } catch (err) {
    //return err;
    return false;
  }
};

userSchema.statics.createNewUser = async function (userdata){
  const user = new UserModel(userdata);
  await user.setPassword(userdata.password);
  await user.save();
  return user;
}

userSchema.methods.updatePasword = async function(newPassword){
  await this.setPassword(newPassword);
  const result = await this.save();
  return result;
}


const User = mongoose.model("user", userSchema);
module.exports ={ 
  User: User,
}
