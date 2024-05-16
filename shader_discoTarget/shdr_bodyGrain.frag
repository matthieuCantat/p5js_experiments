#version 300 es
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

//---------------------------------------------------------- color
//
// Demonstrates high-quality and proper gamma-corrected color gradient.
//
// Does interpolation in linear color space, mixing colors using smoothstep function.
// Also adds some gradient noise to reduce banding.
//
// References:
// http://blog.johnnovak.net/2016/09/21/what-every-coder-should-know-about-gamma/
// https://developer.nvidia.com/gpugems/GPUGems3/gpugems3_ch24.html
// http://loopit.dk/banding_in_games.pdf
//
// This shader is dedicated to public domain.
//

#define SRGB_TO_LINEAR(c) pow((c), vec3(2.2))
#define LINEAR_TO_SRGB(c) pow((c), vec3(1.0 / 2.2))
#define SRGB(r, g, b) SRGB_TO_LINEAR(vec3(float(r), float(g), float(b)) / 255.0)

const vec3 COLOR0 = SRGB(255, 0, 114);
const vec3 COLOR1 = SRGB(197, 255, 80);

// Gradient noise from Jorge Jimenez's presentation:
// http://www.iryoku.com/next-generation-post-processing-in-call-of-duty-advanced-warfare
float gradientNoise(in vec2 uv)
{
    const vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
    return fract(magic.z * fract(dot(uv, magic.xy)));
}
//----------------------------------------------------------------------------------------------



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


//---------------------------------------------------- noise

vec2 grad( ivec2 z )  // replace this anything that returns a random vector
{
    // 2D to 1D  (feel free to replace by some other)
    int n = z.x+z.y*11111;

    // Hugo Elias hash (feel free to replace by another one)
    n = (n<<13)^n;
    n = (n*(n*n*15731+789221)+1376312589)>>16;

#if 0

    // simple random vectors
    return vec2(cos(float(n)),sin(float(n)));
    
#else

    // Perlin style vectors
    n &= 7;
    vec2 gr = vec2(n&1,n>>1)*2.0-1.0;
    return ( n>=6 ) ? vec2(0.0,gr.x) : 
           ( n>=4 ) ? vec2(gr.x,0.0) :
                              gr;
#endif                              
}

float noise( in vec2 p )
{
    ivec2 i = ivec2(floor( p ));
     vec2 f =       fract( p );
	
	vec2 u = f*f*(3.0-2.0*f); // feel free to replace by a quintic smoothstep instead

    return mix( mix( dot( grad( i+ivec2(0,0) ), f-vec2(0.0,0.0) ), 
                     dot( grad( i+ivec2(1,0) ), f-vec2(1.0,0.0) ), u.x),
                mix( dot( grad( i+ivec2(0,1) ), f-vec2(0.0,1.0) ), 
                     dot( grad( i+ivec2(1,1) ), f-vec2(1.0,1.0) ), u.x), u.y);
}
//---------------------------------------------------- noise


//------------------------------------- vignetting
float Falloff = 0.8;
//-------------------------------------

//---------------------------------------------------- rectangle
// from https://iquilezles.org/articles/distfunctions
float roundedBoxSDF(vec2 CenterPosition, vec2 Size, float Radius) {
    return length(max(abs(CenterPosition)-Size+Radius,0.0))-Radius;
}

#define smooth_corner 0.1f
#define edgeSoftness 1.0f

//---------------------------------------------------- rectangle


//---------------------------------------------------- hatching
#define linesRows 6.0
#define line_thickness 1.81
#define rot_value 3.14/2.5
#define invert 0

vec2 rotateCoord(vec2 uv, float rads) {
    uv *= mat2(cos(rads), sin(rads), -sin(rads), cos(rads));
	return uv;
}
//---------------------------------------------------- hatching


