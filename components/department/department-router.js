const express = require("express");
// CRUD
const {
  create,
  update,
  getAll,
  getById,
  delete_,
  addSubdepartment,
  updateSubdepartment,
  deleteSubdepartment
} = require("./department-controller");
// Validation Schemas
const {
  depCreateValidationSchema,
  subdepCreateValidationSchema,
  depUpdateValidationSchema,
  subdepUpdateValidationSchema,
  paramsValidationSchema
} = require("./department-validator");
// Validation Middlewares
const {
  validator,
  requestParamsValidator
} = require("../../middlewares/validation-middleware");
// external controllers
const  photoController  = require("../photoalbum/photoalbum-controller");
const newsController = require("../news/news-controller");


const router = express.Router();

router.get("/", getAll);

router.get("/:id", requestParamsValidator(paramsValidationSchema), getById);

router.get(
  "/:id/photoalbums",
  requestParamsValidator(paramsValidationSchema),
  photoController.getAllbyDepartment
);

router.get(
  "/:id/news",
  requestParamsValidator(paramsValidationSchema),
  newsController.getAllByDepartment
);

router.post("/", validator(depCreateValidationSchema), create);

router.put(
  "/:id",
  requestParamsValidator(paramsValidationSchema),
  validator(depUpdateValidationSchema),
  update
);

router.delete("/:id", requestParamsValidator(paramsValidationSchema), delete_);

router.post(
  "/:id/subdepartments",
  requestParamsValidator(paramsValidationSchema),
  validator(subdepCreateValidationSchema),
  addSubdepartment
);

router.put(
  "/:id/subdepartments/:sid",
  requestParamsValidator(paramsValidationSchema),
  validator(subdepUpdateValidationSchema),
  updateSubdepartment
);

router.delete(
  "/:id/subdepartments/:sid",
  requestParamsValidator(paramsValidationSchema),
  deleteSubdepartment
);

module.exports = router;
