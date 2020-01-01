const router = require("express").Router();
const {
  getAll,
  getBy,
  update,
  create,
  delete_
} = require("./country-controller");

router.get("/", getAll);
router.get("/:id", getBy);

router.post("/", create);
router.put("/:id", update);

router.delete("/:id", delete_);

module.exports = router;
