// bigTriangle.vert

#define SHADER_NAME BIG_TRIANGLE_VERTEX

precision mediump float;
varying vec2 vTextureCoord;

void main(void) {
    gl_Position = vec4(position, 0.0, 1.0);
    vTextureCoord = position * .5 + .5;
}