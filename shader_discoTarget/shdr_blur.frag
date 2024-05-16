#version 300 es // new version of openGl (for devices)


precision mediump float;
uniform vec2 iResolution; // For each instance, same value
uniform float iTime;
uniform int iFrame;
uniform vec2 iMouse;


out vec4 fragColor;
in  vec4 v_color;
uniform sampler2D text;
uniform float uvOffsetX;
uniform float uvOffsetY;
uniform float uvOffsetW;
uniform float uvOffsetH;


//------------------------------------------------- blur
// 16x acceleration of https://www.shadertoy.com/view/4tSyzy
// by applying gaussian at intermediate MIPmap level.

const int samples = 35,
          LOD = 2,         // gaussian done on MIPmap at scale LOD
          sLOD = 1 << LOD; // tile size = 2^LOD
const float sigma = float(samples) * .25;

float gaussian(vec2 i) {
    return exp( -.5* dot(i/=sigma,i) ) / ( 6.28 * sigma*sigma );
}

vec4 blur(sampler2D sp, vec2 U, vec2 scale) {
    vec4 O = vec4(0);  
    int s = samples/sLOD;
    
    for ( int i = 0; i < s*s; i++ ) {
        vec2 d = vec2(i%s, i/s)*float(sLOD) - float(samples)/2.;
        O += gaussian(d) * textureLod( sp, U + scale * d , float(LOD) );
    }
    
    return O / O.a;
}
//----------------------------------------------
#define GOLDEN_ANGLE 2.3999632

#define ITERATIONS 150

const mat2 rot = mat2(cos(GOLDEN_ANGLE), sin(GOLDEN_ANGLE), -sin(GOLDEN_ANGLE), cos(GOLDEN_ANGLE));
vec3 Bokeh(sampler2D tex, vec2 uv, float radius)
{
	vec3 acc = vec3(0), div = acc;
    float r = 1.;
    vec2 vangle = vec2(0.0,radius*.01 / sqrt(float(ITERATIONS)));
    
	for (int j = 0; j < ITERATIONS; j++)
    {  
        // the approx increase in the scale of sqrt(0, 1, 2, 3...)
        r += 1. / r;
	    vangle = rot * vangle;
        vec3 col = texture(tex, uv + (r-1.) * vangle).xyz; /// ... Sample the image
        col = col * col *1.8; // ... Contrast it for better highlights - leave this out elsewhere.
		vec3 bokeh = pow(col, vec3(4));
		acc += col * bokeh;
		div += bokeh;
	}
	return acc / div;
}
//---------------------------------------------------------------------------------

//void mainImage( out vec4 fragColor, in vec2 fragCoord ) ---> void main( ) gl_FragColor, gl_FragCoord
void main()
{
    
    vec2 uv = v_color.xy;
    uv.y = 1.0 - uv.y;
    
    uv.x = uv.x*uvOffsetW+uvOffsetX+0.5;
    uv.y = uv.y*uvOffsetH+uvOffsetY+0.5;
    
    //vec4 col = texture(text, uv);
    float blur_value = 15.0;
    float bokeh_value = 0.1;
   
    //vec4 col = textureLod(text, uv);
    vec4 col = blur( text, uv, vec2(0.0001*blur_value) );
	//vec4 col = vec4(Bokeh(text, uv, bokeh_value),1.0);
    
    fragColor.x  = col.x;
    fragColor.y  = col.y;
    fragColor.z  = col.z;
    
    
}