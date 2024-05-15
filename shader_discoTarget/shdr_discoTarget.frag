#version 300 es

#extension GL_OES_standard_derivatives : enable

precision mediump float;
uniform vec2 iResolution; // For each instance, same value
uniform float iTime;
uniform int iFrame;
uniform vec2 iMouse;
//


//uniform vec3 myColor;
out vec4 fragColor;
in vec4 v_color; // For each instance, different value
#define PI 3.14159265358979323846




//PUT THE ORIGINE AT THE CENTER OF THE SCREEN & NORMALIZE
vec2 map(vec2 pcoord) {
  return (pcoord-0.5*iResolution.xy)/iResolution.y;
}

float sfract(float x) {
  //WITHOUT ANTIALIASING
  //return fract(x);
  //WITH ANTIALIASING
  float px = fwidth(x);
  x -= round(x);
  return mix( x+1.0 , x , smoothstep(-px,px,x));
}

///////////////// FROM SHADERTOY
//void mainImage( out vec4 fragColor, in vec2 fragCoord ) ---> void main( ) fragColor, gl_FragCoord
// out gl_FragColor
// in fragColor


void main( )
{

    float t = iTime;
    vec2 uv = map(gl_FragCoord.xy);                         

    vec2 mouseN = iMouse.x <= 0.0 ? vec2(0): map(iMouse.xy);
    uv -= mouseN;
    fragColor.r = sfract(length( uv.xy*10. )*float(1.0*sin(t*0.1)));
    fragColor.g = sfract(length( uv.xy*10. )*float(1.0*sin(t*0.2)));
    fragColor.b = sfract(length( uv.xy*10. )*float(1.0*sin(t*0.3))) ; 
    fragColor.a = 1.0;

}