void main()
{
	// SETUP
	vec2 uv = gl_FragCoord.xy * vec2(iResolution.x / iResolution.y, 1) / iResolution.xy;

    vec2 uv_move = v_color.xy;
    uv_move.y = 1.0 - uv_move.y;
    uv_move.x = uv_move.x*uvOffsetW+uvOffsetX+0.5;
    uv_move.y = uv_move.y*uvOffsetH+uvOffsetY+0.5;
    
	// Start
	vec4 color = vec4(0.,0.,0.,1.);

    //----------------------------------------------------- show behind
    color = texture(text, uv_move);
	//----------------------------------------------------- show behind

	//----------------------------------------------------- blur behind 
	float blur_value = 15.0;
	color = blur( text, uv_move, vec2(0.0001*blur_value) );
	//----------------------------------------------------- blur behind 
	
	//----------------------------------------------------- background
	float background_transparency = 0.91;


    vec2 a = 0.1 * iResolution.xy*2.0;// First gradient point.
    vec2 b = iResolution.xy*2.0;// Second gradient point.

    // Calculate interpolation factor with vector projection.
    vec2 ba = b - a;
    float t = dot(gl_FragCoord.xy - a, ba) / dot(ba, ba);
	//fragColor = vec4(t);

    // Saturate and apply smoothstep to the factor.
    t = smoothstep(0.0, 1.0, clamp(t, 0.0, 1.0));
    // Interpolate.
    vec3 b_color = mix(COLOR0, COLOR1, t);

    // Convert color from linear to sRGB color space (=gamma encode).
    b_color = LINEAR_TO_SRGB(b_color);

    // Add gradient noise to reduce banding.
    b_color += (1.0/255.0) * gradientNoise(gl_FragCoord.xy) - (0.5/255.0);
	//--------
	
	
	float background_noise_mask = clamp(noise( uv*50. )*10.5,0.5,1.8);
	vec4 background_color = vec4(b_color+vec3(background_noise_mask*0.05), 1.0);
	
	color *= background_transparency;
	color += background_color* (1.-background_transparency) ;	
	//----------------------------------------------------------------------------------------------background

	//---------------------------------------------------- vignetage
	vec2 _uv = gl_FragCoord.xy / iResolution.xy*0.5;
    vec2 coord = (_uv - 0.5) * (iResolution.x/iResolution.y);
    float rf = sqrt(dot(coord, coord)) * Falloff;
	rf = smoothstep(0.2,0.9,rf);
    float rf2_1 = rf * rf + 1.0;
    float e = 1.0 / (rf2_1 * rf2_1);
    
    vec4 src = vec4(1.0,1.0,1.0,1.0);
	vec4 vignetting = vec4(src.rgb * e, 1.0);

	//color *= vignetting;
	
	//------------------------------------------------------------------ vignetage

	//-------------------------------- rectangle border
    vec2 size = iResolution.xy*2.0*0.97;
    vec2 location = iResolution.xy*2./2.-size/2.0;
    float radius = (smooth_corner + 1.0f) * 30.0f; 
    float d 		= roundedBoxSDF(gl_FragCoord.xy - location - (size/2.0f), size / 2.0f, radius);
    float rect_border_mask =  smoothstep(0.0f, edgeSoftness * 2.0f,d);
	vec4 rect_border_color = background_color;//vec4(1.0f, 1.0f, 0.75f, 1.0f);
	color = mix( color , rect_border_color,rect_border_mask);
	//--------------------------------- rectangle border

	//---------------------------------------------------- hatching
    // update layout params
    float rows = linesRows * 0.5;//linesRows + 3. * sin(iTime);
    float curThickness =  0.22 * line_thickness;
  	float curRotation = 0.8 * rot_value;
    // get original coordinate, translate & rotate
	vec2 uv_rot = (2. * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
    //uv += curCenter;
    uv_rot = rotateCoord(uv_rot, curRotation);
    // create grid coords
    vec2 uvRepeat = fract(uv_rot * rows);		
    // adaptive antialiasing, draw, invert
    float aa = iResolution.y * 0.00003; 	
    float hatching_line_alpha = smoothstep(curThickness - aa, curThickness + aa, length(uvRepeat.y - 0.5));
    if(invert == 1) hatching_line_alpha = 1. - hatching_line_alpha;			
	
	color = mix( color , rect_border_color,hatching_line_alpha);
	
	//---------------------------------------------------- hatching


	//--------------------------------- rectangle border light
    a = 0.3 * iResolution.xy*2.0;// First gradient point.
    b = iResolution.xy*2.0;// Second gradient point.

    // Calculate interpolation factor with vector projection.
    ba = b - a;
    float light_mask = dot(gl_FragCoord.xy - a, ba) / dot(ba, ba);
	vec4 rect_border_light_color = rect_border_color * 2.3;
	color = mix( color , rect_border_light_color,rect_border_mask*light_mask);		
	vec4 rect_border_shadow_color = rect_border_color * 0.5;
	color = mix( color , rect_border_shadow_color,rect_border_mask*(1.0 - light_mask) );		
	//--------------------------------- rectangle border  light


    //fragColor = vec4(background_color+vec3(background_noise_mask*0.05), 1.0)*vignetting+smoothedAlpha*t-hatching_line_alpha;	
	fragColor = color;

}