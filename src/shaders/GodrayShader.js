import * as THREE from 'three';


THREE.GodrayShader = {
	uniforms: {
		u_resolution: {
			value: new THREE.Vector2(window.innerWidth, window.innerHeight)
		},
		u_texture: {
			value: null
		}
	},
	vertexShader: [
		"void main() {",
			"gl_Position = vec4( position, 1.0 );",
		"}"
	].join( "\n" ),

	fragmentShader: [
	"precision highp float;",
	"uniform vec2 u_resolution;",
	"uniform sampler2D u_texture;",
	"const float SAMPLES = 100.;",
	"void main(){",
	"    vec2 uv = gl_FragCoord.xy / u_resolution.xy;",
	"    float weight = 0.008;",                     
	"    float decay = 0.95;", 
	"    float density = 0.9;",
	"    float exposure = 4.1; ",

	"    vec2 ouv = uv;",
	"    vec2 tuv = uv-0.5;",
	"    vec2 duv = tuv/SAMPLES*density;",
	"    vec4 initColor = texture2D(u_texture, uv)*0.25;",
	"    ouv+=duv*fract(sin(dot(ouv, vec2(12.9898, 78.233)))*43758.5453);",
	"    for(float i=0.;i<SAMPLES;i++){",
	"        ouv -= duv;",
	"        initColor += texture2D(u_texture, ouv)*weight;",
	"        weight *= decay;",
	"    }",
	"    initColor *= exposure;",
	"    initColor *= (1. - dot(tuv, tuv)*.975);",

	"    float ChromaticAberration = 10.0;",
	"    vec2 texel = 1.0 / u_resolution.xy;",
	"    vec2 coords = (uv - 0.5) * 2.0;",
	"    float coordDot = dot (coords, coords);",
	"    vec2 precompute = ChromaticAberration * coordDot * coords;",
	"    vec2 uvR = uv - texel.xy * precompute;",
	"    vec2 uvB = uv + texel.xy * precompute;",
	"    vec4 rgbColor;",
	"    rgbColor.r = texture2D(u_texture, uvR).r;",
	"    rgbColor.g = texture2D(u_texture, uv).g;",
	"    rgbColor.b = texture2D(u_texture, uvB).b;",
	"    vec3 endColor = vec3(initColor+rgbColor)*0.5;",

	"    gl_FragColor = vec4(endColor,1.0);",
	"}"
	].join( "\n" )
};






