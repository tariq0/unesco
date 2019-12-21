const multer = require("multer");
const isStringInArray = require("../../../services/string-in-array");
const config = require("config");
const { deleteFiles, deleteFile } = require("../../../services/filesystem");

const imageMimeType = config.get("static.suppportedImgMimeType");
const documentMimeType = config.get("static.suppportedDocMimeType");
const imageDir = config.get("publication.staticImgDir");
const documentDir = config.get("publication.staticDocDir");
const imageFieldName = config.get("publication.imgFieldName");
const documentFieldName = config.get("publication.docFieldName");

const filesStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (
      isStringInArray(file.mimetype, imageMimeType) &&
      file.fieldname === imageFieldName
    ) {
      cb(null, imageDir);
    } else if (
      isStringInArray(file.mimetype, documentMimeType) &&
      file.fieldname === documentFieldName
    ) {
      cb(null, documentDir);
    } else {
      const error = new Error();
      error.message = "invalid fields MIME type please check your input";
      error.name = "ValidationError";
      cb(error);
    }
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const filesFilter = (req, file, cb) => {
  //cb(null, true) to accept that file
  if (
    isStringInArray(file.mimetype, imageMimeType) ||
    isStringInArray(file.mimetype, documentMimeType)
  ) {
    cb(null, true);
  } else {
    const error = new Error();
    error.message = "unsupported file MIME type";
    error.name = "ValidationError";
    cb(error);
  }
};

// to make upload functionality totally separate
// i used save middleware to handle that.
function filesSave(req, res, next) {
  if (req.files) {
    // if there is files means request has encoded as form data
    // if there is any data in file fields that i didnt set
    // means its fake file
    if (req.body[imageFieldName] || req.body[documentFieldName]) {
      res.statusCode = 422;
      const error = new Error();
      error.name = "ValidationError";
      error.message = "invalid image or file input.";
      return next(error);
    }

    const image = req.files[imageFieldName];
    const documents = req.files[documentFieldName];

    if (image) {
      req.body[imageFieldName] = req.files[imageFieldName][0].filename;
    }

    //console.log(req.files[documentFieldName]);
    if (documents) {
      let docs = [];
      req.files[documentFieldName].forEach(file => {
        docs.push(file.filename);
      });

      req.body[documentFieldName] = docs;
    }
    next();
  } else {
    // if he send json with image extension but no file
    // we should  stop that bug.
    if (req.body[imageFieldName] || req.body[documentFieldName]) {
      res.statusCode = 422;
      const error = new Error();
      error.name = "ValidationError";
      error.message = "invalid image or file input.";
      return next(error);
    }
    next();
  }
}

const uploadFiles = multer({
  storage: filesStorage,
  fileFilter: filesFilter
});

async function clearFiles(req) {
  // passed as call back for validator to remove
  // saved files if the req is not valid.
  //console.log('clear image is called');
  if (req.files) {
    //console.log(req.files);
    let documents = req.body[documentFieldName];
    let image = req.body[imageFieldName];
    //files = files.concat([req.body[imageFieldName]]);
    if (image) await deleteFile(imageDir, image);
    if (documents) await deleteFiles(documentDir, documents);
  }
  return;
}

module.exports = {
  uploadFiles: [
    uploadFiles.fields([
      { name: imageFieldName, maxCount: 1 },
      { name: documentFieldName }
    ]),
    filesSave
  ],
  clearFiles: clearFiles
};
