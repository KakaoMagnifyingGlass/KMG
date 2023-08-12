const jwt = require("jsonwebtoken");

const EXPIRATION_TIME = "1h";

exports.createAccessToken = (userId, isRememberMe = false) => {
  const expiresIn = EXPIRATION_TIME;
  return jwt.sign({ userId, isRememberMe }, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn,
    issuer: "young",
  });
};
