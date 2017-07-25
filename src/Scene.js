"use strict";

// libs
import * as THREE from 'three';
import {TweenMax} from "gsap";
var glslify = require('glslify');
import OrbitContructor from 'three-orbit-controls';
var OrbitControls = OrbitContructor(THREE);
import Stats from 'stats.js';


export default class Scene {

	constructor() {
		let that = this;


		this.start();
	}

	start() {
		this.stats = new Stats();
		document.body.appendChild(this.stats.dom);

		this.camera;
		this.scene;

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
		this.scene = new THREE.Scene();
		this.scene.add(this.camera);


		// init renderer
		this.renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		this.renderer.setClearColor(new THREE.Color(0xaaaaaa));
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);

		this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;
		this.renderer.shadowMap.enabled = true;

		// controls
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.update();


		this.addLights();

		this.animate();
	}

	addLights() {
		this.ambient = new THREE.AmbientLight(0x666666);
		this.scene.add(this.ambient);
		this.directionalLight = new THREE.DirectionalLight(0x887766);
		this.directionalLight.position.set(-1, 1, 1).normalize();
		this.scene.add(this.directionalLight);
	}


	animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.render();
	}

	// main animation loop
	render() {
		if (this.stats) this.stats.update();

		this.renderer.render(this.scene, this.camera);
	}
}