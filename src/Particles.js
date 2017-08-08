// libs
import * as THREE from 'three';
var glslify = require('glslify');
var simulator = require('./Simulation');


const sprite = new THREE.TextureLoader().load('../assets/spark1.png');




const TEXTURE_WIDTH = 512;
const TEXTURE_HEIGHT = 512;
const AMOUNT = TEXTURE_WIDTH * TEXTURE_HEIGHT;

class Particles extends THREE.Points {

	constructor() {



		const _color1 = new THREE.Color('#e6005e');
		const _color2 = new THREE.Color('#00b1d7');

		let position = new Float32Array(AMOUNT * 3);
		let sizes = new Float32Array(AMOUNT);

		let n = 1000,
			n2 = n / 2; // particles spread in the cube

		for (let i = 0; i < AMOUNT; i++) {
			var x = Math.random() * n - n2;
			var y = Math.random() * n - n2;
			var z = Math.random() * n - n2;

			let i3 = i * 3;
			position[i3] = x;
			position[i3 + 1] = y;
			position[i3 + 2] = z;

			sizes[i] = 10;
		}
		let geometry = new THREE.BufferGeometry();
		geometry.addAttribute('position', new THREE.BufferAttribute(position, 3));

		let material = new THREE.ShaderMaterial({
			uniforms: {
				color1: {
					type: 'c',
					value: _color1
				},
				color2: {
					type: 'c',
					value: _color2
				},
				texturePosition: {
					type: 't',
					value: null
				},
				lightPos: {
					type: 'v3',
					value: new THREE.Vector3(0, 0, 0)
				}
			},
			vertexShader: glslify('./glsl/particles.vert'),
			fragmentShader: glslify('./glsl/particles.frag'),
			// blending: THREE.AdditiveBlending,
			// depthTest: false,
			// transparent: true
		});


		super(geometry, material);

		this.castShadow = true;
		this.receiveShadow = true;

	}

	update(_texture) {

		this.material.uniforms.texturePosition.value = _texture;
		// this.material.uniforms.texturePosition.value = simulator.positionRenderTarget;
		// this.customDistanceMaterial.uniforms.texturePosition.value = texture3;
		// this.customDistanceMaterial.uniforms.texturePosition.value = simulator.positionRenderTarget;
		// this.motionMaterial.uniforms.texturePrevPosition.value = simulator.prevPositionRenderTarget;

		// if (this.material.uniforms.flipRatio) {
		// 	this.material.uniforms.flipRatio.value ^= 1;
		// 	this.customDistanceMaterial.uniforms.flipRatio.value ^= 1;
		// 	this.motionMaterial.uniforms.flipRatio.value ^= 1;
		// }
	}


}

export default Particles;