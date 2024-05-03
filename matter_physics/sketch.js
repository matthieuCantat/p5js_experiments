
// module aliases
var Engine = Matter.Engine,
    //Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

    
// create an engine
var engine = Engine.create();

var ground;

class box_build{
  constructor( x,y,w,h ){

    var body = Bodies.rectangle(x, y, w, h);
    Composite.add( engine.world, body)
    
    this.body = body
    this.w = w
    this.h = h
  }

  show(){
    push(); // Start a new drawing state
    translate(this.body.position.x,this.body.position.y)
    rotate(this.body.angle);
    rectMode(CENTER)
    rect(0,0,this.w,this.h)
    pop(); // Restore original state
  }

}

let width       = 400
let height      = 400


var boxes       = []

function setup() {

  //____________________________Engine



  // create two boxes and a ground
  ground = Bodies.rectangle(200, 400, 400, 50, { isStatic: true });
  wall_left = Bodies.rectangle(-50, 0 , 50, 400, { isStatic: true });
  wall_right = Bodies.rectangle(400, 0 , 50, 400, { isStatic: true });
  // add all of the bodies to the world
  Composite.add(engine.world, [ ground]);

  // create runner
  var runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);

  //____________________________draw
  
  createCanvas(width, height);
  
  

    
}

function mouseDragged()
{
  console.log('mousePressed')
  boxes.push( new box_build(mouseX,mouseY,20,20) )
}

function draw() {
  background(50);

  for( let i = 0; i < boxes.length; i++ )
  {
    boxes[i].show();
  }
}