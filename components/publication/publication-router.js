const router = require("express").Router();
const { getAll, getById,create, update, delete_ } = require("./publication-controller");
const {
  createValidationSchema,
  updateValidationSchema,
  paramsValidationSchema
} = require("./publication-validator");
const {
  validator,
  requestParamsValidator
} = require("../../middlewares/validation-middleware");
const { uploadFiles, clearFiles } = require("./services/upload");

router.get("/", getAll);
router.get("/:id",requestParamsValidator(paramsValidationSchema), getById);
router.post(
  "/",
  uploadFiles,
  validator(createValidationSchema, clearFiles),
  create
);
router.put(
  "/:id",
  requestParamsValidator(paramsValidationSchema),
  uploadFiles,
  validator(updateValidationSchema, clearFiles),
  update
);
router.delete("/:id", delete_);

router.delete("/test", (req, res, next) => {
  res.json(req.query);
});

module.exports = router;
