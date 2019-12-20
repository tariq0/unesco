const Joi = require("@hapi/joi");

const createValidationSchema = Joi.object({
  nameAr: Joi.string()
    .min(3)
    .max(30)
    .required(),
  nameEn: Joi.string()
    .min(3)
    .max(30)
    .required(),

  descriptionShortAr: Joi.string()
    .min(3)
    .max(500)
    .required(),
  descriptionShortEn: Joi.string()
    .min(3)
    .max(500)
    .required(),

  descriptionLongAr: Joi.string()
    .min(3)
    .max(1000)
    .required(),
  descriptionLongEn: Joi.string()
    .min(3)
    .max(1000)
    .required(),

  image: Joi.string()
    .pattern(/(\.png)|(\.jpg)|(\.jpeg)$/, { name: "image" })
    .required(),

  documents: Joi.array().items(
    Joi.string()
      .pattern(/(\.pdf)|(\.doc)|(\.docx)$/)
      .required()
  ),
  organization: Joi.string()
    .min(5)
    .max(50)
    .required(),

  departmentId: Joi.objectId().required(),
  subdepartmentId: Joi.objectId(),

  activityId: Joi.objectId(),
  category: Joi.string()
    .min(3)
    .max(30)
    .required(),

  date: Joi.date()
});

const updateValidationSchema = Joi.object({
  nameAr: Joi.string()
    .min(3)
    .max(30),
  nameEn: Joi.string()
    .min(3)
    .max(30),

  descriptionShortAr: Joi.string()
    .min(3)
    .max(500),
  descriptionShortEn: Joi.string()
    .min(3)
    .max(500),

  descriptionLongAr: Joi.string()
    .min(3)
    .max(1000),
  descriptionLongEn: Joi.string()
    .min(3)
    .max(1000),

  image: Joi.string().pattern(/(\.png)|(\.jpg)|(\.jpeg)$/, { name: "image" }),
  documents: Joi.array().items(
    Joi.string()
      .pattern(/(\.pdf)|(\.doc)|(\.docx)$/)
      .required()
  ),

  organization: Joi.string()
    .min(5)
    .max(50),

  subdepartmentId: Joi.objectId(),

  activityId: Joi.objectId(),
  category: Joi.string()
    .min(3)
    .max(30),

  date: Joi.date()
});

module.exports = {
  createValidationSchema: createValidationSchema,
  updateValidationSchema: updateValidationSchema
};
