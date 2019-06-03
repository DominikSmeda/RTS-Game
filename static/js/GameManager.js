
//Gówna klasa gry. 
class GameManager {
    constructor() {
        this.scene;
        this.camera;
        this.renderer;

        this.clock = new THREE.Clock();

        // sprawdza, czy trzymany jest dany przycisk
        this.isPressed = new ClickRegister();

        this.objects = {//TO MOGLIBYSMY UMIESCIC W KLASIE Scene
            characters: [],
            lights: [],
            obsticles: [],
        }

        this.mainTerrain;
        this.assetsManager;
    }

    resourcesLoaded() {//po załadowaniu assetów rozpoczynamy inicjalizacje gry
        this.init();
    }

    init() {
        this.scene = new Scene(window.innerWidth, window.innerHeight);
        this.camera = this.scene.camera;
        this.cameraControl = new CameraControl(this);
        this.cameraControl.refreshCamera();
        document.getElementById('canvas').appendChild(this.scene.canvas);

        var axesHelper = new THREE.AxesHelper(1000);

        this.scene.add(axesHelper);
        //this.camera.position.set(0, 500, 40)
        //this.camera.lookAt(this.scene.position);

        this.scene.add(new THREE.AmbientLight(0xffffff, 0.1))
        let spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(30, 50, 10);
        spotLight.castShadow = true;
        this.scene.add(spotLight);

        //this.mainTerrain = new TerrainEditor(this.scene);
        //this.scene.add(this.mainTerrain);


        //this.assetsManager = new AssetsManager();
        this.events();
        this.render();

        this.net = new Net(this);
    }

    render() {
        this.update();

        this.scene.render();
        requestAnimationFrame(this.render.bind(this));
    }

    update() {
        const dt = this.clock.getDelta();
        for (let i = 0; i < this.objects.characters.length; i++) {
            this.objects.characters[i].onRender(dt);
        }
    }

    // aktualizuje mapę
    recalculateMap(map) {
        // przy bardzo dużych obciążeniach odrzuca pakiety, gdy jeszcze nie przetworzył poprzedniego
        if (this.working) return;
        this.working = true;
        for (let i = 0; i < Object.keys(map).length; i++) {
            const type = Object.keys(map)[i]; //typ kontenera
            if (!this.objects[type]) this.objects[type] = [];
            for (let j = 0; j < map[type].length; j++) {
                const el = map[type][j]; //obiekt z mapy
                var flag = true;
                for (let k = 0; k < this.objects[type].length; k++) {
                    if (this.objects[type][k].net.id == el.id) {
                        this.objects[type][k].netData = el;
                        this.objects[type][k].onDataUpdate();
                        flag = false;
                        break;
                    };
                }
                if (flag && el.deleted != true) this.createObjectFromNet(el);
            }
        }
        this.working = false;
        if (this.isPressed.rmb) this.cameraControl.issueMove(this.isPressed.lastEvent);
    }

    // USUNIĘTO
    // Podajesz obiekt, któremu zmieniłeś właściwości
    // Wystarczy zmienić właściwości wysłane na serwer
    // Zmieniasz coś -> updateObject() -> Klient odbiera zmiany -> onNetUpdate()
    /* updateObject(obj) {
        this.net.update(obj.netData);
    } */

    // !!! Podajesz stringa do klasy !!!
    //createObject(className = "WorldObject", modelName = "tree1") {
    createObject(obj) {
        //Tutaj tworzymy obiekt, który jest zupełnie nowy, nie pobrany z serwera
        try {
            //var obj = eval('new ' + className + '("' + modelName + '")');
            this.net.spawn(obj.netData);
        }
        catch (e) {
            console.warn("Error in generating object from inside: " + e);
        }
    }
    createObjectFromNet(data) {
        try {
            var n = eval('new ' + data.className + '("' + data.modelName + '")');
            this.objects[data.type].push(n);
            this.scene.add(n);
            n.netData = data;
            n.onDataUpdate();
            n.justCreated = false;
        }
        catch (e) {
            console.warn("Error in generating object from server: " + e);
        }
    }


    events() {
        $(document).on('contextmenu', (e) => {
            e.preventDefault();
        })
        $('#canvas').on('mousedown', (e) => {
            e.preventDefault();
            this.isPressed.mousedown(e);

            if (this.isPressed.lmb) {
                var raycaster = new THREE.Raycaster();
                var mouseVector = new THREE.Vector2();

                mouseVector.x = (e.clientX / $(window).width()) * 2 - 1;
                mouseVector.y = -(e.clientY / $(window).height()) * 2 + 1;
                raycaster.setFromCamera(mouseVector, this.camera);

                var intersects = []//raycaster.intersectObjects([this.mainTerrain], true);

                if (intersects.length > 0) {
                    if (intersects[0].object instanceof TerrainEditor) {
                        //intersects[0].object.mouseClick(intersects[0].point);

                    }

                }
            }


            this.cameraControl.mousedown(e);
        })
        $('#canvas').on('mouseup', (e) => {
            this.isPressed.mouseup(e);
            this.cameraControl.mouseup(e);
        })

        $('#canvas').on('mousemove', (e) => {
            this.isPressed.mouseup(e);
            var raycaster = new THREE.Raycaster();
            var mouseVector = new THREE.Vector2();

            mouseVector.x = (e.clientX / $(window).width()) * 2 - 1;
            mouseVector.y = -(e.clientY / $(window).height()) * 2 + 1;
            raycaster.setFromCamera(mouseVector, this.camera);

            var intersects = []//raycaster.intersectObjects([this.mainTerrain], true);

            if (intersects.length > 0) {
                if (intersects[0].object instanceof TerrainEditor) {
                    //intersects[0].object.mouseMove(intersects[0].point);
                }

            }
            this.cameraControl.mousemove(e);
        })
        $(window).on('keydown', (e) => {
            this.isPressed.keydown(e);
        })
        $(window).on('keyup', (e) => {
            this.isPressed.keyup(e);
        })
        $('#canvas').on('wheel', (e) => {
            //blokada zoomu - niestety nie działa
            event.stopPropagation();
            this.cameraControl.wheel(e);
            //console.log(e);
        })
        $(window).on('resize', (e) => {
            this.cameraControl.resizeCamera(window.innerWidth, window.innerHeight - 4)
            this.scene.renderer.setSize(window.innerWidth, window.innerHeight - 4);
        })
    }

}