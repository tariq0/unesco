const mongoose = require("mongoose");
const { deleteFile, deleteFiles } = require("../../services/filesystem");
const config = require("config");

const imageDir = config.get("publication.staticImgDir");
const documentDir = config.get("publication.staticDocDir");


const publicationShema = new mongoose.Schema({
  nameAr: String,
  nameEn: String,

  descriptionShortAr: String,
  descriptionShortEn: String,

  descriptionLongAr: String,
  descriptionLongEn: String,

  image: String,
  documents: [
    String // validated at upload middleware
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

publicationShema.methods.replaceImage = async function(newImage) {
  let oldImage = this.image;
  this.image = newImage;
  if (oldImage) await deleteFile(imageDir, oldImage);
  //console.log(this);
};

publicationShema.methods.removeDocuments = async function(documents) {
  if (typeof documents === "string") {
    // for single item to remove
    this.documents = this.documents.filter(doc => doc != documents);
    await deleteFile(documentDir, documents);
  } else if (Array.isArray(documents)) {
    // subtracting arrays and delete the required items
    const diff = this.documents.filter(doc => !documents.includes(doc));
    this.documents = diff;
    await deleteFiles(documentDir, documents);
  }
};

publicationShema.pre("remove", async function() {
  await deleteFile(imageDir, this.image);
  await deleteFiles(documentDir, this.documents);
});

const Publication = mongoose.model("publication", publicationShema);

module.exports = {
  Publication: Publication
};
