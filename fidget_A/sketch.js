/* prevents the mobile browser from processing some default
 * touch events, like swiping left for "back" or scrolling
 * the page.
 */
document.ontouchmove = function(event) {
  event.preventDefault();
};


// Disable pull-to-refresh using JavaScript
document.body.addEventListener('touchmove', function(event) {
event.preventDefault();
}, { passive: false });



var mouseConstraint = Matter.MouseConstraint.create(engine, {
  //mouse: mouse,
  collisionFilter: {category: utils.collision_category.mouse, mask: utils.collision_category.inter}, // <---
  constraint: {
      // allow bodies on mouse to rotate
      angularStiffness: 0,
      render: {
          visible: false
      }
  }
});
Matter.Composite.add(engine.world, mouseConstraint);




let width       = 400
let height      = 400
var ground_enable = false
var Fs_sequence = null

var nbr = 10
var debug = false

var use_webgl = false
var shaders_nbr = 0

var shdrs = [] 

var do_shdr_test = false
var shdr_test = null




function preload()
{
  
  console.log('preload : sketch')
  for( let i =0; i < shaders_nbr; i++)
  {
    shdrs.push(new shader_build());
    shdrs[i].preload();
  }

  if(do_shdr_test)
  {
    shdr_test = new shader_build()
    shdr_test.preload()
  }

}

function setup() {
  console.log('setup : sketch')

  if(use_webgl)
  {
    createCanvas(width, height,WEBGL);
    drawingContext.getExtension("OES_standard_derivatives");
    //pixelDensity(1);
    noStroke();
    //stroke(0);
  }
  else
  {
    createCanvas(width, height);
    //pixelDensity(2);
  }
  
  
  /*
  canvas_beauty = createGraphics(canvas_dims.x, canvas_dims.y, WEBGL);
  canvas_beauty.clear();
  canvas_beauty.noStroke();// turn off the cg layers stroke  

  canvas_glow = createGraphics(canvas_dims.x, canvas_dims.y, WEBGL); // create renderer 
  canvas_glow.clear();
  canvas_glow.noStroke();// turn off the cg layers stroke    
  */
  let shader_resolution_div = 1.;
  if( shdrs.length != 0 )
  {
    shdrs[0].setup({x:100/shader_resolution_div,y:50/shader_resolution_div})  
    shdrs[1].setup({x:width/2/shader_resolution_div,y:height/shader_resolution_div})
  }

  if(do_shdr_test)
    shdr_test.setup({x:width/shader_resolution_div,y:height/shader_resolution_div})
 

  Matter.Composite.add(engine.world, create_boundary_wall_collision(width,height,ground_enable));

  var runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);
  
  engine.gravity.scale = 0.0
  
  let m = new Matrix()
  m.setTranslation(width/2, height/2 )
  
  let s = 2.2
  F_sequence = new fidgets_sequence(nbr,m,s,shdrs,debug)
  F_sequence.setup()

 
  
}


var pM = null
function mousePressed() 
{
  /*
  pM = createVector( mouseX, mouseY)
  apply_force_to_all( fidget.rectangles, pM, toggle_force )
  toggle_force = 1 - toggle_force
  */
  
  /*
  //FULL SCREEN
  touchStarted();  
  */
}

var toggle_force = 0
function touchStarted() 
{
  /*
  let touches_nbr = touches.length;
  if( 0 < touches_nbr )
  {
    pM = createVector(touches[0].x, touches[0].y)
    apply_force_to_all( fidget.rectangles, pM, toggle_force )
    toggle_force = 1 - toggle_force
  }
  */

  /*
  //FULL SCREEN
  var fs = fullscreen();
  if (!fs) {
    fullscreen(true);
  }  
  */
}

var end_update_count = 0
var draw_count = 0;
function draw() {
  
  if( mouseIsPressed == false)pM = null
  if( touches.lengh  == 0    )pM = null


  //if( pM != null )
  //  circle(pM.x,pM.y,10)

  if(do_shdr_test)
  {
    shdr_test.iFrame = draw_count;
    shdr_test.iTime = millis() / 1000.0; 
    shdr_test.iMouse = { x: 0, y: 0};
  
    shdr_test.bg_animation = 1.
    shdr_test.bg_grain = 1.
    shdr_test.bg_grain_scale = 14.
    shdr_test.bg_grid = 0.0
    shdr_test.bg_grid_scale = 10.0
    shdr_test.bg_grid_line_scale =  2.0
    shdr_test.bg_grid_point_scale =  2.0
  
    shdr_test.bg_typeA = 0.0;
    shdr_test.bg_typeB = 0.0;
    shdr_test.bg_typeC = 1.0;
    shdr_test.bg_typeD = 0.;
    shdr_test.bg_type_discoTarget= 0.;
  
    shdr_test.light_beam = 0.0
    shdr_test.debug = 0    
  
    shdr_test.update()
    shdr_test.as_image();
  }
  else{
    F_sequence.update()
    F_sequence.draw()
  }

  
  




  
  draw_count += 1
}



/*
var canvasSize = [400,400]

function windowResized() {
  
  if( ( canvasSize[0] != windowWidth )&&( canvasSize[1] != windowHeight ))
  {
    canvasSize[0] = windowWidth;
    canvasSize[1] = windowHeight;
    
    resizeCanvas(windowWidth, windowHeight);
    //init();
  }
  else
  {
    canvasSize[0] = canvasSizeDefault[0];
    canvasSize[1] = canvasSizeDefault[1];
    
    resizeCanvas(canvasSizeDefault[0] , canvasSizeDefault[1] );
    init();
  }

  
}
*/
