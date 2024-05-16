
let shdr_discoTarget;
let shdr_checker;
let shdr_blur;
let canvas_discoTarget;
let canvas_checker;
let canvas_mix;
let canvas_blur;
var canvas_dims ={w:400, h:400}


function preload() {
  // load each shader file 
  shdr_discoTarget = loadShader('shader.vert', 'shdr_discoTarget.frag');
  shdr_checker = loadShader('shader.vert', 'shdr_backgroundA.frag');
  shdr_blur = loadShader('shader.vert', 'shdr_bodyGrain.frag');
}

function setup() {
  // the canvas has to be created with WEBGL mode
  createCanvas(canvas_dims.w, canvas_dims.h, WEBGL);
  noStroke();
  //
  drawingContext.getExtension("OES_standard_derivatives");//canvas.getContext('webgl')
  // 
  canvas_discoTarget = createGraphics(canvas_dims.w, canvas_dims.h, WEBGL); // create renderer 
  canvas_discoTarget.clear();
  canvas_discoTarget.noStroke();// turn off the cg layers stroke
  // 
  canvas_checker = createGraphics(canvas_dims.w, canvas_dims.h, WEBGL); // create renderer 
  canvas_checker.clear();
  canvas_checker.noStroke();// turn off the cg layers stroke  
  // 
  canvas_mix = createGraphics(canvas_dims.w, canvas_dims.h, WEBGL); // create renderer 
  canvas_mix.clear();
  canvas_mix.noStroke();// turn off the cg layers stroke  
  // 
  canvas_blur = createGraphics(canvas_dims.w, canvas_dims.h, WEBGL); // create renderer 
  canvas_blur.clear();
  canvas_blur.noStroke();// turn off the cg layers stroke    

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

  shdr_checker.setUniform("iResolution", [canvas_dims.w, canvas_dims.h]);
  shdr_checker.setUniform("iFrame", frameCount);
  shdr_checker.setUniform("iTime", millis() / 1000.0);
  shdr_checker.setUniform("iMouse", [mouseX*2, map(mouseY, 0, canvas_dims.h, canvas_dims.h, 0)*2]); 
  
  shdr_blur.setUniform("iResolution", [canvas_dims.w, canvas_dims.h]);
  shdr_blur.setUniform("iFrame", frameCount);
  shdr_blur.setUniform("iTime", millis() / 1000.0);
  shdr_blur.setUniform("iMouse", [mouseX*2, map(mouseY, 0, canvas_dims.h, canvas_dims.h, 0)*2]); 
  //////////////////////////////////////////////// 


  


  //rect(-50,-120,150,50);  

  // shader() sets the active shader, which will be applied to what is drawn next

  //canvasB.shader(shader_tpl);

  // rect gives us some geometry on the screen
  // passing the shaderBg graphic geometry to render on

  //update canvase
  canvas_checker.clear()
  canvas_checker.shader(shdr_checker)
  canvas_checker.rect();// INIT SHADER
  
  canvas_discoTarget.clear()
  canvas_discoTarget.shader(shdr_discoTarget)
  canvas_discoTarget.rect();// INIT SHADER

  canvas_mix.clear()
  canvas_mix.background(0,0,0);
  canvas_mix.image(canvas_checker,-200,-200,400,400) // Use as background
  canvas_mix.texture(canvas_discoTarget); // Use on geometry
  //canvas_mix.translate(-100,-100)
  //canvas_mix.rotate(draw_count/20)
  canvas_mix.rect(-150/2,-50/2,250,150, 10);

  image(canvas_mix,-200,-200,400,400)
  
  let tlc = createVector(cos(draw_count/30)*100-250/2, cos(draw_count/20)*150-150/2)
  shdr_blur.setUniform('uvOffsetX',tlc.x/400) 
  shdr_blur.setUniform('uvOffsetY',tlc.y/400) 
  shdr_blur.setUniform('uvOffsetW',250/400) 
  shdr_blur.setUniform('uvOffsetH',150/400)   
  shdr_blur.setUniform('text',canvas_mix)  
  canvas_blur.clear()
  canvas_blur.background(0,0,0);
  canvas_blur.shader(shdr_blur) // Use as background
  canvas_blur.rect();// INIT 
  texture(canvas_blur);
  rect( tlc.x, tlc.y, 250,150, 10);

  //shader(shdr_blur)
  //rect()// INIT SHADER
 

  draw_count += 1
}