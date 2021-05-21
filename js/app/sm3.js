var  SceneManager = {
    screenDimensions: "",
    scene: "scene",
    render: "render",
    camera: "camera",
    init: function(container){
        screenDimensions = {
            width: container.clientWidth,
            height: container.clientHeight
        };
    },
    createScene: function() {
        // create a Scene
        let scene = new THREE.Scene();
        scene.background = new THREE.Color(0x313131);

        return scene;
    },
        
    createRenderer: function (screenDimensions) {

        // create a WebGLRenderer and set its width and height
        let renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        
        renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        renderer.setSize(screenDimensions.width, screenDimensions.height);
        renderer.setPixelRatio(window.devicePixelRatio);

        renderer.gammaFactor = 2.2;
        renderer.gammaOutput = true;

        renderer.physicallyCorrectLights = false;
        renderer.shadowMap.enabled = true;
        
        container.appendChild(renderer.domElement);
        return renderer;
    },

    createCamera: function(screenDimensions) {

        //Configuracion de camara
        const perpectiveCamera = {
            fov: 45,
            aspectRatio: window.innerWidth / window.innerHeight,
            nearPlane: 1,
            farPlane: 1000
        }

        
        let camera = new THREE.PerspectiveCamera(
            perpectiveCamera.fov, // Field of view, angle
            perpectiveCamera.aspectRatio, // Aspect ratio
            perpectiveCamera.nearPlane, // Near plane
            perpectiveCamera.farPlane // Far plane
        );
        
        // Z is up for objects intended to be 3D printed.
        camera.up.set(0, 0, 1);
        
        camera.position.set(10, -50, 60);
        camera.lookAt(position);
        
        return camera
    },
        
}