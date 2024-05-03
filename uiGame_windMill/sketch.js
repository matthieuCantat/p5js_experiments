
let canvas_size    = [500,500];
let canvasSizeDefault =  [500,500];
let size = 30;

class Anim
{
  constructor( values , times , attract)
  {
    this.active = false;
    this.hasHappended = false;
    this.current_start = -1;
    
    this.values  = values;
    this.times   = times; 
    
    this.duration   = this.times[this.times.length-1] - this.times[0] ;
    
    this.times_normalize = []
    for( var i = 0 ; i < this.times.length ; i++ )
      this.times_normalize.push(  this.times[i]  / this.duration );
    
    this.valueTarget = this.values[0]
    this.pos = this.values[0]
    this.vel = 0.0
    this.acc = 0.0

    
    this.friction = 0.1
    this.attract = attract

  }
  
  getValue()
  {
    if( this.active == true)
      {
        var animationTime = ( frameCount - this.current_start )/this.duration;
        
        if( 1.0 < animationTime )
          {
            this.active = false;
            this.hasHappended = true;
          }
        else
          {

            for( var i = 0 ; i < this.values.length -1 ; i++ )
              {
                if(( this.times_normalize[i] < animationTime )&&( animationTime <= this.times_normalize[i+1] ) )
                  {
                    let interp = (animationTime - this.times_normalize[i]) / ( this.times_normalize[i+1] - this.times_normalize[i] ) ;
                    this.valueTarget = interp * this.values[i+1] + (1-interp)*this.values[i];  
                  }
              }   
          }
      } 
    

    let posLast = this.pos;

    //UPDATE
    this.pos += this.acc*( 1.0 - this.friction );

    let vAttract = this.valueTarget - this.pos ;
    vAttract *= this.attract ;    
    this.pos += vAttract;
    
    this.acc = this.pos - posLast;    
      
    return this.pos
  }
  
  trigger()
  {
    this.active = true;
    this.current_start = frameCount;
  }
}



class Dyn
{
  constructor( attract , min , max)
  {
    this.valueTarget = 0
    this.pos = 0
    this.vel = 0.0
    this.acc = 0.0

    
    this.friction = 0.1
    this.attract = attract
    this.min = min
    this.max = max
  }
  
  getValue( pos )
  {
  
    this.valueTarget = pos
    let posLast = this.pos;

    //UPDATE
    this.pos += this.acc*( 1.0 - this.friction );

    let vAttract = this.valueTarget - this.pos ;
    vAttract *= this.attract ;    
    this.pos += vAttract;
    
    this.pos = min( this.max , max(this.min , this.pos ) )
    
    
    this.acc = this.pos - posLast;    
      
    return this.pos
  }
  
}


function getRotationFromVector( pRot , pApply , v )
{
  angleMode(RADIANS)
  
  var vRay = createVector( pApply.x - pRot.x, pApply.y - pRot.y )
  
  var dOpposite = sin( vRay.angleBetween(v) ) * v.mag();
  return asin( dOpposite / p5.Vector.add( vRay , v ).mag() )
  
}


let aExpandCircle     = new Anim( [ 25, 30 ,15 ] , [ 0 , 5 ,7 ] , 0.1);

let tOffset = 5;
let aExpandRectangle  = new Anim( [ 25 ,25, 10 ,50.0 ] , [ 0 ,0+5 , 3+5 ,7+5 ] , 0.01);
let aRot  = new Dyn( 0.01 ,0 , 3.14 * 0.5 );

let aExpandRectangleB  = new Anim( [ 25 ,25, 10 ,30.0 ] , [ 0 ,0+5 , 3+5 ,7+5 ] , 0.01);

function setup() {
  createCanvas(canvas_size[0], canvas_size[1]);
  

  
}

var rot = 0
var rotDyn = 0;
var pos = 0

var mouseFirstPos   = null
var mouseHistory    = []
var mouseHitHistory = []
var traceFrameCount = 6

var phaseA = [ false , false ]
var phaseB = [ false , false ]
var phaseC = [ false , false ]

