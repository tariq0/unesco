//const {validateDepartment, validateSubepartment} = require('./department');

const Joi = require("@hapi/joi");

// validation logic
const subdepCreateValidationSchema = Joi.object({
  nameAr: Joi.string()
    .min(3)
    .max(20)
    .required(),

  nameEn: Joi.string()
    .min(3)
    .max(20)
    .required(),

  descriptionAr: Joi.string()
    .min(3)
    .max(300)
    .required(),

  descriptionEn: Joi.string()
    .min(3)
    .max(300)
    .required()
});

const depCreateValidationSchema = Joi.object({
  nameAr: Joi.string()
    .min(3)
    .max(20)
    .required(),

  nameEn: Joi.string()
    .min(3)
    .max(20)
    .required(),

  descriptionAr: Joi.string()
    .min(3)
    .max(300)
    .required(),

  descriptionEn: Joi.string()
    .min(3)
    .max(300)
    .required(),

  // photoalbums: Joi.array()
  // .items(Joi.objectId()),

  subdepartments: Joi.array().items(subdepCreateValidationSchema)
});

const paramsValidationSchema = Joi.object({
  id: Joi.objectId().message("invalid request parameters"),

  sid: Joi.objectId().message("invalid request parameters")
});

module.exports = {
  depCreateValidationSchema: depCreateValidationSchema,
  subdepCreateValidationSchema: subdepCreateValidationSchema,
  paramsValidationSchema: paramsValidationSchema
};
