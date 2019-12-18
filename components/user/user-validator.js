const Joi = require("@hapi/joi");

const emailValidationSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required()
});


const addressValidationSchema = Joi.object({
  country: Joi.string()
    .min(3)
    .max(20),
  city: Joi.string()
    .min(3)
    .max(20)
});

const passwordValidationSchema = Joi.string()
.min(3)
.max(30)
.required();


const signupValidationSchema = Joi.object({
  firstName: Joi.string()
    .min(3)
    .max(30)
    .required(),

  lastName: Joi.string()
    .min(3)
    .max(30),

  password: passwordValidationSchema,

  phone: Joi.string().pattern(/^01[0125]\d{8}$/, { name: "numbers" }),

  birthDate: Joi.date(),

  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),

  role: Joi.string()
    .min(3)
    .max(30),
  job: Joi.string()
    .min(3)
    .max(50),

  isVerified: Joi.bool(),

  address: addressValidationSchema
});

// used by admin to create subadmins
const createValidationSchema = Joi.object({
  firstName: Joi.string()
    .min(3)
    .max(30),

  lastName: Joi.string()
    .min(3)
    .max(30),

  password: passwordValidationSchema,

  phone: Joi.string().pattern(/^01[0125]\d{8}$/, { name: "numbers" }),

  birthDate: Joi.date(),

  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),

  role: Joi.string()
    .min(3)
    .max(30),
  job: Joi.string()
    .min(3)
    .max(50),

  isVerified: Joi.bool(),

  address: addressValidationSchema
});

const loginValidationSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),

  password: Joi.string()
    .min(3)
    .max(30)
    .required()
});

const forgetPasswordVlidationSchema = Joi.object({
  token: Joi.objectId()
  .message('invalid token')
  .required(),

  newPassword: passwordValidationSchema
});


module.exports = {
  signupValidationSchema: signupValidationSchema,
  createValidationSchema: createValidationSchema,
  signupValidationSchema: signupValidationSchema,
  emailValidationSchema: emailValidationSchema,
  loginValidationSchema: loginValidationSchema,
  forgetPasswordVlidationSchema: forgetPasswordVlidationSchema
};
