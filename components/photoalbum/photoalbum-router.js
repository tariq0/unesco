//
const router = require("express").Router();
const { clearImages, uploadImage} = require("./services/upload");
const { getAll, getById,create, delete_, update } = require("./photoalbum-controller");

const {
  createValidationSchema,
  updateValidationSchema,
  paramsValidationSchema
} = require("./photoalbum-validator");

const {
  validator,
  requestParamsValidator
} = require("../../middlewares/validation-middleware");



router.get("/", getAll);
router.get("/:id", getById);

router.post(
  "/",
  uploadImage,
  validator(createValidationSchema, clearImages),
  create
);

router.put(
  "/:id",
  requestParamsValidator(paramsValidationSchema),
  uploadImage,
  validator(updateValidationSchema, clearImages),
  update
); // dont forget to make update validator

router.delete("/:id", requestParamsValidator(paramsValidationSchema), delete_);

module.exports = router;
