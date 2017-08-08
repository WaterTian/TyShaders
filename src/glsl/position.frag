
precision highp float;


uniform vec2 resolution;
uniform sampler2D texturePosition;
uniform sampler2D textureDefaultPosition;
uniform float time;
uniform float speed;
uniform float dieSpeed;
uniform float radius;
uniform float curlSize;
uniform float attraction;
uniform float initAnimation;
uniform vec3 mouse3d;

#pragma glslify: curl = require(./helpers/curl4)

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 positionDefaultInfo = texture2D( textureDefaultPosition, uv );
    vec4 positionInfo = texture2D( texturePosition, uv );
    vec3 positionDefault = positionDefaultInfo.xyz;
    vec3 position = positionInfo.xyz;
    float life = positionInfo.w - dieSpeed;


    vec3 followPosition = mouse3d;


    if(life < 0.0) {
        position = positionDefault*0.3;
        position += followPosition;
        life = 0.5 + fract(positionInfo.w);
    } else {
        // vec3 delta = followPosition - position;
        // position += delta * (0.005 + life * 0.01) * attraction * (1.0 - smoothstep(50.0, 350.0, length(delta))) *speed;
        // position += curl(position * curlSize, time, 0.1 + (1.0 - life) * 0.1) *speed;
        position += curl(position * curlSize, time, 0.1) *speed;
    }


    gl_FragColor = vec4(position, life);

}
