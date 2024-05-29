



class shader_build
{
  constructor()
  {
    this.iFrame = 0;
    this.iTime = 0;
    this.iResolution = {x:0.,y:0.};
    this.iResolution_main_canvas = {x:0.,y:0.};

    this.iMouse = {x:0.,y:0.};
    this.objCanvasRatio ={x:1.,y:1.};
    this.uvRotatePivot ={x:0.5,y:0.5};
    this.uvOffset ={x:0.,y:0.};
    this.uvOffsetRotate =0.;
   
    this.text =null; 
    this.text_glow = null; 
    this.blur_background =0.; 
    this.blur_background_samples = 35;
    this.blur_background_samples_LOD =2;  
  
    this.glow_background_size =0.; 
    this.glow_background =0.; 
  
    this.background_transparency =0.; 
    this.boder_size =0.0;
    this.hatching_line =0.;
  
    this.background_animation =0.0;
    this.background_animation_offset =0.0;
    this.background_grain =0.0;
    this.background_grain_scale =2.0;
    this.background_grid =0.0;
    this.background_grid_scale = 4.;
    this.background_grid_line_scale =1.0;
    this.background_grid_point_scale =1.0; 
    this.background_colorA =[255., 0., 114.];//vec3(.910, .510, .8,
    this.background_colorB =[197., 255., 80.];//vec3(.957, .804, .623,
    this.background_colorC =[48.96,97.92,237.915];//vec3(.192, .384, .933,
    this.background_colorD =[89.25,181.05,243.015];//vec3(0.350, .71, .953,
    this.background_typeA =0.0;
    this.background_typeB =0.0;
    this.background_typeC =0.0;
    this.background_typeD =0.0;
    this.background_type_discoTarget = 0.0;
  
    this.light_beam =0.;
    this.glow_power = 0.;
    this.debug =0;  

    this.shdr = null;
    this.canvas = null
  }

  preload()
  {
    this.shdr = loadShader('shader.vert', 'shdr_bodyGrain.frag');
  }

  setup(resolution,canvas_resolution=null)
  {
    this.iResolution = resolution
    if( canvas_resolution != null )
    {
      this.iResolution_main_canvas = canvas_resolution;
      //this.objCanvasRatio.x = this.iResolution.x / this.iResolution_main_canvas.x
    }
    else
    {
      this.iResolution_main_canvas = {x:0.,y:0.};
    }
    this.canvas = createGraphics(this.iResolution.x, this.iResolution.y, WEBGL); // create renderer 
    this.canvas.clear();
    this.canvas.noStroke();// turn off the cg layers stroke  
  }   

