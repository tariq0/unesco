const mongoose = require("mongoose");

const countrySchema = new  mongoose.Schema({
  name: String,
  iso: String,
  states: [String]
});

const Country = mongoose.model("countries", countrySchema);
module.exports = Country;
