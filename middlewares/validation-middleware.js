//

function validateService(body, schema) {
  const result = schema.validate(body);
  return result;
}

function validator(validationSchema, cb) {
  // cb is called if error and must be async
  return async (req, res, next) => {
    const result = validateService(req.body, validationSchema);
    if (result.error) {
      res.statusCode = 422;
      if (cb) await cb(req);
      console.log(result.error);
      return res.send(result.error.details[0].message);
    } else next();
  };
}

function requestParamsValidator(validationSchema) {
  return (req, res, next) => {
    const result = validateService(req.params, validationSchema);
    if (result.error) {
      res.statusCode = 422;
      return res.send(result.error.details[0].message);
    } else next();
  };
}

module.exports = {
  validator: validator,
  requestParamsValidator: requestParamsValidator
};
