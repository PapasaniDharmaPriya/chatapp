var express = require("express")
var mongoose = require("mongoose")
var app = express()
var http = require("http").Server(app)
var io= require("socket.io")(http)
var bodyParser = require('body-parser')
var url = "mongodb://localhost:27017/chatAppData"
app.use(express.static(__dirname))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
var Chats = mongoose.model("Chats", {
    name: String,
    chat: String
})

app.post("/chats", async (req, res) => {
    try {
        var chat = new Chats(req.body)
        await chat.save()
        res.sendStatus(200)
        io.emit("chat", req.body)
    } catch (error) {
        res.sendStatus(404)
        console.error(error)
    }
})

app.get("/chats", (req, res) => {
    Chats.find({}, (error, chats) => {
        if(error){
            console.log(error)
        }
        res.send(chats)
    })
})

mongoose.connect(url,
    (err) => {
    if(err){
        console.log(err)
    }else{
    console.log("Connected Successfully")
    }
})


http.listen(3000,()=>{
 console.log("listening on port 3000")
})