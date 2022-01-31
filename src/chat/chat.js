const express = require('express')
const cors = require('cors')
const Pusher = require('pusher')

const pusher = new Pusher({
    appId: "1340722",
    key: "93d2335e77a72d961d50",
    secret: "d2ffc91e0f45640ba85e",
    cluster: "eu",
    useTLS: true
});

const app = express()

app.use(cors({
    origin: ['http://localhost:8085']
}))

app.use(express.json())

app.post('/api/messages', async (req, res) => {
    await pusher.trigger("chat", "message", {
        username: req.body.username,
        message: req.body.message
    });

    res.send([])
})

app.listen(8084, () => console.log('Listening at port 8084'))