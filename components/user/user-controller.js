//

const { Verification } = require("./verify-token");
const _ = require("lodash");
const {
  getDocument,
  getDocumentsPaginated,
  getDocumentIfExist,
  getAndDeleteDocument
} = require("../../services/crud");
const { User } = require("./user");
const sendMail = require("../../services/mail");

// basic crud
async function getAll(req, res, next) {
  try {
    const page = parseInt(req.query.page);
    const perpage = parseInt(req.query.perpage) || 10;

    const result = await getDocumentsPaginated(User, {}, "", page, perpage);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const result = await getDocument(User, { _id: req.params.id });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const result = await User.createNewUser(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const user = await getDocumentIfExist(User, { _id: req.params.id });
    const newData = _.omit(req.body, ["password"]);
    user.set(newData);
    if (req.body.password) await user.setPassword(req.body.password);
    await user.save();

    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function delete_(req, res, next) {
  try {
    const result = await getAndDeleteDocument(User, { _id: req.params.id });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// common functionality
async function signup(req, res, next) {
  try {
    let user = await getDocument(User, { email: req.body.email });
    if (user) {
      const error = new Error();
      error.message = "user already exist";
      error.name = "ConflictError";
      throw error;
    }

    user = await User.createNewUser(req.body);
    const verificationToken = await Verification.createNewVerificationRecord(
      user._id
    );
    // sending verification mail
    const options = {
      email: "tariqabdelghani@gmail.com", // changeit to user.email later.
      subject: "Account Verification Token",
      message: verificationToken,
      html: ""
    };
    await sendMail(options);
    res.json({ message: "signedup successfully please verify your email" });
  } catch (err) {
    next(err);
  }
}

async function verifyEmail(req, res, next) {
  // check if verification record exists
  try {
    const userId = await Verification.getUserByVerificationToken(
      req.params.token
    );
    if (userId) {
      // update user verified state.
      //await updateInstance(User, { _id: userId }, { isVerified: true });
      const user = await getDocumentIfExist(User, { _id: userId });
      if (user.isVerified) {
        res.statusCode = 422;
        return res.json({ message: "you are already verified" });
      }
      user.isVerified = true;
      await user.save();
      res.json({ message: "verified successfulley" });
      // we should redirect to app page
    } else {
      // if not verified redirect to resend verification view
      return res.json({ message: "token is not valid or expired" });
    }
  } catch (err) {
    next(err);
  }
}

async function resendVerificationMail(req, res, next) {
  try {
    // check if body has email
    // check if email user exits
    // generate and send verification mail if user already existed and
    // is not verified.

    const user = await getDocument(User, { email: req.body.email });
    if (!user) {
      const error = new Error();
      error.name = "NotFoundError";
      error.message = "you are not registered .";
      throw error;
    }

    if (user.isVerified) {
      res.statusCode = 400;
      return res.json({ message: "you are already verified" });
    }

    const verificationToken = await Verification.createNewVerificationRecord(
      user._id
    );
    // sending verification mail
    const options = {
      email: "tariqabdelghani@gmail.com", // changeit to user.email later.
      subject: "Account Verification Token",
      message: verificationToken,
      html: ""
    };
    await sendMail(options);
    res.json({ message: "verification email has been sent." });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const user = await getDocument(User, { email: req.body.email });
    if (!user || !(await user.verifyPassword(req.body.password))) {
      res.statusCode = 422;
      return res.json({ message: "email or password is not correct." });
    } else if (!user.isVerified) {
      res.statusCode = 403;
      return res.json({ message: "you must verify first" });
    }

    const token = user.generateToken();
    const profile = (({ firstName, lastName, role }) => ({
      firstName,
      lastName,
      role
    }))(user);
    res.json({ user: profile, token: token });
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    // check if email user exits
    // generate and send verification mail if user already existed and
    // is not verified.

    const user = await getDocument(User, { email: req.body.email });
    if (!user) {
      const error = new Error();
      error.name = "ValidationError";
      error.message = "please enter valid email .";
      throw error;
    }

    const verificationToken = await Verification.createNewVerificationRecord(
      user._id
    );
    // sending verification mail
    const options = {
      email: "tariqabdelghani@gmail.com", // changeit to user.email later.
      subject: "rest password Token",
      message: verificationToken,
      html: ""
    };
    await sendMail(options);
    res.json({ message: "verification token has been sent" });
  } catch (err) {
    next(err);
  }
}

async function verifyNewPassword(req, res, next) {
  //get token from body
  // get user by token if exist
  // update his password and save
  try {
    const userId = await Verification.getUserByVerificationToken(
      req.body.token
    );

    if (!userId) return res.json({ message: "token is not valid or expired" });

    const user = await getDocumentIfExist(User, { _id: userId });
    await user.updatePasword(req.body.newPassword);
    await Verification.deleteToken(req.body.token);
    res.json({ message: "password changed successfulley" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  // CRUD
  create: create,
  getAll: getAll,
  getById: getById,
  update: update,
  delete_: delete_,

  // user profile functionality

  // login, signup, verification
  login: login,
  signup: signup,
  verifyEmail: verifyEmail,
  resendVerificationMail: resendVerificationMail,
  forgotPassword: forgotPassword,
  verifyNewPassword: verifyNewPassword
};
