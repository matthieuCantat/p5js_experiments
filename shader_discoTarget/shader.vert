#version 300 es

in vec4 aPosition;
in vec4 aTexCoord;

// the varying variable will pass the texture coordinate to our fragment shader
out vec4 v_color;

void main() {
  // assign attribute to varying, so it can be used in the fragment
  v_color = aTexCoord;

  vec4 positionVec4 = aPosition;
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}