  update()
  {
    this.shdr.setUniform("iFrame", this.iFrame);
    this.shdr.setUniform("iTime", this.iTime);

    this.shdr.setUniform("iResolution", [this.iResolution.x,this.iResolution.y]);
    this.shdr.setUniform("iMouse", [this.iMouse.x,this.iMouse.y]);
    this.shdr.setUniform('uvOffset',[this.uvOffset.x,this.uvOffset.y]) 
    this.shdr.setUniform('objCanvasRatio',[this.objCanvasRatio.x,this.objCanvasRatio.y]) 
    this.shdr.setUniform('uvRotatePivot',[this.uvRotatePivot.x,this.uvRotatePivot.y])   
    this.shdr.setUniform('uvOffsetRotate',this.uvOffsetRotate) 
    if( this.text != null)
      this.shdr.setUniform('text',this.text)  
    if( this.text_glow != null)
      this.shdr.setUniform('text_glow',this.text_glow)  
      
    this.shdr.setUniform('glow_power',this.glow_power)
    
  
    this.shdr.setUniform('blur_background',this.blur_background) 
    this.shdr.setUniform('blur_background_samples', this.blur_background_samples)
    this.shdr.setUniform('blur_background_samples_LOD',this.blur_background_samples_LOD)  
    this.shdr.setUniform('glow_background_size',this.glow_background_size) 
    this.shdr.setUniform('glow_background',this.glow_background) 
    this.shdr.setUniform('background_transparency',this.background_transparency)//1.) 
    
    this.shdr.setUniform('boder_size',this.boder_size)//max(0.0,cos(draw_count/20)) )
    this.shdr.setUniform('hatching_line',this.hatching_line)
    
    this.shdr.setUniform('background_animation',this.background_animation)
    this.shdr.setUniform('background_animation_offset',this.background_animation_offset)
    this.shdr.setUniform('background_grain',this.background_grain)
    this.shdr.setUniform('background_grain_scale',this.background_grain_scale)
    this.shdr.setUniform('background_grid',this.background_grid)
    this.shdr.setUniform('background_grid_scale', this.background_grid_scale)
    this.shdr.setUniform('background_grid_line_scale',this.background_grid_line_scale) 
    this.shdr.setUniform('background_grid_point_scale',this.background_grid_point_scale) 
  
    this.shdr.setUniform('background_colorA',this.background_colorA);//vec3(.910, .510, .8);
    this.shdr.setUniform('background_colorB',this.background_colorB);//vec3(.957, .804, .623);
    this.shdr.setUniform('background_colorC',this.background_colorC);//vec3(.192, .384, .933);
    this.shdr.setUniform('background_colorD',this.background_colorD);//vec3(0.350, .71, .953);
  
    
    this.shdr.setUniform('background_typeA',this.background_typeA);
    this.shdr.setUniform('background_typeB',this.background_typeB);
    this.shdr.setUniform('background_typeC',this.background_typeC);
    this.shdr.setUniform('background_typeD',this.background_typeD);
    this.shdr.setUniform('background_type_discoTarget',this.background_type_discoTarget);
    this.shdr.setUniform('light_beam',this.light_beam)
  
    this.shdr.setUniform('debug',this.debug)   

    this.canvas.clear()
    this.canvas.background(0);
    this.canvas.shader(this.shdr) // Use as background
    this.canvas.rect();// INIT     
  }

  as_texture()
  {
    this.update()
    texture(this.canvas);
  }
  as_image()
  {
    this.update()
    image(this.canvas,this.iResolution.x/2*-1,this.iResolution.y/2*-1,this.iResolution.x,this.iResolution.y) 
  }

}



function clamp(value,min_v,max_v)
{
  return min(max_v,max(min_v,value));
}
function mix_value_function(value,pos,scale,max_loop)
{
  let input = (value%max_loop-pos)/scale;
  let coef = clamp(round(input+0.5),0.,1.)
  let alternate_valueA = clamp( (1-coef)*input+coef*input*-1. + 1., 0.,1.);  
  return alternate_valueA;
}

let shdr_glow_mask;

let canvas_beauty;

let canvas_background_glow;
let canvas_glow_mask;
let canvas_glow;

var canvas_dims ={x:400, y:400}//*9/16}
let rect_body_dims = {x:250, y:50};
let rect_body_center_offset = {x:rect_body_dims.x/2,y:rect_body_dims.y/2};


let shader_body_A = new shader_build();
let shader_body_B = new shader_build();
let shader_background = new shader_build();
let shader_post_process = new shader_build();

let shader_background_glow = new shader_build();
let shader_glow_mask = new shader_build();
let shader_glow = new shader_build();


function preload() {
  // load each shader file 
  shdr_glow_mask = loadShader('shader.vert', 'shdr_bodyGrain.frag');

  shader_body_A.preload();
  shader_body_B.preload();
  shader_background.preload()
  shader_post_process.preload()
  shader_background_glow.preload()
}

function setup() {
  // the canvas has to be created with WEBGL mode
  canvas_beauty = createCanvas(canvas_dims.x, canvas_dims.y, WEBGL);
  noStroke();
  //
  drawingContext.getExtension("OES_standard_derivatives");//canvas.getContext('webgl')

  shader_background.setup(canvas_dims)
  shader_background_glow.setup(canvas_dims)
  shader_body_A.setup(rect_body_dims);
  shader_body_B.setup(rect_body_dims);
  shader_post_process.setup(canvas_dims)



  // 
  canvas_background_glow = createGraphics(canvas_dims.x, canvas_dims.y, WEBGL); // create renderer 
  canvas_background_glow.clear();
  canvas_background_glow.noStroke();// turn off the cg layers stroke
  //
  canvas_glow_mask = createGraphics(canvas_dims.x, canvas_dims.y, WEBGL); // create renderer 
  canvas_glow_mask.clear();
  canvas_glow_mask.noStroke();// turn off the cg layers stroke  

  //
  canvas_glow = createGraphics(canvas_dims.x, canvas_dims.y, WEBGL); // create renderer 
  canvas_glow.clear();
  canvas_glow.noStroke();// turn off the cg layers stroke    


  //pixelDensity(1)
}

