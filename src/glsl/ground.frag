

uniform vec3 u_color;
uniform sampler2D u_texture;

varying vec2 vUv;

void main( void ) {

	vec3 color = texture2D( u_texture, vUv ).rgb * u_color;

	gl_FragColor = vec4( color, 1.0 );

}