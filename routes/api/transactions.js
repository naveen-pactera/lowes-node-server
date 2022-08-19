const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const { validateUser } = require("../../helpers/validators");
const jwt = require("jsonwebtoken");
const auth = require("../../middlewares/auth");
require("dotenv").config();

// This will help us connect to the database
// const db = require("../../database/models");

// This section will help you get a list of all the users.
router.route("/").get(auth, async (req, res) => {
  try {
    // let rows = await db.User.findAll();
    let rows = {
      row1: "row1 content",
    };

    res.json(rows);
  } catch (err) {
    console.log("Error found", err);
    res.status(500).json("Trouble fetching the users");
  }
});

// This section will help you get a single user by id
router.route("/:id").get(auth, async (req, res) => {
  try {
    // let row = await db.User.findByPk(req.params.id);
    let row = {};

    res.json(row);
  } catch (err) {
    console.log("Error found", err);
    res.status(500).json("Trouble fetching the User Details");
  }
});

// This section will help you register/signup a single user by id
router.route("/").post(auth, validateUser, async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  try {
    // let user = await db.User.scope("signup").findOne({ where: { email } });
    let user = {};

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    // let row = await db.User.create({
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: req.body.password,
    // });
    let row = {};
    // console.log(row.toJSON());

    let payload = {
      id: row.id,
      name: row.name,
      email: row.email,
    };

    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: process.env.jwtExpiration },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.log("Error found", err);
    return res.status(500).json("Trouble registering the User");
  }
});

// This section will help you delete a single user by id
router.route("/:id").delete(auth, async (req, res) => {
  try {
    // let row = await db.User.destroy({
    //   where: {
    //     id: req.params.id,
    //   },
    // });
    let row = {};

    res.status(200).json("Record deleted successfully");
  } catch (err) {
    console.log("Error found", err);
    res.status(500).json("Trouble fetching the User Details");
  }
});

module.exports = router;