var draw_count = 0







function draw() {
 // here we're using setUniform() to send our uniform values to the shader
  // set uniform is smart enough to figure out what kind of variable we are sending it,
  // so there's no need to cast (unlike processing)


  shdr_glow_mask.setUniform("iFrame", frameCount);
  shdr_glow_mask.setUniform("iTime", millis() / 1000.0);
     
  


  /////////////////////////START
  clear()
  background(0);


  shader_background.iFrame = frameCount;
  shader_background.iTime = millis() / 1000.0; 
  shader_background.iMouse = { x: mouseX*2, y: map(mouseY, 0, canvas_dims.x, canvas_dims.y, 0)*2};

  shader_background.background_animation = 1.
  shader_background.background_grain = 1.
  shader_background.background_grain_scale = 4.
  shader_background.background_grid = 1.0
  shader_background.background_grid_scale = 10.0
  shader_background.background_grid_line_scale =  2.0
  shader_background.background_grid_point_scale =  2.0

  shader_background.background_typeA = mix_value_function(frameCount,0  ,200,900);
  shader_background.background_typeB = mix_value_function(frameCount,200,200,900);
  shader_background.background_typeC = mix_value_function(frameCount,400,200,900);
  shader_background.background_typeD = mix_value_function(frameCount,600,200,900);
  shader_background.background_type_discoTarget= mix_value_function(frameCount,800,200,900);

  shader_background.light_beam = 1.0
  shader_background.debug = 0

  shader_background.as_image()
  


  shader_background_glow.iFrame = frameCount;
  shader_background_glow.iTime = millis() / 1000.0; 
  shader_background_glow.iMouse = { x: mouseX*2, y: map(mouseY, 0, canvas_dims.x, canvas_dims.y, 0)*2};

  shader_background_glow.background_grid = 1.0
  shader_background_glow.background_grid_scale = 10.0
  shader_background_glow.background_grid_line_scale =  0.0
  shader_background_glow.background_grid_point_scale =  4.0

  shader_background_glow.light_beam = 1.0
  shader_background_glow.update()
  
  canvas_glow_mask.background(0);
  canvas_glow_mask.image(shader_background_glow.canvas,canvas_dims.x/2*-1,canvas_dims.y/2*-1,canvas_dims.x,canvas_dims.y) // Use as background
  // rectC

  fill(255)
  rect(-190/2,-90/2,50,50);

  canvas_glow_mask.fill(255)
  canvas_glow_mask.rect(-190/2,-90/2,50,50);

  // rectA
  let tlc_pos = createVector(cos(draw_count/30)*100, -10)  
  let center_pos = p5.Vector.add(tlc_pos, createVector(rect_body_center_offset.x,rect_body_center_offset.y))
  let pos_uv = createVector( (center_pos.x)/canvas_dims.x, (center_pos.y)/canvas_dims.y);

  let body_b_rotate = draw_count/50

  shader_body_B.iFrame = frameCount;
  shader_body_B.iTime = millis() / 1000.0; 
  shader_body_B.iMouse = { x: mouseX*2, y: map(mouseY, 0, canvas_dims.y, canvas_dims.y, 0)*2};
  shader_body_B.uvOffset = pos_uv;
  shader_body_B.objCanvasRatio.x = rect_body_dims.x/canvas_dims.x
  shader_body_B.objCanvasRatio.y = rect_body_dims.y/canvas_dims.y
  shader_body_B.uvOffsetRotate = body_b_rotate;

  shader_body_B.background_grain = 1.0;
  shader_body_B.background_grid = 1.0;
  shader_body_B.background_grid_scale = 10.0
  shader_body_B.background_grid_line_scale =  1.0
  shader_body_B.background_grid_point_scale =  4.0

  shader_body_B.background_type_discoTarget = 1.0;
  shader_body_B.debug = 0

  shader_body_B.as_texture()

  push();
  translate(tlc_pos)
  rotate(body_b_rotate);
  rect(-rect_body_center_offset.x,-rect_body_center_offset.y, rect_body_dims.x,rect_body_dims.y, 10);
  pop();

  canvas_glow_mask.push();
  canvas_glow_mask.translate(cos(draw_count/30)*100,-10)
  canvas_glow_mask.rotate(draw_count/50);  
  canvas_glow_mask.fill(0)
  canvas_glow_mask.rect(-rect_body_center_offset.x,-rect_body_center_offset.y, rect_body_dims.x,rect_body_dims.y, 10);    
  canvas_glow_mask.pop();

  
  

  // rectB
  tlc_pos = createVector(cos(draw_count/30+4)*100-100, cos(draw_count/20)*150-150/2)  
  center_pos = p5.Vector.add(tlc_pos, createVector(rect_body_center_offset.x,rect_body_center_offset.y))
  pos_uv = createVector( (center_pos.x)/canvas_dims.x, (center_pos.y)/canvas_dims.y);

  let rot_offset = draw_count/30.*-1.

  shader_body_A.iFrame = frameCount;
  shader_body_A.iTime = millis() / 1000.0; 
  shader_body_A.iMouse = { x: mouseX*2, y: map(mouseY, 0, canvas_dims.y, canvas_dims.y, 0)*2};
  shader_body_A.uvOffset = pos_uv;
  shader_body_A.objCanvasRatio.x = rect_body_dims.x/canvas_dims.x
  shader_body_A.objCanvasRatio.y = rect_body_dims.y/canvas_dims.y
  shader_body_A.uvOffsetRotate = rot_offset;
  shader_body_A.text = canvas_beauty;

  shader_body_A.blur_background = 1.
  shader_body_A.background_transparency = 1.

  shader_body_A.boder_size = 0.10
  shader_body_A.hatching_line = max(0.0,cos(draw_count/20))

  shader_body_A.background_animation = 1.0;
  shader_body_A.background_grain = 1.0;
  shader_body_A.background_grid = 1.0;

  shader_body_A.background_typeA = 0.0;
  shader_body_A.debug = 0

  shader_body_A.as_texture()

  push();
  translate(center_pos.x,center_pos.y)
  rotate(rot_offset);
  rect( -rect_body_center_offset.x,-rect_body_center_offset.y, rect_body_dims.x,rect_body_dims.y, 10);
  pop(); 
  
  //
  canvas_glow_mask.push();
  canvas_glow_mask.translate(center_pos.x,center_pos.y)
  //canvas_glow_mask.rotate(rot_offset);
  canvas_glow_mask.fill(0)
  canvas_glow_mask.rect( -rect_body_center_offset.x,-rect_body_center_offset.y, rect_body_dims.x,rect_body_dims.y, 10);
  canvas_glow_mask.pop(); 



  shdr_glow_mask.setUniform("iResolution", [canvas_dims.x, canvas_dims.y]);
  shdr_glow_mask.setUniform("iMouse", [mouseX*2, map(mouseY, 0, canvas_dims.y, canvas_dims.y, 0)*2]); 
  shdr_glow_mask.setUniform('uvOffset',[0,0]) 
  shdr_glow_mask.setUniform('objCanvasRatio',[1,1])   
  shdr_glow_mask.setUniform('uvRotatePivot',[0.5,0.5])  
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

  shader_post_process.iFrame = frameCount;
  shader_post_process.iTime = millis() / 1000.0; 
  shader_post_process.text = canvas_beauty
  shader_post_process.text_glow = canvas_glow
  shader_post_process.glow_power = abs(cos(float(draw_count)*0.05))
  shader_post_process.background_transparency = 1.;
  shader_post_process.blur_background = 0.;
  shader_post_process.blur_background_samples = 35;
  shader_post_process.blur_background_samples_LOD = 2;

  shader_post_process.as_image()
 
  /*
  canvas_end.clear()
  canvas_end.background(0);
  canvas_end.shader(shdr_post_process) // Use as background
  canvas_end.rect();// INIT 
  //image(canvas_end,canvas_dims.x/2*-1,canvas_dims.y/2*-1,canvas_dims.x,canvas_dims.y)
  */
  

  draw_count += 1
}