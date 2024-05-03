class Bubble{

  constructor( canvas )
  {
    this.coords     = createVector(0, 0);
    this.speed      = createVector(0, 0);
    this.momentum   = createVector(0, 0);

    this.ray      = 100
    this.color    = [250,250,250,100]
    this.shapeStroke = [4]
    this.colorStroke = [250,250,250,250] 
    this.canvas = canvas
  }

  draw()
  {
    stroke(this.colorStroke[0], 
           this.colorStroke[1], 
           this.colorStroke[2],
           this.colorStroke[3]);
    strokeWeight(this.shapeStroke[0]); 
    fill(color(this.color[0], 
               this.color[1], 
               this.color[2],
               this.color[3]));
    circle(this.coords.x, this.coords.y , this.ray*2);  
    
    stroke(255,0,0,255);
    strokeWeight(this.shapeStroke[0]*2); 
    let speedO = this.coords;  
    line(this.coords.x, this.coords.y, 
         this.coords.x + this.speed.x, 
         this.coords.y + this.speed.y)

    stroke(0,255,0,255); 
    strokeWeight(this.shapeStroke[0]); 
    line(this.coords.x, this.coords.y, 
         this.coords.x + this.momentum.x, 
         this.coords.y + this.momentum.y)    
    
  }
  
  isCoordsInside(coords)
  {
    let vDelta = p5.Vector.sub(coords,this.coords);
    if( vDelta.mag() < this.ray ) return true;
    else                          return false; 
  }
  
  isBubbleInside( bubble )
  {
    let vDelta = p5.Vector.sub(this.coords, bubble.coords);
    let minValue = this.ray + bubble.ray;
    
    if( vDelta.mag() < minValue ) return true;
    else                          return false; 
  }
  
  isOutCancas()
  {
    let boundingBox = this.getBoundingBox();

    if( boundingBox[0] < 0 )                   return 1;
    else if( boundingBox[1] < 0 )              return 2;      
    else if( this.canvas[0] < boundingBox[2] ) return 3;
    else if( this.canvas[1] < boundingBox[3] ) return 4;      
    else                                       return 0;
  
  }  
  
  getBoundingBox()
  {
    let minCoords = [this.coords.x-this.ray,
                     this.coords.y-this.ray ]; 
    let maxCoords = [this.coords.x+this.ray,
                     this.coords.y+this.ray ];
    let boundingBox = [ minCoords[0] , minCoords[1] ,
                        maxCoords[0] , maxCoords[1] ] ;
    return boundingBox
  }
  
  randomCoords()
  {
    this.coords.x = random(0+this.ray,canvasSize[0]-this.ray);
    this.coords.y = random(0+this.ray,canvasSize[1]-this.ray);
    this.coordsLast = this.coords;
  }

  randomSpeed(speedMax)
  {
    this.momentum.x = random(-speedMax,speedMax);
    this.momentum.y = random(-speedMax,speedMax);
  }
  
  randomColor()
  {
    var i;
    for(i=0;i<3;i++)
    {
      this.color[i] = random(0,255);      
    }
  }  
  randomShape(min,max)
  {
    this.ray = random(min,max)
  }  
  
}



class Solver{

  constructor( objs , canvas )
  {
   this.objs         = objs;
   this.canvas       = canvas;
   this.friction     = gFriction;
   this.vDown        = createVector(0,1,0);
   this.gravity      = gGravity;
   this.iSelected    = -1;
   this.lastMousePos = null;
  }
  
