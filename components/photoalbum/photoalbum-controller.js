//
//
//
//
const _ = require("lodash");
const config = require('config');
const { Photoalbum } = require("./photoalbum");
const { Department } = require("../department/department");
const {
  getItemsPaginated,
  getItemBy,
  getItemIfExist,
  createInstance,
} = require("../../services/crud");

//
async function getAll(req, res, next) {
  try {
    const page = parseInt(req.query.page);
    const perpage = parseInt(req.query.perpage) || 1;

    const result = await getItemsPaginated(
      Photoalbum,
      {},
      "",
      page,
      perpage
    );
    const {pagination, data} = result;
    const URL = config.get('photoalbum.staticImgUrl');
    res.json({
      URL: URL,
      pagination:pagination,
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

    const result = await getItemsPaginated(
      Photoalbum,
      { departmentId: req.params.id },
      {},
      {},
      page,
      perpage
    );
    const {pagination, data} = result;
    const URL = config.get('photoalbum.staticImgUrl');
    res.json({
      URL: URL,
      pagination:pagination,
      data: data
    });
  } catch (err) {
    next(err);
  }
}

//
async function getById(req, res, next) {
  try {
    const photoalbum = await getItemBy(Photoalbum, { _id: req.body.pid });
    res.json(photoalbum);
  } catch (err) {
    next(err);
  }
}

//
async function create(req, res, next) {
  try {
    const department = await getItemIfExist(Department, {
      _id: req.body.departmentId
    });
    const photoalbum = await createInstance(Photoalbum, req.body);
    res.json(photoalbum);
  } catch (err) {
    next(err);
  }
}

//
async function update(req, res, next) {
  try {
    let photoalbum = await getItemIfExist(Photoalbum, {
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
    if(images)  photoalbum.images = images.concat(photoalbum.images);
   
    await photoalbum.save();
    res.json(photoalbum);
  } catch (err) {
    next(err);
  }
}

//
async function delete_(req, res, next) {
  try {
    let photoalbum = await getItemIfExist(Photoalbum, {
      _id: req.params.id
    });
    //removes image if its name is given as query string
    if (req.query.name) {
      await photoalbum.deleteImage(req.query.name);
      res.json({ message: "deleted successfully" });
    } else {
      await photoalbum.remove();
      res.json(photoalbum);
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
