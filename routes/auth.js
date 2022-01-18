const router = require('express').Router()
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { registerValidation, loginValidation } = require('../validation')
const req = require('express/lib/request')


router.get('/register', (req, res) => {
  res.render('signup')
})
router.post('/register', async (req, res) => {
  
  console.log("post request made to register")

  //validating
  const { error } = registerValidation(req.body)
  if (error) return res.status(400).send(JSON.stringify(error.details[0].message))

  //check if email already exist
  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist) return res.status(400).send(JSON.stringify('Email is taken'))

  //hashing password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  //create user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  })
  try {
    const savedUser = await user.save()
    res.send({ user: user._id })
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/login', (req, res) => {
  res.render('login')
})

const maxAge = 3 * 24 * 60 * 60;


router.post('/login', async (req, res) => {

  console.log("post request made to login")
  
  //validating
  const { error } = loginValidation(req.body)
  if (error) return res.status(400).send(JSON.stringify(error.details[0].message))


  //check if email is valid
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send(JSON.stringify('Email or password is wrong'))
  

  //password check
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if (!validPass) return res.status(400).send(JSON.stringify('Invalid password'))

  //CREATE AND ASIGN JWT TOKEN
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
  res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
  res.header('auth-token', token).send(JSON.stringify(token))
})


router.get('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
})

module.exports = router
