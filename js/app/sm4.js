  "use strict";
function SceneManager(sceneContainer){
    "use strict";
    const container = document.querySelector(sceneContainer);
    
    const screenDimensions = {
                width: container.clientWidth,
                height: container.clientHeight
            };
    
    //Configuracion de camara
    const perpectiveCamera = {
                fov: 45,
                aspectRatio: window.innerWidth / window.innerHeight,
                nearPlane: 1,
                farPlane: 2000
            };
    
    function CreateScene(){
            let scene = new THREE.Scene();    
            //scene.background = new THREE.Color(0x12af30);
            return scene;
        }
    
    function CreateCamera(){
            let camera = new THREE.PerspectiveCamera(
                perpectiveCamera.fov, // Field of view, angle
                perpectiveCamera.aspectRatio, // Aspect ratio
                perpectiveCamera.nearPlane, // Near plane
                perpectiveCamera.farPlane // Far plane
            );
            
            // Z is up for objects intended to be 3D printed.
            camera.up.set(0, 0, 1);
            
            camera.position.set(10, -50, 60);
            //camera.lookAt(scene.position);
            camera.updateProjectionMatrix();
        
            return camera
        }
    
    function CreateRenderer(){
            // create a WebGLRenderer and set its width and height
            /*let _renderer = new THREE.WebGLRenderer({
                antialias: true
            });*/
            let renderer = new THREE.WebGLRenderer({ 
                                antialias: true, 
                                alpha: true  //trasparente
                            });
            
            //renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
            renderer.setClearColor(0x000000, 0.0);  //trasparente
        
            renderer.setSize(screenDimensions.width, screenDimensions.height);
            renderer.setPixelRatio(window.devicePixelRatio);

            renderer.gammaFactor = 2.2;
            renderer.outputEncoding = THREE.sRGBEncoding;

            renderer.physicallyCorrectLights = false;
            renderer.shadowMap.enabled = true;
        
            renderer.shadowMap.type = THREE.PCFSoftShadowMap; // options are THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap
            
            container.appendChild(renderer.domElement);
            
            return renderer;
        }
    
    function CreateControls(camera, renderer){
            let controls = new THREE.MapControls( camera, renderer.domElement );
            return controls;
        };
    
    //Creacion del objeto de escena
    this.sceneManager  =  {
        
        clock : new THREE.Clock(),
        scene :  new CreateScene(),
        camera : new CreateCamera(),
        renderer : new CreateRenderer(),
        controls: "controls",
        //sceneSubjects : new SceneSubjects().sceneSubjects,
        init: function() {
            this.controls = new CreateControls(this.camera, this.renderer);
            this.camera.lookAt(this.scene.position);

            
           // this.add(this.sceneSubjects.generalLights.light);
           window.addEventListener( 'resize', this, false );
        },
        handleEvent: function(e) {
            switch(e.type) {
                case "resize":
                    
                        screenDimensions.width = container.clientWidth;
                        screenDimensions.height = container.clientHeight;
                    
                        // update the size of the renderer AND the canvas
                        this.renderer.setSize( screenDimensions.width, screenDimensions.height );
                        
                        // set the aspect ratio to match the new browser window aspect ratio
                        this.camera.aspect = screenDimensions.width / screenDimensions.height;

                        // update the camera's frustum
                        this.camera.updateProjectionMatrix();

                    break;
                case "click":
                    this.button();
                    break;
                case "touchstart":
                    this.button();
                    break;
            }
        },
        render: function() {
      
            this.renderer.render(this.scene, this.camera);
        },
        update: function(){
             
              //ToDo
              const elapsedTime = this.clock.getElapsedTime();
              //console.log(elapsedTime);

               sceneSubjects.meshes.cube.rotation.z += 0.01;
               sceneSubjects.meshes.cube.rotation.x += 0.01;
               sceneSubjects.meshes.cube.rotation.y += 0.01;
            
              sceneSubjects.meshes.cube.material.color = new THREE.Color();

              //meshes.sphere.update();
            
               sceneSubjects.meshes.sphere.rotation.x += 0.1;
               sceneSubjects.meshes.sphere.translateY += 1;
            
               sceneSubjects.meshes.sphere.position.x = 20 * Math.cos( -elapsedTime) + 0;
              sceneSubjects.meshes.sphere.position.y = 20 * Math.sin(-elapsedTime) + 0;
            
          /*  if(meshes.sphere.position.z < 10)
                meshes.sphere.position.z += Math.sin(Math.PI / 100);
            else{
                this.camera.position.x += .1;
            }*/
                
            sceneSubjects.meshes.plane.rotation.z += .01;
                
            sceneSubjects.lights.generalLights.update(elapsedTime);
            sceneSubjects.lights.ambientLight.update(elapsedTime);
            sceneSubjects.lights.pointLight.update(elapsedTime);
            
            
            //this.scene.background.setHSL( Math.sin(elapsedTime), 0.8, 0.5 );
        	  
      
        },
        play : function (){
            console.log("play");
          // start the animation loop
          this.renderer.setAnimationLoop( () => {

            this.update();
            this.render();

          } );
        },
        stop : function(){
            this.renderer.setAnimationLoop(null);
        },
        add : function(mesh){
           this.scene.add(mesh);     
        },
        remove : function(mesh){
            this.scene.remove(mesh);     
        },
        dude: "holla",
        button: function() {
            alert(this.dude);
        }
    };

   
   // return sceneManager;
}//SceneManager

function SceneSubjects(){
    "use strict";
    function GeneralLights(){

        const light = new THREE.PointLight("#2222ff", 1);
        //sceneManager.add(_light);

        this.update = function(time) {
            light.intensity = (Math.sin(time)+1.5)/1.5;
            light.color.setHSL( Math.sin(time), 0.5, 0.5 );
        }
        
        this.light = light;
        
    }
    
    function AmbientLight(sceneManager){
        //createAmbientLight
        const light = new THREE.AmbientLight( 0xdedede ); // soft white light

        this.update = function(time) {
            light.intensity = (Math.sin(time)+1.5)/1.5;
            light.color.setHSL( Math.sin(time), 0.5, 0.5 );
        }
        
        this.light = light;
    }

    function PointLight(sceneManager){

        const light = new THREE.SpotLight(0xffffff);
        light.position.set(0, 10, 15);
        light.castShadow = true;
        
        light.shadow.cameraVisible = true;
        
        //Set up shadow properties for the light
        light.shadow.mapSize.width = 1024;  // default
        light.shadow.mapSize.height = 1024; // default
        light.shadow.camera.near = 0.01;       // default
        //light.shadow.camera.far = 500      // default
        

        //sceneManager.add(light);

         this.update = function(time) {
            light.intensity = (Math.sin(time)+1.5)/1.5;
            light.color.setHSL( Math.sin(time), 0.5, 0.5 );
        }

        this.light = light;    

    }
    
    function CreateControls(camera, renderer){
            let controls = new THREE.MapControls( camera, renderer.domElement );
            return controls;
            
        };
    
    this.sceneSubjects = { 
                            lights : {  generalLights : new GeneralLights(),
                                        ambientLight : new AmbientLight(),
                                        pointLight : new PointLight()
                                       },
                            meshes : [],
                      };
    
    //return sceneSubjects;
    
}//SceneSubjects

function SceneHelpers(){
    const sceneHelpers = {
            grid : "grid",
            axis : "axis",
            stats : "stats",
    };

}