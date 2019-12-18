const db = require("mongoose");
const config = require("config");
const { deleteFiles, deleteFile } = require("../../services/filesystem");

const photoalbumSchema = new db.Schema({
  nameAr: String,
  nameEn: String,
  descriptionAr: String,
  descriptionEn: String,
  // it must be required to make relations.
  departmentId: {
    type: db.Schema.Types.ObjectId,
    ref: "Department"
  },
  images: [
    String // validated at upload middleware
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

photoalbumSchema.methods.deleteImage = async function(imageName) {
  this.images = this.images.filter(image => {
    return image !== imageName;
  });
  // removing related files from filesystem.
  await deleteFile(config.get("static.staticImgDir"), imageName);
  await this.save();
};

photoalbumSchema.pre("remove", async function() {
  await deleteFiles(config.get("static.staticImgDir"), this.images);
});

const Photoalbum = db.model("Photoalbum", photoalbumSchema);

module.exports = {
  Photoalbum: Photoalbum
};
