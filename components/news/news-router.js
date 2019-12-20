const router = require("express").Router();
const { getAll, create, update, delete_ } = require("./news-controller");
const { validator } = require("../../middlewares/validation-middleware");
const { uploadFiles, clearFiles } = require("./services/upload");
const {
  createValidationSchema,
  updateValidationSchema
} = require("./news-validator");

router.get("/", getAll);
router.post(
  "/",
  uploadFiles,
  validator(createValidationSchema, clearFiles),
  create
);
router.put(
  "/:id",
  uploadFiles,
  validator(updateValidationSchema, clearFiles),
  update
);
router.delete("/:id", delete_);

// router.delete("/test/test", (req, res, next)=>{

//   res.json({query: req.query, body: req.body});
// });

module.exports = router;
