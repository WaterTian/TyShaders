// libs
import * as THREE from 'three';
var glslify = require('glslify');


const TEXTURE_WIDTH = 512;
const TEXTURE_HEIGHT = 512;
const AMOUNT = TEXTURE_WIDTH * TEXTURE_HEIGHT;


var shadowBuffer, shadowBufferSize , shadowDebug

class Shadow {

	constructor(_renderer,_scene,_mesh) {

		this.renderer = _renderer;
		this.scene = _scene;
		// this.scene = new THREE.Scene();
		this.mesh=_mesh;

		var s = 150;
		this.camera = new THREE.OrthographicCamera(-s, s, s, -s, .1, 400);
		this.camera.position.set(10, 4, -200);
		this.camera.lookAt(this.scene.position);
		var b = new THREE.CameraHelper(this.camera);
		this.scene.add(b);


		shadowBufferSize = 2048;
		shadowBuffer = new THREE.WebGLRenderTarget(shadowBufferSize, shadowBufferSize, {
			wrapS: THREE.ClampToEdgeWrapping,
			wrapT: THREE.ClampToEdgeWrapping,
			minFilter: THREE.LinearMipMapLinear,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat
		});

		this.shadowMaterial = new THREE.RawShaderMaterial({
			uniforms: {
				texturePosition: {
					type: 't',
					value: null
				}
			},
			vertexShader: glslify('./glsl/particles.vert'),
			fragmentShader: glslify('./glsl/particlesShadow.frag'),
			side: THREE.DoubleSide
		});


		shadowDebug = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshBasicMaterial({
			map: shadowBuffer,
			side: THREE.DoubleSide
		}));
		shadowDebug.position.set(0, 0, 200);
		this.scene.add( shadowDebug ); 

	}


	update(_texture) {
		
		// this.shadowMaterial.uniforms.texturePosition.value = _texture;


		// this.renderer.autoClearColor = false;
		this.renderer.setClearColor(0);
		this.mesh.material = this.shadowMaterial;


		this.renderer.render(this.scene, this.camera, shadowBuffer);
		this.renderer.render(this.scene, this.camera);

		// this.renderer.autoClearColor = true;


	}


}

export default Shadow;