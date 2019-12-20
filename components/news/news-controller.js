const {
  getItemsPaginated,
  getItemsPaginatedAndFiltered,
  getFilteredItemsCount,
  createInstance,
  getItemIfExist,
  getAndDeleteInstance
} = require("../../services/crud");
const { News } = require("./news");
const config = require("config");
const _ = require('lodash');
const imageURL = config.get("news.staticImgUrl");
const documentsURL = config.get("news.staticDocUrl");

async function getAll(req, res, next) {
  // gets all by this year if found
  // or gets all (archive) if no records for this year
  // or archive is required.
  try {
    const archive = req.query.archive;
    const page = req.query.page;
    const perPage = req.query.perpage;

    const order = { date: -1 };

    const currentYear = new Date().getFullYear();
    const ltYear = currentYear + 1;
    const gtYear = currentYear - 1;
    const ltDate = `${ltYear}-01-01`;
    const gtDate = `${gtYear}-01-01`;

    const filterByThisYear = {
      $and: [{ date: { $lt: ltDate } }, { date: { $gt: gtDate } }]
    };

    const currentYearNewsCount = await getFilteredItemsCount(
      News,
      filterByThisYear
    );
    if (archive || !currentYearNewsCount) {
      console.log("inside archive!");
      const result = await getItemsPaginated(News, order, "", page, perPage);
      res.json(result);
    } else {
      console.log("inside news for the current year!");
      const result = await getItemsPaginatedAndFiltered(
        News,
        filterByThisYear,
        order,
        "",
        page,
        perPage
      );
      res.json(result);
    }
  } catch (err) {
    next(err);
  }
}
//
//
//

async function getAllBy(req, res, next) {
  const page = req.query.page;
  const perPage = req.query.perpage;
  const order = { date: -1 };
  // this id is department id
  const filter = { deparmentId: req.params.id };
  const result = await getItemsPaginatedAndFiltered(
    News,
    filter,
    order,
    "",
    page,
    perPage
  );

  res.json(result);
  try {
  } catch (err) {
    next(err);
  }
}
//
//
//

async function create(req, res, next) {
  try {
    const result = await createInstance(News, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
//
//


async function update(req, res, next) {
  try {
    const newImage = req.body.image;
    const documents = req.body.documents;
    const news = await getItemIfExist(News, {_id: req.params.id});
    const newData = _.omit(req.body, ["image", "documents"]);
    // if new attributes are inculded update it
    news.set(newData);
    if(newImage) await news.replaceImage(newImage);
    if(documents) news.addDocuments(documents);
    await news.save();
    res.json(news);
  } catch (err) {
    next(err);
  }
}
//
//


async function delete_(req, res, next) {
  try {
    console.log('req.query: ', req.query);
    if(req.query.document){
      //console.log('case1');
      const documents = req.query.document;
      const news = await getItemIfExist(News, {_id: req.params.id});
      await news.removeDocuments(documents);
      await news.save();
      res.json(news)
    }else{
      console.log('case2')
      const news = await getAndDeleteInstance(News, req.params.id);
      res.json(news);
    }
   
  } catch (err) {
    next(err);
  }
}
//
//
//

module.exports = {
  getAll: getAll,
  getAllBy: getAllBy,
  create: create,
  update: update,
  delete_: delete_
};
