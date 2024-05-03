class Bubble{

  constructor( canvas )
  {
    this.coords     = createVector(0, 0);
    this.speed      = createVector(0, 0);
    this.momentum   = createVector(0, 0);
    
    this.speedMax = 1

    this.ray      = 100
    this.color    = [170,170,170,250]
    this.shapeStroke = [4]
    this.colorStroke = [200,250,250,250] 
    this.canvas = canvas
    
    this.colorInfected = [250,50,50,250]
    this.colorRecovered = [50,250,50,250]
    this.timeInfected  = 0
    this.timeToRecover = 700
    this.timeToDie     = 400
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
    circle(this.coords.x, this.coords.y , this.ray*2); 
    
    if( this.color == this.colorInfected )
      this.timeInfected += 1
    
    if( this.timeToRecover < this.timeInfected )
      this.color = this.colorRecovered
     
    
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

  randomSpeed()
  {
    this.momentum.x = random(-this.speedMax,this.speedMax);
    this.momentum.y = random(-this.speedMax,this.speedMax);
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


class QuadLine{

  constructor( coords )
  {
    this.coords     = coords;

    this.color    = [0,0,0,250]
    this.canvas = canvas
  }

  draw()
  {
    strokeWeight(0); 
    fill(color(this.color[0], 
               this.color[1], 
               this.color[2],
               this.color[3]));
    quad(this.coords[0],this.coords[1] , 
         this.coords[2],this.coords[3] , 
         this.coords[4],this.coords[5] , 
         this.coords[6],this.coords[7]  );    
     
    
  }
  
  getIntersectPoints( lineAA , lineAB )
  {
    
    
  }
  
  
  isIntersect(center , ray)
  {

    if( this.isCoordsInside(center) )
    {
      return true      
    }
    else
    {
      let closestPoint = this.getClosestPoint( center);
         
    
      let vTmp = createVector( closestPoint.x - center.x , closestPoint.y - center.y );
      let distTmp = vTmp.mag();
      if( distTmp < ray )
        return true
    }
    return false
  }
  
  isCoordsInside(coords)
  {
    var vPA = createVector(      coords.x-this.coords[0],      coords.y-this.coords[1] ) 
    var vBA = createVector(this.coords[2]-this.coords[0],this.coords[3]-this.coords[1] ) 
    var vDA = createVector(this.coords[6]-this.coords[0],this.coords[7]-this.coords[1] )  
    
    var vPC = createVector(      coords.x-this.coords[4],      coords.y-this.coords[5] ) 
    var vBC = createVector(this.coords[2]-this.coords[4],this.coords[3]-this.coords[5] )
    var vDC = createVector(this.coords[6]-this.coords[4],this.coords[7]-this.coords[5] )
    
    if( ( 0 < vPA.dot(vBA) )&&( 0 < vPA.dot(vDA) )&&( 0 < vPC.dot(vBC) )&&( 0 < vPC.dot(vDC) ) )
       return true
    
    return false
  }  
  
  getClosestPoint( point )
  {
   
    let pA = createVector( this.coords[0] , this.coords[1]  )
    let pB = createVector( this.coords[2] , this.coords[3]  )
    let pC = createVector( this.coords[4] , this.coords[5]  )
    let pD = createVector( this.coords[6] , this.coords[7]  )
    
    let pClosests = []
    pClosests.push( this.getClosestPointOnSegment( pA , pB , point) )
    pClosests.push( this.getClosestPointOnSegment( pB , pC , point) )
    pClosests.push( this.getClosestPointOnSegment( pC , pD , point) )
    pClosests.push( this.getClosestPointOnSegment( pD , pA , point) )
    
    
    let distancesMin = 99999999999999999999999999999999 ;
    let pClosest = null;
    var i;
    for( i = 0 ; i < pClosests.length ; i++ )
    {
       let vTmp = createVector( pClosests[i].x - point.x , pClosests[i].y - point.y ) 
       let distanceTmp = vTmp.mag();
        if( distanceTmp < distancesMin)
        {
          distancesMin = distanceTmp    
          pClosest = pClosests[i]
        }

    }
    
    return pClosest
  }
  
  getClosestPointOnSegment( pA , pB , p)
  {
    let vBA = createVector( pB.x - pA.x , pB.y - pA.y )
    let vPA = createVector( p.x - pA.x  , p.y - pA.y )
    let dot = p5.Vector.dot(vPA , vBA ) 
    
    let vAdd = createVector( vBA.x , vBA.y )
    vAdd.normalize()
    vAdd.mult(dot/ vBA.mag())
    let closestPoint = p5.Vector.add(pA,vAdd)

    let vCheckBA = createVector( pB.x - pA.x , pB.y - pA.y )    
    let vCheckCA = createVector( closestPoint.x - pA.x , closestPoint.y - pA.y  )
    let dotA = vCheckBA.dot(vCheckCA);


    let vCheckAB = createVector( pA.x - pB.x , pA.y - pB.y )    
    let vCheckCB = createVector( closestPoint.x - pB.x , closestPoint.y - pB.y )  
    let dotB = vCheckAB.dot(vCheckCB);
    
    if( dotA < 0 ) closestPoint = pA
    if( dotB < 0 ) closestPoint = pB   
    return closestPoint
  }
  
  
  
}




class Solver{

  constructor( objs , canvas )
  {
   this.objs         = objs;
   this.objsCollide  = []
   this.canvas       = canvas;
   this.friction     = gFriction;
   this.vDown        = createVector(0,1,0);
   this.gravity      = gGravity;
   this.iSelected    = -1;
   this.lastMousePos = null;
  
    this.graphNormal    = []        
    this.graphInfected  = []
    this.graphRecovered = []
    
    this.nbrToStop = 0
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
      //STOP MOVING OVERRIDE
      if( i < this.nbrToStop )
      {
        this.friction = 1 
      }
      else if( this.objs[i].momentum.mag() < 0.001)
      {
        this.objs[i].randomSpeed();
        this.friction = 0;
      }
      else
      {
        this.friction = 0
      }      
      
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
            //MODIF COORDS
            let vIJ = p5.Vector.sub(this.objs[i].coords,this.objs[j].coords);         
            let distToAdd = this.objs[i].ray + this.objs[j].ray - vIJ.mag();

            let vJI = p5.Vector.mult(vIJ ,-1);

            vIJ.normalize()
            vJI.normalize()
            vIJ.mult( distToAdd/2 );
            vJI.mult( distToAdd/2 );

            this.objs[i].coords = p5.Vector.add(this.objs[i].coords,vIJ);
            this.objs[j].coords = p5.Vector.add(this.objs[j].coords,vJI);

            //MODIF SPEED
            this.objs[i].speed = vIJ;
            this.objs[j].speed = vJI;

            //MODIF MOMENTUM
            vIJ.normalize();
            vJI.normalize();

            this.objs[i].momentum = p5.Vector.mult( vIJ , this.objs[i].momentum.mag());
            this.objs[j].momentum = p5.Vector.mult( vJI , this.objs[j].momentum.mag());

            //PASS COLOR
            if( this.objs[i].color == this.objs[i].colorInfected ) this.objs[j].color = this.objs[j].colorInfected
            if( this.objs[j].color == this.objs[i].colorInfected ) this.objs[i].color = this.objs[i].colorInfected
            
            
          }
        }
      }    
    }
        
    
  }
  
  draw()
  { 
    var i;
    for( i = 0 ; i < this.objsCollide.length ; i++ )
    {
    fill(0,0,0)
    quad(this.objsCollide[i][0],this.objsCollide[i][1] , 
         this.objsCollide[i][2],this.objsCollide[i][3] , 
         this.objsCollide[i][4],this.objsCollide[i][5] , 
         this.objsCollide[i][6],this.objsCollide[i][7]  );    
    }    
    
    for( i = 0 ; i < this.objs.length ; i++ )
      this.objs[i].draw();   
    

  }
  
  updateStatistic()
  {
    var nbrInfected  = 0
    var nbrRecovered = 0
    var nbrNormal    = 0
    var i;
    for( i = 0 ; i < this.objs.length ; i++ )
    {
      if(      this.objs[i].color == this.objs[i].colorInfected  ) nbrInfected ++ 
      else if( this.objs[i].color == this.objs[i].colorRecovered ) nbrRecovered ++ 
      else                                                         nbrNormal ++ 
    }
    
    this.graphNormal.push(nbrNormal)
    this.graphInfected.push(nbrInfected)
    this.graphRecovered.push(nbrRecovered)
    
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

//UTILS
var cSolver;
var time = 0;
var rInfected  = []
var rNormal    = []
var rRecovered = []
var timeGraphSample = 0
var nbrToStop = 0

//LAYOUT
var canvasSize         = [400, 500]
var canvasSizeDefault  = [400, 500]
var simulationArea     = [400, 400]
var graphArea          = [0 , 400, 400 , 500]

//ENVIRONNEMENT
var gGravity = 0;
var gFriction = 0;

//GRAPH CONFIG
var stepSample = 20
var stepDraw    = 3

//INDIVIDUAL CONFIG
var shapeLimit     = [5,5];
var colorNormal    = [170,170,170,250]
var colorInfected  = [250,50,50,250]
var colorRecovered = [50,250,50,250]

//INDIVIDUAL PARAM
var bubblesNbr = 100;
var speedLimit = 1;
var timeToRecover = 700

/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////


function mouseWheel(event) {
  
  print(nbrToStop)
  nbrToStop += event.delta *-1;
  if( nbrToStop < 0                   ) nbrToStop = 0
  if( cSolver.objs.length < nbrToStop ) nbrToStop = cSolver.objs.length
  
  cSolver.nbrToStop = nbrToStop
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


function init()
{
  //LAYOUT
  createCanvas(canvasSize[0], canvasSize[1]);
  simulationArea     = [canvasSize[0], canvasSize[1] - canvasSize[1]/5]
  graphArea          = [0 , canvasSize[1] - canvasSize[1]/5, canvasSize[0] , canvasSize[1]]  
  stepDraw           = (graphArea[2] - graphArea[0])/500.0
  
  bubbles = [];
  var i;
  for( i = 0 ; i < bubblesNbr ; i++ )
  {
    let newBubble = new Bubble(simulationArea);
    newBubble.randomShape(shapeLimit[0],shapeLimit[1]);    
    newBubble.randomCoords();
    newBubble.speedMax = speedLimit
    newBubble.randomSpeed();
    
    newBubble.colorNormal    = colorNormal
    newBubble.colorInfected  = colorInfected
    newBubble.colorRecovered = colorRecovered
    
    newBubble.timeToRecover = timeToRecover
    
    bubbles.push( newBubble );  
  }
  cSolver = new Solver(bubbles,simulationArea);  
  
  //INFECT ONE GUY
  cSolver.objs[0].color = cSolver.objs[0].colorInfected
  
  background(100);
  //noLoop();  
}



function setup() {
init();
}


var mousePressedState = false
var quadCollide = [0,0 , 0,0 , 0,0 , 0,0]
var mouseCoordsHold = null

function draw() {
  
  background(100);
  
  var mouseCoords = createVector( mouseX , mouseY )
  
  if(( mouseIsPressed )&&( mousePressedState == false))
  {
    print("HOLD FIRST")
    mousePressedState = true
    mouseCoordsHold = mouseCoords
  }
  else if(mouseIsPressed)
  {
    fill(0, 0, 0);
    var vTmp = createVector( mouseCoords.x - mouseCoordsHold.x, mouseCoords.y - mouseCoordsHold.y )
    var thickness = 5
    
    var A = mouseCoordsHold
    var B = mouseCoords
    
    var vBA = createVector( B.x - A.x, B.y - A.y )
    var vBANormal = createVector( vBA.y, vBA.x *-1 )
    vBANormal.normalize()
    vBANormal.mult(thickness)
    var C = p5.Vector.add(B, vBANormal )
    var D = p5.Vector.add(A, vBANormal )
    
    quadCollide = [A.x, A.y, B.x, B.y , C.x, C.y, D.x, D.y] 
    quad(quadCollide[0],quadCollide[1] , 
         quadCollide[2],quadCollide[3] , 
         quadCollide[4],quadCollide[5] , 
         quadCollide[6],quadCollide[7]  );
  }
  else if(( mouseIsPressed == false )&&(mousePressedState == true))
  {
    print("RELEASE") 
    mousePressedState = false  
    cSolver.objsCollide.push(quadCollide)
    quadCollide = [0,0 , 0,0 , 0,0 , 0,0]
    

  }
  
  

  //cSolver.checkInteraction();
  cSolver.solve();  
  cSolver.draw();
  cSolver.updateStatistic();

  //GET INFO  
  
  //GRAPH BG
  rectMode(CORNERS)
  strokeWeight(0);
  fill(colorNormal[0], colorNormal[1], colorNormal[2]);
  rect( graphArea[0] , graphArea[1], graphArea[2] , graphArea[3] );
  
  //GRAPH
  var graphH = graphArea[3] - graphArea[1];
  var graphW = graphArea[2] - graphArea[0];
  
  //UPDATE GRAPH INFO
  if(time%stepSample == 0 )
  {
    var xTime = timeGraphSample; 
    var nbrElem = 0 ;
    
    var yInfected  = map( cSolver.graphInfected[time]  , 0 , bubblesNbr , 0 , graphH   )
    var yNormal    = map( cSolver.graphNormal[time]    , 0 , bubblesNbr , 0 , graphH   )
    var yRecovered = map( cSolver.graphRecovered[time] , 0 , bubblesNbr , 0 , graphH   )
    
    if( graphArea[2] < xTime )
    {
      rInfected  = []
      rNormal    = []
      rRecovered = [] 
      timeGraphSample = 0
    }
    
    var yBase = graphArea[3];
    print( yBase )
    rInfected.push(  [ xTime , yBase-yInfected , xTime+stepDraw , yBase ])
    yBase-=yInfected
    rRecovered.push( [ xTime , yBase-yRecovered, xTime+stepDraw , yBase ]) 
    yBase-=yRecovered
    rNormal.push(    [ xTime , yBase-yNormal   , xTime+stepDraw , yBase ])
    yBase-=yNormal    
    
    timeGraphSample+=stepDraw 
  }
  //DRAW GRAPH
  for( i = 0 ; i < rInfected.length ; i++ )
  {
    
    fill(colorInfected[0], colorInfected[1], colorInfected[2]);
    rect( rInfected[i][0] , rInfected[i][1] ,  rInfected[i][2] , rInfected[i][3] );      
    
    fill(colorRecovered[0], colorRecovered[1], colorRecovered[2]);    
    rect( rRecovered[i][0] , rRecovered[i][1] ,  rRecovered[i][2] , rRecovered[i][3] );      

    fill(colorNormal[0], colorNormal[1], colorNormal[2]);    
    rect( rNormal[i][0] , rNormal[i][1] ,  rNormal[i][2] , rNormal[i][3] );      
  }     
    
  

  

  let sText = 15;
  let hText = 30;
  strokeWeight(0);   
  textSize(sText);
  fill(255, 255, 255);
  text('total:  ' + cSolver.objs.length , 15 , hText);
  text('stop:   ' + nbrToStop , 15 , hText +=sText);
  //text('friction:  ' + cSolver.friction , 15 , hText +=sText);  
  //text('frameRate: ' + frameRate() , 15 , hText +=sText);  

  time ++
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

