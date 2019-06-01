const express = require('express');
const bodyParser = require("body-parser");
const app = express();

const PORT = process.env.PORT || 2000;

const path = require('path');


app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'game.html'))
})

app.listen(3000, () => {
    console.log('3000');

})
