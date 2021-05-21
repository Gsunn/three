function SceneManager(container)
{   
        const screenDimensions = { width: container.clientWidth , height: container.clientHeight };
    
        const scene = createScene();
        const renderer = createRenderer(screenDimensions);
        const camera = createCamera(screenDimensions);
    
        const clock = new THREE.Clock();

        createAmbientLight();
        createPointLight()
    
        function createScene(){
          // create a Scene
          let scene = new THREE.Scene();
          scene.background = new THREE.Color( 0x8FBCD4 );

          return scene;
        }
    
        function createRenderer(screenDimensions) {

          // create a WebGLRenderer and set its width and height
          let renderer = new THREE.WebGLRenderer( { antialias: true } );
          renderer.setSize( screenDimensions.width, screenDimensions.height );

          renderer.setPixelRatio( window.devicePixelRatio );

          renderer.gammaFactor = 2.2;
          renderer.outputEncoding = THREE.sRGBEncoding;

          renderer.physicallyCorrectLights = false;
            
          renderer.shadowMap.enabled = true;
            
          container.appendChild( renderer.domElement );
          return renderer;
        }
    
        function createCamera(screenDimensions) {

        //Configuracion de camara
        const perpectiveCamera = {
            fov: 45,
            aspectRatio: window.innerWidth / window.innerHeight,
            nearPlane: 0.001,
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

        camera.position.set(-82, 31, 37);
          return camera
        }

        function createAmbientLight(){
          var light = new THREE.AmbientLight( 0x000000 ); // soft white light
          scene.add( light );
        }

        function createPointLight(){
          var light = new THREE.SpotLight( 0xffffff );
          light.position.set( 50, 50, 50 );
            light.castShadow = true; 
            

            
          scene.add( light );
        }

    
        function render() {
            console.log("rr");
            renderer.render(scene, camera);
        }
    
        function update() {
        const elapsedTime = clock.getElapsedTime();
        //console.log(elapsedTime);
        //        for(let i=0; i<sceneSubjects.length; i++)
        //        	sceneSubjects[i].update(elapsedTime);
            
            let _mesh = scene.getObjectByName("mesh");
          _mesh.rotation.z += 0.01;
          _mesh.rotation.x += 0.01;
          _mesh.rotation.y += 0.01;

        }
    
        this.children = function(){
            console.log(scene.children);
        }
    
        this.add = function(el){
            scene.add(el);
        }
        
        this.remove = function(el){
            scene.remove(el);
        }
    
        this.play = function (){
            console.log("play");
          // start the animation loop
          renderer.setAnimationLoop( () => {

            //update();
            render();

          } );
        }
        
        this.stop = function(){
          renderer.setAnimationLoop(null);
        }
}
