var http = require("http")
var express = require("express")
var app = express()
const PORT = 3000;
const path = require('path');
//const fs = require('fs');
//const concat = require('concat');

// załatwia wszystkie sprawy dostępu do plików
app.use(express.static('static'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'))
});

/*
// Zamiast dodawać wszystkie pliki js-a, złącz je w jeden plik i wyślij!
// Złącza je raz na uruchomienie serwera... musisz go restartować
// W dalszej kolejności można dodać minify itp.
// Kod synchroniczny!
// Ścieżka: ./static/merged/merged.js
// URL: /merged.js
// moduły: fs, concat

// Kolejność inicjalizacji ma teraz duże znaczenie i łączenie w jeden
// plik aktualnie wszystko niszczy - wycofywanie zmian

// https://stackoverflow.com/questions/2727167/how-do-you-get-a-list-of-the-names-of-all-files-present-in-a-directory-in-node-j
function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}
var paths = [];
//  --- libs/* sprawia problemy - należy wpisywać te skrypty własnoręcznie
// walkSync('./static/libs', function (filePath, stat) {
//     paths.push(filePath);
// });
walkSync('./static/js', function (filePath, stat) {
    paths.push(filePath);
});
console.log(paths)
concat(paths, './static/merged/merged.js');
app.get('/merged.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'merged', 'merged.js'))
});
*/


app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})