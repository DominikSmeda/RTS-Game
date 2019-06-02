
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
            terrains: []
        }


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
        this.camera.position.set(0, 500, 40)
        this.camera.lookAt(this.scene.position);

        this.scene.add(new THREE.AmbientLight(0xffffff, 0.1))
        let spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(30, 50, 10);
        spotLight.castShadow = true;
        this.scene.add(spotLight);

        let mainTerrain = new TerrainEditor(this.scene);
        this.objects.terrains.push(mainTerrain);
        this.scene.add(mainTerrain);

        this.assetsManager = new AssetsManager();
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

    }

    events() {

        $(window).on('mousedown', (e) => {
            this.isPressed.mousedown(e);

            if (this.isPressed.lmb) {
                var raycaster = new THREE.Raycaster();
                var mouseVector = new THREE.Vector2();

                mouseVector.x = (e.clientX / $(window).width()) * 2 - 1;
                mouseVector.y = -(e.clientY / $(window).height()) * 2 + 1;
                raycaster.setFromCamera(mouseVector, this.camera);

                var intersects = raycaster.intersectObjects(this.objects.terrains, true);

                if (intersects.length > 0) {
                    if (intersects[0].object instanceof TerrainEditor) {
                        intersects[0].object.adjustHeightByPoint(intersects[0].point);
                        intersects[0].object.selectArea(intersects[0].point);
                    }

                }
            }


            this.cameraControl.mousedown(e);
        })
        $(window).on('mouseup', (e) => {
            this.isPressed.mouseup(e);
        })

        $(window).on('mousemove', (e) => {
            var raycaster = new THREE.Raycaster();
            var mouseVector = new THREE.Vector2();

            mouseVector.x = (e.clientX / $(window).width()) * 2 - 1;
            mouseVector.y = -(e.clientY / $(window).height()) * 2 + 1;
            raycaster.setFromCamera(mouseVector, this.camera);

            var intersects = raycaster.intersectObjects(this.objects.terrains, true);

            if (intersects.length > 0) {
                if (intersects[0].object instanceof TerrainEditor) {
                    intersects[0].object.selectArea(intersects[0].point);
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
        $(window).on('wheel', (e) => {
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