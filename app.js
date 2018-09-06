var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
const path = require("path");

var public = require("./routes/public");
var restricted = require("./routes/restricted");

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.locals.config = {
  PUBLIC_API_USERNAME: process.env.PUBLIC_API_USERNAME,
  PUBLIC_API_PASSWORD: process.env.PUBLIC_API_PASSWORD,
  RESTRICTED_API_USERNAME: process.env.RESTRICTED_API_USERNAME,
  RESTRICTED_API_PASSWORD: process.env.RESTRICTED_API_PASSWORD,
  RESOURCE_MAP_URL: process.env.RESOURCE_MAP_URL
};

app.use(express.static(path.join(__dirname, "client/build")));

app.use("/api/public", public);
app.use("/api/restricted", restricted);

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.json({ error: err });
});

module.exports = app;
