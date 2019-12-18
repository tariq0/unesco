
const multer = require("multer");
const isStringInArray = require("./string-in-array");
const config = require("config");
const {deleteFiles} = require('../services/filesystem');


const imageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, config.get("static.staticImgDir"));
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const imageFilter = (req, file, cb) => {
  //cb(null, true) to accept that file
  if (
    isStringInArray(file.mimetype, config.get("static.suppportedImgMimeType"))
  ) {
    cb(null, true);
  }
    //cb(null, false) to rejectc it
    //cb(new Error("I don't have a clue!"));
};

// to make upload functionality totally separate
// i used save middleware to handle that.
function imageSave(req, res, next){
   
  if(req.files){
    let images = [];
    req.files.forEach(file =>{
        images.push(file.filename);
    });
    req.body[config.get('static.imgFieldName')] = images;
    //console.log(req.body.images ,req.files);
    next();
  }else{
    // if he send json with image extension but no file
    // we should  stop that bug.
    if(req.body.images) req.body.images = ['bad value'];
    else req.body.images = undefined;
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
  //console.log('clear image is called');
  if(req.files){
    let images = req.files.map(file => file.filename);
  //console.log(req.files);
  await deleteFiles( config.get('static.staticImgDir'), images);
  }
  
}

module.exports = {
  uploadImage: [
      uploadImage.array(config.get('static.imgFieldName')),
      imageSave
    ],
    clearImages: clearImages
};
