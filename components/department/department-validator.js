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

const subdepUpdateValidationSchema = Joi.object({
  nameAr: Joi.string()
    .min(3)
    .max(20),

  nameEn: Joi.string()
    .min(3)
    .max(20),

  descriptionAr: Joi.string()
    .min(3)
    .max(300),

  descriptionEn: Joi.string()
    .min(3)
    .max(300)
})
  .min(1)
  .message("empty request !!");
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

  subdepartments: Joi.array().items(subdepCreateValidationSchema)
});

const depUpdateValidationSchema = Joi.object({
  nameAr: Joi.string()
    .min(3)
    .max(20),

  nameEn: Joi.string()
    .min(3)
    .max(20),

  descriptionAr: Joi.string()
    .min(3)
    .max(300),

  descriptionEn: Joi.string()
    .min(3)
    .max(300),

  subdepartments: Joi.array().items(subdepCreateValidationSchema)
})
  .min(1)
  .message("empty request !!");

const paramsValidationSchema = Joi.object({
  id: Joi.objectId().message("invalid request parameters"),

  sid: Joi.objectId().message("invalid request parameters")
});

module.exports = {
  depCreateValidationSchema: depCreateValidationSchema,
  depUpdateValidationSchema: depUpdateValidationSchema,
  subdepCreateValidationSchema: subdepCreateValidationSchema,
  subdepUpdateValidationSchema: subdepUpdateValidationSchema,
  paramsValidationSchema: paramsValidationSchema
};
