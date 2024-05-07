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

function setup() {

  Matter.Composite.add(engine.world, create_boundary_wall_collision(width,height,ground_enable));

  var runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);

  createCanvas(width, height);

  engine.gravity.scale = 0.0


  let m = new Matrix()
  m.setTranslation(width/2, height/2 )
  
  
  let s = 2.2
  F_sequence = new fidgets_sequence(nbr,m,s,debug)

  
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

function draw() {
  
  if( mouseIsPressed == false)pM = null
  if( touches.lengh  == 0    )pM = null
  F_sequence.update()
  F_sequence.draw()
  if( pM != null )
    circle(pM.x,pM.y,10)

  

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
