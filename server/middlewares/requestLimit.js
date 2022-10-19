const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour minutes
  max: 3, // Limit each IP to 5 requests per `window` (here, per hour minutes)
  message:
    "Too many request from this IP, please try again after an 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = limiter;
