
#extension GL_OES_standard_derivatives : enable

precision mediump float;
uniform vec2 iResolution; // For each instance, same value
uniform float iTime;
uniform int iFrame;
uniform vec2 iMouse;
//


//uniform vec3 myColor;

varying vec2 vTexCoord; // For each instance, different value
#define PI 3.14159265358979323846




//PUT THE ORIGINE AT THE CENTER OF THE SCREEN & NORMALIZE
vec2 map(vec2 pcoord) {
  return (pcoord-0.5*iResolution.xy)/iResolution.y;
}

float sfract(float x) {
  //WITHOUT ANTIALIASING
  return fract(x);
  //WITH ANTIALIASING
  //float px = fwidth(x);
  //x -= round(x);
  //return mix( x+1.0 , x , smoothstep(-px,px,x));
}

///////////////// FROM SHADERTOY
//void mainImage( out vec4 fragColor, in vec2 fragCoord ) ---> void main( ) gl_FragColor, gl_FragCoord
// out gl_FragColor
// in gl_FragCoord


void main( )
{

    float t = iTime;
    vec2 uv = map(gl_FragCoord.xy);                         

    vec2 mouseN = iMouse.x <= 0.0 ? vec2(0): map(iMouse.xy);
    uv -= mouseN;
    gl_FragColor.r = sfract(length( uv.xy*10. )*float(1.0*sin(t*0.1)));
    gl_FragColor.g = sfract(length( uv.xy*10. )*float(1.0*sin(t*0.2)));
    gl_FragColor.b = sfract(length( uv.xy*10. )*float(1.0*sin(t*0.3))) ; 
    gl_FragColor.a = 1.0;

}









