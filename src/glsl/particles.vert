uniform sampler2D texturePosition;


varying float vLife;

void main() {

    vec4 positionInfo = texture2D( texturePosition, position.xy );

    vec4 worldPosition = modelMatrix * vec4( positionInfo.xyz, 1.0 );
    vec4 mvPosition = viewMatrix * worldPosition;

    vLife = positionInfo.w;

    // gl_PointSize = 2000.0 / length( mvPosition.xyz ) * smoothstep(0.0, 0.3, positionInfo.w);
    gl_PointSize = 2000.0 / length( mvPosition.xyz ) * smoothstep(0.0, 0.1, positionInfo.w);

    gl_Position = projectionMatrix * mvPosition;
    
}