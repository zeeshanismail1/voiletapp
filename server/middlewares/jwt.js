"use strict";
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  issue(payload, expiresIn) {
    return jwt.sign(payload, "webevisSecretKey0001", {
      expiresIn: expiresIn ? expiresIn : "3d",
    });
  },
  verify(token) {
    try {
      return jwt.verify(token, "webevisSecretKey0001");
    } catch (err) {
      return false;
    }
  },
};
