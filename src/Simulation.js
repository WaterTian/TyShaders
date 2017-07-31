// libs
import * as THREE from 'three';
var glslify = require('glslify');


class Simulation {

	constructor(_renderer,_scene,_camera) {

		this.renderer = _renderer;
		this.scene = _scene;
		this.camera = _camera;

		this.time = Math.random() * 0xFF;

		// this.scene = new THREE.Scene();
		// this.camera = new THREE.Camera();
		// this.camera.position.z = 1;

		let geometry = new THREE.PlaneBufferGeometry(2, 2);

		let material = new THREE.ShaderMaterial({
			uniforms: {
				texture: {
					value: 0
				},
				time: {
					value: this.time
				},
				skipCount: {
					value: 5
				}
			},
			vertexShader: glslify('./glsl/default.vert'),
			fragmentShader: glslify('./glsl/sim.frag')
		});

		this.mesh = new THREE.Mesh(geometry, material);
		this.scene.add(this.mesh);

	}



	render() {
		this.time += .01;
		this.mesh.material.uniforms.time.value = this.time;


		this.renderer.render(this.scene, this.camera);



	}


}

export default Simulation;