const { Publication } = require("./publication");
const { getItemsPaginated, createInstance} = require("../../services/crud");
const config = require("config");

async function getAll(req, res, next) {
  const page = req.query.page;
  const perPage = req.query.perpage;
  try {
    const { pagination, data } = await getItemsPaginated(
      Publication,
      {},
      {},
      "",
      page,
      perPage
    );
    const documentsURL = config.get("publication.staticImgUrl");
    const imageURL = config.get("publication.staticDocUrl");
    res.json({
      pagination: pagination,
      data: data,
      documentsURL: documentsURL,
      imageURL: imageURL
    });
  } catch (err) {
    next(err);
  }
}
async function create(req, res, next) {
  try {
    const result = await createInstance(Publication, req.body);
    res.json(result); 
  } catch (err) {
    throw err
  }
}
async function update(req, res, next) {}
async function delete_(req, res, next) {}

module.exports = {
  getAll: getAll,
  create: create,
  update: update,
  delete_: delete_
};
