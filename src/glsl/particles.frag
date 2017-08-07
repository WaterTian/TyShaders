
varying vec3 vColor;
varying float vLife;

void main() {
	vec3 outgoingLight = mix(vec3(1.0),vec3(1.0), smoothstep(0.0, 0.7, vLife));

	// outgoingLight *= shadowMask;//pow(shadowMask, vec3(0.75));


    gl_FragColor = vec4(outgoingLight, 1.0);
}