"use strict";
const sceneManager = new SceneManager("#scene-container").sceneManager;
const sceneSubjects = new SceneSubjects().sceneSubjects;


function play(){
   sceneManager.play();
}

function stop(){
   sceneManager.stop();
}

function init(){
      console.log("init");
    
        Object.entries(sceneSubjects.lights).forEach(entry => {
            let key = entry[0];
            let value = entry[1];
            //use key and value here
            console.log("-" + key + " " + value.light);
            sceneManager.add(value.light);
          });
    
        //sceneManager.add(sceneSubjects.lights.generalLights.light);
        //sceneManager.add(sceneSubjects.lights.ambientLight.light);
       
     // create the ground plane
        var planeGeometry = new THREE.PlaneGeometry(40, 40, 100, 100);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0x2ea2ac, side: THREE.DoubleSide});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.castShadow = false;
        plane.receiveShadow = true;
        sceneSubjects.meshes.plane = plane ;
    
        //sceneSubjects.meshes.push(plane);
        // add the plane to the scene
        //sceneManager.add(plane);

        // create a cube
        var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.receiveShadow = false;    
       
        // position the cube
        cube.position.x = 0;
        cube.position.y = 0;
        cube.position.z = 5;

        //add the cube to the scene
        //sceneManager.add(cube);

        sceneSubjects.meshes.cube = cube;
        //sceneSubjects.meshes.push(cube);


        var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
       var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

       // position the sphere
        sphere.position.x = 2;
        sphere.position.y = 16;
        sphere.position.z = 4;
        sphere.castShadow = true;
        sphere.receiveShadow = false;   
          
//        // add the sphere to the scene
         sceneSubjects.meshes.sphere = sphere;
    
    
         sceneSubjects.meshes.sphere.update = function (){console.log("update !!")};

        sceneSubjects.meshes.sphere.update();            
    

        Object.entries(sceneSubjects.meshes).forEach(entry => {
            let key = entry[0];
            let value = entry[1];
            //use key and value here
            console.log("-" + key + " " + value.type);
            sceneManager.add(value);
          });

    
}


window.onload = function(){
    // start the animation loop
    sceneManager.init();
    console.log(sceneManager);
    //load meshes
    init();
    play();
    //sceneManager.createGrid();
    //sceneManager.createAxes();
}