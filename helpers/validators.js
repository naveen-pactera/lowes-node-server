const { check, param, validationResult } = require("express-validator");

exports.validateUser = [
  check("name")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Name can not be empty!")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .bail(),
  check("email")
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage("Email can not be empty!")
    .bail()
    .isEmail()
    .withMessage("Invalid email address!")
    .bail(),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password cannot be empty!")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Minimum 6 characters required!")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.validateLogin = [
  check("email")
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage("Email can not be empty!")
    .bail()
    .isEmail()
    .withMessage("Invalid email address!")
    .bail(),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password cannot be empty!")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.validateEmail = [
  check("email")
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage("Email can not be empty!")
    .bail()
    .isEmail()
    .withMessage("Invalid email address!")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.validateToken = [
  param("token").trim().not().isEmpty().withMessage("Token not found!").bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.validateResetPassword = [
  check("email")
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage("Email can not be empty!")
    .bail()
    .isEmail()
    .withMessage("Invalid email address!")
    .bail(),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password cannot be empty!")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Minimum 6 characters required!")
    .bail()
    .custom((value, { req, loc, path }) => {
      if (value !== req.body.confirmPassword) {
        // trow error if passwords do not match
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    })
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
