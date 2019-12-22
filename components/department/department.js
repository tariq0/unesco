const mongoose = require("mongoose");
const config = require("config");
const { Photoalbum } = require("../photoalbum/photoalbum");
const { News } = require("../news/news");
const { deleteFiles } = require("../../services/filesystem");

const subdepartmentSchema = new mongoose.Schema({
  nameAr: String,
  nameEn: String,
  descriptionAr: String,
  descriptionEn: String
});

const departmentSchema = new mongoose.Schema({
  nameAr: { type: String, unique: true },
  nameEn: { type: String, unique: true },
  descriptionAr: String,
  descriptionEn: String,
  subdepartments: [subdepartmentSchema]
});

const Subdepartment = mongoose.model("Subdepartment", subdepartmentSchema);

departmentSchema.pre("remove", async function() {
  // removes related documents

  // removing related photoalbums.
  // getting list of all files on the file system
  // and removing them.
  let listOfFiles = await Photoalbum.find({
    departmentId: this._id
  }).select("images");

  listOfFiles = listOfFiles.map(obj => obj.images);
  listOfFiles = listOfFiles.concat.apply([], listOfFiles);

  let newsFiles = await News.find({departmentId: this._id})
  .select("image documents");
  const newsImages = newsFiles.map(obj => obj.image);
  let newsArrayOfDocumentsArray = newsFiles.map(obj => obj.documents);
  const newsDocuments = newsArrayOfDocumentsArray.concat.apply([], newsArrayOfDocumentsArray);

  

  await Photoalbum.deleteMany({ departmentId: this._id });
  await News.deleteMany({ departmentId: this._id });

  await deleteFiles(config.get("photoalbum.staticImgDir"), listOfFiles);
  await deleteFiles(config.get("news.staticImgDir"), newsImages);
  await deleteFiles(config.get("news.staticDocDir"), newsDocuments);
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = {
  Department: Department,
  Subdepartment: Subdepartment
};
