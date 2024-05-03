

class quadTree
{
  constructor(points,bbCoords,deepLevel)
  {
    this.minPoints = 1;
    
    this.bbCoords = bbCoords;  
    this.pointsInside = this.utils_getPointsInsideBB( points , bbCoords );
    this.divisionChildren = []
    this.divisionParent = null
    this.deepLevel = deepLevel
    
    if( this.minPoints < this.pointsInside.length )
      if( this.deepLevel < 6 )
        this.divide();           
  }
  
  divide()
  {
    var bbCoordsDivided = this.bbCoordsDivid( this.bbCoords );
    
    for( var i = 0 ; i < bbCoordsDivided.length ; i++ )
      {
        let newDiv = new quadTree(this.pointsInside , bbCoordsDivided[i] , this.deepLevel + 1 )
        newDiv.divisionParent = this
        this.divisionChildren.push( newDiv )      
      }         
  }
  
  bbCoordsDivid(bbCoords)
  {
    var bbCoordsDivided = [];
    
    var xMiddle = ( bbCoords[1].x + bbCoords[0].x )/2;
    var yMiddle = ( bbCoords[1].y + bbCoords[0].y )/2;
    
    var pMiddle = createVector( xMiddle       , yMiddle       );
    var pTop    = createVector( xMiddle       , bbCoords[0].y );
    var pBottom = createVector( xMiddle       , bbCoords[1].y );    
    var pLeft   = createVector( bbCoords[0].x , yMiddle       ); 
    var pRight  = createVector( bbCoords[1].x , yMiddle       );     
    
    bbCoordsDivided.push([ bbCoords[0] , pMiddle     ]);
    bbCoordsDivided.push([ pTop        , pRight      ]);    
    bbCoordsDivided.push([ pLeft       , pBottom     ]);
    bbCoordsDivided.push([ pMiddle     , bbCoords[1] ]);
    
    return bbCoordsDivided;
  }
  
  utils_getPointsInsideBB(points,bbCoords)
  {
    var pointsInside = [];
    for( var i = 0 ; i < points.length ; i++ )
      if( this.utils_isCoordsInsideBB(points[i] , bbCoords) )
        pointsInside.push(points[i]);  

    return pointsInside;  
  }
  
  utils_isCoordsInsideBB(point , bbCoords)
  {
   if(( bbCoords[0].x < point.x )&&( point.x< bbCoords[1].x))
     if(( bbCoords[0].y < point.y )&&( point.y < bbCoords[1].y)) 
       return true;        
    return false;
  }
 
  isInside(point)
  {
    return this.utils_isCoordsInsideBB( point , this.bbCoords )    
  }

  
  draw(depth = 0)
  {
    
    for( var i = 0 ; i < this.divisionChildren.length ; i++ )
      this.divisionChildren[i].draw(depth+1); 
    
    rectMode(CORNERS);
    strokeWeight(3); 
    let tmp = this.bbCoords[0].x + this.bbCoords[0].y + this.bbCoords[1].x + this.bbCoords[1].y
    stroke(0 ,255 - depth*30, 255 - depth*30  ,255);
    fill(color(255,255,255,0));
    rect( this.bbCoords[0].x , this.bbCoords[0].y , this.bbCoords[1].x , this.bbCoords[1].y );
    
   
    
    //textSize(30);
    //text(this.pointsInside.length, (this.bbCoords[1].x + this.bbCoords[0].x)/2 , 
                 //(this.bbCoords[0].y + this.bbCoords[1].y)/2  ); 
  }
  
  getInsideRayCandidates( center , ray )
  {
    var points = []
    for( var i = 0 ; i < this.divisionChildren.length ; i++ )
      points = points.concat(this.divisionChildren[i].getInsideRayCandidates( center , ray) ); 
    
    if( this.isBottomDepthDivision() )
      if( this.intersect(center , ray) )
        points = points.concat(this.pointsInside );  
    
    return points
  }
  

  getClosestCandidates( center , depth = 0 )
  {
    var points = []
    for( var i = 0 ; i < this.divisionChildren.length ; i++ )
      if( this.divisionChildren[i].isInside( center ) )
        points = points.concat(this.divisionChildren[i].getClosestCandidates( center ) ); 
    
    if( this.isBottomDepthDivision() )
      points = points.concat(this.pointsInside ); 

    if( ( points.length == 0 )&&( this.divisionParent != null ) )
      points = points.concat(this.divisionParent.pointsInside );
      
    return points
  }  
  
