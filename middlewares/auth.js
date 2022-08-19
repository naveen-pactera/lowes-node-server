const jwt_decode = require("jwt-decode");

require("dotenv").config();

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  //check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  //verify token
  try {
    const decoded = jwt_decode(token);
    // console.log("decoded token", decoded);
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid!" });
  }
};
