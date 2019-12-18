//
const config = require('config');


async function getItems(Model, filter, order, select){
  const result = await Model.find(filter)
  .order(order)
  .select(select);
}

async function getItemsPaginated(Model, filter, order, select, page, perPage) {
  // when getting all items it should be paginated.

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
        perPage:perPage,
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
    .select(select)
    .skip(skip)
    .limit(perPage)
    .sort(order);

  return {
    pagination: {
      perPage:perPage,
      page: page,
      numberOfPages: numberOfPages,
      nextState: numberOfPages > page ? true : false,
      previousState: page > 1 ? true : false
    },
    data: docs
  };
}


async function getItemBy(Model, filter, select) {
  return await Model.findOne(filter).select(select);
}

async function getItemIfExist(Model, filter, select) {
  // throws error if not found
  const result = await Model.findOne(filter).select(select);
  if (!result) {
    const error = new Error();
    error.message = "not found error";
    error.name = "NotFoundError";
    throw error;
  } else {
    return result;
  }
}


async function createInstance(Model, data) {
  const instance = new Model(data);
  await instance.save();
  return instance;
}

async function getAndUpdateInstance(Model, id, data) {
  // check if found then update
  // if not found throws error
  let item = await Model.findById(id);
  if (!item) {
    const error = new Error();
    error.message = "not found error";
    error.name = "NotFoundError";
    throw error;
  }
  item.set(data);
  await item.save();
  return item;
}

async function updateInstance(Model, filter, data){
  // updates document directly in data base
  const result = await Model.updateOne(filter, data);
  return result;
}

async function getAndDeleteInstance(Model, id) {
  let item = await Model.findById(id);
  if (!item) {
    const error = new Error();
    error.message = "not found error";
    error.name = "NotFoundError";
    throw error;
  }
  await item.remove();
  return item;
}

async function deleteInstances(Model, filter) {
  await Model.deleteMany(filter);
}

// embedded document crud

async function addEmbeddedDocument(
  ParentModel,
  parentId /** add the subdocument feild as argument not hard coded */,
  childFieldName,
  ChildModel,
  childData
) {
  let parent = await ParentModel.findById(parentId);

  if (!parent) throw new Error("not found error");

  const child = new ChildModel(childData);
  parent[childFieldName].push(child);
  await parent.save();
  return parent;
}

async function updateEmbeddedDocument(
  ParentModel,
  parentId,
  childFieldName,
  ChildModel,
  childId,
  childData
) {
  let parent = await ParentModel.findById(parentId);

  if (!parent) {
    const err = new Error();
    err.name = "NotFoundError";
    err.message = "resource not found";
    throw err;
  }

  let child = parent[childFieldName].id(childId);
  if (!child) {
    const err = new Error();
    err.name = "NotFoundError";
    err.message = "resource not found";
    throw err;
  }

  child.set(childData);
  await parent.save();

  return parent;
}

async function delteEmbeddedDocument(
  ParentModel,
  parentId,
  childFieldName,
  //ChildModel,
  childId
  //childData
) {
  const parent = await ParentModel.findById(parentId);
  if (!parent) {
    const err = new Error();
    err.name = "NotFoundError";
    err.message = "resource not found";
    throw err;
  }

  const child = parent[childFieldName].id(childId);
  if (!child) {
    const err = new Error();
    err.name = "NotFoundError";
    err.message = "resource not found";
    throw err;
  }

  child.remove();
  await parent.save();
  return parent;
}

module.exports = {
  // get 
  getItems: getItems,
  getItemsPaginated: getItemsPaginated,
  getItemBy: getItemBy,
  getItemIfExist: getItemIfExist,
  
  //checkItemIfExist: checkItemIfExist,
  // create
  createInstance: createInstance,
  // update
  getAndUpdateInstance: getAndUpdateInstance,
  updateInstance: updateInstance,
  // delete
  getAndDeleteInstance: getAndDeleteInstance,
  deleteInstances: deleteInstances,
  
  // embeddeddocument operations
  addEmbeddedDocument: addEmbeddedDocument,
  updateEmbeddedDocument: updateEmbeddedDocument,
  delteEmbeddedDocument: delteEmbeddedDocument
};
