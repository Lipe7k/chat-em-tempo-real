const { WebSocketServer } = require("ws")
const  dotenv = require("dotenv")

dotenv.config()

const wss = new WebSocketServer({ port: process.env.port || 8080 })

wss.on("connection", ws => {

    ws.on("error", console.error)

    ws.send("Mensagem enviada pelo servidor")

    ws.on("message", data => {

        wss.clients.forEach(c => c.send(data.toString()))

        ws.send(data)

        console.log("client connected")
    })
})