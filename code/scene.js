"use strict";

//  Adapted from Daniel Rohmer tutorial
//
// 		https://imagecomputing.net/damien.rohmer/teaching/2019_2020/semester_1/MPRI_2-39/practice/threejs/content/000_threejs_tutorial/index.html
//
//  And from an example by Pedro Iglésias
//
// 		J. Madeira - April 2021


// To store the scene graph, and elements usefull to rendering the scene
const sceneElements = {
    sceneGraph: null,
    camera: null,
    control: null,  // NEW
    renderer: null,
};


// Functions are called
//  1. Initialize the empty scene
//  2. Add elements within the scene
//  3. Animate
helper.initEmptyScene(sceneElements);
load3DObjects(sceneElements.sceneGraph);
requestAnimationFrame(computeFrame);

// HANDLING EVENTS

// Event Listeners

window.addEventListener('resize', resizeWindow);

//To keep track of the keyboard - WASD
var keyD = false, keyA = false, keyS = false, keyW = false;
document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);

// Update render image size and camera aspect when the window is resized
function resizeWindow(eventParam) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneElements.camera.aspect = width / height;
    sceneElements.camera.updateProjectionMatrix();

    sceneElements.renderer.setSize(width, height);
}

function onDocumentKeyDown(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = true;
            break;
        case 83: //s
            keyS = true;
            break;
        case 65: //a
            keyA = true;
            break;
        case 87: //w
            keyW = true;
            break;
    }
}
function onDocumentKeyUp(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = false;
            break;
        case 83: //s
            keyS = false;
            break;
        case 65: //a
            keyA = false;
            break;
        case 87: //w
            keyW = false;
            break;
    }
}

//////////////////////////////////////////////////////////////////

function Wheel() {
    const geometry = new THREE.BoxBufferGeometry(0.1, 0.1, 0.275);
    const material = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const wheel = new THREE.Mesh(geometry, material);
    wheel.translateY(0.05);
    wheel.castShadow = true;
    wheel.receiveShadow = true;
    return wheel;
}

function frontMirror() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");
  
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);
  
    context.fillStyle = "#666666";
    context.fillRect(8, 8, 48, 24);
  
    return new THREE.CanvasTexture(canvas);
}

function sideMirror() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");
  
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);
  
    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);
  
    return new THREE.CanvasTexture(canvas);
}

function Car(){
    const car = new THREE.Group();

    const wheel1 = Wheel();
    wheel1.translateX(-0.15);
    car.add(wheel1);
  
    const wheel2 = Wheel();
    wheel2.translateX(0.15);
    car.add(wheel2);

    const main = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.5, 0.125, 0.25),
      new THREE.MeshPhongMaterial({ color: "rgb(255,140,0)" })
    );
    main.translateY(0.1);
    main.castShadow = true;
    main.receiveShadow = true;
    car.add(main);
  
    const front = frontMirror();
    const back = frontMirror();
    const right = sideMirror();
    const left = sideMirror();
    left.center = new THREE.Vector2(0.5/120, 0.5/120);
    left.rotation = Math.PI/120;
    left.flipY = false;
  
    const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(0.275, 0.1, 0.2), [
      new THREE.MeshPhongMaterial({ map: front }),
      new THREE.MeshPhongMaterial({ map: back }),
      new THREE.MeshPhongMaterial({ color: 0xffffff }), // top
      new THREE.MeshPhongMaterial({ color: 0xffffff }), // bottom
      new THREE.MeshPhongMaterial({ map: right }),
      new THREE.MeshPhongMaterial({ map: left }),
    ]);
    cabin.position.x = -0.05;
    cabin.position.y = 0.2125;
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    car.add(cabin);
  
    return car;
}


function getTruckFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 32, 32);

  context.fillStyle = "#666666";
  context.fillRect(0, 5, 32, 10);

  return new THREE.CanvasTexture(canvas);
}

function getTruckSideTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 32, 32);

  context.fillStyle = "#666666";
  context.fillRect(17, 5, 15, 10);

  return new THREE.CanvasTexture(canvas);
}


