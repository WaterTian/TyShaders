uniform vec3 color1;
uniform vec3 color2;

uniform sampler2D textureSprite;

uniform sampler2D depthTexture;

uniform vec3 lightPosition;


varying float vLife;
varying vec3 vPosition;

void main() {

	vec3 outgoingLight = mix(color2,color1, smoothstep(0.0, 0.7, vLife));
	// outgoingLight *= shadowMask;//pow(shadowMask, vec3(0.75));

 //    vec3 fdx = dFdx( vPosition );
 //    vec3 fdy = dFdy( vPosition );
 //    vec3 n = normalize(cross(fdx, fdy));
	// vec3 L = normalize( vLightPosition - vPosition );
 //    float diffuse = max( 0., dot( L, n ) );
 //    vec3 color3 = outgoingLight * mix( vec3( diffuse ), vec3( 1. ), .2 );
	// vec4 color = vec4(color3, 1.0);

    vec4 color = vec4(outgoingLight, 1.0);
	color *= texture2D( textureSprite, gl_PointCoord );

    gl_FragColor = color;
}