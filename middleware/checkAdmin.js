// check current user
const User = require('../model/User')
const jwt = require('jsonwebtoken')



module.exports = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          return res.status(401).redirect('/');
        } else {
          let user = await User.findById(decodedToken._id);
            if (user && user.isAdmin) {
                next();
            }else {
                return res.status(401).redirect('/');
            }
         
        }
      });
    } else {
        return res.status(401).redirect('/api/user/login');
    }
  };
  