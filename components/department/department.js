const mongoose = require("mongoose");
const config = require("config");
const { PhotoalbumModel } = require("../photoalbum/photoalbum");
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
  let listOfFiles = await PhotoalbumModel.find({
    departmentId: this._id
  }).select("images");

  listOfFiles = listOfFiles.map(obj => obj.images);
  listOfFiles = listOfFiles.concat.apply([], listOfFiles);
  await PhotoalbumModel.deleteMany({ departmentId: this._id });
  await deleteFiles(config.get("static.staticImgDir"), listOfFiles);
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = {
  Department: Department,
  Subdepartment: Subdepartment
};
