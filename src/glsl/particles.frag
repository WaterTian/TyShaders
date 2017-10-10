uniform vec3 color1;
uniform vec3 color2;

uniform sampler2D textureSpriteArr[13];

varying float vLife;
varying float vNum;

void main() {

	vec3 outgoingLight = mix(color2,color1, smoothstep(0.0, 0.7, vLife));
	// outgoingLight *= shadowMask;//pow(shadowMask, vec3(0.75));

    // vec4 color = vec4(outgoingLight, 1.0) * 4.;
	// color *= texture2D( textureSpriteArr[0], gl_PointCoord );

	vec4 color = vec4(vec3(1.0),1.0);
	if(vNum > 0.0)color = texture2D( textureSpriteArr[0], gl_PointCoord );
	if(vNum > 0.01)color = texture2D( textureSpriteArr[1], gl_PointCoord );
	if(vNum > 0.02)color = texture2D( textureSpriteArr[2], gl_PointCoord );
	if(vNum > 0.03)color = texture2D( textureSpriteArr[3], gl_PointCoord );
	if(vNum > 0.04)color = texture2D( textureSpriteArr[4], gl_PointCoord );
	if(vNum > 0.05)color = texture2D( textureSpriteArr[5], gl_PointCoord );
	if(vNum > 0.06)color = texture2D( textureSpriteArr[6], gl_PointCoord );
	if(vNum > 0.07)color = texture2D( textureSpriteArr[7], gl_PointCoord );
	if(vNum > 0.08)color = texture2D( textureSpriteArr[8], gl_PointCoord );
	if(vNum > 0.09)color = texture2D( textureSpriteArr[9], gl_PointCoord );
	if(vNum > 0.10)color = texture2D( textureSpriteArr[10], gl_PointCoord );
	if(vNum > 0.11)color = texture2D( textureSpriteArr[11], gl_PointCoord );
	if(vNum > 0.12)color = texture2D( textureSpriteArr[12], gl_PointCoord );



    gl_FragColor = color;
}