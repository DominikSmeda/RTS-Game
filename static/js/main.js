/*
    Idea struktury pliku main:
    Mamy jedną zmienną "f" (obiekt), w której zawieramy wszystkie 
    główne funkcje (np. init). 
    Nie będzie to zmienna globalna, aby maksymalnie zaspokoić wymóg 
    podziału na klasy.
*/

// f = {
//     // funkcja inicjująca wszystko
//     init() {
//         //stwórz scenę i dodaj canvas do strony
//         f.scene = new Scene($('#canvas').width(), $('#canvas').height());
//         console.log(f.scene.canvas)
//         $('#canvas').append(f.scene.canvas);
//     }
// }


// addEventListener("DOMContentLoaded", f.init);

var game;

$(document).ready(() => {
    game = new GameManager();

});

//Funkcje developerskie :3


function addTestObject(count = 1) {
    for (let i = 0; i < count; i++) {
        var obj = new Test();
        game.createObject(obj);
    }
}
var plane;
function addTestPlane() {
    var geometry = new THREE.PlaneGeometry(100, 100, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    plane = new THREE.Mesh(geometry, material);
    plane.rotation.set(Math.PI / 2, 0, 0);
    game.scene.add(plane);
}

function showTerrainBrush() {
    game.mainTerrain.showUISettings();
}

function showAssetsManager() {
    $("#assetsManager").css({ display: 'block' });
}

