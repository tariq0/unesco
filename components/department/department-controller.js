const { Department, Subdepartment } = require("./department");
const {
  createInstance,
  getAndUpdateInstance,
  getAndDeleteInstance,
  getItems,
  getItemBy,
  addEmbeddedDocument,
  updateEmbeddedDocument,
  delteEmbeddedDocument
} = require("../../services/crud");

async function create(req, res, next) {
  try {
    const department = await createInstance(Department, req.body);
    res.send(department);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const department = await getAndUpdateInstance(
      Department,
      req.params.id,
      req.body
    );
    res.send(department);
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const departments = await getItems(Department);
    res.json(departments);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const department = await getItemBy(Department, { _id: req.params.id });
    res.json(department);
  } catch (err) {
    next(err);
  }
}

async function delete_(req, res, next) {
  try {
    const department = await getAndDeleteInstance(Department, req.params.id);
    res.json({ message: "deleted successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

/** working with subdocuments */
//
async function addSubdepartment(req, res, next) {
  try {
    const department = await addEmbeddedDocument(
      Department,
      req.params.id,
      "subdepartments",
      Subdepartment,
      req.body
    );

    res.json(department);
  } catch (err) {
    next(err);
  }
}

async function updateSubdepartment(req, res, next) {
  try {
    const department = await updateEmbeddedDocument(
      Department,
      req.params.id,
      "subdepartments",
      Subdepartment,
      req.params.sid,
      req.body
    );
    res.json(department);
  } catch (err) {
    next(err);
  }
}

async function deleteSubdepartment(req, res, next) {
  try {
    const department = await delteEmbeddedDocument(
      Department,
      req.params.id,
      "subdepartments",
      req.params.sid
    );

    res.json(department);
  } catch (err) {
    //console.log(err);
    next(err);
  }
}
//
module.exports = {
  create: create,
  getAll: getAll,
  getById: getById,
  update: update,
  delete_: delete_,
  addSubdepartment: addSubdepartment,
  updateSubdepartment: updateSubdepartment,
  deleteSubdepartment: deleteSubdepartment
};
