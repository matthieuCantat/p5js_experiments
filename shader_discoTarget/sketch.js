
let shdr_discoTarget;
let shdr_background;
let shdr_background_glow;
let shdr_body;
let shdr_post_process;
let shdr_glow_mask;
let canvas_main;
let canvas_background;
let canvas_background_glow;
let canvas_body_discoTarget;
let canvas_bodyA;
let canvas_glow_mask;
let canvas_glow;
let canvas_end;
var canvas_dims ={w:400, h:400}

function clamp(value,min_v,max_v)
{
  return min(max_v,max(min_v,value));
}
function mix_value_function(value,pos,scale)
{
  let input = (value-pos)/scale;
  let coef = clamp(round(input+0.5),0.,1.)
  let alternate_valueA = clamp( (1-coef)*input+coef*input*-1. + 1., 0.,1.);  
  return alternate_valueA;
}
function preload() {
  // load each shader file 
  shdr_discoTarget = loadShader('shader.vert', 'shdr_discoTarget.frag');
  shdr_background = loadShader('shader.vert', 'shdr_bodyGrain.frag');
  shdr_background_glow = loadShader('shader.vert', 'shdr_bodyGrain.frag');
  shdr_body = loadShader('shader.vert', 'shdr_bodyGrain.frag');
  shdr_post_process = loadShader('shader.vert', 'shdr_bodyGrain.frag');
  shdr_glow_mask = loadShader('shader.vert', 'shdr_bodyGrain.frag');
}

function setup() {
  // the canvas has to be created with WEBGL mode
  canvas_main = createCanvas(canvas_dims.w, canvas_dims.h, WEBGL);
  noStroke();
  //
  drawingContext.getExtension("OES_standard_derivatives");//canvas.getContext('webgl')
  // 
  canvas_body_discoTarget = createGraphics(canvas_dims.w, canvas_dims.h, WEBGL); // create renderer 
  canvas_body_discoTarget.clear();
  canvas_body_discoTarget.noStroke();// turn off the cg layers stroke
  // 
  canvas_background = createGraphics(canvas_dims.w, canvas_dims.h, WEBGL); // create renderer 
  canvas_background.clear();
  canvas_background.noStroke();// turn off the cg layers stroke  
  // 
  canvas_background_glow = createGraphics(canvas_dims.w, canvas_dims.h, WEBGL); // create renderer 
  canvas_background_glow.clear();
  canvas_background_glow.noStroke();// turn off the cg layers stroke
  // 
  canvas_bodyA = createGraphics(canvas_dims.w, canvas_dims.h, WEBGL); // create renderer 
  canvas_bodyA.clear();
  canvas_bodyA.noStroke();// turn off the cg layers stroke    
  
  //
  canvas_glow_mask = createGraphics(canvas_dims.w, canvas_dims.h, WEBGL); // create renderer 
  canvas_glow_mask.clear();
  canvas_glow_mask.noStroke();// turn off the cg layers stroke  

  //
  canvas_glow = createGraphics(canvas_dims.w, canvas_dims.h, WEBGL); // create renderer 
  canvas_glow.clear();
  canvas_glow.noStroke();// turn off the cg layers stroke    

  //
  canvas_end = createGraphics(canvas_dims.w, canvas_dims.h, WEBGL); // create renderer 
  canvas_end.clear();
  canvas_end.noStroke();// turn off the cg layers stroke    

  //pixelDensity(1)
}

var draw_count = 0

