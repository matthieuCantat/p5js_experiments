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




var debug = true
let width       = 400
let height      = 400
var c = {x:200, y:200 }
var scale_coef = 2.2
var ground_enable = false

var fidgets = []
var draw_debug = null

var fidgets_nbr = 1
var fidgets_to_show = [fidgets_nbr-1,null]

var chrono = null

function setup() {

  Matter.Composite.add(engine.world, create_boundary_wall_collision(width,height,ground_enable));

  var runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);

  createCanvas(width, height);

  engine.gravity.scale = 0.0

  // Build Custom
  for( let i = 0; i < fidgets_nbr; i++)
  {
    var fidget = new fidget_windmill(c,scale_coef,debug)
    fidget.force_way = 1
    fidgets.push(fidget)
  
    if( draw_debug == null)
    {
      draw_debug = new Draw_debug()
      draw_debug.fidget = fidget
      draw_debug.mouse_cns = mouseConstraint
    }
  }

  chrono = new Chrono()
  chrono.start()
  
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

  background(50);
  
  c1 = color(10,10,10);
  c2 = color(10,10,10);
  c3 = color(80,80,100);
  let middle_height = height/2
  
  for(let y=0; y<middle_height; y++){
    n = map(y ,0,middle_height,0,1);
    let newc = lerpColor(c1,c2,n);
    stroke(newc);
    line(0,y,width, y);
  }
  for(let y=middle_height; y<height; y++){
    n = map(y,middle_height,height,0,1);
    let newc = lerpColor(c2,c3,n);
    stroke(newc);
    line(0,y,width, y);
  }
  

  var fidget_to_show_next = [fidgets_to_show[0],fidgets_to_show[1]]
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
    
    
    if((i==0)&&( fidgets[iF].state.resolution_coef == 4 ))
    {
      fidget_to_show_next[1] = iF
      fidget_to_show_next[0] = iF-1
    }
  }
  fidgets_to_show = fidget_to_show_next

  

  var p_chrono = createVector(0, 0)
  var s_chrono = 0
  

  if(fidgets_to_show[0] < 0 )
  {
    var a = min(1,max(0,end_update_count / 100))
    chrono.stop()
    let blendA = (0.1*(1-a)+0.5*a)
    let blendB = (0.05*(1-a)+0.07*a)
    p_chrono = createVector(width * 0.5, height * blendA )
    s_chrono = width * blendB

    end_update_count += 1
  }
  else
  {
    p_chrono = createVector(width * 0.5, height * 0.1)
    s_chrono = width * 0.05
    end_update_count = 0

  }
  chrono.update()
  chrono.draw(p_chrono, s_chrono)

  
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
