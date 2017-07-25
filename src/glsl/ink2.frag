#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_texture;

void main()
{
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec3 col;
    mat3 sobelX = mat3(-1.0, -2.0, -1.0,
                       0.0,  0.0, 0.0,
                       1.0,  2.0,  1.0);
    mat3 sobelY = mat3(-1.0,  0.0,  1.0,
                       -2.0,  0.0, 2.0,
                       -1.0,  0.0,  1.0);  
    
    float sumX = 0.0;   // x-axis change
    float sumY = 0.0;   // y-axis change
    
    for(int i = -1; i <= 1; i++)
    {
        for(int j = -1; j <= 1; j++)
        {
            // texture coordinates should be between 0.0 and 1.0
            float x = (gl_FragCoord.x + float(i))/u_resolution.x;   
            float y =  (gl_FragCoord.y + float(j))/u_resolution.y;
            
            // Convolve kernels with image
            sumX += length(texture2D( u_texture, vec2(x, y) ).xyz) * float(sobelX[1+i][1+j]);
            sumY += length(texture2D( u_texture, vec2(x, y) ).xyz) * float(sobelY[1+i][1+j]);
        }
    }
    float g = abs(sumX) + abs(sumY);
    if(g > u_mouse.y/u_resolution.y)
        col = vec3(1.0,1.0,1.0);
    else
        col = col * 0.0;
    gl_FragColor.xyz = col;
}
