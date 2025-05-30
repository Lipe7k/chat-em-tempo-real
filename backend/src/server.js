const { WebSocketServer } = require("ws")
const dotenv = require("dotenv")

dotenv.config()

const wss = new WebSocketServer({ port: process.env.port || 8080 })

wss.on("connection", ws => {
    ws.on("error", console.error)

    ws.on("message", data => {
        const message = data.toString()
        console.log("Mensagem recebida:", message)

        wss.clients.forEach(client => {
            if (client.readyState === ws.OPEN) {
                client.send(message)
            }
        })
    })

    ws.on("close", () => {
        console.log("Cliente desconectado")
    })
})
