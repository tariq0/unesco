const express = require("express");

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

const {
  depCreateValidationSchema,
  subdepCreateValidationSchema,
  depUpdateValidationSchema,
  subdepUpdateValidationSchema,
  paramsValidationSchema
} = require("./department-validator");

const {
  validator,
  requestParamsValidator
} = require("../../middlewares/validation-middleware");

const { getAllbyDepartment } = require("../photoalbum/photoalbum-controller");

const router = express.Router();

router.get("/", getAll);

router.get("/:id", requestParamsValidator(paramsValidationSchema), getById);

router.get(
  "/:id/photoalbums",
  requestParamsValidator(paramsValidationSchema),
  getAllbyDepartment
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
