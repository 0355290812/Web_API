const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const router = require('./routes/index.routes')
const db = require('./configs/db.config')
const authRouter = require('./routes/auth.routes')
const guestRoute = require('./routes/guest.routes')
const app = express()
const schedule = require('node-schedule')
const Rent = require('./models/rent.models')
app.use('/uploads', express.static('uploads'));

dotenv.config()

db.connect()

app.use(morgan('dev'))
app.use(cors())
app.use(cors({
    origin: 'http://localhost:3000' 
  }));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api', router)
app.use('/auth', authRouter)
app.use('/', guestRoute)

// app.post('/rent', async (req, res) => {
//     const rent = await Rent.create({
//         user: "657fffb2f8685f23a101f2ca",
//         instructor: "657c7be5c2dea2f0cf1986da",
//         time: 1,
//         roomId: ""
//     })
// })

app.listen(process.env.HOST, () => {
    console.log("http://localhost:3001")
})