function Truck() {
    const truck = new THREE.Group();
  
    const base = new THREE.Mesh(
      new THREE.BoxBufferGeometry(100/120, 5/120, 25/120),
      new THREE.MeshPhongMaterial({ color: 0xb4c6fc })
    );
    base.position.y = 10/120;
    truck.add(base);
  
    const cargo = new THREE.Mesh(
      new THREE.BoxBufferGeometry(75/120, 40/120, 35/120),
      new THREE.MeshPhongMaterial({ color: 0xffffff }) 
    );
    cargo.position.x = -15/120;
    cargo.position.y = 30/120;
    cargo.castShadow = true;
    cargo.receiveShadow = true;
    truck.add(cargo);
  
    const truckFrontTexture = getTruckFrontTexture();
  
    const truckLeftTexture = getTruckSideTexture();
    truckLeftTexture.center = new THREE.Vector2(0.5, 0.5);
    truckLeftTexture.rotation = Math.PI;
    truckLeftTexture.flipY = false;
  
    const truckRightTexture = getTruckSideTexture();
  
    const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(25/120, 30/120, 30/120), [
      new THREE.MeshLambertMaterial({ color: 0xa52523, map: truckFrontTexture }),
      new THREE.MeshLambertMaterial({ color: 0xa52523 }), // back
      new THREE.MeshLambertMaterial({ color: 0xa52523 }), // top
      new THREE.MeshLambertMaterial({ color: 0xa52523 }), // bottom
      new THREE.MeshLambertMaterial({ color: 0xa52523, map: truckRightTexture }),
      new THREE.MeshLambertMaterial({ color: 0xa52523, map: truckLeftTexture })
    ]);
    cabin.position.x = 40/120;
    cabin.position.y = 20/120;
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    truck.add(cabin);
  
    const backWheel = Wheel();
    backWheel.position.x = -30/120;
    truck.add(backWheel);
  
    const middleWheel = Wheel();
    middleWheel.position.x = 10/120;
    truck.add(middleWheel);
  
    const frontWheel = Wheel();
    frontWheel.position.x = 38/120;
    truck.add(frontWheel);
  
    return truck;
}

function TrafficLight(){
    const trafficLight = new THREE.Group();

    const postGeometry = new THREE.BoxBufferGeometry(0.07, 0.3, 0.1);
    const postMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.translateY(0.15);
    post.translateX(-1.70);
    post.castShadow = true;
    post.receiveShadow = true;
    trafficLight.add(post);

    const topPostGeometry = new THREE.BoxBufferGeometry(0.15, 0.5, 0.1);
    const topPostMaterial = new THREE.MeshPhongMaterial({ color: "rgb(192,192,192)" });
    const topPost = new THREE.Mesh(topPostGeometry, topPostMaterial);
    topPost.translateY(0.55);
    topPost.translateX(-1.70);
    topPost.castShadow = true;
    topPost.receiveShadow = true;
    trafficLight.add(topPost);
    
    const geometry = new THREE.CircleGeometry(0.05 , 32 );
    const material = new THREE.MeshBasicMaterial( { color: "rgb(0,128,0)" } );
    const circle = new THREE.Mesh( geometry, material );
    circle.translateY(0.4);
    circle.translateX(-1.70);
    circle.translateZ(0.051);//ATENCAO ESTOU A COLOCAR A VOAR !!
    trafficLight.add( circle );

    const yellowGeometry = new THREE.CircleGeometry(0.05 , 32 );
    const yellowMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const yellowCircle = new THREE.Mesh( yellowGeometry, yellowMaterial );
    yellowCircle.translateY(0.55);
    yellowCircle.translateX(-1.70);
    yellowCircle.translateZ(0.051);//ATENCAO ESTOU A COLOCAR A VOAR !!
    trafficLight.add( yellowCircle );

    const redGeometry = new THREE.CircleGeometry(0.05 , 32 );
    const redMaterial = new THREE.MeshBasicMaterial( { color: "rgb(255,0,0)" } );
    const redCircle = new THREE.Mesh( redGeometry, redMaterial );
    redCircle.translateY(0.7);
    redCircle.translateX(-1.70);
    redCircle.translateZ(0.051);//ATENCAO ESTOU A COLOCAR A VOAR !!
    trafficLight.add( redCircle );

    return trafficLight;
}


// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {

    // ************************** //
    // Create a ground plane
    // ************************** //
    const planeGeometry = new THREE.PlaneGeometry(15, 6);
    //const planeGeometry = new THREE.PlaneGeometry(15, 15);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(154,205,50)', side: THREE.DoubleSide });
    const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
    sceneGraph.add(planeObject);
    planeObject.translateY(-0.0001);//ATENCAO ESTOU A COLOCAR A VOAR !!

    // Change orientation of the plane using rotation
    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // Set shadow property
    planeObject.receiveShadow = true;

    const circleGeometry1 = new THREE.CircleGeometry(3, 100);
    const circleMaterial1 = new THREE.MeshPhongMaterial({ color: 'rgb(200, 200, 200)', side: THREE.DoubleSide });
    const circle1 = new THREE.Mesh(circleGeometry1, circleMaterial1);
    sceneGraph.add(circle1);

    // Change orientation of the plane using rotation
    circle1.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // Set shadow property
    circle1.receiveShadow = true;

    const circleGeometry2 = new THREE.CircleGeometry(2, 100);
    const circleMaterial2 = new THREE.MeshPhongMaterial({ color: 'rgb(154,205,50)', side: THREE.DoubleSide });
    const circle2 = new THREE.Mesh(circleGeometry2, circleMaterial2);
    sceneGraph.add(circle2);
    circle2.translateY(0.0001);//ATENCAO ESTOU A COLOCAR A VOAR !!

    // Change orientation of the plane using rotation
    circle2.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // Set shadow property
    circle2.receiveShadow = true;

    const roadLineGeometry = new THREE.CircleGeometry(2.5, 100);
    roadLineGeometry.vertices.splice(0, 1); 
    const roadLine =  new THREE.LineLoop(roadLineGeometry, new THREE.LineBasicMaterial({ color: 'yellow'}));
    sceneGraph.add( roadLine );

    // Change orientation
    roadLine.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // Set shadow property
    roadLine.receiveShadow = true;

    // ************************** //
    // Create a Car
    // ************************** //
    const car = Car();
    sceneGraph.add(car);
    car.translateZ(2.75)
    // Set shadow property
    car.castShadow = true;
    car.receiveShadow = true;

    // ************************** //
    // Create a trafficLight
    // ************************** //
    const trafficLight = TrafficLight();
    sceneGraph.add(trafficLight);
    // Set shadow property
    trafficLight.castShadow = true;
    trafficLight.receiveShadow = true;

    // ************************** //
    // Create a Truck
    // ************************** //
    const truck = Truck();
    sceneGraph.add(truck);
    truck.translateZ(2.25)
    truck.rotation.y = 3.1
    // Set shadow property
    truck.castShadow = true;
    truck.receiveShadow = true;

    // ************************** //
    // Create a pivot
    // ************************** //
	const pivot = new THREE.Object3D();
    pivot.add(car);
    sceneGraph.add(pivot)
    pivot.name="pivot"

    const pivot2 = new THREE.Object3D();
    pivot2.add(truck);
    sceneGraph.add(pivot2)
    pivot2.name="pivot2"

}

// Displacement value

var delta = 0.1;

var dispX = 0.2, dispZ = 0.2;


function computeFrame(time) {
/*
    // THE SPOT LIGHT

    // Can extract an object from the scene Graph from its name
    const light = sceneElements.sceneGraph.getObjectByName("light");

    // Apply a small displacement

    if (light.position.x >= 10) {
        delta *= -1;
    } else if (light.position.x <= -10) {
        delta *= -1;
    }
    light.translateX(delta);
*/
    // Truck movement
    const pivot2 = sceneElements.sceneGraph.getObjectByName("pivot2");
    pivot2.rotation.y -= 0.03;

    // CONTROLING THE CAR WITH THE KEYBOARD

    const pivot = sceneElements.sceneGraph.getObjectByName("pivot");

    if (keyW) {
        pivot.rotation.y += 0.03;
    }
    if (keyS) {
        pivot.rotation.y -= 0.03;
    }

    // Rendering
    helper.render(sceneElements);

    // NEW --- Update control of the camera
    sceneElements.control.update();

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}