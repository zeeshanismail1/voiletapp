const express = require("express");
const cookieparser = require("cookie-parser");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoute");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

app.use(cookieparser());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
  parameterLimit: 100000,
  limit: '500mb'
}));
connectDB();
app.use(userRoutes);

// app.use('/', (req, res) => {
//   res.send('Hello World');
// })

app.listen(process.env.PORT || 5002, () => {
  console.log("Server running at port", process.env.PORT);
});

module.exports = app;