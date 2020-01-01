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


async function getAll(req, res, next) {
  const page = parseInt(req.query.page);
      const perPage = parseInt(req.query.perpage);
  const order = {date: -1};
  try {
    const { pagination, data } = await getDocumentsPaginated(
      Publication,
      order,
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
    //res.json(result);
    res.json({message: "successfully created"});
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
      //console.log(req.body.documents);
      // adding documents in request to the data base
      publication.documents = publication.documents.concat(req.body.documents);
    }
    console.log();
    await publication.save();
    //res.json({ publication });
    res.json({message: "successfully updated"});
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
    if (query) {
      await publication.removeDocuments(query);
      await publication.save();
      //res.json(publication);
      res.json({message: "successfully deleted"});
    } else {
      await publication.remove();
      //res.json(publication);
      res.json({message: "successfully deleted"});
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
