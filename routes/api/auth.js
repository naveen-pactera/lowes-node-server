const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const { validateLogin, validateEmail } = require("../../helpers/validators");
const jwt = require("jsonwebtoken");
const auth = require("../../middlewares/auth");

require("dotenv").config();

// This will help us connect to the database
// const db = require("../../database/models");
const { sendMail } = require("../../helpers/mailer");

// @route GET api/auth
// @desc Checks if the user is authenticated and returns user info. Used in every time page navigation
// @access public
router.route("/").get(auth, async (req, res) => {
  // console.log("req.user", req.user);
  let id = req.user.id;
  try {
    let user;
    if (req.user.usertype == "admin" || req.user.usertype == "storeuser") {
      user = {
        ...req.user,
      };
    } else {
      // user = await db.User.scope("login").findByPk(id, { raw: true });
      user = {};

      if (!user) {
        return res.status(400).json({ errors: [{ msg: "Invalid Token" }] }); //"This email is not yet registered!"
      }
      user = {
        ...user,
        usertype: "camerauser",
      };
    }
    res.json(user);
  } catch (err) {
    console.log("Error found", err);
    return res.status(500).json("Server Error");
  }
});

// This section will help you login a single user
router.route("/login").post(validateLogin, async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let payload;

    if (email == "admin@lowes.com") {
      payload = {
        id: "adm001",
        name: "Admin",
        email: email,
        usertype: "admin",
      };
    } else if (email == "storeuser@lowes.com") {
      payload = {
        id: "stusr001",
        name: "Store User",
        email: email,
        usertype: "storeuser",
      };
    } else {
      // let user = await db.User.scope("login").findOne({ where: { email } });
      let user = {};

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] }); //"This email is not yet registered!"
      }

      //validating the user password
      let passValidation = await user.validPassword(password);
      if (!passValidation) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // console.log(row.toJSON());

      user.lastLogin = new Date();
      user.save();

      payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        usertype: "camerauser",
      };
    }

    //send logged-in mail: TODO
    // sendMail("nav_g3@yahoo.com", "login"); //email

    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: process.env.jwtExpiration },
      (err, token) => {
        if (err) throw err;
        res.json({ user: payload, token });
      }
    );
  } catch (err) {
    console.log("Error found", err);
    return res.status(500).json("Trouble registering the User");
  }
});

// TODO - This section will send a mail with access token when forgot password
router.route("/forgot-password").post(validateEmail, async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;
  try {
    // let user = await db.User.findOne({ where: { email } });
    let user = {};

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "User not found" }] }); //"This email is not yet registered!"
    }

    //TODO
    //Generate a reset token
    //send the token
  } catch (err) {
    console.log("Error found", err);
    return res.status(500).json("Trouble registering the User");
  }
});

// TODO - This section will check if the reset-token is valid before showing the screen to reset the password
router
  .route("/check-reset-token/:token")
  .get(validateEmail, async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    try {
      // let user = await db.User.findOne({ where: { email } });
      let user = {};

      if (!user) {
        return res.status(400).json({ errors: [{ msg: "User not found" }] }); //"This email is not yet registered!"
      }

      //TODO
      //Generate a reset token
      //send the token
    } catch (err) {
      console.log("Error found", err);
      return res.status(500).json("Trouble registering the User");
    }
  });

module.exports = router;