function draw() {
  background(220);
  let pMiddle = createVector( canvas_size[0]/2 , canvas_size[1]/2)
  
  var mPrev = createVector( pmouseX , pmouseY ) 
  var vDelta = createVector( mouseX-pmouseX , mouseY-pmouseY ) 
  
  //circle(pMiddle.x, pMiddle.y , size);
  
  //////////////////////////////////////////////
  
  let c = color(255, 204, 0);
  fill(c);  
  
  var mouseVector = createVector(0,0)
  if( mouseIsPressed )
  {
    mouseHistory.push( createVector( pmouseX , pmouseY , 20 ) )    
  }
  else if( 0 < mouseHistory.length )
  {
    if(  mouseHistory.length < traceFrameCount )
    {
      print('BUTTON MODE')
      mouseHitHistory.push( mouseHistory[0] )
    }
    else
    {
      print('VECTOR MODE')
      var pA = mouseHistory[0]
      var pB = mouseHistory[mouseHistory.length-1]
      
      mouseFirstPos = pA
      mouseVector = p5.Vector.sub(pB,pA)
      var vSide = createVector( mouseVector.y, -mouseVector.x)
      vSide.setMag(10)
      triangle( pA.x+vSide.x, pA.y+vSide.y, pA.x-vSide.x, pA.y-vSide.y, pB.x, pB.y)
    }
    mouseHistory = []
  }

  if( 2 < mouseHistory.length )
  {
    for( var i = 0 ; i < mouseHistory.length - 1 ;i++)
      line(mouseHistory[i].x, mouseHistory[i].y, mouseHistory[i+1].x, mouseHistory[i+1].y)    
  }

  for(  var j = 0 ; j < mouseHitHistory.length ;j++)
  {
    circle( mouseHitHistory[j].x, mouseHitHistory[j].y , mouseHitHistory[j].z);  
    mouseHitHistory[j].z -= 1.0;
    mouseHitHistory[j].z = max( mouseHitHistory[j].z , 0 )
  }

  c = color(255, 255, 255);
  fill(c);  
  
  //////////////////////////////////////////////


  
  textSize(32);
  if( ( phaseB[0] == false)&&( phaseB[1] == true) )
  {
    text('phaseC', 10, 30);
    pos += mouseVector.x; 
    
    if( pos < -40 )
      pos = max( -40, pos )
    else if( 1 < pos )
    {
      pos = min( 1, pos )
      phaseB = [ false , false ]
    }
      
    
  }
  else if( ( phaseA[0] == false)&&( phaseA[1] == true) ) //( rotDyn < PI*0.5 -0.01 )
  {
    text('phaseB', 10, 30);
    
    if( 1 < mouseHistory.length )
    {
      var vMouseDelta = p5.Vector.sub( mouseHistory[ mouseHistory.length -1 ] , mouseHistory[mouseHistory.length -2] )
      if( 0.01 < vMouseDelta.mag() )
        rot += getRotationFromVector( pMiddle , mouseHistory[0] , vMouseDelta );
            
    }
    
    if( PI*0.5 -0.01 < rotDyn )
      phaseB = [ false , true ]

  }
  else
  {
    text('phaseA', 10, 30);
      
    var vM = createVector(mouseX,mouseY);
    let pMiddle = createVector( canvas_size[0]/2 , canvas_size[1]/2)
    if( p5.Vector.sub(vM , pMiddle).mag() < 20 ) 
    {
      aExpandRectangle.trigger();
      aExpandCircle.trigger(); 
    }  
    phaseA[0] = aExpandRectangle.active
    phaseA[1] = aExpandRectangle.hasHappended

        
  }



  rotDyn =  aRot.getValue(rot)

   
    rectMode(CENTER);
  
    let w = 0.25;
    let h = 1.4;

    let x = 1.5;
  
    let pMiddleOffset  = createVector( x * aExpandRectangle.getValue()  + pos    , x * aExpandRectangle.getValue() +pos );
    let pMiddleOffsetB = createVector( x * aExpandRectangleB.getValue() - rot*5  , x * aExpandRectangleB.getValue() - rot*5  );

  
    translate(pMiddle.x,pMiddle.y)
  
    circle(0, 0 , aExpandCircle.getValue() );
  
  
  
    rect(pMiddleOffset.x, 0, size* h, size*w);
    
    rotate(PI*-0.5+rotDyn);
    rect(pMiddleOffset.x, 0, size* h, size*w);

    rotate(PI*-0.5+rotDyn);
    rect(pMiddleOffset.x, 0, size* h, size*w);
  
    rotate(PI*-0.5+rotDyn);
    rect(pMiddleOffset.x, 0, size* h, size*w);

  
    var qA = createVector( pMiddleOffsetB.x      , 10 * (1- rot/(PI*0.5))    );
    var qB = createVector( pMiddleOffsetB.x + 10 , 10 * (1- rot/(PI*0.5))    );
    var qC = createVector( 10 * (1- rot/(PI*0.5))   , pMiddleOffsetB.y + 10);
    var qD = createVector( 10 * (1- rot/(PI*0.5))   , pMiddleOffsetB.y );
    quad(qA.x, qA.y, qB.x, qB.y , qC.x, qC.y, qD.x, qD.y );
    
    
    rotate(PI*-0.5);
    quad(qA.x, qA.y, qB.x, qB.y , qC.x, qC.y, qD.x, qD.y );
  
    rotate(PI*-0.5);
    quad(qA.x, qA.y, qB.x, qB.y , qC.x, qC.y, qD.x, qD.y );
  
    rotate(PI*-0.5);
    quad(qA.x, qA.y, qB.x, qB.y , qC.x, qC.y, qD.x, qD.y );
  

}

  

function mouseClicked()
{
  print('mouseClicked')
  var vM = createVector(mouseX,mouseY);
  let pMiddle = createVector( canvas_size[0]/2 , canvas_size[1]/2)
  if( p5.Vector.sub(vM , pMiddle).mag() < 20 ) 
    {
      aExpandRectangle.trigger();
      aExpandCircle.trigger();       
    }
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
    //init();
  }
  else
  {
    canvas_size[0] = canvasSizeDefault[0];
    canvas_size[1] = canvasSizeDefault[1];
    
    resizeCanvas(canvasSizeDefault[0] , canvasSizeDefault[1] );
    //init();
  }

  
}

/* prevents the mobile browser from processing some default
 * touch events, like swiping left for "back" or scrolling
 * the page.
 */
document.ontouchmove = function(event) {
    event.preventDefault();
};
