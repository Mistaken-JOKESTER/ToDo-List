const express = require('express')
const userRoutes = require('./routers/userRouter')
const taskRouters = require('./routers/tasksRouter')
const app = express()
const cors = require('cors')

//defining port if present
//default 8080
const port = process.env.PORT || 8080

//cross origin requests
app.use(cors())
//Json parser for reading post request data
app.use(express.json())

//basic route to check if api is working
app.get('/', (req, res) => {
    res.send('todo api')
})

//user relates routes
app.use('/', userRoutes)
//task related routes
app.use('/', taskRouters)

//listing on prot derfined
app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})