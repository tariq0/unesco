
const Joi = require('@hapi/joi');

const subdepartmentValidationSchema = Joi.object({
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
});

const departmentValidationSchema = Joi.object({
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
    
    subdepartments: Joi.array()
    .items(subdepartmentValidationSchema)

});

console.log(
    departmentValidationSchema.validate({})
)