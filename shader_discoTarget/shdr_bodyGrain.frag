#version 300 es
precision mediump float;
uniform vec2 iResolution; // For each instance, same value
uniform float iTime;
uniform int iFrame;
uniform vec2 iMouse;

out vec4 fragColor;


//---------------------------------------------------------------------------------------------- color
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
#define linesRows 10.0
#define line_thickness 2.01
#define rot_value 3.14/4.
#define invert 0

vec2 rotateCoord(vec2 uv, float rads) {
    uv *= mat2(cos(rads), sin(rads), -sin(rads), cos(rads));
	return uv;
}
//---------------------------------------------------- hatching


void main()
{
	//---------------------------------------------------------------------------------------------- background
    vec2 a = 0.1 * iResolution.xy*2.0;// First gradient point.
    vec2 b = iResolution.xy*2.0;// Second gradient point.

    // Calculate interpolation factor with vector projection.
    vec2 ba = b - a;
    float t = dot(gl_FragCoord.xy - a, ba) / dot(ba, ba);
	//fragColor = vec4(t);

    // Saturate and apply smoothstep to the factor.
    t = smoothstep(0.0, 1.0, clamp(t, 0.0, 1.0));
    // Interpolate.
    vec3 background_color = mix(COLOR0, COLOR1, t);

    // Convert color from linear to sRGB color space (=gamma encode).
    background_color = LINEAR_TO_SRGB(background_color);

    // Add gradient noise to reduce banding.
    background_color += (1.0/255.0) * gradientNoise(gl_FragCoord.xy) - (0.5/255.0);
	//--------
	vec2 uv = gl_FragCoord.xy * vec2(iResolution.x / iResolution.y, 1) / iResolution.xy;
	float background_noise_mask = clamp(noise( uv*50. )*10.5,0.5,1.8);
	//----------------------------------------------------------------------------------------------background

	//------------------------------------------------------------------ vignetage
	vec2 _uv = gl_FragCoord.xy / iResolution.xy*0.5;
    vec2 coord = (_uv - 0.5) * (iResolution.x/iResolution.y);
    float rf = sqrt(dot(coord, coord)) * Falloff;
	rf = smoothstep(0.2,0.9,rf);
    float rf2_1 = rf * rf + 1.0;
    float e = 1.0 / (rf2_1 * rf2_1);
    
    vec4 src = vec4(1.0,1.0,1.0,1.0);
	vec4 vignetting = vec4(src.rgb * e, 1.0);
	//------------------------------------------------------------------ vignetage

	//------------------------------------------------------------------ rectangle border
    vec2 size = iResolution.xy*2.0*0.97;
    vec2 location = iResolution.xy*2./2.-size/2.0;
    float radius = (smooth_corner + 1.0f) * 30.0f; 
    float d 		= roundedBoxSDF(gl_FragCoord.xy - location - (size/2.0f), size / 2.0f, radius);
    float smoothedAlpha =  smoothstep(0.0f, edgeSoftness * 2.0f,d);

    a = 0.3 * iResolution.xy*2.0;// First gradient point.
    b = iResolution.xy*2.0;// Second gradient point.

    // Calculate interpolation factor with vector projection.
    ba = b - a;
    t = dot(gl_FragCoord.xy - a, ba) / dot(ba, ba);
		
	//------------------------------------------------------------------ rectangle border

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
	
	//---------------------------------------------------- hatching


    fragColor = vec4(background_color+vec3(background_noise_mask*0.05), 1.0)*vignetting+smoothedAlpha*t-hatching_line_alpha;	


}