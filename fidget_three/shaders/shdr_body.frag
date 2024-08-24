#version 300 es
precision mediump float;



uniform vec2 iResolution; // For each instance, same value
uniform float iTime;
uniform int iFrame;
uniform vec2 iMouse;

out vec4 fragColor;
in  vec4 v_color;
uniform sampler2D text;
uniform sampler2D text_glow;
uniform vec2 uvOffset;
uniform vec2 objCanvasRatio;
uniform vec2 uvRotatePivot;
uniform float uvOffsetRotate;


uniform float blur_background;
uniform int blur_background_samples;// = 35;
uniform int blur_background_samples_LOD;// = 2;    
uniform float glow_background_size;
uniform float glow_background;
uniform float background_transparency;
uniform float background_type;
uniform float background_animation;
uniform float background_animation_offset;
uniform float background_grain;
uniform float background_grain_scale;
uniform float background_grid;
uniform float background_grid_scale;
uniform float background_grid_line_scale;
uniform float background_grid_point_scale;
uniform vec3 background_colorA;
uniform vec3 background_colorB;
uniform vec3 background_colorC;
uniform vec3 background_colorD;
uniform float background_typeA;
uniform float background_typeB;
uniform float background_typeC;
uniform float background_typeD;
uniform float background_type_discoTarget;

uniform float boder_size;
uniform float glow_power;
uniform int glow_remove_white_original;

uniform float hatching_line;
uniform float light_beam;

uniform int debug;

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


// Gradient noise from Jorge Jimenez's presentation:
// http://www.iryoku.com/next-generation-post-processing-in-call-of-duty-advanced-warfare
float gradientNoise(in vec2 uv)
{
    const vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
    return fract(magic.z * fract(dot(uv, magic.xy)));
}
//----------------------------------------------------------------------------------------------

//--------------------------------------- moving_background
#define S(a,b,t) smoothstep(a,b,t)

