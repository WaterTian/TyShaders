uniform vec3 color1;
uniform vec3 color2;

uniform sampler2D textureSprite;

varying float vLife;

void main() {

	vec3 outgoingLight = mix(color2,color1, smoothstep(0.0, 0.7, vLife));
	// outgoingLight *= shadowMask;//pow(shadowMask, vec3(0.75));

    vec4 color = vec4(outgoingLight, 1.0);
	color *= texture2D( textureSprite, gl_PointCoord );

    gl_FragColor = color;
}