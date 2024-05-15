precision mediump float;
uniform vec2 iResolution; // For each instance, same value
uniform float iTime;
uniform int iFrame;
uniform vec2 iMouse;



varying vec2 vTexCoord;
uniform sampler2D texture;
uniform float uvOffsetX;
uniform float uvOffsetY;
uniform float uvOffsetW;
uniform float uvOffsetH;

//void mainImage( out vec4 fragColor, in vec2 fragCoord ) ---> void main( ) gl_FragColor, gl_FragCoord
void main()
{
    vec2 uv = vTexCoord.xy;
    uv.y = 1.0 - uv.y;

    uv.x = uv.x*uvOffsetW+uvOffsetX+0.5;
    uv.y = uv.y*uvOffsetH+uvOffsetY+0.5;

    gl_FragColor.x = uv.x;

    vec4 col = texture2D(texture, uv);
	gl_FragColor.x = col.x;
}