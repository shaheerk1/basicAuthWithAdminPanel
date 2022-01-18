const jwt = require('jsonwebtoken')


module.exports = function (req, res, next) {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).redirect('/api/user/login');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified
    next()
  } catch (err) {
    
    res.status(400).redirect('/api/user/login');
  }
}
