const multer = require("multer");
const isStringInArray = require("../../../services/string-in-array");
const config = require("config");
const { deleteFiles, deleteFile } = require("../../../services/filesystem");

// allowed MIME types
const imageMimeType = config.get("static.suppportedImgMimeType");
const documentMimeType = config.get("news.suppportedDocMimeType");

// directories of files
const imageDir = config.get("news.staticImgDir");
const documentDir = config.get("news.staticDocDir");

// files fields names
const imageFieldName = config.get("news.imgFieldName");
const documentFieldName = config.get("news.docFieldName");

const filesStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (
      // restricting MIME type and field name together
      isStringInArray(file.mimetype, imageMimeType) &&
      file.fieldname === imageFieldName
    ) {
      cb(null, imageDir);
    } else if (
      // restricting MIME type and field name together
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
  if (isStringInArray(file.mimetype, imageMimeType)) {
    cb(null, true);
  } else if (isStringInArray(file.mimetype, documentMimeType)) {
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

  // note that if req is encoded as multipart form data
  // then req.files will be an object even if no files inculded.
  if (req.files) {
    let image = undefined;
    let documents = undefined;

    if (req.files[imageFieldName]) {
      image = req.files[imageFieldName][0].filename;
    }
    //console.log(req.files[documentFieldName]);
    if (req.files[documentFieldName]) {
      documents = [];
      req.files[documentFieldName].forEach(file => {
        documents.push(file.filename);
      });
    }
    req.body[imageFieldName] = image;
    req.body[documentFieldName] = documents;
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
    //console.log(req.files);
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
  console.log("clear files is called");
  if (req.files) {
    let documents = req.body[documentFieldName];
    let image = req.body[imageFieldName];
    // req.files checks if multer is called
    // but it may be called and no files included
    // and this makes the following code crash.
    // so we check if there is files in each field
    if (image) await deleteFile(imageDir, image);
    if (documents) await deleteFiles(documentDir, documents);
  }
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
