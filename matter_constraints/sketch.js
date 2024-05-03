
// module aliases
var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Composite = Matter.Composite;
    Common = Matter.Common;
    Vertices = Matter.Vertices;
    MouseConstraint = Matter.MouseConstraint;
    Constraint = Matter.Constraint;

// provide concave decomposition support library
Common.setDecomp(decomp)//Common.setDecomp(require('poly-decomp'));

// create an engine
var engine = Engine.create();



var star = [0,-1.0949659863945578, 0.26,-0.3349659863945578, 1,-0.3349659863945578, 0.38,0.08503401360544217, 0.64,0.9050340136054422,
  0,0.40503401360544217, -0.64,0.9050340136054422, -0.38,0.08503401360544217, -1,-0.3349659863945578, -0.26,-0.3349659863945578]
var arrow =[-0.2904761904761905,-1,-0.2904761904761905,-0.6,0.9095238095238095,-0.6,0.9095238095238095,0.6,-0.2904761904761905,0.6,-0.2904761904761905,1,-1.0904761904761906,0]
var chevron =[1,-1,0.5,0,1,1,-0.5,1,-1,0,-0.5,-1]
var horseShoe = [-0.04517900120336947,-0.7731498194945848,-0.3651790012033695,-0.5731498194945849,-0.46517900120336947,-0.15314981949458484,
  -0.46517900120336947,0.24685018050541516,-0.24517900120336947,0.6668501805054151,0.15482099879663053,0.7868501805054152,
  0.5548209987966305,0.7668501805054152,0.5548209987966305,0.40685018050541516,0.17482099879663054,0.4268501805054152,
  -0.06517900120336947,0.26685018050541515,-0.14517900120336946,-0.03314981949458485,-0.08517900120336946,-0.33314981949458483,
  0.15482099879663053,-0.4531498194945849,0.5748209987966305,-0.4531498194945849,0.5748209987966305,-0.7731498194945848,0.31482099879663056,-0.7731498194945848]

class body_build{
  
  constructor( in_options ){
  // Default options
    const defaultOptions = {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      box: null,
      type: -1,
    };
    const args = { ...defaultOptions, ...in_options };
    
    this.x = args.x
    this.y = args.y
    this.w = args.w
    this.h = args.h
    var max_choice = 8
    if(args.type != -1)
      this.type = args.type
    else
      this.type = min(max(Math.round(Common.random(-1, max_choice+1)),0),max_choice)

    this.shape_vertices = Matter.Vertices.create([], Body)

    if( args.box != null )
    {
      this.x = args.box.body.position.x
      this.y = args.box.body.position.y
      this.w = args.box.w
      this.h = args.box.h
      this.type = args.box.type
      this.shape_vertices = args.box.shape_vertices
    }
    else
    {
      switch(this.type) {    
        case 1:
          this.w = args.w/2
          break;
        case 2:
          this.w = args.w/2
          break; 
        case 3:
          this.w = args.w/2
          break;  
        case 4:
          this.w = args.w/2
          break;               
        case 5:
          this.w = args.w/2
          var points_scale = []
          for(let i = 0; i < arrow.length;i+=2)
            points_scale.push( { x:arrow[i]*this.w, y:arrow[i+1]*this.w})
          this.shape_vertices = Matter.Vertices.create(points_scale, Body)      
          break;     
        case 6:
          this.w = args.w/2
          var points_scale = []
          for(let i = 0; i < chevron.length;i+=2)
            points_scale.push( { x:chevron[i]*this.w, y:chevron[i+1]*this.w})
          this.shape_vertices = Matter.Vertices.create(points_scale, Body)      
          break;    
        case 7:
          this.w = args.w/2
          var points_scale = []
          for(let i = 0; i < star.length;i+=2)
            points_scale.push( { x:star[i]*this.w, y:star[i+1]*this.w})
          this.shape_vertices = Matter.Vertices.create(points_scale, Body)      
          break;   
        case 8:
          this.w = args.w/2
          var points_scale = []
          for(let i = 0; i < horseShoe.length;i+=2)
            points_scale.push( { x:horseShoe[i]*this.w, y:horseShoe[i+1]*this.w})
          this.shape_vertices = Matter.Vertices.create(points_scale, Body)      
          break;                                             
        }
    }


    switch(this.type) {
      case 0:
        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h);
        break;
      case 1:
        this.body = Bodies.circle(this.x, this.y, this.w);
        break;
      case 2:
        this.body = Bodies.polygon(this.x, this.y, 3, this.w);
        break;
      case 3:
        this.body = Bodies.polygon(this.x, this.y, 5, this.w);
        break;     
      case 4:
        this.body = Bodies.polygon(this.x, this.y, 6, this.w);
        break;  
      case 5:    
        this.body = Bodies.fromVertices(this.x, this.y, this.shape_vertices)
        break;     
      case 6: 
        this.body = Bodies.fromVertices(this.x, this.y, this.shape_vertices)
        break;    
      case 7:     
        this.body = Bodies.fromVertices(this.x, this.y, this.shape_vertices)
        break;   
      case 8:     
        this.body = Bodies.fromVertices(this.x, this.y, this.shape_vertices)
        break;                                             
      }

