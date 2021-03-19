const express = require('express')
const userRoutes = require('./routers/userRouter')
const taskRouters = require('./routers/tasksRouter')
const app = express()
const cors = require('cors')

const port = process.env.PORT || 8080

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
    res.send('todo api')
})

app.use('/', userRoutes)
app.use('/', taskRouters)

app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})