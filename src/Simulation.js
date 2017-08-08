// libs
import * as THREE from 'three';
var glslify = require('glslify');

var undef;


const TEXTURE_WIDTH = 512;
const TEXTURE_HEIGHT = 512;
const AMOUNT = TEXTURE_WIDTH * TEXTURE_HEIGHT;


class Simulation {

	constructor(_renderer, _scene, _camera) {


		this._followPoint = new THREE.Vector3();
		this._followPointTime = 0;

		this.renderer = _renderer;
		this.scene = new THREE.Scene();
		this.camera = new THREE.Camera();

		// this.scene = _scene;
		// this.camera = _camera;
		this.camera.position.z = 1;

		var rawShaderPrefix = 'precision ' + this.renderer.capabilities.precision + ' float;\n';
		console.log(rawShaderPrefix);

		this.copyShader = new THREE.ShaderMaterial({
			uniforms: {
				resolution: {
					type: 'v2',
					value: new THREE.Vector2(TEXTURE_WIDTH, TEXTURE_HEIGHT)
				},
				texture: {
					type: 't',
					value: undef
				}
			},
			vertexShader: glslify('./glsl/quad.vert'),
			fragmentShader: glslify('./glsl/through.frag')
		});
		this.positionShader = new THREE.ShaderMaterial({
			uniforms: {
				resolution: {
					type: 'v2',
					value: new THREE.Vector2(TEXTURE_WIDTH, TEXTURE_HEIGHT)
				},
				texturePosition: {
					type: 't',
					value: undef
				},
				textureDefaultPosition: {
					type: 't',
					value: undef
				},
				mouse3d: {
					type: 'v3',
					value: new THREE.Vector3
				},
				speed: {
					type: 'f',
					value: 1
				},
				dieSpeed: {
					type: 'f',
					value: 0
				},
				radius: {
					type: 'f',
					value: 0
				},
				curlSize: {
					type: 'f',
					value: 0
				},
				attraction: {
					type: 'f',
					value: 0
				},
				time: {
					type: 'f',
					value: 0
				},
				initAnimation: {
					type: 'f',
					value: 0
				}
			},
			vertexShader: glslify('./glsl/quad.vert'),
			fragmentShader: glslify('./glsl/position.frag'),
			blending: THREE.NoBlending,
			transparent: false,
			depthWrite: false,
			depthTest: false
		});


		this.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), this.positionShader);
		this.scene.add(this.mesh);



		this.positionRenderTarget = new THREE.WebGLRenderTarget(TEXTURE_WIDTH, TEXTURE_HEIGHT, {
			wrapS: THREE.RepeatWrapping,
			wrapT: THREE.RepeatWrapping,
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat,
			type: THREE.FloatType,
			depthWrite: false,
			depthBuffer: false,
			stencilBuffer: false
		});
		this.positionRenderTarget2 = this.positionRenderTarget.clone();
		this.copyTexture(this.createPositionTexture(), this.positionRenderTarget);

		console.log("1");

	}

	copyTexture(input, output) {
		this.mesh.material = this.copyShader;
		this.copyShader.uniforms.texture.value = input;
		this.renderer.render(this.scene, this.camera, output);
		console.log("copy");
	}

	createPositionTexture() {
		var positions = new Float32Array(AMOUNT * 4);
		var i4;
		var r, phi, theta;
		for (var i = 0; i < AMOUNT; i++) {
			i4 = i * 4;
			// r = (0.5 + Math.pow(Math.random(), 0.4) * 0.5) * 50;
			r = (0.5 + Math.random() * 0.5) * 50;
			phi = (Math.random() - 0.5) * Math.PI;
			theta = Math.random() * Math.PI * 2;
			positions[i4 + 0] = r * Math.cos(theta) * Math.cos(phi);
			positions[i4 + 1] = r * Math.sin(phi);
			positions[i4 + 2] = r * Math.sin(theta) * Math.cos(phi);
			positions[i4 + 3] = Math.random();
		}
		var texture = new THREE.DataTexture(positions, TEXTURE_WIDTH, TEXTURE_HEIGHT, THREE.RGBAFormat, THREE.FloatType);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.minFilter = THREE.NearestFilter;
		texture.magFilter = THREE.NearestFilter;
		texture.needsUpdate = true;
		texture.generateMipmaps = false;
		texture.flipY = false;


		this.textureDefaultPosition = texture;
		return texture;
	}


	updatePosition(dt) {

		// swap
		let tmp = this.positionRenderTarget;
		this.positionRenderTarget = this.positionRenderTarget2;
		this.positionRenderTarget2 = tmp;

		this.mesh.material = this.positionShader;
		this.positionShader.uniforms.textureDefaultPosition.value = this.textureDefaultPosition;
		this.positionShader.uniforms.texturePosition.value = this.positionRenderTarget2;
		this.positionShader.uniforms.time.value += dt * 0.001;

		this.renderer.render(this.scene, this.camera, this.positionRenderTarget, true);
		// this.renderer.render(this.scene, this.camera);
	}

	update(dt) {

		this.renderer.autoClearColor = false;

		var deltaRatio = dt / 16.6667;

		this.positionShader.uniforms.speed.value = deltaRatio;
		this.positionShader.uniforms.dieSpeed.value = 0.005 * deltaRatio;
		this.positionShader.uniforms.radius.value = 2;
		this.positionShader.uniforms.curlSize.value = 0.015;
		this.positionShader.uniforms.attraction.value = 1;
		this.positionShader.uniforms.initAnimation.value = 1;


		this._followPointTime += dt * 0.001;
		this._followPoint.set(
			Math.cos(this._followPointTime) * 200,
			Math.cos(this._followPointTime * 4.0) * 60,
			Math.sin(this._followPointTime * 2.0) * 200
		);
		this.positionShader.uniforms.mouse3d.value.lerp(this._followPoint, 0.2);



		this.updatePosition(dt);

		// this.renderer.setClearColor(clearColor, clearAlpha);
		// this.renderer.autoClearColor = true;

	}


}

export default Simulation;