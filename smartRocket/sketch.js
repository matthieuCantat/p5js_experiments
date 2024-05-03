


class rocket
{
  constructor( canvas_size )
  {
    this.pos = createVector(canvas_size[0]/2.0,canvas_size[1])
    this.vel = createVector(0,-0.1)
    this.acc = createVector(0,0)
    
    this.size = 20.0;
    this.acc_sequence_length = 200
    this.acc_sequence_limits = [-0.1,0.1]
    this.acc_sequence = []
    this.fitness = 0;
    for( var i = 0 ; i < this.acc_sequence_length ; i++ )
      this.acc_sequence.push( createVector( random(this.acc_sequence_limits[0],this.acc_sequence_limits[1]),
                                           random(this.acc_sequence_limits[0],this.acc_sequence_limits[1])) )
  }
  reset()
  {
    this.pos = createVector(canvas_size[0]/2.0,canvas_size[1])
    this.vel = createVector(0,-0.1)
    this.acc = createVector(0,0)    
  }
  
  udpate( max_speed )
  {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);    
    
    if( max_speed < this.vel.mag() )
      this.vel.setMag(max_speed);
  }

  applyForce( force )
  {
    this.acc.add( force );  
  }

  applySequence( time )
  {
    if( time < this.acc_sequence_length  )
      this.acc.add( this.acc_sequence[time] );  
  }  
  
  draw()
  {
    var orient = createVector( this.vel.x , this.vel.y )
    orient.normalize()
    var orientSide = createVector( orient.x , orient.y ) 
    orientSide.rotate(PI/2.0)
    orientSide.mult(0.2)
    
    orient.mult(this.size)
    orientSide.mult(this.size)
    
    var pA = createVector( this.pos.x + orient.x + orientSide.x , this.pos.y + orient.y + orientSide.y )
    var pB = createVector( this.pos.x + orient.x - orientSide.x , this.pos.y + orient.y - orientSide.y )
    var pC = createVector( this.pos.x - orient.x - orientSide.x , this.pos.y - orient.y - orientSide.y )
    var pD = createVector( this.pos.x - orient.x + orientSide.x , this.pos.y - orient.y + orientSide.y )
    
    
    quad(pA.x, pA.y, pB.x, pB.y, pC.x, pC.y, pD.x, pD.y)
    
  }
  
  
  
}


 
  
function rockets_mutation()
{
  
  for( i = 0 ; i < rockets_nbr ; i++ )
  {
    for( j = 0 ; j < rockets[i].acc_sequence.length ; j++ )
    {
      if( random(0.0,1.0) < 0.2 )
        rockets[i].acc_sequence[j] = createVector(random(rockets[i].acc_sequence_limits[0],rockets[i].acc_sequence_limits[1]),
                                                   random(rockets[i].acc_sequence_limits[0],rockets[i].acc_sequence_limits[1]))     
    }
  }  
  
}  
  
  
function rockets_fitness( target )
{
  
  var dists = []
  var maxDist = 0.0
  for( var i = 0 ; i < rockets_nbr ; i++ )
  {
    var vDiff = createVector( target.x-rockets[i].pos.x , target.y-rockets[i].pos.y );
    dists.push( vDiff.mag()  )
    if( maxDist < vDiff.mag() )
      maxDist = vDiff.mag() 
  }
  
  for( i = 0 ; i < rockets_nbr ; i++ )
  {
    rockets[i].fitness =  1.0 - (dists[i]/maxDist)*(dists[i]/maxDist) ;
  }  
  
}  
  


function rockets_crossOver()
{
  var mating_pool = []
  var i = 0;
  var j = 0;
  for( i = 0 ; i < rockets_nbr ; i++ )
  {
    for( j = 0 ; j < floor( rockets[i].fitness*10 ) ; j++ )
        mating_pool.push( rockets[i] );
  }
  
  var nextGen = []
  for( i = 0 ; i < rockets_nbr ; i++ )
  {
    var parentA = mating_pool[floor(random(0,mating_pool.length))]
    var parentB = mating_pool[floor(random(0,mating_pool.length))]
    
    var new_rocket = new rocket( canvas_size )

    for(  j = 0 ; j < new_rocket.acc_sequence.length ; j++ )
    {
      if(  j%2 == 0 )
      {
        new_rocket.acc_sequence[j] = parentA.acc_sequence[j]  
      }
      else
      {
        new_rocket.acc_sequence[j] = parentB.acc_sequence[j]              
      }

    }
    
    nextGen.push( new_rocket );
  }  
  
  return nextGen
}

function init()
{
  createCanvas(canvas_size[0], canvas_size[1]);
  
  for( var i = 0 ; i < rockets_nbr ; i++ )
  {
      rockets.push( new rocket( canvas_size ) );
  }

  target = createVector(canvas_size[0]/2.0,10)  
}

function setup() {
  init()
}



var canvas_size = [400, 400]
var canvasSizeDefault = [400, 400]
var rockets = [];
var rockets_nbr = 100;
var time = 0;
var generation = 0;
var target;

function setup() {
  createCanvas(canvas_size[0], canvas_size[1]);
  
  for( var i = 0 ; i < rockets_nbr ; i++ )
  {
      rockets.push( new rocket( canvas_size ) );
  }

  target = createVector(canvas_size[0]/2.0,100)
}

function draw() {
  background(220);
  
  
  textSize(20);
  text('time       :  ' + time, 10, 30);
  text('generation :  ' + generation, 10, 50);  
  
  for( var i = 0 ; i < rockets_nbr ; i++ )
  {
      rockets[i].applySequence( time )
      rockets[i].udpate(5);
      rockets[i].draw();
  }  
  
  circle( target.x , target.y , 20.0)
  
  if( 200 < time )
  {
    
    rockets_fitness( target )

    rockets = rockets_crossOver()
    //rockets_mutation()

    
    
    time = 0
    generation += 2
      
  }
  
  
  time += 1;

}





//FOR MOBILE PHONE

/* fullscreen() must be called in a touch or
 * mouse event to work!
 */



function mousePressed() {
  print( 'mousePressed');
  touchStarted();
}


function touchStarted () {
  
  var fs = fullscreen();
  if (!fs) {
    fullscreen(true);
  }
}

/* full screening will change the size of the canvas */
function windowResized() {
  
  if( ( canvas_size[0] != windowWidth )&&( canvas_size[1] != windowHeight ))
  {
    canvas_size[0] = windowWidth;
    canvas_size[1] = windowHeight;
    
    resizeCanvas(windowWidth, windowHeight);
    init();
  }
  else
  {
    canvas_size[0] = canvasSizeDefault[0];
    canvas_size[1] = canvasSizeDefault[1];
    
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

