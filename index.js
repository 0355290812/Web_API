const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const router = require('./routes/index.routes')
const db = require('./configs/db.config')
const authRouter = require('./routes/auth.routes')
const Instructor = require('./models/instructor.models')
const guestRoute = require('./routes/guest.routes')
const app = express()

dotenv.config()

db.connect()

app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/api', router)
app.use('/auth', authRouter)
app.use('/', guestRoute)
app.listen(process.env.HOST, () => {
    console.log("http://localhost:3001")
})