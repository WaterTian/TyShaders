#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_texture;



// Bitmap to ASCII (not really) fragment shader by movAX13h, September 2013
// --- This shader is now used in Pixi JS ---

// If you change the input channel texture, disable this:
#define HAS_GREENSCREEN

float character(float n, vec2 p) // some compilers have the word "char" reserved
{
    p = floor(p*vec2(4.0, -4.0) + 2.5);
    if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y)
    {
        if (int(mod(n/exp2(p.x + 5.0*p.y), 2.0)) == 1) return 1.0;
    }   
    return 0.0;
}


void main() {
    vec2 uv = gl_FragCoord.xy;
    vec3 col = texture2D(u_texture, floor(uv/8.0)*8.0/u_resolution.xy).rgb;    
    
    #ifdef HAS_GREENSCREEN
    float gray = (col.r + col.b)/2.0; // skip green component
    #else
    float gray = (col.r + col.g + col.b)/3.0;
    #endif
    
    float n =  65536.0;             // .
    if (gray > 0.2) n = 65600.0;    // :
    if (gray > 0.3) n = 332772.0;   // *
    if (gray > 0.4) n = 15255086.0; // o 
    if (gray > 0.5) n = 23385164.0; // &
    if (gray > 0.6) n = 15252014.0; // 8
    if (gray > 0.7) n = 13199452.0; // @
    if (gray > 0.8) n = 11512810.0; // #
    
    vec2 p = mod(uv/4.0, 2.0) - vec2(1.0);
    
    // col = gray*vec3(character(n, p));
    col = col*character(n, p);
    
    gl_FragColor = vec4(col, 1.0);
}

