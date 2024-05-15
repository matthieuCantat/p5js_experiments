#version 300 es
precision mediump float;
uniform vec2 iResolution; // For each instance, same value
uniform float iTime;
uniform int iFrame;
uniform vec2 iMouse;

out vec4 fragColor;
// by Nikos Papadopoulos, 4rknova / 2013
// WTFPL

#define S 5. // Scale
//void mainImage( out vec4 fragColor, in vec2 fragCoord ) ---> void main( ) gl_FragColor, gl_FragCoord
void main()
{
	vec2 uv = floor(S * gl_FragCoord.xy * vec2(iResolution.x / iResolution.y, 1) / iResolution.xy);
	fragColor = vec4(vec3(mod(uv.x + uv.y, 2.)), 1);
}