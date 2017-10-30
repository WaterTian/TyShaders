"use strict";

// libs
import * as THREE from 'three';
import TweenMax from "gsap";
var glslify = require('glslify');
import OrbitContructor from 'three-orbit-controls';
var OrbitControls = OrbitContructor(THREE);
import Stats from 'stats.js';

import dat from 'dat-gui';



import './postprocessing/EffectComposer';
import './postprocessing/RenderPass';
import './postprocessing/ShaderPass';
import './postprocessing/MaskPass';
import './postprocessing/UnrealBloomPass';


import './shaders/CopyShader';
import './shaders/FXAAShader';
import './shaders/ConvolutionShader';
import './shaders/LuminosityHighPassShader';
import './shaders/ScreenShader';


var That;
var time = 0;

class Scene {

	constructor() {
		That = this;

		this.start();
	}

	start() {
		this.stats = new Stats();
		document.body.appendChild(this.stats.dom);

		this.camera;
		this.scene;

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.set(0, 0, 500);
		this.scene = new THREE.Scene();
		this.scene.add(this.camera);


		// init renderer
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			autoClearColor: true
		});
		this.renderer.setClearColor(0xcccccc);
		// this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);

		this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;


		// controls
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.update();


		// // postprocessing
		this.initEffectComposer();



		this.addLights();
		this.addObjects();
		this.initGround();
		this.loadModel();


		time = Date.now();
		this.animate();
	}


	initEffectComposer() {
		this.composer = new THREE.EffectComposer(this.renderer);
		this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
		let effect = new THREE.ShaderPass(THREE.ScreenShader);
		effect.renderToScreen = true;
		this.composer.addPass(effect);



		// var effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
		// effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
		// this.composer.addPass(effectFXAA);


		// var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85); //1.0, 9, 0.5, 512);
		// bloomPass.renderToScreen = true;
		// this.composer.addPass(bloomPass);

	}



	addLights() {
		this.ambient = new THREE.AmbientLight(0x333333);
		this.scene.add(this.ambient);

		this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		this.directionalLight.color.setHSL(0.1, 1, 0.95);
		this.directionalLight.position.set(-1, 1.75, 1);
		this.directionalLight.position.multiplyScalar(30);
		this.directionalLight.castShadow = true;
		this.directionalLight.shadow.mapSize.width = 2048;
		this.directionalLight.shadow.mapSize.height = 2048;
		this.scene.add(this.directionalLight);
		var d = 400;
		this.directionalLight.shadow.camera.left = -d;
		this.directionalLight.shadow.camera.right = d;
		this.directionalLight.shadow.camera.top = d;
		this.directionalLight.shadow.camera.bottom = -d;
		this.directionalLight.shadow.camera.far = 3500;
		this.directionalLight.shadow.bias = -0.0001;



		// this.pointLight = new THREE.PointLight(0xffffff, 1, 700);
		// this.pointLight.castShadow = true;
		// this.pointLight.shadow.camera.near = 10;
		// this.pointLight.shadow.camera.far = 700;
		// this.pointLight.shadow.bias = 0.1;
		// this.pointLight.shadow.darkness = 0.45;
		// this.pointLight.shadow.mapSize.width = 4096;
		// this.pointLight.shadow.mapSize.height = 2048;
		// this.scene.add(this.pointLight);
	}

	addObjects() {
		var geometry = new THREE.SphereGeometry(1, 14, 4);
		for (var i = 0; i < 100; i++) {
			var material = new THREE.MeshPhongMaterial({
				color: 0xffffff * Math.random(),
				dithering: true,
				flatShading: true
			});
			var mesh = new THREE.Mesh(geometry, material);
			mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
			mesh.position.multiplyScalar(Math.random() * 200);
			mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
			mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 20;
			this.scene.add(mesh);

			mesh.castShadow = true;
			mesh.receiveShadow = true;
		}

	}

	loadModel() {
		var loader = new THREE.JSONLoader();
		loader.load('assets/beijing.js', function(geometry) {

			var material = new THREE.MeshPhongMaterial({
				color: 0xffffff * Math.random(),
				dithering: true,
				flatShading: true,
				side: THREE.DoubleSide,
				// wireframe: true,
			});

			var mesh = new THREE.Mesh(geometry, material);
			mesh.scale.set(20,20,20);
			mesh.position.set(0, -300,0);
			That.scene.add(mesh);
			
			mesh.castShadow = true;
			mesh.receiveShadow = true;
		});
	}

	initGround() {
		// GROUND
		var groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
		var groundMat = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			specular: 0x050505
		});
		var ground = new THREE.Mesh(groundGeo, groundMat);
		ground.rotation.x = -Math.PI / 2;
		ground.position.y = -200;
		this.scene.add(ground);
		ground.receiveShadow = true;
	}



	animate() {
		let newTime = Date.now();
		requestAnimationFrame(this.animate.bind(this));
		this.render(newTime - time);
		time = newTime;
	}


	// main animation loop
	render(dt) {
		if (this.stats) this.stats.update();

		this.renderer.render(this.scene, this.camera);

		if (this.composer){
			this.composer.render();

		} 
	}
}

export default Scene;