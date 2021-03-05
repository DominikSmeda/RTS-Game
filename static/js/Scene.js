/*
    Klasa tworząca scenę z kamerą itp.
*/
//DOMINIK: POMYSŁ Z DZIEDZICZENIEM JEST CIEKAWY ALE MYSLĘ ŻE RENDERER POWINIEN BYC W GAMEMANAGERZE
//NATOMIAST MOZNA BY POSZERZYC SCENE O OBSŁOGE I DOSTĘP DO POSZCZEGÓLNYCH OBIEKTÓW SCENY
//NP. STWORZYC OSOBNO ZMIENNE PRZCHOWUJACE POSTACIE, PRZESZKODY, NEUTRALNE ELEMENTY, TEREN I SWIATLA
class Scene extends THREE.Scene {
    /*
    * należy podać szerokość i wysokość canvasa
    *
    * zwraca siebie
    */
    constructor(width, height) {
        super();
        // console.log("class Scene():", this);

        //kamera
        this.camera = new THREE.PerspectiveCamera(
            80,    // kąt patrzenia kamery (FOV - field of view)
            width / height,    // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
            0.1,    // minimalna renderowana odległość
            10000    // maxymalna renderowana odległość od kamery 
        );
        this.add(this.camera)
        //this.camera.position.set(100, 100, 100);

        //renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height + 1);// -> -4 ?
        this.renderer.setClearColor(0x87CEFA);
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        //rozpocznij renderowanie
        //this.startRender();

        return this;
    }

    /*
    zwróć canvas renderera
    */
    get canvas() {
        return this.renderer.domElement;
    }

    startRender() {
        this.render.bind(this)();
    }

    render() {
        this.renderer.render(this, this.camera);
    }
}