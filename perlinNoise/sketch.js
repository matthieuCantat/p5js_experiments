let cols;
let rows;

var canvasSize        = [ 800.0 , 800.0 ]
var canvasSizeDefault = [ 800.0 , 800.0 ]
let scl    = 20;
let r_incr = 0.3
let t_incr = 0.01;
let zOff   = 0.0;

let particles = [];
let particles_nbr = 1000;
let field_accel_mag = 0.05;
let particle_max_speed = 1.0;
let particles_size = 1.0

let draw_clean           = true
let draw_clean_each_eval = false
let draw_particles     = true
let draw_field_arrows = false
let draw_field_zones  = false
let draw_field_colors = false


let flowField;


function init()
{
  //draw_clean = true
  background(255/2);
  
  
  cols = int( canvasSize[0] / scl );
  rows = int( canvasSize[1] /scl );
  zOff   = 0.0;
  
  flowField = new Array( cols* rows )
  particles = [];
  for( var p = 0 ; p < particles_nbr ; p++ )
    particles.push( new particle(canvasSize[0] , canvasSize[1]) )  
}



function setup() {
  createCanvas(canvasSize[0], canvasSize[1]);
  init();
}



function draw() {
  
  if( draw_clean_each_eval )
    background(255/2);

   if( draw_clean) 
     {
       background(255/2);
       draw_clean = false
     }
      
  var xOff = 0;
  var step = 0;
  for( var x = 0 ; x < rows ; x++ )
  {
      var yOff = 0;
      
      for( var y = 0 ; y < cols ; y++)
      {
          var r = noise(yOff,xOff,zOff);        
          
          fill(r*255)
          stroke(0, 0, 0);
        
          if(draw_field_zones)
            square( x*scl ,y*scl,scl);
        
          stroke(255, 204, 0);
          strokeWeight(4);
          var v = createVector( scl/2 , 0 )
          var p = createVector( x*scl + scl/2 , y*scl + scl/2 )
          v.rotate(r*PI*4)
          
          if(draw_field_arrows)
            line( p.x , p.y,  p.x + v.x , p.y + v.y );
        
          yOff += r_incr;
        
          flowField[step] = v;
          step++
      }
      xOff += r_incr
  }
  
  zOff += t_incr;

  if( draw_particles )
  {
    for( var p = 0 ; p < particles.length ; p++ )
    {

      particles[p].edges()
      
      var i_row    = floor( particles[p].pos.x / scl )
      var i_column = floor( particles[p].pos.y / scl )
      var v_found  = flowField[i_column*cols+i_row]
      v_found.setMag(field_accel_mag);
      
      
      particles[p].applyForce( v_found );
      particles[p].udpate( particle_max_speed );
      
      var vColor = createVector( (sin( zOff*1.2 ) + 1)/2 * 255 , (sin( zOff*1.3 ) + 1)/2 * 255 , (sin( zOff*1.4 ) + 1)/2 * 255)
      particles[p].show(vColor,particles_size);  
    }
          
  }

}






function mousePressed() {
  print( 'mousePressed');
  touchStarted();
}



//FOR MOBILE PHONE

/* fullscreen() must be called in a touch or
 * mouse event to work!
 */
function touchStarted () {
  
  var fs = fullscreen();
  if (!fs) {
    fullscreen(true);
  }
}

/* full screening will change the size of the canvas */
function windowResized() {
  
  if( ( canvasSize[0] != windowWidth )&&( canvasSize[1] != windowHeight ))
  {
    canvasSize[0] = windowWidth;
    canvasSize[1] = windowHeight;
    
    resizeCanvas(windowWidth, windowHeight);
    init();
  }
  else
  {
    canvasSize[0] = canvasSizeDefault[0];
    canvasSize[1] = canvasSizeDefault[1];
    
    resizeCanvas(canvasSizeDefault[0] , canvasSizeDefault[1] );
    init();
  }

  
}

/* prevents the mobile browser from processing some default
 * touch events, like swiping left for "back" or scrolling
 * the page.
 */
document.ontouchmove = function(event) {
    event.preventDefault();
};



