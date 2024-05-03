
class Boid{
  
  constructor( width , height )
  {
    this.position     = createVector( random(width) , random(height) )
    this.velocity     = p5.Vector.random2D()
    this.acceleration = createVector( )
    this.size = 10
    this.color = [255,255,255,255]
    
    this.canvas = [ width , height ]
    this.nRadius = 400
    this.maxSpeed = 1.0;
    
    this.forceMeet   = 0
    this.forceEscape = 1
    this.forceDir    = 0
  }
  
  solve( Boids , currentIndex)
  {
    this.position.add(this.velocity)
    this.velocity.add(this.acceleration)
    
    //STEER
    this.desire = createVector( 0 , 0 )
    
    var avPosition = createVector( this.position.x , this.position.y )
    var avVelocity = createVector( this.velocity.x , this.velocity.y )
    
    var boidsInRadius = 1.0
    for( var i = 0 ; i < Boids.length; i++)
      {

        let d = p5.Vector.sub( this.position , Boids[i].position ).mag()
        if(( d < this.nRadius )&&( i != currentIndex ))
          {
            avPosition.add(Boids[i].position)
            avVelocity.add(Boids[i].velocity)
            boidsInRadius += 1
          }
      }
    
    avPosition.div( boidsInRadius ) 
    avVelocity.div( boidsInRadius )
    
    avVelocity.setMag(this.maxSpeed)
    
    this.velocity.mult( 1-this.forceDir)
    avVelocity.mult( this.forceDir)
    this.velocity.add(avVelocity)

    
    let vToCenter = p5.Vector.sub( avPosition , this.position )
    vToCenter.setMag(this.maxSpeed)
    vToCenter.mult(this.forceMeet)
    this.position.add( vToCenter )
 
    boidsInRadius = 0
    let vToEscape = createVector()
    for(  i = 0 ; i < Boids.length; i++)
      {

        let vTmp = p5.Vector.sub( this.position , Boids[i].position )
        if( ( currentIndex != i )&&( vTmp.mag() < this.nRadius ) )
          {
            //vTmp.setMag(this.escapeRadius)
            //vTmp.mult(  this.forceEscape )
            vToEscape.add(vTmp)
            boidsInRadius += 1
          }
      }   
    
    if( 0 < boidsInRadius )
      {
        vToEscape.div(boidsInRadius)
        vToEscape.setMag(0.6)
        this.position.add( vToEscape )
      }
    
      
    
    

    
    
    
    
    
    
    this.edgeTeleport()
  }
  
  edgeTeleport()
  {
    if( this.position.x < 0 ) this.position.x = this.canvas[0];
    if( this.position.y < 0 ) this.position.y = this.canvas[1];
    if( this.canvas[0] < this.position.x ) this.position.x = 0;
    if( this.canvas[1] < this.position.y ) this.position.y = 0;  
  }  
  
  draw()
  {
    fill( color(this.color[0],this.color[1],this.color[2],this.color[3]) )
    circle(this.position.x , this.position.y , this.size )
  }
  
}

let width       = 400
let height      = 400
let nbrBoids    = 100
let Boids       = []

function setup() {
  
  createCanvas(width, height);
  
 
  for( var i = 0 ; i < nbrBoids; i++)
    append(Boids, new Boid( width,height))
      
  

    
}

function draw() {
  background(0);
  
  
  for( var i = 0 ; i < Boids.length; i++)
    {
      Boids[i].solve( Boids , i)
      Boids[i].draw()
    }
}