import express from "express";
import { createClient } from "redis";

const app = express()
app.use(express.json());

const client = createClient()
client.on("error", (err) => console.log("Redis Client Error"));

app.post('/Submit', async (req, res) => {
    const { problemId, code, language } = req.body
    try {
        await client.lPush("Submission", JSON.stringify({ problemId, code, language }))
        res.status(200).send("Submission Recceived")
    }
    catch (e) {
        console.log("Redis Error", e)
        res.status(500).send("Submission Failed")
    }
})

async function startServer() {
    try {
        await client.connect()
        console.log("Client Connected")
        app.listen(3000, () => {
            console.log("Server Listening on port 3000")
        })
    }
    catch (e) {
        console.log("Error Connecting To Redis", e)
    }
}
startServer();