    Composite.add( engine.world, this.body)

    this.color = [100,100,100]
    this.colorStroke = [0,0,0]
  }

  update()
  {
  }

  show(){
    //
    push(); // Start a new drawing state
    fill(this.color)
    strokeWeight(4);
    stroke(this.colorStroke)

    translate(this.body.position.x,this.body.position.y)
    rotate(this.body.angle);

    var pi2 = Math.PI*2
    switch(this.type) {
      case 0:
        rectMode(CENTER)
        rect(0,0,this.w,this.h)
        break
      case 1:
        circle(0,0,this.w*2)
        break
      case 2:
        let pA = [cos(pi2*1/6)*this.w,sin(pi2*1/6)*this.w]
        let pB = [cos(pi2*3/6)*this.w,sin(pi2*3/6)*this.w]
        let pC = [cos(pi2*5/6)*this.w,sin(pi2*5/6)*this.w]
        triangle(pA[0], pA[1], pB[0], pB[1], pC[0], pC[1]);
        break
      case 3:
        beginShape(TESS);
        vertex(cos(pi2*1/10)*this.w,sin(pi2*1/10)*this.w);
        vertex(cos(pi2*3/10)*this.w,sin(pi2*3/10)*this.w);
        vertex(cos(pi2*5/10)*this.w,sin(pi2*5/10)*this.w);
        vertex(cos(pi2*7/10)*this.w,sin(pi2*7/10)*this.w);
        vertex(cos(pi2*9/10)*this.w,sin(pi2*9/10)*this.w);
        endShape(CLOSE);
        break    
      case 4:
        beginShape(TESS);
        vertex(cos(pi2*1/12)*this.w,sin(pi2*1/12)*this.w);
        vertex(cos(pi2*3/12)*this.w,sin(pi2*3/12)*this.w);
        vertex(cos(pi2*5/12)*this.w,sin(pi2*5/12)*this.w);
        vertex(cos(pi2*7/12)*this.w,sin(pi2*7/12)*this.w);
        vertex(cos(pi2*9/12)*this.w,sin(pi2*9/12)*this.w);
        vertex(cos(pi2*11/12)*this.w,sin(pi2*11/12)*this.w);
        endShape(CLOSE);
        break    
      case 5:     
        beginShape(TESS);
        for(let i = 0; i < this.shape_vertices.length;i++)
          vertex(this.shape_vertices[i].x, this.shape_vertices[i].y);
        endShape(CLOSE);
        break    
      case 6:     
        beginShape(TESS);
        for(let i = 0; i < this.shape_vertices.length;i++)
          vertex(this.shape_vertices[i].x, this.shape_vertices[i].y);
        endShape(CLOSE);
        break          
      case 7:        
        beginShape(TESS);
        for(let i = 0; i < this.shape_vertices.length;i++)
          vertex(this.shape_vertices[i].x, this.shape_vertices[i].y);
        endShape(CLOSE);
        break   
      case 8:     
        beginShape(TESS);
        for(let i = 0; i < this.shape_vertices.length;i++)
          vertex(this.shape_vertices[i].x, this.shape_vertices[i].y);
        endShape(CLOSE);
        break                                          
      }    
    pop(); // Restore original state
  }

}



