
class GameManager {
    constructor() {
        this.scene;
        this.camera;
        this.renderer;

        this.clock = new THREE.Clock();

        this.objects = {
            hexes: [],
            lights: [],
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

        var orbitControl = new THREE.OrbitControls(this.camera, this.renderer.domElement);


        orbitControl.addEventListener('change', function () {

        });
        this.terrain = new Terrain(this.scene)
        this.terrain.position.x -= 0;
        this.cont = new THREE.Object3D();
        this.cont.add(this.terrain)
        this.scene.add(this.cont);
        this.render()
        this.mouseEvents()
    }


    render() {
        requestAnimationFrame(this.render.bind(this));
        this.update();

        this.renderer.render(this.scene, this.camera);
    }

    update() {
        const dt = this.clock.getDelta();
        // this.terrain.rotation.y += Math.PI / 40
    }

    mouseEvents() {

        $(window).on('contextmenu', (e) => {
            e.preventDefault()
            var raycaster = new THREE.Raycaster();
            var mouseVector = new THREE.Vector2();

            mouseVector.x = (e.clientX / $(window).width()) * 2 - 1;
            mouseVector.y = -(e.clientY / $(window).height()) * 2 + 1;
            raycaster.setFromCamera(mouseVector, this.camera);

            var intersects = raycaster.intersectObjects(this.scene.children, true);
            console.log('aa');
            // console.log(intersects[0]);
            if (intersects.length > 0) {
                // console.log(intersects[0]);
                // console.log(intersects[0]);
                // let obj = intersects[0].object;
                // let vec = intersects[0].face.normal = new THREE.Vector3(0, 2, 0);
                // let vec = intersects[0].face.vertexNormals[0].set(0, 2, 0);
                // console.log(intersects[0].face.vertexNormals[0]);

                // for (let vert of obj.geometry.vertices) {

                //     if (vert.equals(intersects[0].face.vertexNormals[0])) {
                //         vert.set(0, 2, 0)
                //         console.log('s');

                //     }
                //     console.log(vert);
                // }
                // obj.geometry.vertices[0].set(0, 2, 0);
                var intersects = raycaster.intersectObjects([this.terrain], true);

                if (intersects[0].object instanceof Terrain) {
                    this.terrain.adjustHeightByPoint(intersects[0].point)
                    this.terrain.selectArea(intersects[0].point);

                }

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
                if (intersects[0].object instanceof Terrain) {
                    this.terrain.selectArea(intersects[0].point);
                }

            }

        })
    }


}