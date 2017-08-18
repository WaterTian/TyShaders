// libs
import * as THREE from 'three';
var glslify = require('glslify');
var simulator = require('./Simulation');




class Particles extends THREE.Points {

	constructor(SIZE = 64, C1 = 0xffffff, C2 = 0xaaaaaa) {
		const AMOUNT = SIZE * SIZE;
		const COLOR1 = new THREE.Color(C1);
		const COLOR2 = new THREE.Color(C2);


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



		let sprite = new THREE.TextureLoader().load('../assets/sprites/circle2.png');
		sprite.wrapS = THREE.RepeatWrapping;
		sprite.wrapT = THREE.RepeatWrapping;

		let material = new THREE.ShaderMaterial({
			uniforms: {
				color1: {
					type: 'c',
					value: COLOR1
				},
				color2: {
					type: 'c',
					value: COLOR2
				},
				texturePosition: {
					type: 't',
					value: null
				},
				textureSprite: {
					type: 't',
					value: sprite
				}
			},
			vertexShader: glslify('./glsl/particles.vert'),
			fragmentShader: glslify('./glsl/particles.frag'),
			// blending: THREE.AdditiveBlending,
			// depthTest: false,
			transparent: true
		});



		super(geometry, material);

		this.castShadow = true;
		this.receiveShadow = true;
		this.particlesMaterial = material;


	}

	update(_texture) {

		this.particlesMaterial.uniforms.texturePosition.value = _texture;

		// this.customDistanceMaterial.uniforms.texturePosition.value = _texture;
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