  isBottomDepthDivision()
  {
    if( this.divisionChildren.length == 0 )
      return true
    return false
  }
  
  
  intersect(center , ray)
  {

    if( this.isInside(center) )
    {
      return true      
    }
    else
    {
      let closestPoint = this.utils_getClosestPoint( center , this.bbCoords );      
    
      let vTmp = createVector( closestPoint.x - center.x , closestPoint.y - center.y );
      let distTmp = vTmp.mag();
      if( distTmp < ray )
        return true
    }
    return false
  }
  
  utils_getClosestPoint( point , bbCoords )
  {
   
    let pA = createVector( bbCoords[0].x , bbCoords[0].y  )
    let pB = createVector( bbCoords[1].x , bbCoords[0].y  )
    let pC = createVector( bbCoords[1].x , bbCoords[1].y  )
    let pD = createVector( bbCoords[0].x , bbCoords[1].y  )
    
    let pClosests = []
    pClosests.push( this.utils_getClosestPointOnSegment( pA , pB , point) )
    pClosests.push( this.utils_getClosestPointOnSegment( pB , pC , point) )
    pClosests.push( this.utils_getClosestPointOnSegment( pC , pD , point) )
    pClosests.push( this.utils_getClosestPointOnSegment( pD , pA , point) )
    
    
    let distancesMin = 99999999999999999999999999999999 ;
    let pClosest = null;

    for( var i = 0 ; i < pClosests.length ; i++ )
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
  
  utils_getClosestPointOnSegment( pA , pB , p)
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


/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////


let points = []
let canvasSize = [500,500]
let canvasSizeDefault= [500,500]
let quadTreeA = null
let researchRay = 20

var pointsBrush = 1;
var brushSize = 50;
var pointsSize = 10
var pointsColor = [255,255,255,255]

/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

function setup() {
  createCanvas(canvasSize[0], canvasSize[1]);
  //noLoop();
}

function draw() {
  background(100);
  var mousePosition = createVector( mouseX , mouseY );
  
  if( mouseIsPressed )
  {

    var j;
    for(j=0 ; j<pointsBrush ; j++)
    {
      var offsetedPoint = createVector(mousePosition.x,mousePosition.y);
      offsetedPoint.x += random(brushSize*-1,brushSize);
      offsetedPoint.y += random(brushSize*-1,brushSize);
      points.push(offsetedPoint)      
    }

  }
  
  let canvasBB = [ createVector(0,0) , createVector(canvasSize[0] , canvasSize[1] ) ];
  quadTreeA = new quadTree(points,canvasBB , 0);
  quadTreeA.draw();
  
         
  var i;
  for( i = 0 ; i < points.length ; i++)
  {
   
    fill(color(pointsColor[0],pointsColor[1],pointsColor[2],pointsColor[3]));
    strokeWeight(0);
    circle(points[i].x,points[i].y,pointsSize);
    
  }
 
  
  if( keyIsPressed ) {
    if (keyCode == 32) //space bar
    {
      var mouseCoords = createVector( mouseX , mouseY )
      var inside_ray_candidates = quadTreeA.getInsideRayCandidates( mouseCoords , researchRay )
      var closestCandidates = quadTreeA.getClosestCandidates( mouseCoords )
   
      fill(color(0,225,0,50));    
      circle(mouseCoords.x,mouseCoords.y,researchRay*2);
      
      
      for( i = 0 ; i < closestCandidates.length ; i++)
      {
        fill(color(0,225,0,225));
        strokeWeight(0);
        circle(closestCandidates[i].x,closestCandidates[i].y,5);
      }       
      
      if( 0.01 < researchRay )
        for( i = 0 ; i < inside_ray_candidates.length ; i++)
        {
          fill(color(225,0,0,225));
          strokeWeight(0);
          circle(inside_ray_candidates[i].x,inside_ray_candidates[i].y,5);
        }          
      
    }
  }

}


function mouseWheel(event) {

  researchRay = max( 0 , researchRay +event.delta*0.1 );

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