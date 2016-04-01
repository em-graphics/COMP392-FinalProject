/// <reference path="_reference.ts"/>
// MAIN GAME FILE
// THREEJS Aliases
var Scene = Physijs.Scene;
var Renderer = THREE.WebGLRenderer;
var PerspectiveCamera = THREE.PerspectiveCamera;
var BoxGeometry = THREE.BoxGeometry;
var CubeGeometry = THREE.CubeGeometry;
var PlaneGeometry = THREE.PlaneGeometry;
var SphereGeometry = THREE.SphereGeometry;
var Geometry = THREE.Geometry;
var AxisHelper = THREE.AxisHelper;
var LambertMaterial = THREE.MeshLambertMaterial;
var MeshBasicMaterial = THREE.MeshBasicMaterial;
var LineBasicMaterial = THREE.LineBasicMaterial;
var PhongMaterial = THREE.MeshPhongMaterial;
var Material = THREE.Material;
var Texture = THREE.Texture;
var Line = THREE.Line;
var Mesh = THREE.Mesh;
var Object3D = THREE.Object3D;
var SpotLight = THREE.SpotLight;
var PointLight = THREE.PointLight;
var AmbientLight = THREE.AmbientLight;
var Color = THREE.Color;
var Vector3 = THREE.Vector3;
var Face3 = THREE.Face3;
var CScreen = config.Screen;
var Clock = THREE.Clock;
// Setup a Web Worker for Physijs
Physijs.scripts.worker = "/Scripts/lib/Physijs/physijs_worker.js";
Physijs.scripts.ammo = "/Scripts/lib/Physijs/examples/js/ammo.js";
// setup an IIFE structure (Immediately Invoked Function Expression)
var game = (function () {
    // declare game objects
    var havePointerLock;
    var element;
    var scene = new Scene(); // Instantiate Scene Object
    var renderer;
    var camera;
    var stats;
    var blocker;
    var instructions;
    var spotLight;
    var groundGeometry;
    var groundPhysicsMaterial;
    var groundMaterial;
    var ground;
    var groundTexture;
    var groundTextureNormal;
    var doorTexture;
    Texture;
    var doorTextureNormal;
    var doorPhysicsMaterial;
    var doorMaterial;
    var clock;
    // THREEJS and PHYSIJS Objects
    var playerGeometry;
    var playerMaterial;
    var player;
    var sphereGeometry;
    var sphereMaterial;
    var sphere;
    var keyboardControls;
    var mouseControls;
    var isGrounded;
    var velocity = new Vector3(0, 0, 0);
    var prevTime = 0;
    var directionLineMaterial;
    var directionLineGeometry;
    var directionLine;
    var donutGeometry;
    var donutMaterial;
    //donuts
    var donut;
    var donut2;
    var donut3;
    var donut4;
    var donut5;
    var donut6;
    //ugjyDonuts
    var uglyDonuts;
    var uglyDonut;
    var uglyDonut2;
    var uglyDonut3;
    var donuts;
    var donutCount = 10;
    var deathPlaneGeometry;
    var deathPlaneMaterial;
    var deathPlane;
    // CreateJS Related Variables
    var assets;
    var canvas;
    var stage;
    var scoreLabel;
    var livesLabel;
    var scoreValue;
    var livesValue;
    //level objects
    //big island
    var bigIsland;
    var bigIslandGeometry;
    var bigIslandMaterial;
    //small island
    var smallIsland;
    var smallIslandGeometry;
    var smallIslandMaterial;
    //board
    var board;
    var boardGeometry;
    var boardMaterial;
    var manifest = [
        { id: "land", src: "../../Assets/audio/Land.wav" },
        { id: "hit", src: "../../Assets/audio/hit.wav" },
        { id: "coin", src: "../../Assets/audio/coin.mp3" },
        { id: "jump", src: "../../Assets/audio/Jump.wav" }
    ];
    function preload() {
        assets = new createjs.LoadQueue();
        assets.installPlugin(createjs.Sound);
        assets.on("complete", init, this);
        assets.loadManifest(manifest);
    }
    function setupCanvas() {
        canvas = document.getElementById("canvas");
        canvas.setAttribute("width", config.Screen.WIDTH.toString());
        canvas.setAttribute("height", (config.Screen.HEIGHT * 0.1).toString());
        canvas.style.backgroundColor = "#000000";
        stage = new createjs.Stage(canvas);
    }
    function setupScoreboard() {
        // initialize  score and lives values
        scoreValue = 0;
        livesValue = 5;
        // Add Lives Label
        livesLabel = new createjs.Text("LIVES: " + livesValue, "40px Consolas", "#ffffff");
        livesLabel.x = config.Screen.WIDTH * 0.1;
        livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
        stage.addChild(livesLabel);
        console.log("Added Lives Label to stage");
        // Add Score Label
        scoreLabel = new createjs.Text("SCORE: " + scoreValue, "40px Consolas", "#ffffff");
        scoreLabel.x = config.Screen.WIDTH * 0.8;
        scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
        stage.addChild(scoreLabel);
        console.log("Added Score Label to stage");
    }
    function init() {
        // Create to HTMLElements
        blocker = document.getElementById("blocker");
        instructions = document.getElementById("instructions");
        // Set Up CreateJS Canvas and Stage
        setupCanvas();
        // Set Up Scoreboard
        setupScoreboard();
        // Set Up Level
        setupLevel();
        //check to see if pointerlock is supported
        havePointerLock = 'pointerLockElement' in document ||
            'mozPointerLockElement' in document ||
            'webkitPointerLockElement' in document;
        // Instantiate Game Controls
        keyboardControls = new objects.KeyboardControls();
        mouseControls = new objects.MouseControls();
        // Check to see if we have pointerLock
        if (havePointerLock) {
            element = document.body;
            instructions.addEventListener('click', function () {
                // Ask the user for pointer lock
                console.log("Requesting PointerLock");
                element.requestPointerLock = element.requestPointerLock ||
                    element.mozRequestPointerLock ||
                    element.webkitRequestPointerLock;
                element.requestPointerLock();
            });
            document.addEventListener('pointerlockchange', pointerLockChange);
            document.addEventListener('mozpointerlockchange', pointerLockChange);
            document.addEventListener('webkitpointerlockchange', pointerLockChange);
            document.addEventListener('pointerlockerror', pointerLockError);
            document.addEventListener('mozpointerlockerror', pointerLockError);
            document.addEventListener('webkitpointerlockerror', pointerLockError);
        }
        // Scene changes for Physijs
        scene.name = "Main";
        scene.fog = new THREE.Fog(0xffffff, 0, 750);
        scene.setGravity(new THREE.Vector3(0, -10, 0));
        scene.addEventListener('update', function () {
            scene.simulate(undefined, 2);
        });
        // setup a THREE.JS Clock object
        clock = new Clock();
        setupRenderer(); // setup the default renderer
        setupCamera(); // setup the camera
        // Directional Light
        var light = new THREE.DirectionalLight(0xffffff);
        light.castShadow = true; // soft white light
        light.shadowCameraNear = 2;
        scene.add(light);
        // Player Object
        playerGeometry = new BoxGeometry(2, 4, 2);
        playerMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);
        player = new Physijs.BoxMesh(playerGeometry, playerMaterial, 1);
        player.position.set(0, 30, 10);
        player.receiveShadow = true;
        player.castShadow = true;
        player.name = "Player";
        scene.add(player);
        console.log("Added Player to Scene");
        // Add custom donut imported from Blender
        addDonutMesh();
        addUglyDonutMesh();
        addDeathPlane();
        // Collision Check
        player.addEventListener('collision', function (eventObject) {
            if (eventObject.name === "BigIsland") {
                console.log("player hit the big island");
                isGrounded = true;
                createjs.Sound.play("land");
            }
            if (eventObject.name === "Board") {
                console.log("player hit the board");
                isGrounded = true;
                createjs.Sound.play("land");
            }
            if (eventObject.name === "SmallIsland") {
                console.log("player hit the board");
                isGrounded = true;
                createjs.Sound.play("land");
            }
            if (eventObject.name === "Donut") {
                createjs.Sound.play("coin");
                scene.remove(eventObject);
                scoreValue += 100;
                scoreLabel.text = "SCORE: " + scoreValue;
            }
            if (eventObject.name === "UglyDonut") {
                createjs.Sound.play("coin");
                livesValue--;
                livesLabel.text = "LIVES: " + livesValue;
                scene.remove(uglyDonut);
            }
            if (eventObject.name === "DeathPlane") {
                createjs.Sound.play("hit");
                livesValue--;
                livesLabel.text = "LIVES: " + livesValue;
                scene.remove(player);
                player.position.set(0, 30, 10);
                scene.add(player);
            }
        });
        // Add DirectionLine
        directionLineMaterial = new LineBasicMaterial({ color: 0xffff00 });
        directionLineGeometry = new Geometry();
        directionLineGeometry.vertices.push(new Vector3(0, 0, 0)); // line origin
        directionLineGeometry.vertices.push(new Vector3(0, 0, -50)); // end of the line
        directionLine = new Line(directionLineGeometry, directionLineMaterial);
        player.add(directionLine);
        console.log("Added DirectionLine to the Player");
        // create parent-child relationship with camera and player
        player.add(camera);
        camera.position.set(0, 1, 0);
        // Add framerate stats
        addStatsObject();
        console.log("Added Stats to scene...");
        document.body.appendChild(renderer.domElement);
        gameLoop(); // render the scene	
        scene.simulate();
        window.addEventListener('resize', onWindowResize, false);
    }
    function setCenter(geometry) {
        geometry.computeBoundingBox();
        var bb = geometry.boundingBox;
        var offset = new THREE.Vector3();
        offset.addVectors(bb.min, bb.max);
        offset.multiplyScalar(-0.5);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(offset.x, offset.y, offset.z));
        geometry.computeBoundingBox();
        return offset;
    }
    function addDeathPlane() {
        deathPlaneGeometry = new BoxGeometry(100, 1, -720);
        deathPlaneMaterial = Physijs.createMaterial(new MeshBasicMaterial({ color: 0xADD8E6 }), 0.4, 0.6);
        deathPlane = new Physijs.BoxMesh(deathPlaneGeometry, deathPlaneMaterial, 0);
        deathPlane.position.set(0, -10, 0);
        deathPlane.name = "DeathPlane";
        scene.add(deathPlane);
    }
    // Add the Donut to the scene
    function addDonutMesh() {
        donuts = new Array(); // Instantiate a convex mesh array
        var donutLoader = new THREE.JSONLoader().load("../../Assets/imported/donut.json", function (geometry, materials) {
            //jem color    
            var phongMaterial = new PhongMaterial({ color: 0xF21F88 });
            phongMaterial.emissive = new THREE.Color(0xF21F88);
            materials[0] = Physijs.createMaterial((phongMaterial), 0.4, 0.6);
            //bun color    
            var phongMaterial = new PhongMaterial({ color: 0x946931 });
            phongMaterial.emissive = new THREE.Color(0x946931);
            materials[1] = Physijs.createMaterial((phongMaterial), 0.4, 0.6);
            //first donut
            donut2 = new Physijs.ConvexMesh(geometry, new THREE.MeshFaceMaterial(materials));
            donut2.receiveShadow = true;
            donut2.castShadow = true;
            donut2.name = "Donut";
            donut2.position.set(0, 10, -10);
            scene.add(donut2);
            donuts.push(donut2);
            //second donut
            donut3 = new Physijs.ConvexMesh(geometry, new THREE.MeshFaceMaterial(materials));
            donut3.receiveShadow = true;
            donut3.castShadow = true;
            donut3.name = "Donut";
            donut3.position.set(-11, 10, -38);
            scene.add(donut3);
            donuts.push(donut3);
            //third donut
            donut4 = new Physijs.ConvexMesh(geometry, new THREE.MeshFaceMaterial(materials));
            donut4.receiveShadow = true;
            donut4.castShadow = true;
            donut4.name = "Donut";
            donut4.position.set(9, 10, -58);
            scene.add(donut4);
            donuts.push(donut4);
            //fourth donut
            donut5 = new Physijs.ConvexMesh(geometry, new THREE.MeshFaceMaterial(materials));
            donut5.receiveShadow = true;
            donut5.castShadow = true;
            donut5.name = "Donut";
            donut5.position.set(-1, 10, -170);
            scene.add(donut5);
            donuts.push(donut5);
            //fifth donut
            donut6 = new Physijs.ConvexMesh(geometry, new THREE.MeshFaceMaterial(materials));
            donut6.receiveShadow = true;
            donut6.castShadow = true;
            donut6.name = "Donut";
            donut6.position.set(1, 10, -195);
            scene.add(donut6);
            donuts.push(donut6);
        });
        console.log("Added Donut Mesh to Scene");
    }
    // Add the Ugly Donut to the scene
    function addUglyDonutMesh() {
        uglyDonuts = new Array(); // Instantiate a convex mesh array
        var donutLoader2 = new THREE.JSONLoader().load("../../Assets/imported/donut.json", function (geometry, materials) {
            //ugly donat gem
            var phongMaterial = new PhongMaterial({ color: 0x0add08 });
            phongMaterial.emissive = new THREE.Color(0x0add08);
            materials[0] = Physijs.createMaterial((phongMaterial), 0.4, 0.6);
            //ugly donat bun
            var phongMaterial = new PhongMaterial({ color: 0x000000 });
            phongMaterial.emissive = new THREE.Color(0x000000);
            materials[1] = Physijs.createMaterial((phongMaterial), 0.4, 0.6);
            //first ugly donut  
            uglyDonut = new Physijs.ConvexMesh(geometry, new THREE.MeshFaceMaterial(materials));
            uglyDonut.receiveShadow = true;
            uglyDonut.castShadow = true;
            uglyDonut.name = "UglyDonut";
            uglyDonut.position.set(0, 10, -30);
            scene.add(uglyDonut);
            uglyDonuts.push(uglyDonut);
            //second ugly donut  
            uglyDonut2 = new Physijs.ConvexMesh(geometry, new THREE.MeshFaceMaterial(materials));
            uglyDonut2.receiveShadow = true;
            uglyDonut2.castShadow = true;
            uglyDonut2.name = "UglyDonut";
            uglyDonut2.position.set(-1, 10, -118);
            scene.add(uglyDonut2);
            uglyDonuts.push(uglyDonut2);
            //third ugly donut  
            uglyDonut3 = new Physijs.ConvexMesh(geometry, new THREE.MeshFaceMaterial(materials));
            uglyDonut3.receiveShadow = true;
            uglyDonut3.castShadow = true;
            uglyDonut3.name = "UglyDonut";
            uglyDonut3.position.set(-1, 10, -168);
            scene.add(uglyDonut3);
            uglyDonuts.push(uglyDonut3);
        });
        console.log("Added Donut Mesh to Scene");
    }
    //PointerLockChange Event Handler
    function pointerLockChange(event) {
        if (document.pointerLockElement === element) {
            // enable our mouse and keyboard controls
            keyboardControls.enabled = true;
            mouseControls.enabled = true;
            blocker.style.display = 'none';
        }
        else {
            // disable our mouse and keyboard controls
            keyboardControls.enabled = false;
            mouseControls.enabled = false;
            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';
            instructions.style.display = '';
            console.log("PointerLock disabled");
        }
    }
    //PointerLockError Event Handler
    function pointerLockError(event) {
        instructions.style.display = '';
        console.log("PointerLock Error Detected!!");
    }
    // Window Resize Event Handler
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvas.style.width = "100%";
        livesLabel.x = config.Screen.WIDTH * 0.1;
        livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
        scoreLabel.x = config.Screen.WIDTH * 0.8;
        scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
        stage.update();
    }
    // Add Frame Rate Stats to the Scene
    function addStatsObject() {
        stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);
    }
    // Setup main game loop
    function gameLoop() {
        stats.update();
        donuts.forEach(function (donut) {
            donut.setAngularFactor(new Vector3(0, 0, 0));
            donut.setAngularVelocity(new Vector3(0, 1, 0));
        });
        uglyDonuts.forEach(function (uglyDonut) {
            uglyDonut.setAngularFactor(new Vector3(0, 0, 0));
            uglyDonut.setAngularVelocity(new Vector3(0, 1, 0));
        });
        checkControls();
        stage.update();
        // render using requestAnimationFrame
        requestAnimationFrame(gameLoop);
        // render the scene
        renderer.render(scene, camera);
    }
    // Check Controls Function
    function checkControls() {
        if (keyboardControls.enabled) {
            velocity = new Vector3();
            var time = performance.now();
            var delta = (time - prevTime) / 1000;
            if (isGrounded) {
                var direction = new Vector3(0, 0, 0);
                if (keyboardControls.moveForward) {
                    velocity.z -= 400.0 * delta;
                }
                if (keyboardControls.moveLeft) {
                    velocity.x -= 400.0 * delta;
                }
                if (keyboardControls.moveBackward) {
                    velocity.z += 400.0 * delta;
                }
                if (keyboardControls.moveRight) {
                    velocity.x += 400.0 * delta;
                }
                if (keyboardControls.jump) {
                    velocity.y += 4000.0 * delta;
                    if (player.position.y > 4) {
                        isGrounded = false;
                        createjs.Sound.play("jump");
                    }
                }
                player.setDamping(0.7, 0.1);
                // Changing player's rotation
                player.setAngularVelocity(new Vector3(0, mouseControls.yaw, 0));
                direction.addVectors(direction, velocity);
                direction.applyQuaternion(player.quaternion);
                if (Math.abs(player.getLinearVelocity().x) < 20 && Math.abs(player.getLinearVelocity().y) < 10) {
                    player.applyCentralForce(direction);
                }
                cameraLook();
            } // isGrounded ends
            //reset Pitch and Yaw
            mouseControls.pitch = 0;
            mouseControls.yaw = 0;
            prevTime = time;
        } // Controls Enabled ends
        else {
            player.setAngularVelocity(new Vector3(0, 0, 0));
        }
    }
    // Camera Look function
    function cameraLook() {
        var zenith = THREE.Math.degToRad(90);
        var nadir = THREE.Math.degToRad(-90);
        var cameraPitch = camera.rotation.x + mouseControls.pitch;
        // Constrain the Camera Pitch
        camera.rotation.x = THREE.Math.clamp(cameraPitch, nadir, zenith);
    }
    // Setup default renderer
    function setupRenderer() {
        renderer = new Renderer({ antialias: true });
        renderer.setClearColor(0xADD8E6, 1.0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
        renderer.shadowMap.enabled = true;
        console.log("Finished setting up Renderer...");
    }
    // Setup main camera for the scene
    function setupCamera() {
        camera = new PerspectiveCamera(35, config.Screen.RATIO, 0.1, 1000);
        //camera.position.set(0, 10, 30);
        //camera.lookAt(new Vector3(0, 0, 0));
        console.log("Finished setting up Camera...");
    }
    // Setup level
    function setupLevel() {
        // Beginning Big Island
        //Ground texture
        groundTexture = new THREE.TextureLoader().load('../../Images/Grass.jpg');
        groundTexture.wrapS = THREE.RepeatWrapping;
        groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(10, 10);
        groundTextureNormal = new THREE.TextureLoader().load('../../Images/Grass.jpg');
        groundTextureNormal.wrapS = THREE.RepeatWrapping;
        groundTextureNormal.wrapT = THREE.RepeatWrapping;
        groundTextureNormal.repeat.set(10, 10);
        groundMaterial = new PhongMaterial();
        groundMaterial.map = groundTexture;
        groundMaterial.bumpMap = groundTextureNormal;
        groundMaterial.bumpScale = 0.2;
        //Door Texture
        doorTexture = new THREE.TextureLoader().load('../../Images/door.jpg');
        doorTexture.wrapS = THREE.RepeatWrapping;
        doorTexture.wrapT = THREE.RepeatWrapping;
        doorTexture.repeat.set(10, 10);
        doorTextureNormal = new THREE.TextureLoader().load('../../Images/door.jpg');
        doorTextureNormal.wrapS = THREE.RepeatWrapping;
        doorTextureNormal.wrapT = THREE.RepeatWrapping;
        doorTextureNormal.repeat.set(10, 10);
        doorMaterial = new PhongMaterial();
        doorMaterial.map = doorTexture;
        doorMaterial.bumpMap = doorTextureNormal;
        doorMaterial.bumpScale = 0.2;
        //Big Island
        bigIslandGeometry = new BoxGeometry(32, 1, 20);
        bigIslandMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        bigIsland = new Physijs.ConvexMesh(bigIslandGeometry, bigIslandMaterial, 0);
        bigIsland.position.set(0, 0, 5);
        bigIsland.receiveShadow = true;
        bigIsland.name = "BigIsland";
        scene.add(bigIsland);
        console.log("Added BigIsland to scene");
        // Board
        boardGeometry = new BoxGeometry(32, 1, 5);
        boardMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        board = new Physijs.ConvexMesh(boardGeometry, boardMaterial, 0);
        board.position.set(0, 0, -9);
        board.receiveShadow = true;
        board.name = "Board";
        scene.add(board);
        console.log("Added Board to scene");
        // Board
        boardGeometry = new BoxGeometry(32, 1, 5);
        boardMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        board = new Physijs.ConvexMesh(boardGeometry, boardMaterial, 0);
        board.position.set(0, 0, -16);
        board.receiveShadow = true;
        board.name = "Board";
        scene.add(board);
        console.log("Added Board to scene");
        // Big Island
        bigIslandGeometry = new BoxGeometry(32, 1, 10);
        bigIslandMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        bigIsland = new Physijs.ConvexMesh(bigIslandGeometry, bigIslandMaterial, 0);
        bigIsland.position.set(0, 0, -26);
        bigIsland.receiveShadow = true;
        bigIsland.name = "BigIsland";
        scene.add(bigIsland);
        console.log("Added BigIsland to scene");
        // Small Island 1
        smallIslandGeometry = new BoxGeometry(10, 1, 10);
        smallIslandMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        smallIsland = new Physijs.ConvexMesh(smallIslandGeometry, smallIslandMaterial, 0);
        smallIsland.position.set(-11, 0, -38);
        smallIsland.receiveShadow = true;
        smallIsland.name = "SmallIsland";
        scene.add(smallIsland);
        console.log("Added SmallIsland to scene");
        console.log("Finished setting up Level...");
        //Small Island 2
        smallIslandGeometry = new BoxGeometry(10, 1, 10);
        smallIslandMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        smallIsland = new Physijs.ConvexMesh(smallIslandGeometry, smallIslandMaterial, 0);
        smallIsland.position.set(-1, 0, -48);
        smallIsland.receiveShadow = true;
        smallIsland.name = "SmallIsland";
        scene.add(smallIsland);
        console.log("Added SmallIsland to scene");
        console.log("Finished setting up Level...");
        //Small Island 3
        smallIslandGeometry = new BoxGeometry(10, 1, 10);
        smallIslandMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        smallIsland = new Physijs.ConvexMesh(smallIslandGeometry, smallIslandMaterial, 0);
        smallIsland.position.set(9, 0, -58);
        smallIsland.receiveShadow = true;
        smallIsland.name = "SmallIsland";
        scene.add(smallIsland);
        console.log("Added SmallIsland to scene");
        console.log("Finished setting up Level...");
        // Safe Board
        boardGeometry = new BoxGeometry(32, 1, 10);
        boardMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        board = new Physijs.ConvexMesh(boardGeometry, boardMaterial, 0);
        board.position.set(0, 0, -70);
        board.receiveShadow = true;
        board.name = "Board";
        scene.add(board);
        console.log("Added Board to scene");
        // Small Island 
        smallIslandGeometry = new BoxGeometry(10, 1, 10);
        smallIslandMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        smallIsland = new Physijs.ConvexMesh(smallIslandGeometry, smallIslandMaterial, 0);
        smallIsland.position.set(-1, 0, -82);
        smallIsland.receiveShadow = true;
        smallIsland.name = "SmallIsland";
        scene.add(smallIsland);
        console.log("Added SmallIsland to scene");
        console.log("Finished setting up Level...");
        // Safe Board
        boardGeometry = new BoxGeometry(32, 1, 10);
        boardMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        board = new Physijs.ConvexMesh(boardGeometry, boardMaterial, 0);
        board.position.set(-1, 0, -94);
        board.receiveShadow = true;
        board.name = "Board";
        scene.add(board);
        console.log("Added Board to scene");
        // Long Board
        boardGeometry = new BoxGeometry(6, 1, 32);
        boardMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        board = new Physijs.ConvexMesh(boardGeometry, boardMaterial, 0);
        board.position.set(-1, 0, -118);
        board.receiveShadow = true;
        board.name = "Board";
        scene.add(board);
        console.log("Added Board to scene");
        // Safe Board
        boardGeometry = new BoxGeometry(32, 1, 10);
        boardMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        board = new Physijs.ConvexMesh(boardGeometry, boardMaterial, 0);
        board.position.set(-1, 0, -145);
        board.receiveShadow = true;
        board.name = "Board";
        scene.add(board);
        console.log("Added Board to scene");
        //Island 1
        smallIslandGeometry = new BoxGeometry(10, 1, 10);
        smallIslandMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        smallIsland = new Physijs.ConvexMesh(smallIslandGeometry, smallIslandMaterial, 0);
        smallIsland.position.set(-11, 0, -158);
        smallIsland.receiveShadow = true;
        smallIsland.name = "SmallIsland";
        scene.add(smallIsland);
        console.log("Added SmallIsland to scene");
        console.log("Finished setting up Level...");
        //Island 2
        smallIslandGeometry = new BoxGeometry(10, 1, 10);
        smallIslandMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        smallIsland = new Physijs.ConvexMesh(smallIslandGeometry, smallIslandMaterial, 0);
        smallIsland.position.set(-1, 0, -170);
        smallIsland.receiveShadow = true;
        smallIsland.name = "SmallIsland";
        scene.add(smallIsland);
        console.log("Added SmallIsland to scene");
        console.log("Finished setting up Level...");
        //Island 3
        smallIslandGeometry = new BoxGeometry(10, 1, 10);
        smallIslandMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        smallIsland = new Physijs.ConvexMesh(smallIslandGeometry, smallIslandMaterial, 0);
        smallIsland.position.set(-11, 0, -182);
        smallIsland.receiveShadow = true;
        smallIsland.name = "SmallIsland";
        scene.add(smallIsland);
        console.log("Added SmallIsland to scene");
        console.log("Finished setting up Level...");
        // Finish Line Island
        bigIslandGeometry = new BoxGeometry(32, 1, 20);
        bigIslandMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        bigIsland = new Physijs.ConvexMesh(bigIslandGeometry, bigIslandMaterial, 0);
        bigIsland.position.set(0, 0, -199);
        bigIsland.receiveShadow = true;
        bigIsland.name = "BigIsland";
        scene.add(bigIsland);
        console.log("Added BigIsland to scene");
        //Door to success
        bigIslandGeometry = new BoxGeometry(32, 20, 1);
        bigIslandMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        bigIsland = new Physijs.ConvexMesh(bigIslandGeometry, bigIslandMaterial, 0);
        bigIsland.position.set(0, 10, -199);
        bigIsland.receiveShadow = true;
        bigIsland.name = "BigIsland";
        scene.add(bigIsland);
        console.log("Added BigIsland to scene");
    }
    window.onload = preload;
    return {
        scene: scene
    };
})();

//# sourceMappingURL=game.js.map
