const mongoose = require("mongoose");
const { deleteFile, deleteFiles } = require("../../services/filesystem");
const config = require("config");

const imageDir = config.get("news.staticImgDir");
const documentDir = config.get("news.staticDocDir");
const newsShema = new mongoose.Schema({
  nameAr: String,
  nameEn: String,

  descriptionShortAr: String,
  descriptionShortEn: String,

  descriptionLongAr: String,
  descriptionLongEn: String,

  image: String,
  documents: [String],
  organization: String,

  departmentId: mongoose.SchemaTypes.ObjectId,
  subdepartmentId: mongoose.SchemaTypes.ObjectId,

  activityId: mongoose.SchemaTypes.ObjectId,
  category: String,

  date: {
    type: Date,
    default: Date.now
  }
});

newsShema.methods.replaceImage = async function(newImage) {
  let oldImage = this.image;
  this.image = newImage;
  if (oldImage) await deleteFile(imageDir, oldImage);
  //console.log(this);
};

newsShema.methods.addDocuments =  function(documents){
  this.documents = this.documents.concat(documents);
}

newsShema.methods.removeDocuments = async function(documents) {
  if (typeof documents === "string") {
    // for single item to remove
    this.documents = this.documents.filter(doc => doc != documents);
    await deleteFile(documentDir, documents);
  } else if (Array.isArray(documents)) {
    // subtracting arrays and delete the required items
    const diff = this.documents.filter(doc => !documents.includes(doc));
    this.documents = diff;
    await deleteFiles(documentDir, documents);
  }else{
    const error = new Error();
    error.name = "FileSystemError";
    error.message = "file names is not valid type"
  }
};

newsShema.pre('remove',async function(){

    if (this.image) await deleteFile(imageDir, this.image);
    if(this.documents.length >0) await deleteFiles(documentDir, this.documents);
});

const News = new mongoose.model('news', newsShema);
module.exports = {
    News: News
}