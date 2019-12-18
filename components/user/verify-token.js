const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const verificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  token: { type: String },
  createdAt: { type: Date, default: Date.now, index: true, expires: '3m' }
});

// generate new token and save it hashed and return the unhashed
verificationSchema.methods.generateToken = async function() {
  const token = mongoose.Types.ObjectId();
  this.token = jwt.sign(token.toString(), config.get("jwt.secret"));
  return token;
};


verificationSchema.statics.createNewVerificationRecord = async function(userId){
  // this function does all logic required to
  // give verification token to user
  // creating the token and saving it hashed
  const verification = new VerificationModel({ userId: userId });
  const verificationToken = await verification.generateToken();
  await verification.save();
  return verificationToken.toString();
}



verificationSchema.statics.getUserByVerificationToken = async function(token){

  // gets user by verification token
  const encrypted = jwt.sign(token, config.get("jwt.secret"));
  const verificationRecord = await VerificationModel.findOne({
    token: encrypted
  });
  if (verificationRecord) {
    return verificationRecord.userId;
  } else {
    return false;
  }
}



verificationSchema.statics.deleteToken = async function (token){
    const encrypted = jwt.sign(token, config.get("jwt.secret"));
    await VerificationModel.deleteOne({token: encrypted});
}

const VerificationModel = mongoose.model("verification", verificationSchema);

module.exports = {
  Verification: VerificationModel
};
