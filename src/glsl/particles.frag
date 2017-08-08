uniform vec3 color1;
uniform vec3 color2;

varying vec3 vColor;
varying float vLife;
varying vec2 vUv;

void main() {
	vec3 outgoingLight = mix(color2,color1, smoothstep(0.0, 0.7, vLife));

	// outgoingLight *= shadowMask;//pow(shadowMask, vec3(0.75));



    gl_FragColor = vec4(outgoingLight, 1.0);
}