//
const config = require("config");

async function paginate(Model, filter, order, options, page, perPage) {

  if (page <= 0) {
    let error = new Error();
    error.message = "page cant be negative or zero";
    error.name = "ValidationError";
    throw error;
  }
  if (perPage > config.get("pagination.maxPerPage")) {
    let error = new Error();
    error.message = "exceeding max number per page.";
    error.name = "ValidationError";
    throw error;
  }
  // setting main arguments to default if not given.
  if (!page) page = 1;
  if (!perPage) perPage = config.get('pagination.defaultPerPage');
  
  const numberOfDocs = await Model.estimatedDocumentCount(filter);
  //console.log(numberOfDocs);
  if (!numberOfDocs) {
    return {
      pagination: {
        page: 1,
        numberOfPages: 1,
        nextState: false,
        previousState: false
      },
      data: []
    };
  }

  const numberOfPages = Math.ceil(numberOfDocs / perPage);
  const skip = (page - 1) * perPage;

  if (page > numberOfPages) {
    let error = new Error();
    error.message = `page ${page} is not found`;
    error.name = "NotFoundError";
    throw error;
  }

  const docs = await Model.find(filter)
    .select(options)
    .skip(skip)
    .limit(perPage)
    .sort(order);

  return {
    pagination: {
      page: page,
      numberOfPages: numberOfPages,
      nextState: numberOfPages > page ? true : false,
      previousState: page > 1 ? true : false
    },
    data: docs
  };
}

module.exports = paginate;
