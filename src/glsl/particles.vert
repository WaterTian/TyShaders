uniform sampler2D texturePosition;

varying vec3 vColor;

void main() {

	
    vec4 positionInfo = texture2D( texturePosition, position.xy );

    vec4 worldPosition = modelMatrix * vec4( positionInfo.xyz, 1.0 );
    vec4 mvPosition = viewMatrix * worldPosition;

    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = 2.0;

    vColor = positionInfo.xyz;

}