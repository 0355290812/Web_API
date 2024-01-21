const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const router = require('./routes/index.routes')
const db = require('./configs/db.config')
const authRouter = require('./routes/auth.routes')
const guestRoute = require('./routes/guest.routes')
const app = express()
app.use('/uploads', express.static('uploads'));

dotenv.config()

db.connect()

app.use(morgan('dev'))
app.use(cors())
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
//   optionsSuccessStatus: 200
// }));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api', router)
app.use('/auth', authRouter)
app.use('/', guestRoute)

app.listen(process.env.HOST, () => {
  console.log("http://localhost:3001")
})