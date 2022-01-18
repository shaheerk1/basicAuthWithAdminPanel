const router = require('express').Router()
const verify = require('../middleware/verifyToken')
const checkAdmin = require('../middleware/checkAdmin')


router.get('/', verify, checkAdmin, async(req, res) => {
console.log("admin route accessed")
  res.render('admin');
})

module.exports = router
