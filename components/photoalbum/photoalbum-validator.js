
const Joi = require('@hapi/joi');

const createValidationSchema = Joi.object({
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

    departmentId: Joi.objectId()
    .required(),

    images: Joi.array()
    .items(
        Joi.string().
        pattern(/(\.png)|(\.jpg)|(\.jpeg)$/, {name: 'images'}).required()
        
        ).required(),
    
    date: Joi.date()

});

const updateValidationSchema = Joi.object({
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

    images: Joi.array()
    .items(
        Joi.string().
        pattern(/(\.png)|(\.jpg)|(\.jpeg)$/, {name: 'images'}).required()), 

}).or('nameAr', 'nameEn', 'descriptionAr', 'descriptionEn', 'images');


const paramsValidationSchema = Joi.object({
   id: Joi.objectId()
   .message('invalid request parameters'),

   pid: Joi.objectId()
   .message('invalid request parameters')
});

module.exports = {
    createValidationSchema: createValidationSchema,
    updateValidationSchema: updateValidationSchema,
    paramsValidationSchema: paramsValidationSchema
}