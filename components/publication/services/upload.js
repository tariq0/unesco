const multer = require("multer");
const isStringInArray = require("../../../services/string-in-array");
const config = require("config");
const { deleteFiles , deleteFile} = require("../../../services/filesystem");

const imageMimeType = config.get("static.suppportedImgMimeType");
const documentMimeType = config.get("static.suppportedDocMimeType");
const imageDir = config.get("publication.staticImgDir");
const documentDir = config.get("publication.staticDocDir");
const imageFieldName = config.get("publication.imgFieldName");
const documentFieldName = config.get("publication.docFieldName");

const filesStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (isStringInArray(file.mimetype, imageMimeType)) {
      cb(null, imageDir);
    } else if (isStringInArray(file.mimetype, documentMimeType)) {
      cb(null, documentDir);
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
    cb(new Error("unsupported file MIME type"));
  }
};

// to make upload functionality totally separate
// i used save middleware to handle that.
function filesSave(req, res, next) {
  if (req.files) {

    let image = undefined;
    let documents = undefined;

    if(req.files[imageFieldName]){
      image = req.files[imageFieldName][0].filename;
    }
    
    //console.log(req.files[documentFieldName]);
    if(req.files[documentFieldName]){
      
      documents = [];
      req.files[documentFieldName].forEach(file => {
        documents.push(file.filename);
      });
    }
    
    req.body[imageFieldName] = image;
    req.body[documentFieldName] = documents;
    
    //console.log(req.body.image, req.body.documents ,req.files);
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
  //console.log('clear image is called');
  if (req.files) {
    //console.log(req.files);
    let documents = req.body[documentFieldName];
    let image = req.body[imageFieldName];
    //files = files.concat([req.body[imageFieldName]]);
    await deleteFile(imageDir, image);
    await deleteFiles(documentDir, documents);
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
