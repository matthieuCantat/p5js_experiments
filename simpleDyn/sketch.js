class Triangle{

  constructor( canvas )
  {
    this.coords     = createVector(random(0, simulationArea[0]),
                                   random(0, simulationArea[1]));
    this.orient     = 0;
    
    this.momentum   = createVector(0, 0);
    this.momentumA  = 0;
    
    this.size        = 20.0
    
    this.sizeStroke  = 1;
    this.color       = [170,170,170,250]
    this.colorStroke = [0,0,0,250]
    this.colorLineDir = [170,0,0,250]
    
    this.canvas      = canvas  
  }

  draw()
  {  
    stroke(this.colorStroke[0], 
           this.colorStroke[1], 
           this.colorStroke[2],
           this.colorStroke[3]);
    
    strokeWeight(this.sizeStroke); 
    
    fill(color(this.color[0], 
               this.color[1], 
               this.color[2],
               this.color[3]));
    
    //DRAW SHAPE
    circle(this.coords.x, this.coords.y, this.size*2) 
    
    let vOrient = createVector(  cos(this.orient)* this.size  , sin(this.orient) * this.size    ) 
    
    stroke(this.colorLineDir[0], 
               this.colorLineDir[1], 
               this.colorLineDir[2],
               this.colorLineDir[3]);
        
    line(this.coords.x, this.coords.y, this.coords.x + vOrient.x, this.coords.y + vOrient.y ) 
  }
  
}


class MouseCircle{

  constructor( canvas )
  {
    this.coords     = createVector(0,0);
    this.size        = 30.0
    this.color       = [100,170,100,100]
    this.colorStroke = [170,170,170,250]
    this.canvas      = canvas  
  }

  draw()
  {
    
    stroke(this.colorStroke[0], 
           this.colorStroke[1], 
           this.colorStroke[2],
           this.colorStroke[3]);
    strokeWeight(0); 
    fill(color(this.color[0], 
               this.color[1], 
               this.color[2],
               this.color[3]));
    
    //DRAW SHAPE
    circle(this.coords.x, this.coords.y, this.size*2)   

  }
  
}






class Solver{

  constructor( objs , userObj, canvas )
  {
    this.objs         = objs;
    this.userObj      = userObj
    
    this.friction = gFriction;
    this.attract  = target_attract
    this.attractA = target_attractA 
  }
  
  solve()
  {
    this.userObj.coords = createVector( mouseX , mouseY ) 
    
    //BASE FORCES
    var i;
    for( i = 0 ; i < this.objs.length ; i++ )
    {   

 


      //________________________________________________________________________ORIENT
      //ORIENT - GET MOMENTUM
      let mA = this.objs[i].momentumA;   
      //ORIENT - GET FRICTION      
      let fA = mA *-1 * this.friction;  
  
      //ORIENT - ADD FORCES
      let o = this.objs[i].orient  
      
      o += mA;
      o += fA;

         
      let vAttractA = p5.Vector.sub( this.userObj.coords , this.objs[i].coords )
      let vOrientA = createVector(  cos(o) , sin(o)     ) 
      let oA = vAttractA.angleBetween(vOrientA) * -1
      oA *= this.attractA
      o += oA 
   
      //ORIENT - SAVE MOMENTUM
      this.objs[i].momentumA = o - this.objs[i].orient ;

      //ORIENT - SET BACK     
      this.objs[i].orient = o;      
      
      //________________________________________________________________________POSITION
      //POS - GET MOMENTUM
      let vMomentum = createVector( this.objs[i].momentum.x , this.objs[i].momentum.y );   
      //POS - GET FRICTION
      let vFriction = createVector( this.objs[i].momentum.x , this.objs[i].momentum.y );  
      vFriction.mult(-1);
      vFriction.mult(this.friction)

      //POS - ADD FORCES 
      let p = createVector( this.objs[i].coords.x , this.objs[i].coords.y );  
      
      p.add(vMomentum);        
      p.add(vFriction);
      
      let attractDist = p5.Vector.sub( p , this.userObj.coords ).mag()
      if( this.objs[i].size + this.userObj.size  < attractDist )
        {
          let vAttract = p5.Vector.sub( this.userObj.coords , this.objs[i].coords )
          vAttract.mult(this.attract)
                      
          p.add(vAttract);           
        }
    
      //POS - SAVE MOMENTUM
      this.objs[i].momentum = p5.Vector.sub( p , this.objs[i].coords );
      
      //POS - SET BACK     
      this.objs[i].coords = p;     
      
    }    
  }
  
  draw()
  { 
    this.userObj.draw();
    var i;  
    for( i = 0 ; i < this.objs.length ; i++ )
      this.objs[i].draw();    
  }
  
}

/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

//LAYOUT
var canvasSize     = [500, 500]
var simulationArea = [500, 500]
var canvasSizeDefault = [500, 500]

//ENVIRONNEMENT
var gFriction = 0.05;

//INDIVIDUAL PARAM
var agentNbr = 1;
var speedLimit = 1000;

var target_attract  = 0.01

var target_attractA = 0.01 

var onlyFrontDriving = true

//UTILS
var cSolver;

/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////


function setup() {
  //LAYOUT
  createCanvas(canvasSize[0], canvasSize[1]);
  
  mCircle = new MouseCircle(simulationArea);
  
  Triangles = [];
  var i;
  for( i = 0 ; i < agentNbr ; i++ )
  {
    let newTriangle = new Triangle(simulationArea);   
    Triangles.push( newTriangle );  
  }
  
  cSolver = new Solver(Triangles,mCircle, simulationArea);    
  //noLoop();
}


function draw() {
  
  background(100);
  cSolver.solve();
  cSolver.draw();
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


