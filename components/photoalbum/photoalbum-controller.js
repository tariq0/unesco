//
//
//
//
const _ = require("lodash");
const config = require("config");
const { Photoalbum } = require("./photoalbum");
const { Department } = require("../department/department");
const {
  //
  getDocumentsPaginated,
  getDocumentsPaginatedFiltered,
  getDocument,
  createDocument,
  getDocumentIfExist
} = require("../../services/crud");

const imageURL = config.get("photoalbum.staticImgUrl");
//
async function getAll(req, res, next) {
  try {
    const page = parseInt(req.query.page);
    const perpage = parseInt(req.query.perpage) || 1;
    const order = { date: -1 };
    const result = await getDocumentsPaginated(
      Photoalbum,
      order,
      "",
      page,
      perpage
    );
    const { pagination, data } = result;
    const URL = imageURL;
    res.json({
      URL: URL,
      pagination: pagination,
      data: data
    });
  } catch (err) {
    next(err);
  }
}

async function getAllbyDepartment(req, res, next) {
  try {
    const page = parseInt(req.query.page);
    const perpage = parseInt(req.query.perpage) || 1;
    const order = { date: -1 };
    const result = await getDocumentsPaginatedFiltered(
      Photoalbum,
      { departmentId: req.params.id },
      order,
      "",
      page,
      perpage
    );
    const { pagination, data } = result;
    const URL = imageURL;
    res.json({
      URL: URL,
      pagination: pagination,
      data: data
    });
  } catch (err) {
    next(err);
  }
}

//
async function getById(req, res, next) {
  try {
    let photoalbum = await getDocument(Photoalbum, { _id: req.params.id });
    photoalbum =photoalbum.toObject();
    photoalbum["URL"] = imageURL;
    //photoalbum.URL = imageURL;
    //console.log(imageURL, photoalbum);
    res.json(photoalbum);
  } catch (err) {
    next(err);
  }
}

//
async function create(req, res, next) {
  try {
    const department = await getDocumentIfExist(Department, {
      _id: req.body.departmentId
    });
    const photoalbum = await createDocument(Photoalbum, req.body);
    //res.json(photoalbum);
    res.json({ message: "created successfully" });
  } catch (err) {
    next(err);
  }
}

//
async function update(req, res, next) {
  try {
    let photoalbum = await getDocumentIfExist(Photoalbum, {
      _id: req.params.id
    });
    const images = req.body.images;
    const newData = _.pick(req.body, [
      "nameAr",
      "nameEn",
      "descriptionAr",
      "descriptionEn"
    ]);
    photoalbum.set(newData);

    if (images) photoalbum.images = images.concat(photoalbum.images);

    await photoalbum.save();
    photoalbum = photoalbum.toObject();
    photoalbum["URL"] = imageURL;
    res.json(photoalbum);
    //res.json({ message: "updated successfully" });
  } catch (err) {
    next(err);
  }
}

//
async function delete_(req, res, next) {
  try {
    let photoalbum = await getDocumentIfExist(Photoalbum, {
      _id: req.params.id
    });
    //removes image if its name is given as query string
    if (req.query.image) {
      await photoalbum.deleteImages(req.query.image);
      photoalbum = photoalbum.toObject();
      photoalbum["URL"] = imageURL;
      res.json(photoalbum);
      //res.json({ message: "deleted successfully" });
    } else {
      await photoalbum.remove();
      //res.json(photoalbum);
      res.json({ message: "deleted successfully" });
    }
  } catch (err) {
    next(err);
  }
}

//
module.exports = {
  getAll: getAll,
  getAllbyDepartment,
  getById: getById,
  delete_: delete_,
  update: update,
  create: create
};
