const {
  getDocumentsPaginated,
  getDocument,
  getDocuments,
  getAndUpdateDocument,
  createDocument,
  getAndDeleteDocument
} = require("../../services/crud");

const Country = require("./country");

async function getAll(req, res, next) {
  try {

    if( req.query.page){
      const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perpage);

    const result = await getDocumentsPaginated(Country, {_id: -1}, "", page, perPage);

    res.json(result);
    }else{
      const result = await getDocuments(Country,{},{_id:-1},"");
      res.json(result);
    }
    
  } catch (error) {
    next(error);
  }
}

async function getBy(req, res, next) {
  try {
    const result = await getDocument(Country, { _id: req.params.id });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const result = await createDocument(Country, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const result = await getAndUpdateDocument(Country, req.params.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function delete_(req, res, next) {
  try {
    const result = await getAndDeleteDocument(Country, req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll: getAll,
  getBy: getBy,
  update: update,
  create: create,
  delete_: delete_
};
