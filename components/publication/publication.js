const mongoose = require("mongoose");

const publicationShema = new mongoose.Schema({
  nameAr: String,
  nameEn: String,

  descriptionShortAr: String,
  descriptionShortEn: String,
  
  descriptionLongAr: String,
  descriptionLongEn: String,
  // incase of relationship.
  //   departmentId: {
  //     type: db.Schema.Types.ObjectId,
  //     ref: "Department"
  //   },
  image: String,
  files: [
    String // validated at upload middleware
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

const Publication = mongoose.model("publication", publicationShema);

module.exports = {
  Publication: Publication
};
