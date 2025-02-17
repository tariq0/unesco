const multer = require("multer");
const isStringInArray = require("../../../services/string-in-array");
const config = require("config");
const { deleteFiles } = require("../../../services/filesystem");

const imageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, config.get("photoalbum.staticImgDir"));
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const imageFilter = (req, file, cb) => {
  if (
    isStringInArray(file.mimetype, config.get("static.suppportedImgMimeType"))
  ) {
    cb(null, true);
  } else {
    const error = new Error();
    error.name = "ValidationError";
    error.message = "Invalid MIME type .";
    cb(error);
  }
};

// to make upload functionality totally separate
// i used save middleware to handle that.
function imageSave(req, res, next) {
  //console.log("req.files: ",req.files, "req.body: ", req.body);
  if (req.files) {

    if (req.body.images) {
      res.statusCode = 422;
      const error = new Error();
      error.name = "ValidationError";
      error.message = "invalid image or file input.";
      return next(error);
    }
    
    let images = [];
    req.files.forEach(file => {
      images.push(file.filename);
    });
    req.body[config.get("photoalbum.imgFieldName")] = images;
    console.log("req.files: ", req.files, "req.body: ", req.body);
    //console.log(req.body.images ,req.files);
    next();
  } else {
    // if he send json with image extension but no file
    // we should  stop that bug.
    if (req.body.images) {
      res.statusCode = 422;
      const error = new Error();
      error.name = "ValidationError";
      error.message = "invalid image or file input.";
      return next(error);
    }
    next();
  }
  //console.log('image save is called',req.files);
}

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter
});

async function clearImages(req) {
  // passed as call back for validator to remove
  // saved files if the req is not valid.
  if (req.files) {
    let images = req.files.map(file => file.filename);
    //console.log(req.files);
    if (images.length > 0) {
      await deleteFiles(config.get("photoalbum.staticImgDir"), images);
    }
  }
}

module.exports = {
  uploadImage: [
    uploadImage.array(config.get("photoalbum.imgFieldName")),
    imageSave
  ],
  clearImages: clearImages
};
