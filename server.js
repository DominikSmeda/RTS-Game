var http = require("http")
var express = require("express")
var app = express()
const PORT = 3000;
const path = require('path');
// załatwia wszystkie sprawy dostępu do plików
app.use(express.static('static'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'))
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})