class constraint_build{
  
  constructor( in_options ){
  // Default options
    const defaultOptions = {
      pA: {x:0,y:0},
      bodyA: null,
      pB: {x:0,y:0},
      bodyB: null,
      stiffness: 0.001,
      damping: 0.05,
      length: null,
      type: 0,
    };
    const args = { ...defaultOptions, ...in_options };

    this.pA = args.pA
    this.bodyA = args.bodyA
    this.pB = args.pB
    this.bodyB = args.bodyB
    this.type = args.type
    this.stiffness = args.stiffness
    this.damping = args.damping
    this.length = args.length



    switch(this.type) {
      case 0:
        var out_options ={
          bodyA: this.bodyA,
          pointA: { x: this.pA.x, y: this.pA.y },
          bodyB: this.bodyB,
          pointB: { x: this.pB.x, y: this.pB.y },
          stiffness : this.stiffness,
          damping : this.damping,
        };
        if(this.length!=null)
          out_options.length = this.length
        this.cns = Constraint.create(out_options);
        break;
                                           
      }

    Composite.add( engine.world, [ this.cns ])

    this.color = [100,100,100]
    this.colorStroke = [0,0,0]

  }

  update()
  {
  }

  show(){
    //
    push(); // Start a new drawing state
    fill(this.color)
    strokeWeight(4);
    stroke(this.colorStroke)

    //translate(this.body.position.x,this.body.position.y)
    //rotate(this.body.angle);

    switch(this.type) {
      case 0:
        var pA = {x:this.cns.pointA.x, y:this.cns.pointA.y}
        if(this.cns.bodyA != null)
          pA = {x:this.cns.bodyA.position.x+this.cns.pointA.x, y:this.cns.bodyA.position.y+this.cns.pointA.y}
        var pB = {x:this.cns.pointB.x,y:this.cns.pointB.y}
        if(this.cns.bodyB != null)
          pB = {x:this.cns.bodyB.position.x+this.cns.pointB.x, y:this.cns.bodyB.position.y+this.cns.pointB.y}

        line( pA.x, pA.y,pB.x, pB.y)
        break                                       
      }    
    pop(); // Restore original state

  }

}


var ground;
let width       = 400
let height      = 400


var boxes       = []
var constraints = []
function setup() {

  // create two boxes and a ground
  ground     = Bodies.rectangle(200, 450, 400, 100, { isStatic: true });
  wall_left  = Bodies.rectangle(-50, 200 , 100, 400, { isStatic: true });
  wall_right = Bodies.rectangle(450, 200 , 100, 400, { isStatic: true });
  wall_top   = Bodies.rectangle(200, -50, 400, 100, { isStatic: true });
  // add all of the bodies to the world
  Composite.add(engine.world, [ ground,wall_left,wall_right,wall_top]);

  // create runner
  var runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);

  
  createCanvas(width, height);


  var body_size = 40;
  var shapes_nbr = 9;
  for( let i = 0; i < shapes_nbr; i++)
  {
    let dist = (body_size/2.0)+ body_size*i;
    let x = dist % width;
    let y =  (body_size/2.0)+ body_size*floor(dist/width)
    //console.log(x,y)
    var options = { 
      x:x,
      y:y,
      w:body_size,
      h:body_size,
      type:i}
    boxes.push(new body_build(options))
  }

  //engine.gravity.scale = 0
  var options = {
    bodyA: boxes[4].body,
    pA: { x: -10, y: -10 },
    bodyB: boxes[1].body,
    pB: { x: -10, y: -10 },
    stiffness: 0.01
  }
  constraints.push( new constraint_build(options) )

 

}

var mouseConstraint = MouseConstraint.create(engine, {
  //mouse: mouse,
  constraint: {
      // allow bodies on mouse to rotate
      angularStiffness: 0,
      render: {
          visible: false
      }
  }
});

Composite.add(engine.world, mouseConstraint);

function mousePressed()
{
}




function draw() {
  background(50);

  for( let i = 0; i < boxes.length; i++ )
  {
    boxes[i].update();
      
    boxes[i].show();
  }
  for( let i = 0; i < constraints.length; i++ )
    constraints[i].show();

  
}