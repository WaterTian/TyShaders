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



		var spriteNumData = new Uint8Array(SIZE * SIZE * 4);

		for (var j = 0; j < SIZE * SIZE * 4; j+=4) {
			spriteNumData[j] = Math.random() * 0.13 * 255;
		}

		var spriteNumTexture = new THREE.DataTexture(spriteNumData, SIZE, SIZE, THREE.RGBAFormat);
		spriteNumTexture.minFilter = THREE.NearestFilter;
		spriteNumTexture.magFilter = THREE.NearestFilter;
		spriteNumTexture.needsUpdate = true;


		var spriteArr = [];
		for (var i = 0; i < 13; i++) {
			var j = i + 1;
			spriteArr[i] = new THREE.TextureLoader().load('../assets/sprites/p' + j + '.png');
			spriteArr[i].wrapS = THREE.RepeatWrapping;
			spriteArr[i].wrapT = THREE.RepeatWrapping;
		}


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
				textureSpriteNum: {
					type: 't',
					value: spriteNumTexture
				},
				textureSpriteArr: {
					type: 't',
					value: spriteArr
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