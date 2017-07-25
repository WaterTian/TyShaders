import * as THREE from 'three';

var glslify = require('glslify');

THREE.ScreenShader = {
	uniforms: {
		u_time: {
			type: 'f',
			value: 0.0
		},
		u_resolution: {
			value: new THREE.Vector2(window.innerWidth, window.innerHeight)
		},
		u_mouse: {
			value: new THREE.Vector2(0, 0)
		},
		u_texture: {
			value: null
		}
	},
	vertexShader: glslify('../glsl/water.vert'),
	fragmentShader: glslify('../glsl/effect.frag')
};