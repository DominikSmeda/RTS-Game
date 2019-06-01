
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
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87CEFA);
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('root').appendChild(this.renderer.domElement);

        var axesHelper = new THREE.AxesHelper(1000);
        this.scene.add(axesHelper);
        this.camera.position.set(0, 50, 40)
        this.camera.lookAt(this.scene.position);
        this.scene.add(this.camera)

        this.scene.add(new THREE.AmbientLight(0xffffff, 0.1))
        let spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(30, 50, 10);
        spotLight.castShadow = true;
        this.scene.add(spotLight);

        // var orbitControl = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        this.mouseEvents();
        this.render();
    }


    render() {
        requestAnimationFrame(this.render.bind(this));
        this.update();

        this.renderer.render(this.scene, this.camera);
    }

    update() {
        const dt = this.clock.getDelta();

    }

    mouseEvents() {

        $(window).on('mousedown', (e) => {

            var raycaster = new THREE.Raycaster();
            var mouseVector = new THREE.Vector2();

            mouseVector.x = (e.clientX / $(window).width()) * 2 - 1;
            mouseVector.y = -(e.clientY / $(window).height()) * 2 + 1;
            raycaster.setFromCamera(mouseVector, this.camera);

            var intersects = raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {


            }

        })

        $(window).on('mousemove', (e) => {
            var raycaster = new THREE.Raycaster();
            var mouseVector = new THREE.Vector2();

            mouseVector.x = (e.clientX / $(window).width()) * 2 - 1;
            mouseVector.y = -(e.clientY / $(window).height()) * 2 + 1;
            raycaster.setFromCamera(mouseVector, this.camera);

            var intersects = raycaster.intersectObjects([this.terrain], true);

            if (intersects.length > 0) {


            }

        })
    }


}