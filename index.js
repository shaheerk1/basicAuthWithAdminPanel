const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const checkUser = require('./middleware/checkUser');

//import route
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const adminRoute = require('./routes/admin')

dotenv.config()

//connect DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
  console.log('connected to Database')
)

//Middleware
app.use(express.static('public'))
app.use(express.json())
app.use(
  cors({
    origin: '*',
  })
)
// view engine
app.set('view engine', 'ejs');
app.use(cookieParser());

app.get('*', checkUser);



app.get('/', (req, res) => {
  res.render('home')
})

//Router Middlewares
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/admindashboard', adminRoute)


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`server running in port ${port}`))
