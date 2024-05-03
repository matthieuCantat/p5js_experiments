


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




var debug = false
let width       = 400
let height      = 400
var c = {x:200, y:200 }
var scale_coef = 2.2
var ground_enable = false


var fidgets = []
var draw_debug = null

var fidgets_nbr = 10
var fidgets_to_show = [fidgets_nbr-1,null]


function setup() {

  //_________________________________________________________________________________start
  // create two boxes and a ground
  Matter.Composite.add(engine.world, create_boundary_wall_collision(width,height,ground_enable));

  // create runner
  var runner = Matter.Runner.create();

  // run the engine
  Matter.Runner.run(runner, engine);

  // 
  createCanvas(width, height);

  engine.gravity.scale = 0.0

  // Build Custom
  for( let i = 0; i < fidgets_nbr; i++)
  {
    var fidget = new fidget_daft_i(c,scale_coef,debug)
    fidgets.push(fidget)
  
    if( draw_debug == null)
    {
      draw_debug = new Draw_debug()
      draw_debug.fidget = fidget
      draw_debug.mouse_cns = mouseConstraint
    }
  }





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


function draw() {
  
  if( mouseIsPressed == false)pM = null
  if( touches.lengh  == 0    )pM = null
  // Draw
  background(50);

  var fidget_to_show_next = [fidgets_to_show[0],fidgets_to_show[1]]
  //console.log(fidgets_to_show)
  for( let i = 0; i < fidgets_to_show.length; i++ )
  {
    let iF = fidgets_to_show[i]
    if( iF == null )
      continue
    if( iF < 0 )
      continue      
    fidgets[iF].update()
    fidgets[iF].show()
    fidgets[iF].mouse_select_highlight(mouseConstraint)
    fidgets[iF].state.phase_last = fidgets[iF].state.phase
    
    if((i==0)&&( fidgets[iF].state.phase == 4 ))
    {
      fidget_to_show_next[1] = iF
      fidget_to_show_next[0] = iF-1
    }
  }
  fidgets_to_show = fidget_to_show_next


  if( pM != null )
    circle(pM.x,pM.y,10)

  if(debug)
    draw_debug.draw()

  

  
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
