
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
            buildings: [],
        }
        this.specialRender = {};

        this.playerID;
        this.playerColor;
        this.gold = 0;

        this.mainTerrain;
        this.assetsManager;
    }

    resourcesLoaded() {//po załadowaniu assetów rozpoczynamy inicjalizacje gry
        this.init();

        showAssetsManager()
    }

    init() {
        this.shop = [//postacie możliwe do kupienia przez gracza
            new Test(),
            new Test(),
        ]
        this.hud = new HUD(this);
        $('#canvas').append(this.hud.jQueryElement);

        this.scene = new Scene(window.innerWidth, window.innerHeight);
        this.camera = this.scene.camera;
        this.cameraControl = new CameraControl(this);
        this.cameraControl.refreshCamera();
        this.selectControl = new SelectControl(this);
        document.getElementById('canvas').appendChild(this.scene.canvas);

        // var axesHelper = new THREE.AxesHelper(1000);

        // this.scene.add(axesHelper);
        //this.camera.position.set(0, 500, 40)
        //this.camera.lookAt(this.scene.position);

        this.scene.add(new THREE.AmbientLight(0xffffff, 0.7))

        // let spotLight = new THREE.DirectionalLight(0xffffff, 0.8);
        // spotLight.position.set(0, 50, 60);
        // spotLight.castShadow = true;
        // this.scene.add(spotLight);

        // let spotLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
        // spotLight2.position.set(0, 50, -60);
        // spotLight2.castShadow = true;
        // this.scene.add(spotLight2);

        let pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(-70, 100, -70);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        let pointLight2 = new THREE.PointLight(0xffffff, 0.3);
        pointLight2.position.set(70, 100, 70);
        pointLight2.castShadow = true;
        this.scene.add(pointLight2);

        this.mainTerrain = new TerrainEditor(this.scene);
        this.scene.add(this.mainTerrain);


        let farTerrain = new THREE.Mesh(new THREE.PlaneGeometry(2500, 2500, 1, 1), SETTINGS.materials.terrainFar);
        farTerrain.material.color.setHex(0xeeeeee);
        farTerrain.position.y -= 1;
        farTerrain.rotation.x -= Math.PI / 2
        this.scene.add(farTerrain)

        var skyGeo = new THREE.SphereGeometry(1000, 25, 25);

        var loader = new THREE.TextureLoader();
        let texture = loader.load("assets/textures/sky3.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        var material = new THREE.MeshPhongMaterial({
            map: texture,
        });
        var sky = new THREE.Mesh(skyGeo, material);
        sky.material.side = THREE.BackSide;
        this.scene.add(sky);

        this.assetsManager = new AssetsManager();
        this.events();
        this.render();

        this.net = new Net(this);

        this.hud.helpNextStage();
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
        for (let i = 0; i < Object.keys(this.specialRender).length; i++) {
            const k = Object.keys(this.specialRender)[i];
            this.specialRender[k].onRender(dt);
        }
    }

    // aktualizuje mapę
    recalculateMap(map) {
        // przy bardzo dużych obciążeniach odrzuca pakiety, gdy jeszcze nie przetworzył poprzedniego
        if (this.working) return;
        this.working = true;
        //złoto
        this.gold = map.gold[this.playerID];
        this.hud.updateGold();
        //console.log(this.gold)
        //Analizowanie mapy
        for (let i = 0; i < Object.keys(map).length; i++) {
            const type = Object.keys(map)[i]; //typ kontenera
            if (!this.objects[type]) this.objects[type] = [];
            for (let j = 0; j < map[type].length; j++) {
                const el = map[type][j]; //obiekt z mapy
                var flag = true;
                for (let k = 0; k < this.objects[type].length; k++) {
                    if (this.objects[type][k].net.id == el.id) {
                        this.objects[type][k].sendEdit();
                        this.objects[type][k].netData = el;
                        // this.objects[type][k].onDataUpdate();
                        this.objects[type][k].onGameTick();
                        flag = false;
                        if (this.objects[type][k].dead) {
                            this.objects[type].splice(k--, 1);
                        };
                        break;
                    };
                }
                if (flag && el.deleted != true) this.createObjectFromNet(el);
            }
        }
        this.working = false;
        if (this.isPressed.rmb) this.selectControl.issueAction(this.isPressed.lastEvent);
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
        if (data.base && data.owner == this.playerID)
            this.hud.helpNextStage();
        try {
            var n = eval('new ' + data.className + '("' + data.modelName + '")');
            this.objects[data.type].push(n);
            this.scene.add(n);
            n.justCreated = true;
            n.netData = data;
            n.onGameTick();
            n.justCreated = false;
        }
        catch (e) {
            console.warn("Error in generating object from server: " + e);
        }
    }

    won() {
        this.hud.helpNextStage();
        this.showMyStats();
    }
    lost() {
        this.hud.helpNextStage();
        this.showMyStats();
    }
    onGameStart() {
        this.hud.helpNextStage();
        this.assetsManager.onGameStart();
    }


    events() {
        $(document).on('contextmenu', (e) => {
            e.preventDefault();
            this.mainTerrain.contextmenu();
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

                var intersects = raycaster.intersectObjects([this.mainTerrain], true);

                if (intersects.length > 0) {
                    if (intersects[0].object instanceof TerrainEditor) {
                        intersects[0].object.mouseClick(intersects[0].point);

                    }

                }
            }


            this.cameraControl.mousedown(e);
            this.selectControl.mousedown(e);
        })
        $('#canvas').on('mouseup', (e) => {
            this.isPressed.mouseup(e);
            this.cameraControl.mouseup(e);
            this.selectControl.mouseup(e);
        })


        let mouseMovelastUpdate = Date.now();
        $('#canvas').on('mousemove', (e) => {
            this.isPressed.mousemove(e);

            let dt = Date.now() - mouseMovelastUpdate;
            if (dt > 50) {
                mouseMovelastUpdate = Date.now();


                var raycaster = new THREE.Raycaster();
                var mouseVector = new THREE.Vector2();

                mouseVector.x = (e.clientX / $(window).width()) * 2 - 1;
                mouseVector.y = -(e.clientY / $(window).height()) * 2 + 1;
                raycaster.setFromCamera(mouseVector, this.camera);

                var intersects = raycaster.intersectObjects([this.mainTerrain], false);

                if (intersects.length > 0) {
                    if (intersects[0].object instanceof TerrainEditor) {
                        intersects[0].object.mouseMove(intersects[0].point);
                    }

                }
            }


            this.cameraControl.mousemove(e);
            this.selectControl.mousemove(e);
        })
        $(window).on('keydown', (e) => {
            this.isPressed.keydown(e);
        })
        $(window).on('keyup', (e) => {
            this.isPressed.keyup(e);
        })
        $('#canvas').on('wheel', (e) => {
            //console.log(e)
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


    showMyStats() {
        this.net.getStats((data) => {
            this.hud.showStatistics(data);

            var inp = $('<input type="text" placeholder="Wpisz swój nick">');
            var but = $('<input type="button" value="Zapisz wyniki">');
            but.click(() => {
                if (inp.val() != '') {
                    this.saveStats(inp.val())
                    this.showAllStats();
                }
            })
            this.hud.stats.append(inp).append(but);
            $('#overlay').css('display', 'block');
        });
    }
    showAllStats() {
        this.net.getAllStats((data) => {
            this.hud.showAllStatistics(data);
        });
        $('#overlay').css('display', 'block');
    }
    saveStats(nick) {
        this.net.saveStats(nick);
    }
}