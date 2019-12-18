const express = require("express");
const cors = require("cors");
const config = require("config");
const departmentRouter = require("../components/department/department-router");
const photoalbumRouter = require("../components/photoalbum/photoalbum-router");
const publicationRouter = require("../components/publication/publication-router");
const userRouter = require("../components/user/user-router");
const errorHandler = require("../middlewares/error-middleware");

module.exports = function(app) {
  app.use(cors());
  app.options("*", cors());

  app.use(express.static(config.get("static.staticRootDir")));
  app.use(express.json());
  app.use("/api/departments", departmentRouter);
  app.use("/api/photoalbums", photoalbumRouter); //
  app.use("/api/publications", publicationRouter);
  app.use("/api/users", userRouter);
  app.use(errorHandler);
};
