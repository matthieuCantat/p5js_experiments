#version 300 es
precision mediump float;
uniform vec2 iResolution; // For each instance, same value
uniform float iTime;
uniform int iFrame;
uniform vec2 iMouse;

out vec4 fragColor;






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















#define S 3. // Scale
#define line_width 0.01
#define point_width 0.06
//void mainImage( out vec4 fragColor, in vec2 fragCoord ) ---> void main( ) gl_FragColor, gl_FragCoord
void main()
{
	vec2 uv = gl_FragCoord.xy * vec2(iResolution.x / iResolution.y, 1) / iResolution.xy;

	vec4 color = vec4(0.0,0.0,0.0,1.0);

	//--------------------------- 
	vec4 background_color = vec4(uv.x*0.2,uv.x*0.2,uv.y*0.8,1.0);
	float background_noise_mask = clamp(noise( uv*140. )*1.5,0.4,0.9);
	background_color *= vec4(background_noise_mask);
	color += background_color;
	
	//--------------------------- grid
	float u = S * uv.x;
	float u_alternate = mod(u, 1.);
	float u_shorten = 0.0;//pow(u_alternate,80.0);;
	if( 1.0-line_width < u_alternate)
		u_shorten = 1.0;

	float v = S * uv.y;
	float v_alternate = mod(v, 1.);
	float v_shorten = 0.0;//pow(v_alternate,80.0);;
	if( 1.0-line_width < v_alternate)
		v_shorten = 1.0;

	vec4 grid_mask = vec4(min(1.0,u_shorten+v_shorten));
	vec4 grid_color = vec4(1.0);
	float grid_noise_mask = clamp(noise( uv*250. )*1.5,0.3,0.8);

	color += grid_color*grid_mask*grid_noise_mask;

	//--------------------------- cross_path_point
	u = S * uv.x;
	u_alternate = mod(u, 1.);
	u_shorten = 0.0;//pow(u_alternate,80.0);;
	if( 1.0-point_width < u_alternate)
		u_shorten = 1.0;

	v = S * uv.y;
	v_alternate = mod(v, 1.);
	v_shorten = 0.0;//pow(v_alternate,80.0);;
	if( 1.0-point_width < v_alternate)
		v_shorten = 1.0;

	vec4 cross_path_point_mask = vec4(u_shorten*v_shorten);
	vec4 cross_path_point_color = vec4(1.0);
	float cross_path_point_noise_mask = clamp(noise( uv*250. )*1.5,0.3,0.8);
	
	color += cross_path_point_mask * cross_path_point_color*cross_path_point_noise_mask;


	
	
	fragColor = color;
	//fragColor.y = uv.y;
}