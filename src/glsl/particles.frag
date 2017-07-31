uniform vec3 color;
varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor * color, 1.0);
}