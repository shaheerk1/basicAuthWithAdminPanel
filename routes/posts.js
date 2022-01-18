const router = require('express').Router()
const verify = require('../middleware/verifyToken')


router.get('/', verify, async(req, res) => {
console.log("post route accessed")
  res.render('post');
})

module.exports = router
