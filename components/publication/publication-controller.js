const _ = require("lodash");

const { Publication } = require("./publication");
const {
  //
  getDocumentsPaginated,
  createDocument,
  getDocumentIfExist
  //
} = require("../../services/crud");
const config = require("config");

// const imageDir = config.get("publication.staticImgDir");
// const documentDir = config.get("publication.staticDocDir");
// const imageFieldName = config.get("publication.imgFieldName");
// const documentFieldName = config.get("publication.docFieldName");

async function getAll(req, res, next) {
  const page = req.query.page;
  const perPage = req.query.perpage;
  try {
    const { pagination, data } = await getDocumentsPaginated(
      Publication,
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
    const result = await createDocument(Publication, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    // update data if given
    console.log("inside update", req.body.documents);
    const publication = await getDocumentIfExist(Publication, {
      _id: req.params.id
    });

    const newData = _.omit(req.body.data, ["image", "documents"]);
    publication.set(newData);
    // if given image remove the current image and add the new one.
    if (req.body.image) {
      // replacing the image
      await publication.replaceImage(req.body.image);
    }

    if (req.body.documents) {
      console.log(req.body.documents);
      // adding documents in request to the data base
      publication.documents = publication.documents.concat(req.body.documents);
    }
    console.log();
    await publication.save();
    res.json({ publication });
    //
  } catch (err) {
    next(err);
  }
}

async function delete_(req, res, next) {
  try {
    // if query string exists then its to delete
    // file from the document if there is no query string
    // then its order to remove the document
    const query = req.query.document;
    const publication = await getDocumentIfExist(Publication, {
      _id: req.params.id
    });
    if (typeof query === "string") {
      await publication.removeDocuments(query);
      await publication.save();
      res.json(publication);
    } else if (Array.isArray(query)) {
      await publication.removeDocuments(query);
      await publication.save();
      res.json(publication);
    } else {
      await publication.remove();
      res.json(publication);
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll: getAll,
  create: create,
  update: update,
  delete_: delete_
};
