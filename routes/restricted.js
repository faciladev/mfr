const express = require("express");
const axios = require("axios");
const decoder = require("../shared/utility");

const router = express.Router();

//Restricted api requests
router.get("/", function(req, res, next) {
  axios({
    method: "get",
    url: `https://resourcemap.eth.instedd.org/api/${decoder(req.query.url)}`,
    auth: {
      username: req.app.locals.config.RESTRICTED_API_USERNAME,
      password: req.app.locals.config.RESTRICTED_API_PASSWORD
    },
    withCredentials: true,
    timeout: 5000
  })
    .then(response => res.json(response.data))
    .catch(function(err) {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        return next(err.response);
      } else if (err.request) {
        // The request was made but no response was received
        // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(err.request);
        return next(err.request);
      } else {
        // Something happened in setting up the request that triggered an err
        console.log("err", err.message);
        return next(err.message);
      }
    });
});

module.exports = router;