function draw() {
 // here we're using setUniform() to send our uniform values to the shader
  // set uniform is smart enough to figure out what kind of variable we are sending it,
  // so there's no need to cast (unlike processing)
  shdr_discoTarget.setUniform("iResolution", [canvas_dims.w, canvas_dims.h]);
  shdr_discoTarget.setUniform("iFrame", frameCount);
  shdr_discoTarget.setUniform("iTime", millis() / 1000.0);
  shdr_discoTarget.setUniform("iMouse", [mouseX*2, map(mouseY, 0, canvas_dims.h, canvas_dims.h, 0)*2]);

  shdr_background.setUniform("iResolution", [canvas_dims.w, canvas_dims.h]);
  shdr_background.setUniform("iFrame", frameCount);
  shdr_background.setUniform("iTime", millis() / 1000.0);
  shdr_background.setUniform("iMouse", [mouseX*2, map(mouseY, 0, canvas_dims.h, canvas_dims.h, 0)*2]); 
  
  shdr_background_glow.setUniform("iResolution", [canvas_dims.w, canvas_dims.h]);
  shdr_background_glow.setUniform("iFrame", frameCount);
  shdr_background_glow.setUniform("iTime", millis() / 1000.0);
  shdr_background_glow.setUniform("iMouse", [mouseX*2, map(mouseY, 0, canvas_dims.h, canvas_dims.h, 0)*2]); 

  shdr_body.setUniform("iResolution", [canvas_dims.w, canvas_dims.h]);
  shdr_body.setUniform("iFrame", frameCount);
  shdr_body.setUniform("iTime", millis() / 1000.0);
  shdr_body.setUniform("iMouse", [mouseX*2, map(mouseY, 0, canvas_dims.h, canvas_dims.h, 0)*2]); 
  
  shdr_post_process.setUniform("iResolution", [canvas_dims.w, canvas_dims.h]);
  shdr_post_process.setUniform("iFrame", frameCount);
  shdr_post_process.setUniform("iTime", millis() / 1000.0);
  shdr_post_process.setUniform("iMouse", [mouseX*2, map(mouseY, 0, canvas_dims.h, canvas_dims.h, 0)*2]); 

  shdr_glow_mask.setUniform("iResolution", [canvas_dims.w, canvas_dims.h]);
  shdr_glow_mask.setUniform("iFrame", frameCount);
  shdr_glow_mask.setUniform("iTime", millis() / 1000.0);
  shdr_glow_mask.setUniform("iMouse", [mouseX*2, map(mouseY, 0, canvas_dims.h, canvas_dims.h, 0)*2]);     
  
  //////////////////////////////////////////////// 


  


  //rect(-50,-120,150,50);  

  // shader() sets the active shader, which will be applied to what is drawn next

  //canvasB.shader(shader_tpl);

  // rect gives us some geometry on the screen
  // passing the shaderBg graphic geometry to render on

  //update canvase
  canvas_background.clear()
  canvas_background.shader(shdr_background)
  canvas_background.rect();// INIT SHADER

  canvas_background_glow.clear()
  canvas_background_glow.shader(shdr_background_glow)
  canvas_background_glow.rect();// INIT SHADER  

  canvas_body_discoTarget.clear()
  canvas_body_discoTarget.shader(shdr_discoTarget)
  canvas_body_discoTarget.rect();// INIT SHADER


  /////////////////////////START
  clear()

  // background
  background(0);
  // rectB
  shdr_background.setUniform('background_type', (frameCount*0.005)%5)
  shdr_background.setUniform('background_animation',1.0)
  shdr_background.setUniform('background_animation_offset',0.0)
  shdr_background.setUniform('background_grain',1.0)
  shdr_background.setUniform('background_grain_scale',2.0)
  shdr_background.setUniform('background_grid',1.0)
  shdr_background.setUniform('background_grid_scale', 4.)
  shdr_background.setUniform('background_grid_line_scale',1.0) 
  shdr_background.setUniform('background_grid_point_scale',1.0) 

  shdr_background.setUniform('background_colorA',[255., 0., 114.]);//vec3(.910, .510, .8);
  shdr_background.setUniform('background_colorB',[197., 255., 80.]);//vec3(.957, .804, .623);
  shdr_background.setUniform('background_colorC',[48.96,97.92,237.915]);//vec3(.192, .384, .933);
  shdr_background.setUniform('background_colorD',[89.25,181.05,243.015]);//vec3(0.350, .71, .953);


  shdr_background.setUniform('background_typeA',mix_value_function(frameCount,0,200));
  shdr_background.setUniform('background_typeB',mix_value_function(frameCount,200,200));
  shdr_background.setUniform('background_typeC',mix_value_function(frameCount,400,200));
  shdr_background.setUniform('background_typeD',mix_value_function(frameCount,600,200));


  shdr_background_glow.setUniform('background_type', 10)
  shdr_background_glow.setUniform('background_grid',1.0)
  shdr_background_glow.setUniform('background_grid_scale', 4.) 
  shdr_background_glow.setUniform('background_grid_line_scale',0.0) 
  shdr_background_glow.setUniform('background_grid_point_scale',3.0) 

  image(canvas_background,-200,-200,400,400) // Use as background

  canvas_glow_mask.background(0);
  canvas_glow_mask.image(canvas_background_glow,-200,-200,400,400) // Use as background
  // rectC

  fill(255)
  rect(-190/2,-90/2,50,50);

  canvas_glow_mask.fill(255)
  canvas_glow_mask.rect(-190/2,-90/2,50,50);

  // rectA
  texture(canvas_body_discoTarget); // Use on geometry

  push();
  //translate(cos(draw_count/30)*100,-10)
  //rotate(draw_count/50);
  rect(-250/2.,-150./2,250,150, 10);
  pop();

  
  canvas_glow_mask.fill(0)
  canvas_glow_mask.rect(-250/2,-250/2,250,150, 10);  

  // rectB
  let tlc_pos = createVector(-250/2+draw_count,-150/2);//createVector(cos(draw_count/30+4)*100, cos(draw_count/20)*150-150/2)
  let scale_rect = createVector(250,150);
  let center_offset =createVector(scale_rect.x/2,scale_rect.y/2);
  let rot_offset = draw_count/30.*-1.

  let center_pos = p5.Vector.add(tlc_pos, center_offset)
  let center_at_top_left_coords_system = p5.Vector.add(center_pos, createVector(200,200))
  let pos_uv = createVector( (center_at_top_left_coords_system.x)/400, (center_at_top_left_coords_system.y)/400);
  console.log(pos_uv.x,pos_uv.y)

  shdr_body.setUniform('uvOffsetX',pos_uv.x) 
  shdr_body.setUniform('uvOffsetY',pos_uv.y) 
  shdr_body.setUniform('objCanvasRatioW',scale_rect.x/400) 
  shdr_body.setUniform('objCanvasRatioH',scale_rect.y/400)   
  shdr_body.setUniform('uvOffsetRotate',rot_offset) 
  shdr_body.setUniform('text',canvas_main)  


  shdr_body.setUniform('blur_background',1.) 
  shdr_body.setUniform('blur_background_samples', 35)
  shdr_body.setUniform('blur_background_samples_LOD',2)  
  shdr_body.setUniform('glow_background_size',1.) 
  shdr_body.setUniform('glow_background',0.) 
  shdr_body.setUniform('background_transparency',1.)//1.) 
  shdr_body.setUniform('background_type', 0.0)
  shdr_body.setUniform('background_animation',0.0)
  shdr_body.setUniform('background_animation_offset',0.0)
  shdr_body.setUniform('background_grain',1.0)
  shdr_body.setUniform('background_grain_scale',1.0)
  shdr_body.setUniform('background_grid',0.0)
  
  //shdr_body.setUniform('background_grid_scale', (frameCount*0.1)%10)
  //shdr_body.setUniform('background_grid_line_scale',1.0) 
  //shdr_body.setUniform('background_grid_point_scale',1.0)   
  shdr_body.setUniform('boder_size',0.01)//max(0.0,cos(draw_count/20)) )
  shdr_body.setUniform('hatching_line',max(0.0,cos(draw_count/20)))
  
  canvas_bodyA.clear()
  canvas_bodyA.background(0);
  canvas_bodyA.shader(shdr_body) // Use as background
  canvas_bodyA.rect();// INIT 
  texture(canvas_bodyA);

  push();
  translate(center_pos.x,center_pos.y)
  rotate(rot_offset);
  rect( -center_offset.x,-center_offset.y, scale_rect.x,scale_rect.y, 10);
  pop(); 
  /*
  canvas_glow_mask.fill(0)
  canvas_glow_mask.rect( tlc_pos.x, tlc_pos.y, 250,150, 10);


  shdr_glow_mask.setUniform('uvOffsetX',-0.5) 
  shdr_glow_mask.setUniform('uvOffsetY',-0.5) 
  shdr_glow_mask.setUniform('uvOffsetW',1) 
  shdr_glow_mask.setUniform('uvOffsetH',1)     
  shdr_glow_mask.setUniform('text',canvas_glow_mask)
  shdr_glow_mask.setUniform('background_transparency',1.)//,1.-max(0.,cos(frameCount*0.005+1.)) )//1.)
  shdr_glow_mask.setUniform('blur_background',1.1) 
  shdr_glow_mask.setUniform('blur_background_samples', 35)
  shdr_glow_mask.setUniform('blur_background_samples_LOD',2)  
  //shdr_glow_mask.setUniform('glow_background_size',0.1) 
  //shdr_glow_mask.setUniform('glow_background',0.05) 
  shdr_glow_mask.setUniform('glow_remove_white_original',0)  
  
  canvas_glow.background(0);
  canvas_glow.shader(shdr_glow_mask) // Use as background
  canvas_glow.rect();// INIT 


  // post process
  shdr_post_process.setUniform('uvOffsetX',-0.5) 
  shdr_post_process.setUniform('uvOffsetY',-0.5) 
  shdr_post_process.setUniform('uvOffsetW',1) 
  shdr_post_process.setUniform('uvOffsetH',1)    
  //shdr_post_process.setUniform('text',canvas_main)
  shdr_post_process.setUniform('text',canvas_main)
  shdr_post_process.setUniform('text_glow',canvas_glow)
  shdr_post_process.setUniform('glow_power',abs(cos(float(draw_count)*0.05)))

  //shdr_post_process.setUniform('blur_background',max(0.,cos(frameCount*0.05+0.5))) 
  //shdr_post_process.setUniform('glow_background_size',1.) 
  //shdr_post_process.setUniform('glow_background',max(0.,cos(frameCount*0.02+0.5))) 
  shdr_post_process.setUniform('background_transparency',1.)//,1.-max(0.,cos(frameCount*0.005+1.)) )//1.)
  shdr_post_process.setUniform('background_type',0)
  shdr_post_process.setUniform('blur_background',0.) 
  shdr_post_process.setUniform('blur_background_samples', 35)
  shdr_post_process.setUniform('blur_background_samples_LOD',2)

  shdr_post_process.setUniform('light_beam',1.)


  canvas_end.clear()
  canvas_end.background(0);
  canvas_end.shader(shdr_post_process) // Use as background
  canvas_end.rect();// INIT 
  image(canvas_end,-200,-200,400,400)
  */
 
  

  draw_count += 1
}