  checkInteraction()
  {
    var mouseCoords = createVector( mouseX , mouseY ) 
    var i;
    for( i = 0 ; i < this.objs.length ; i++ )
    {      
      //INTERACTION 
      if(mouseIsPressed)
      {
        if(this.objs[i].isCoordsInside(mouseCoords) )
        {
          if(this.objSelected == null ) 
            this.iSelected = i; 
          this.lastMousePos = null;
        }  
        else
        {
          if((this.lastMousePos == null )&&(this.iSelected == -1 ))
            this.lastMousePos = mouseCoords;
        }
      }
      else
      {
        this.iSelected = -1;
        
        if(this.lastMousePos != null )
        {
          var vValue = p5.Vector.add(mouseCoords,this.lastMousePos);
          var gValue = createVector(0,1);
          vValue.normalize();
          
          strokeWeight(10); 
          line(this.lastMousePos.x, this.lastMousePos.y,mouseCoords.x, mouseCoords.y);

          if( 0 < p5.Vector.dot(vValue, gValue)  )
          {
            var yValue = mouseCoords.y - this.lastMousePos.y;
            if( yValue < 0 ) yValue = 0 ;
            this.gravity = yValue /30; 
          }
          this.lastMousePos = null;                         
        }    
      }
      
      
    }      
  }
  
  
  solve()
  {
    var mouseCoords = createVector( mouseX , mouseY ) 
    
    //BASE FORCES
    var i;
    for( i = 0 ; i < this.objs.length ; i++ )
    {
      //GET MOMENTUM
      let vMomentum = createVector( this.objs[i].momentum.x , this.objs[i].momentum.y );   
      //GET FRICTION
      let vFriction = createVector( this.objs[i].momentum.x , this.objs[i].momentum.y );  
      vFriction.mult(-1);
      vFriction.mult(this.friction)
      //GET GRAVITY      
      let vGravity = createVector( this.vDown.x , this.vDown.y );
      vGravity.mult(this.gravity);

      //ADD FORCES 
      let p = createVector( this.objs[i].coords.x , this.objs[i].coords.y );      
      p.add(vMomentum);        
      p.add(vFriction);
      p.add(vGravity);
      
      //ADD INTERACTION
      if( i == this.iSelected )
        p = mouseCoords;
      
      //SAVE MOMENTUM
      this.objs[i].momentum = p5.Vector.sub( p , this.objs[i].coords );
      
      //SET POSITION      
      this.objs[i].coords = p;
    }
    

    var marge = 0;

    for( i = 0 ; i < this.objs.length ; i++ )
    {
      if( this.objs[i].isOutCancas() == 1 )
      {
        this.objs[i].momentum.x *= -1;
        this.objs[i].coords.x =  this.objs[i].ray ; 
      }
      
      if( this.objs[i].isOutCancas() == 2 )
      {
        this.objs[i].momentum.y *= -1;  
        this.objs[i].coords.y = this.objs[i].ray ; 
      }
      
      if( this.objs[i].isOutCancas() == 3 )
      {
        this.objs[i].momentum.x *= -1;
        this.objs[i].coords.x = this.objs[i].canvas[0] - this.objs[i].ray  ; 
      }
      
      if( this.objs[i].isOutCancas() == 4 )
      {
        this.objs[i].momentum.y *= -1;  
        this.objs[i].coords.y =  this.objs[i].canvas[1] - this.objs[i].ray ;  
      }      
    }       


    for( i = 0 ; i < this.objs.length ; i++ )
    {
      var j;
      for( j = 0 ; j < this.objs.length ; j++ )
      {
        if( i != j )
        {
          if( this.objs[i].isBubbleInside(this.objs[j]) )
          {
            //ENERGY EXCHANGE
            let energyIRatio  = this.objs[i].ray / ( this.objs[i].ray + this.objs[j].ray );
            let energyJRatio  = this.objs[j].ray / ( this.objs[i].ray + this.objs[j].ray );    

            let totalMomentumEnergy  = this.objs[i].momentum.mag() + this.objs[j].momentum.mag() ; 

            let energyMomentumI = totalMomentumEnergy * energyIRatio;
            let energyMomentumJ = totalMomentumEnergy * energyJRatio;  

            //MODIF COORDS
            let vIJ = p5.Vector.sub(this.objs[i].coords,this.objs[j].coords);         
            let distToAdd = this.objs[i].ray + this.objs[j].ray - vIJ.mag();

            let vJI = p5.Vector.mult(vIJ ,-1);

            vIJ.normalize()
            vJI.normalize()
            vIJ.mult( distToAdd * energyIRatio );
            vJI.mult( distToAdd * energyJRatio );

            this.objs[i].coords = p5.Vector.add(this.objs[i].coords,vIJ);
            this.objs[j].coords = p5.Vector.add(this.objs[j].coords,vJI);

            //MODIF SPEED
            this.objs[i].speed = vIJ;
            this.objs[j].speed = vJI;

            //MODIF MOMENTUM
            vIJ.normalize();
            vJI.normalize();

            this.objs[i].momentum = p5.Vector.mult( vIJ , energyMomentumI);
            this.objs[j].momentum = p5.Vector.mult( vJI , energyMomentumJ);
          }
        }
      }    
    }
        
    
  }
  
