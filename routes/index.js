var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/error", function (req, res) {
  res.status(500).json({ status: false, msg: req.session.messages })
})

router.get("/error", function (req, res) {
  res.status(401).json({ status: false, msg: "Session expired\nPlease login again." })
})

module.exports = router;
