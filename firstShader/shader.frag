precision mediump float;

//uniform vec3 myColor;

varying vec2 vTexCoord; // For each instance, different value
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution; // For each instance, same value
uniform float u_time;
uniform vec2 u_mouse;

void main() {
  //vec2 uv = vTexCoord;
  //vec4 myColor = vec4(myColor, 1.0);
  vec4 myColor = vec4(abs(cos(u_time/1.0))*vTexCoord.x,
  0.0, 
  abs(cos(u_time/2.0+0.5))*vTexCoord.y, 
  1.0);
  gl_FragColor = myColor;
}