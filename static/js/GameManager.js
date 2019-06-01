
//Gówna klasa gry. 
class GameManager {
    constructor() {
        this.scene;
        this.camera;
        this.renderer;

        this.clock = new THREE.Clock();

        this.objects = {//TO MOGLIBYSMY UMIESCIC W KLASIE Scene
            characters: [],
            lights: [],
            obsticles: []
        }

        this.init();
    }

    init() {
        this.scene = new Scene(window.innerWidth, window.innerHeight);
        this.camera = this.scene.camera;
        this.cameraControl = new CameraControl(this.camera);
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

        // var orbitControl = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        // this.scene.add(new Terrain(this.scene))
        this.mouseEvents();
        this.render();
    }


    render() {
        this.update();

        this.scene.render();
        requestAnimationFrame(this.render.bind(this));
    }

    update() {
        const dt = this.clock.getDelta();

    }

    mouseEvents() {

        $(window).on('mousedown', (e) => {
            console.log(e)
            var raycaster = new THREE.Raycaster();
            var mouseVector = new THREE.Vector2();

            mouseVector.x = (e.clientX / $(window).width()) * 2 - 1;
            mouseVector.y = -(e.clientY / $(window).height()) * 2 + 1;
            raycaster.setFromCamera(mouseVector, this.camera);

            var intersects = raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {


            }
            this.cameraControl.mousedown(e);
        })
        $(window).on('mouseup', (e) => {
            console.log(e)
            this.cameraControl.mouseup(e);
        })

        $(window).on('mousemove', (e) => {
            var raycaster = new THREE.Raycaster();
            var mouseVector = new THREE.Vector2();

            mouseVector.x = (e.clientX / $(window).width()) * 2 - 1;
            mouseVector.y = -(e.clientY / $(window).height()) * 2 + 1;
            raycaster.setFromCamera(mouseVector, this.camera);

            //var intersects = raycaster.intersectObjects([this.terrain], true);

            //if (intersects.length > 0) {


            //}
            this.cameraControl.mousemove(e);
        })
    }


}