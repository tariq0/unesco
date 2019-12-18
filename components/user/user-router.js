const express = require("express");

// controller functions
const {
  //CRUD
  getAll,
  getById,
  create,
  update,
  delete_,

  // signup login password functionality
  login,
  signup,
  verifyEmail,
  resendVerificationMail,
  forgotPassword,
  verifyNewPassword
} = require("./user-controller");

// validatons shemsa
const {
  signupValidationSchema,
  emailValidationSchema,
  createValidationSchema,
  loginValidationSchema,
  forgetPasswordVlidationSchema
} = require("./user-validator");

const { validator } = require("../../middlewares/validation-middleware");
const isAutheticated = require("./middleware/authentication");
const isAutorized = require("./middleware/authorization");

const router = express.Router();

// CRUD routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', delete_);

// user profile finctionality routes

// login
router.post("/login", validator(loginValidationSchema), login);

// signup process routets.
router.post("/signup", validator(signupValidationSchema), signup);

router.get("/verify/:token", verifyEmail);

router.post(
  "/resend-verification",
  validator(emailValidationSchema),
  resendVerificationMail
);

// forget password routes
router.post(
  "/forgot-password",
  validator(emailValidationSchema),
  forgotPassword
);

router.post(
  "/verify-new-password",
  validator(forgetPasswordVlidationSchema),
  verifyNewPassword
);

// test routes
// router.post('/test/authetication', isAutheticated, (req, res, next)=>{

//   res.json({user: req.user});
// });

// router.post('/test/authorization', isAutheticated,isAutorized([]), (req, res, next)=>{

//   res.json({user: req.user});
// });

module.exports = router;
