"use strict";

//  Adapted from Daniel Rohmer tutorial
//
// 		https://imagecomputing.net/damien.rohmer/teaching/2019_2020/semester_1/MPRI_2-39/practice/threejs/content/000_threejs_tutorial/index.html
//
// 		J. Madeira - April 2021

const helper = {

    initEmptyScene: function (sceneElements) {

        // ************************** //
        // Create the 3D scene
        // ************************** //
        sceneElements.sceneGraph = new THREE.Scene();


        // ************************** //
        // Add camera
        // ************************** //
        const width = window.innerWidth;
        const height = window.innerHeight;
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
        sceneElements.camera = camera;
        camera.position.set(0, 5, 5);
        camera.lookAt(0, 0, 0);

        // ************************** //
        // NEW --- Control for the camera
        // ************************** //
        sceneElements.control = new THREE.OrbitControls(camera);
        sceneElements.control.screenSpacePanning = true;

        // ************************** //
        // Illumination
        // ************************** //

        // ************************** //
        // Add ambient light
        // ************************** //
        const ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)', 0.2);
        sceneElements.sceneGraph.add(ambientLight);

        // ***************************** //
        // Add spotlight (with shadows)
        // ***************************** //
        const spotLight = new THREE.SpotLight('rgb(255, 255, 255)', 0.8);
        spotLight.position.set(-5, 8, 0);
        sceneElements.sceneGraph.add(spotLight);


        // Setup shadow properties for the spotlight
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;

        // Give a name to the spot light
        spotLight.name = "light";

/*

const intensity = 1;
const rectLight = new THREE.RectAreaLight( 0xff0000, intensity,  10, 10 );
rectLight.position.set( 5, 5, 0 );
rectLight.lookAt( 0, 0, 0 );
sceneElements.sceneGraph.add( rectLight )


        TRY PUT TrafficLight shy
        const light_1 = new THREE.PointLight('rgb(255, 0, 0)');
        light_1.translateX(-1.70);
        light_1.translateZ(0.05);//ATENCAO ESTOU A COLOCAR A VOAR !!
        light_1.translateY(0.7);
        sceneElements.sceneGraph.add(light_1);// se retirar esta linha a bola fica cinzenta, pq tirei a fonte de luz 

        const spotLight1 = new THREE.SpotLight( 0xff0000 );
        spotLight1.position.set( -1.70, 0.7, 0 );
        sceneElements.sceneGraph.add( spotLight1 );

        const spotLightHelper = new THREE.SpotLightHelper( spotLight1 );
        sceneElements.sceneGraph.add( spotLightHelper );       

        const pointLight = new THREE.PointLight( 0xff0000, 0.2, 100 );
        pointLight.position.set( -1.70, 0.7, 0.05 );
        sceneElements.sceneGraph.add( pointLight );
        
        const sphereSize = 0.2;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        sceneElements.sceneGraph.add( pointLightHelper );

*/

        // *********************************** //
        // Create renderer (with shadow map)
        // *********************************** //
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        sceneElements.renderer = renderer;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor('rgb(135,206,235)', 1.0);
        renderer.setSize(width, height);

        // Setup shadowMap property
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;


        // **************************************** //
        // Add the rendered image in the HTML DOM
        // **************************************** //
        const htmlElement = document.querySelector("#Tag3DScene");
        htmlElement.appendChild(renderer.domElement);
    },

    render: function render(sceneElements) {
        sceneElements.renderer.render(sceneElements.sceneGraph, sceneElements.camera);
    },
};