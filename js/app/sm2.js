function SceneManager(container) {
    const screenDimensions = {
        width: container.clientWidth,
        height: container.clientHeight
    };
    
    const clock = new THREE.Clock();

    this.scene = createScene();
    
    var position = this.scene.position;
    
    this.camera = createCamera(screenDimensions);

    this.renderer = createRenderer(screenDimensions);
    
    var distance = 0;

    //console.log(this.scene);

    createAmbientLight(this.scene);
    createPointLight(this.scene)

    function createScene() {
        // create a Scene
        let scene = new THREE.Scene();
        scene.background = new THREE.Color(0x313131);

        return scene;
    }

    function createRenderer(screenDimensions) {

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
    }

    function createCamera(screenDimensions) {

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
    }
        
    function createAmbientLight(scene){
      var light = new THREE.AmbientLight( 0xdedede ); // soft white light
      scene.add( light );
    }
        
    function createPointLight(scene){
        var light = new THREE.SpotLight(0xffffff);
        light.position.set(0, 60, 50);
        light.castShadow = true;
                            //Set up shadow properties for the light
        light.shadow.mapSize.width = 512;  // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.near = 0.5;       // default
        light.shadow.camera.far = 500      // default
        
        scene.add( light );
    }

    
    this.createGrid = function() {
        var grid = new THREE.GridHelper(
            50, //tamaño 
            50, //num_divisiones
            0xffffff, //color_grid 
            0x555555 //color_ejes 
        );

        //grid.rotateOnAxis(new THREE.Vector3(0, 0, 1), 90 * (Math.PI / 180));
        
        grid.geometry.rotateX( Math.PI / 2 );
        
        this.scene.add(grid);
    }
    
    this.createAxes = function() {
        var axes = new THREE.AxesHelper(20);
        this.scene.add(axes);
    }

           
    this.add = function(el){
         this.scene.add(el);
    }
                
    this.remove = function(el){
        this.scene.remove(el);
    }
    
    this.play = function (){
        console.log("play sm2");
        console.log(this.renderer);
      // start the animation loop
       this.renderer.setAnimationLoop( () => {
    
        //update();
        render(this.renderer);
        //renderer.render(this.scene, this.camera);
    
      } );
    }
      
    this.stop = function(){
      this.renderer.setAnimationLoop(null);
    }

    function render(renderer) {

        renderer.render(this.scene, this.camera);
    }
    
    function update(){
       
        //ToDo
        const elapsedTime = clock.getElapsedTime();
        //console.log(elapsedTime);

    }
    
}