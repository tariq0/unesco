const db = require("mongoose");
const config = require("config");
const { deleteFiles, deleteFile } = require("../../services/filesystem");

const imageDir = config.get("photoalbum.staticImgDir");
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

photoalbumSchema.methods.deleteImages = async function(imageNames) {

  if (typeof imageNames === "string"){
    this.images = this.images.filter(image => {
      return image !== imageNames;
    });
    // removing related files from filesystem.
    await deleteFile(imageDir, imageNames);
  }else if (Array.isArray(imageNames)){
   const  diff = this.images.filter(image => !imageNames.includes(image));
    this.images = diff;
    await deleteFiles(imageDir, imageNames);
  }
  
  await this.save();
};

photoalbumSchema.pre("remove", async function() {
  await deleteFiles(imageDir, this.images);
});

const Photoalbum = db.model("Photoalbum", photoalbumSchema);

module.exports = {
  Photoalbum: Photoalbum
};