mat2 mb_Rot(float a)
{
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

vec2 mb_Rot2(vec2 point, float angle, vec2 pivot)
{
    vec2 delta = point - pivot;
    delta *= mb_Rot(angle);
    return delta + pivot;
}


// Created by inigo quilez - iq/2014
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
vec2 mb_hash( vec2 p )
{
    p = vec2( dot(p,vec2(2127.1,81.17)), dot(p,vec2(1269.5,283.37)) );
	return fract(sin(p)*43758.5453);
}

float mb_noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
	
	vec2 u = f*f*(3.0-2.0*f);

    float n = mix( mix( dot( -1.0+2.0*mb_hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                        dot( -1.0+2.0*mb_hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                   mix( dot( -1.0+2.0*mb_hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                        dot( -1.0+2.0*mb_hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
	return 0.5 + 0.5*n;
}
//--------------------------------------- moving_background

//--------------------------------------- palettes_background
vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}
//--------------------------------------- palettes_background

//------------------------------------------------- blur
// 16x acceleration of https://www.shadertoy.com/view/4tSyzy
// by applying gaussian at intermediate MIPmap level.

     // gaussian done on MIPmap at scale LOD


float gaussian(vec2 i) {
    float sigma = float(blur_background_samples) * .25;
    return exp( -.5* dot(i/=sigma,i) ) / ( 6.28 * sigma*sigma );
}

vec4 blur(sampler2D sp, vec2 U, vec2 scale) {
    int sLOD = 1 << blur_background_samples_LOD;
    vec4 O = vec4(0);  
    int s = blur_background_samples/sLOD;
    
    for ( int i = 0; i < s*s; i++ ) {
        vec2 d = vec2(i%s, i/s)*float(sLOD) - float(blur_background_samples)/2.;
        O += gaussian(d) * textureLod( sp, U + scale * d , float(blur_background_samples_LOD) );
    }
    
    return O / O.a;
}
//----------------------------------------------


vec4 glow(sampler2D sp, vec2 U, float glowSize, float glowIntensity)
{

    vec4 sum = vec4(0);
    vec2 texcoord = U;

    // blur in y (vertical)
    // take nine samples, with the distance glowSize between them
    sum += texture(sp, vec2(texcoord.x - 4.0*glowSize, texcoord.y)) * 0.05;
    sum += texture(sp, vec2(texcoord.x - 3.0*glowSize, texcoord.y)) * 0.09;
    sum += texture(sp, vec2(texcoord.x - 2.0*glowSize, texcoord.y)) * 0.12;
    sum += texture(sp, vec2(texcoord.x - glowSize, texcoord.y)) * 0.15;
    sum += texture(sp, vec2(texcoord.x, texcoord.y)) * 0.16;
    sum += texture(sp, vec2(texcoord.x + glowSize, texcoord.y)) * 0.15;
    sum += texture(sp, vec2(texcoord.x + 2.0*glowSize, texcoord.y)) * 0.12;
    sum += texture(sp, vec2(texcoord.x + 3.0*glowSize, texcoord.y)) * 0.09;
    sum += texture(sp, vec2(texcoord.x + 4.0*glowSize, texcoord.y)) * 0.05;

    // blur in y (vertical)
    // take nine samples, with the distance glowSize between them
    sum += texture(sp, vec2(texcoord.x, texcoord.y - 4.0*glowSize)) * 0.05;
    sum += texture(sp, vec2(texcoord.x, texcoord.y - 3.0*glowSize)) * 0.09;
    sum += texture(sp, vec2(texcoord.x, texcoord.y - 2.0*glowSize)) * 0.12;
    sum += texture(sp, vec2(texcoord.x, texcoord.y - glowSize)) * 0.15;
    sum += texture(sp, vec2(texcoord.x, texcoord.y)) * 0.16;
    sum += texture(sp, vec2(texcoord.x, texcoord.y + glowSize)) * 0.15;
    sum += texture(sp, vec2(texcoord.x, texcoord.y + 2.0*glowSize)) * 0.12;
    sum += texture(sp, vec2(texcoord.x, texcoord.y + 3.0*glowSize)) * 0.09;
    sum += texture(sp, vec2(texcoord.x, texcoord.y + 4.0*glowSize)) * 0.05;
  
    return sum*glowIntensity + texture(sp, texcoord); 
}



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


//---------------------------------------------------- beam light

// https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
float lineDistance(in vec2 M, vec2 P1, vec2 P2) {
    float x1 = P1.x, y1 = P1.y;
    float x2 = P2.x, y2 = P2.y;
    float x0 = M.x, y0 = M.y;
    float numer = abs((y2-y1)*x0 - (x2-x1)*y0 + x2*y1 - y2*x1);
    float denom = length(P2 - P1);
    return numer / denom;
}

float beam_mask(vec2 uv, vec2 p , vec2 p_target, float size, float falloff, float max_dist,bool inverse )
{
    vec2 vPixel = uv-p;
    vec2 vDelta = p_target - p;
    float pixel_dist = length(vPixel);
    float delta_dist = length(vDelta);
    
    float beam_base = clamp(0.,1.,(1. - lineDistance(uv, p, p_target)));

    float d = beam_base;
    size *= pixel_dist*(max_dist-delta_dist);
    falloff *= pixel_dist*delta_dist;
    float size_inv = 1.-size;
    d = pow( smoothstep(size_inv-falloff,size_inv, d),20.);
    
    float pixel_dist_mask = (max_dist - pixel_dist)/max_dist;    
    d *= pixel_dist_mask;
    
    float one_side_mask = clamp(dot(vDelta,vPixel),0.,1.); 
    if(inverse)
    {
        one_side_mask = clamp(dot(vDelta,vPixel)*-1.,0.,1.); 
    } 
    d *= one_side_mask;

    float face_projector = clamp((0.05 - pixel_dist)/0.05,0.,1.); 
    d += face_projector*clamp((1.6-delta_dist)/1.6,0.,1.);//smoothstep(0.1,0.9,face_projector);

    return clamp(d,0.,1.);
}

vec4 draw_point(vec2 uv, vec2 p, float size,vec4 color)
{
    vec2 vPixel = uv-p;
    float pixel_dist = length(vPixel);
    
    float pixel_dist_mask = (size - pixel_dist)/size;
    pixel_dist_mask = smoothstep(0.5,0.5,pixel_dist_mask);
    return pixel_dist_mask*color;
}
   

//---------------------------------------------------- beam light



//---------------------------------------------------- disco target
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
//---------------------------------------------------- disco target



mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////



void main()
{
	// SETUP
    vec2 fragCoord_fixRez      =  gl_FragCoord.xy/2.;
	vec2 uv = fragCoord_fixRez.xy * vec2(iResolution.x / iResolution.y, 1) / iResolution.xy;

    vec2 uv_move = v_color.xy;
    

    uv_move.y = 1.0 - uv_move.y; // inverse y

    // scale
    uv_move -= uvRotatePivot; // from the pivot point of the rectang ( here the middle) 
    // scale down the canvas, to make the picture bigger 
    uv_move = uv_move*objCanvasRatio; 

    uv_move += uvRotatePivot ;

    // rotation
    float rot = uvOffsetRotate * -1.;
    // move space from the center to the vec2(0.0)
    uv_move -= uvRotatePivot;
    // rotate the space
    uv_move = rotate2d(rot)*uv_move;
    // move it back to the original place
    uv_move += uvRotatePivot ;
    

    // translate
    uv_move += uvOffset;




	// Start
	vec4 color = vec4(0.,0.,0.,1.);
    
    
    

    if( 0. < background_transparency )
    {
        color = texture(text, uv_move);
        
        float blur_value = blur_background*15.0;
        if(0.<blur_background)
        {
            color = blur( text, uv_move, vec2(0.0001*blur_value) );
        }
        
        float glowSize = 3.0/512.0*glow_background_size;
        float glowIntensity = 2.95*glow_background;
        if(0.<glow_background)
        {
            color = glow(text, uv_move, glowSize, glowIntensity);
            color = vec4(vec3(smoothstep(0.1,0.4,glow_background)*255.),1.);
        }
        
    }



    
    vec4 background_color = vec4(0.,0.,0.,0.);

    if( 0.0 < background_typeA)
    {
        background_color = vec4(background_colorA/255.*background_typeA,0.);
    }

    
    
	if(0.0 < background_typeB)// 1 gradian radial
    {
        vec3 COLOR0 = SRGB(background_colorA.x, background_colorA.y, background_colorA.z);//SRGB(255, 0, 114);
        vec3 COLOR1 = SRGB(background_colorB.x, background_colorB.y, background_colorB.z);//SRGB(197, 255, 80);

        vec2 a = 0.1 * iResolution.xy*2.0;// First gradient point.
        vec2 b = iResolution.xy*2.0;// Second gradient point.

        float rot_angle = iTime*background_animation+background_animation_offset;
        vec2 piv = vec2(0.5 * iResolution.x*2.0,0.5 * iResolution.x*2.0);
        a = mb_Rot2(a,rot_angle, piv);
        b = mb_Rot2(b,rot_angle, piv);

        // Calculate interpolation factor with vector projection.
        vec2 ba = b - a;

        
        float t = dot(fragCoord_fixRez.xy - a, ba) / dot(ba, ba);
        //fragColor = vec4(t);

        // Saturate and apply smoothstep to the factor.
        t = smoothstep(0.0, 1.0, clamp(t, 0.0, 1.0));
        // Interpolate.        
        vec3 b_color = mix(COLOR0, COLOR1, t);

        // Convert color from linear to sRGB color space (=gamma encode).
        b_color = LINEAR_TO_SRGB(b_color);

        // Add gradient noise to reduce banding.
        b_color += (1.0/255.0) * gradientNoise(fragCoord_fixRez.xy) - (0.5/255.0);
        //--------
 
  
        background_color += vec4( b_color*background_typeB,0.0);
    }
    

    
    if( 0.0< background_typeC )// multi gradian
    {
        vec3 colorA = background_colorB/255.;//vec3(.957, .804, .623);
        vec3 colorB = background_colorC/255.;//vec3(.192, .384, .933);
        vec3 colorC = background_colorA/255.;//vec3(.910, .510, .8);
        vec3 colorD = background_colorD/255.;//vec3(0.350, .71, .953);

        vec2 mb_uv = uv*0.5;//fragCoord_fixRez.xy/iResolution.xy;
        float ratio = iResolution.x / iResolution.y;

        vec2 tuv = mb_uv;
        tuv -= .5;

        // rotate with Noise
        float degree = noise(vec2(iTime*.5*background_animation+background_animation_offset, tuv.x*tuv.y));

        tuv.y *= 1./ratio;
        tuv *= mb_Rot(radians((degree-.5)*720.+180.));
        tuv.y *= ratio;

        
        // Wave warp with sin
        float frequency = 5.;
        float amplitude = 30.;
        float speed = iTime * 2.;
        tuv.x += sin(tuv.y*frequency+speed)/amplitude;
        tuv.y += sin(tuv.x*frequency*1.5+speed)/(amplitude*.5);
        
        
        // draw the image
        float env_tmp = S(-.3, .2, (tuv*mb_Rot(radians(-5.))).x);
        vec3 layer1 = mix(colorA, colorB, env_tmp);
        vec3 layer2 = mix(colorC, colorD, env_tmp);
        
        vec3 finalComp = mix(layer1, layer2, S(.5, -.3, tuv.y));

        background_color += vec4(finalComp*background_typeC,1.);
    }
 
    //----------------------------------------------------- moving_background
    
    //----------------------------------------------------- palettes_background
    /*
    if( 1.0< background_typeD )// lines gradian
    {
        vec2 p = uv*0.5;
        
        // animate
        p.x += 1.5*iTime*background_animation+background_animation_offset;
        
        // compute colors
        vec3                col = pal( p.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67) );
        if( p.y>(1.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20) );
        if( p.y>(2.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.3,0.20,0.20) );
        if( p.y>(3.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,0.5),vec3(0.8,0.90,0.30) );
        if( p.y>(4.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,0.7,0.4),vec3(0.0,0.15,0.20) );
        if( p.y>(5.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25) );
        if( p.y>(6.0/7.0) ) col = pal( p.x, vec3(0.8,0.5,0.4),vec3(0.2,0.4,0.2),vec3(2.0,1.0,1.0),vec3(0.0,0.25,0.25) );
        

        // band
        float f = fract(p.y*7.0);
        // borders
        col *= smoothstep( 0.49, 0.47, abs(f-0.5) );
        // shadowing
        col *= 0.5 + 0.5*sqrt(4.0*f*(1.0-f));

        float env = 0.;
        if(background_type < 2.0)
            env = clamp((background_type-1.),0.,1.);
        else
            env = clamp(1.0-(background_type-2.),0.,1.);
        background_color += vec4(col*env,1.0);

    }
    */
    
    //----------------------------------------------------- palettes_background
    if( 0.0< background_typeD )// lines gradian
    {
        vec3 colorA = background_colorB/255.;//vec3(0.5,0.5,0.5);
        vec3 colorB = background_colorC/255.;//vec3(0.5,0.5,0.5);
        vec3 colorC = background_colorA/255.;//vec3(2.0,1.0,0.0);
        vec3 colorD = background_colorD/255.;//vec3(0.5,0.20,0.25);
        vec2 p = uv*0.5;
        
        // animate
        p.y += 1.5*iTime*background_animation+background_animation_offset;
        
        // compute colors
        // vec3                col = pal( p.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67) );
        // if( p.y>(1.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20) );
        // if( p.y>(2.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.3,0.20,0.20) );
        // if( p.y>(3.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,0.5),vec3(0.8,0.90,0.30) );
        // if( p.y>(4.0/7.0) ) col = pal( p.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,0.7,0.4),vec3(0.0,0.15,0.20) );
        // if( p.y>(5.0/7.0) ) 
        // if( p.y>(6.0/7.0) ) col = pal( p.x, vec3(0.8,0.5,0.4),vec3(0.2,0.4,0.2),vec3(2.0,1.0,1.0),vec3(0.0,0.25,0.25) );
        
        vec3 col = pal( p.y, colorA,colorB,colorC,colorD );

       
        background_color += vec4(col*background_typeD,1.0);

    }

    if( 0.0< background_type_discoTarget )// lines gradian
    {
        float t = iTime;
        vec2 uv = map(gl_FragCoord.xy);                         

        vec2 mouseN = iMouse.x <= 0.0 ? vec2(0): map(iMouse.xy);
        uv -= mouseN;

        vec3 col = vec3(0.);
        col.r = sfract(length( uv.xy*10. )*float(1.0*sin(t*0.1)));
        col.g = sfract(length( uv.xy*10. )*float(1.0*sin(t*0.2)));
        col.b = sfract(length( uv.xy*10. )*float(1.0*sin(t*0.3))) ; 


        background_color += vec4(col*background_type_discoTarget,1.0);
    }

    
    if( 0. < background_grain )
    {
        float background_noise_mask = clamp(noise( uv*50.*background_grain_scale )*10.5,0.5,1.8);
        background_color = vec4(background_color.xyz+vec3(background_noise_mask*0.05*background_grain), 1.0);        
    }        

    
    if( 0. < background_transparency )
    {
        color *= background_transparency;
        color += background_color* (1.-background_transparency) ;
    }
    else{
        color = background_color;
    }

    
    if(( 0. < background_grid )&&( 0. < background_grid_scale))
    {
        float S = background_grid_scale; // Scale
        float line_width = 0.0101*background_grid_line_scale; 
        float point_width = 0.06*background_grid_point_scale; 
           
        //--------------------------- grid
        float offset = 0.05;
        float u = S * uv.x-0.5*S+offset-0.5*line_width;
        float u_alternate = mod(u, 1.);
        float u_shorten = 0.0;//pow(u_alternate,80.0);;
        if( 1.0-line_width < u_alternate)
            u_shorten = 1.0;

        float v = S * uv.y-0.5*S+offset-0.5*line_width;
        float v_alternate = mod(v, 1.);
        float v_shorten = 0.0;//pow(v_alternate,80.0);;
        if( 1.0-line_width < v_alternate)
            v_shorten = 1.0;

        vec4 grid_mask = vec4(min(1.0,u_shorten+v_shorten));
        vec4 grid_color = vec4(1.0);
        float grid_noise_mask = clamp(noise( uv*250. )*1.5,0.3,1.0);

        color += grid_color*grid_mask*grid_noise_mask*background_grid;    
        
        //--------------------------- cross_path_point
        u = S * uv.x-0.5*S+offset-0.5*point_width;
        u_alternate = mod(u, 1.);
        u_shorten = 0.0;//pow(u_alternate,80.0);;
        if( 1.0-point_width < u_alternate)
            u_shorten = 1.0;

        v = S * uv.y-0.5*S+offset-0.5*point_width;
        v_alternate = mod(v, 1.);
        v_shorten = 0.0;//pow(v_alternate,80.0);;
        if( 1.0-point_width < v_alternate)
            v_shorten = 1.0;

        vec4 cross_path_point_mask = vec4(u_shorten*v_shorten);
        vec4 cross_path_point_color = vec4(1.0);
        float cross_path_point_noise_mask = clamp(noise( uv*250. )*1.5,0.3,1.0);
        
        color += cross_path_point_mask * cross_path_point_color*cross_path_point_noise_mask*background_grid;

    }   

    //----------------------------------------------------- palettes_background
    
	//---------------------------------------------------- vignetage
	vec2 _uv = fragCoord_fixRez.xy / iResolution.xy*0.5;
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
    vec4 rect_border_color = background_color;//vec4(1.0f, 1.0f, 0.75f, 1.0f);
    if( 0. < boder_size )
    {
        vec2 p_center       = iResolution.xy/2.0;
        vec2 center_to_frag = fragCoord_fixRez - p_center;

        vec2 border_thickness = iResolution.xy/2.0*(1.-boder_size)*0.99;

        float box_corner_smooth_radius = smooth_corner * 80.; 


        float d = roundedBoxSDF(center_to_frag, border_thickness, box_corner_smooth_radius);

        float rect_border_mask =  smoothstep(0., edgeSoftness * 2.,d);
        color = mix( color , rect_border_color,rect_border_mask);
        
    }
	//--------------------------------- rectangle border

	//---------------------------------------------------- hatching
    if( 0. < hatching_line )
    {
        // update layout params
        float rows = linesRows * 0.5;//linesRows + 3. * sin(iTime);
        float curThickness =  0.22 * line_thickness;
        float curRotation = 0.8 * rot_value;
        // get original coordinate, translate & rotate
        vec2 uv_rot = (2. * fragCoord_fixRez.xy - iResolution.xy) / iResolution.y;
        //uv += curCenter;
        uv_rot = rotateCoord(uv_rot, curRotation);
        // create grid coords
        vec2 uvRepeat = fract(uv_rot * rows);		
        // adaptive antialiasing, draw, invert
        float aa = iResolution.y * 0.00003; 	
        float hatching_line_alpha = smoothstep(curThickness - aa, curThickness + aa, length(uvRepeat.y - 0.5));
        if(invert == 1) hatching_line_alpha = 1. - hatching_line_alpha;			
        
        
        //color = mix( color , color*vec4(1.-hatching_line),hatching_line_alpha);
        //color = mix( color , rect_border_color,hatching_line_alpha);
    }

	
	//---------------------------------------------------- hatching


	//--------------------------------- rectangle border light
    vec2 a = 0.3 * iResolution.xy*2.0;// First gradient point.
    vec2 b = iResolution.xy*2.0;// Second gradient point.

    // Calculate interpolation factor with vector projection.
    vec2 ba = b - a;
    float light_mask = dot(fragCoord_fixRez.xy - a, ba) / dot(ba, ba);
	vec4 rect_border_light_color = rect_border_color * 2.3;	
	vec4 rect_border_shadow_color = rect_border_color * 0.5;

    //color = mix( color , rect_border_light_color,rect_border_mask*light_mask);	
	//color = mix( color , rect_border_shadow_color,rect_border_mask*(1.0 - light_mask) );		
	//--------------------------------- rectangle border  light


    //--------------------------------- beam light
    
    if( 0.0 < light_beam )
    {
        float size = 0.19;
        float falloff = 0.3;
        float max_dist = 1.5;
        
        
        vec2 p_target = vec2(1.+cos(float(iFrame)*0.05),1.+cos(float(iFrame)*0.01));
        
        vec2 p = vec2(1.,1.5);
        float d = beam_mask(uv,p , p_target, size, falloff, max_dist, true );
        p = vec2(1.25,1.5);
        d += beam_mask(uv,p , p_target, size, falloff, max_dist, true );
        p = vec2(0.75,1.5);
        d += beam_mask(uv,p , p_target, size, falloff, max_dist, true );
                
        color += d*light_beam;
        color += draw_point(uv, p_target, 0.05,vec4(1,1,1,0));
    }
    
    //--------------------------------- beam light
    



    //TMP
    if( glow_remove_white_original == 1 )
    {
        color = color - texture(text, uv_move);
    }

    if( 0. < glow_power)
    {
        color += texture(text_glow,uv_move)*glow_power;
    }

    if(debug == 1)
    {
        vec2 _uv = fragCoord_fixRez.xy/iResolution.xy;
        vec2 _uv_grid = vec2(0.);
        _uv_grid.x = float(int(_uv.x*10.)%10)/10., 
        _uv_grid.y = float(int(_uv.y*10.)%10)/10.;
        color = vec4(_uv_grid.x, _uv_grid.y,0.,0.); 
        if((int(_uv.x*10.) == 4)&&(int(_uv.y*10.) == 4))
        {
            color = vec4(1.);
        }
        if((int(_uv.x*10.) == 9)&&(int(_uv.y*10.) == 9))
        {
            color = vec4(1.);
        }      
          
    }
    



    //fragColor = vec4(background_color+vec3(background_noise_mask*0.05), 1.0)*vignetting+smoothedAlpha*t-hatching_line_alpha;	
	fragColor = color; // ask for a value between 0 and 1
    
    

}