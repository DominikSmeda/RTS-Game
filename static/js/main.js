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
})

