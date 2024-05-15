let shader_tpl;
let canvasB;

function preload() {
  // load each shader file 
  shader_tpl = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  // the canvas has to be created with WEBGL mode
  createCanvas(400, 400, WEBGL);
  noStroke();
  // initialize the createGraphics layers
  canvasB = createGraphics(400, 400, WEBGL); // create renderer 
  canvasB.clear();
  canvasB.noStroke();// turn off the cg layers stroke
}

var draw_count = 0

function draw() {
 // here we're using setUniform() to send our uniform values to the shader
  // set uniform is smart enough to figure out what kind of variable we are sending it,
  // so there's no need to cast (unlike processing)
  shader_tpl.setUniform("u_resolution", [width, height]);
  shader_tpl.setUniform("u_time", millis() / 1000.0);
  shader_tpl.setUniform("u_mouse", [mouseX, map(mouseY, 0, height, height, 0)]);
  //////////////////////////////////////////////// 

  background(50);

  fill(0, 255, 0);
  rect(-50,-120,150,50);  

  // shader() sets the active shader, which will be applied to what is drawn next

  //canvasB.shader(shader_tpl);

  // rect gives us some geometry on the screen
  // passing the shaderBg graphic geometry to render on

  //------------------------------BEFORE CANVAS B
  canvasB.clear()
  canvasB.shader(shader_tpl)
  canvasB.fill(0, 0, 255);

  let anim = abs(cos(draw_count/20))*100
  
  
  canvasB.rect(-150+anim,-200+anim,150,50);
  
  //image(canvasB,-200,-200,400,400)
  //------------------------------AFTER CANVAS B


  fill(255, 0, 0);
  texture(canvasB);
  translate(-100,-100)
  rotate(draw_count/20)
  rect(-150/2,-50/2,150,50);
    
  
  //rect(100,100,150,50);


  draw_count += 1
}