  draw()
  { 
    var i;
    for( i = 0 ; i < this.objs.length ; i++ )
      this.objs[i].draw();    
  }
}



function mouseWheel(event) {
  var indexInside = -1;
  //SIZE
  var mouseCoords = createVector( mouseX , mouseY ) 
    
  var i;
  for( i = 0 ; i < cSolver.objs.length ; i++ )
  {
    if(cSolver.objs[i].isCoordsInside(mouseCoords))
      indexInside = i;      
  }

  //FRICTION
  if( indexInside == -1 )
  {
    cSolver.friction -= event.delta*0.003;
    if(     cSolver.friction < 0     ) cSolver.friction = 0;
    if( 1 < cSolver.friction         ) cSolver.friction = 1;    
  }
  else
  {
    cSolver.objs[indexInside].ray -= event.delta;     
  }

  

  
}



function keyPressed() {
  print(keyCode)
  if (keyCode == 32)
  {
    var mouseCoords = createVector( mouseX , mouseY )
    let newBubble = new Bubble(canvasSize);
    newBubble.randomShape(shapeLimit[0],shapeLimit[1]);    
    newBubble.randomColor();
    newBubble.randomSpeed(speedLimit); 
    newBubble.coords = mouseCoords;
    cSolver.objs.push( newBubble ); 
  }


}




var canvasSize = [400, 400]
var canvasSizeDefault = [400, 400]
var bubblesNbr = 10;
var shapeLimit = [10,30];
var speedLimit = 5;

var gGravity = 0.1;
var gFriction = 0.01;

var cSolver;


function setup() {
  createCanvas(canvasSize[0], canvasSize[1]);
  
  bubbles = [];
  var i;
  for( i = 0 ; i < bubblesNbr ; i++ )
  {
    let newBubble = new Bubble(canvasSize);
    newBubble.randomShape(shapeLimit[0],shapeLimit[1]);    
    newBubble.randomCoords();
    newBubble.randomColor();
    newBubble.randomSpeed(speedLimit);
    bubbles.push( newBubble );  
  }
  cSolver = new Solver(bubbles,canvasSize);  
  
  //noLoop();
}



function draw() {
  
  background(100);
  
  var mouseCoords = createVector( mouseX , mouseY )
 
  var i;  
  for( i = 0 ; i < cSolver.objs.length ; i++ )
  {
    if(cSolver.objs[i].isCoordsInside(mouseCoords) )cSolver.objs[i].color[3] = 255;         
    else                                            cSolver.objs[i].color[3] = 100;           
  }
  
  
  cSolver.checkInteraction();
  cSolver.solve();  
  cSolver.draw();
  

  let sText = 15;
  let hText = 30;
  strokeWeight(0);   
  textSize(sText);
  fill(255, 255, 255);
  text('nbr:       ' + cSolver.objs.length , 15 , hText);
  text('gravity:   ' + cSolver.gravity , 15 , hText +=sText);
  text('friction:  ' + cSolver.friction , 15 , hText +=sText);  
  text('frameRate: ' + frameRate() , 15 , hText +=sText);  


}

/*

function mousePressed() {
   redraw();
 }

*/



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
