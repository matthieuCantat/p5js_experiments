
// module aliases
var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Composite = Matter.Composite;
    Common = Matter.Common;
    Vertices = Matter.Vertices;

    

// provide concave decomposition support library
//Common.setDecomp(require('poly-decomp'));
Common.setDecomp(decomp)

// create an engine
var engine = Engine.create();

var ground;

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
  constructor( x,y,w,h,box = null){

    //var body = Bodies.rectangle(x, y, w, h);
    //var body = Bodies.circle(x, y, w/2.0)
    
    this.x = x
    this.y = y
    this.w = w +Common.random(0, w*0.5)
    this.h = h +Common.random(0, h*3.0)
    var max_choice = 8
    this.type = min(max(Math.round(Common.random(-1, max_choice+1)),0),max_choice)
    this.shape_vertices = Matter.Vertices.create([], Body)

    if( box != null )
    {
      this.x = box.body.position.x
      this.y = box.body.position.y
      this.w = box.w
      this.h = box.h
      this.type = box.type
      this.shape_vertices = box.shape_vertices
    }
    else
    {
      switch(this.type) {    
        case 5:
          var points_scale = []
          for(let i = 0; i < arrow.length;i+=2)
            points_scale.push( { x:arrow[i]*this.w, y:arrow[i+1]*this.w})
          this.shape_vertices = Matter.Vertices.create(points_scale, Body)      
          break;     
        case 6:
          var points_scale = []
          for(let i = 0; i < chevron.length;i+=2)
            points_scale.push( { x:chevron[i]*this.w, y:chevron[i+1]*this.w})
          this.shape_vertices = Matter.Vertices.create(points_scale, Body)      
          break;    
        case 7:
          var points_scale = []
          for(let i = 0; i < star.length;i+=2)
            points_scale.push( { x:star[i]*this.w, y:star[i+1]*this.w})
          this.shape_vertices = Matter.Vertices.create(points_scale, Body)      
          break;   
        case 8:
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
        this.body = Bodies.circle(this.x, this.y, this.w/2);
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
    this.hit_speed = 0
    this.duplicate_counter = -1.0
    this.duplicate_phase = 0
  }



  
  update()
  {
    if(( this.duplicate_counter < 0 )&&( 0.1 < this.hit_speed))
      this.duplicate_counter = 1.0
    
    if ( 0 < this.duplicate_counter )
    {
      this.duplicate_counter -= 0.01
      let value = 255*cos(exp((1.0-this.duplicate_counter)*4))
      this.color = [value,value,0]
      this.duplicate_phase = 0
    }
    else if( this.duplicate_counter != -1.0 )
    {
      this.color = [255,0,0]
      this.duplicate_phase = 1
      this.duplicate_counter = -1.0
    }
    else
    {
      this.duplicate_phase = 0
      this.color = [100,100,100]
    }
      

   
    var coef = 0.1;
    let c = 255*this.hit_speed*coef
    this.colorStroke = [ c, 0, 0  ]
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
        circle(0,0,this.w)
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


  // an example of using collisionStart event on an engine
  Events.on(engine, 'collisionStart', function(event) {
      var pairs = event.pairs;


      var colliding_speed_min = 0.4
      // change object colours to show those starting a collision
      for( let i = 0; i < boxes.length; i++ )
      {
        for (let j = 0; j < pairs.length; j++)
        {
          
          var bA = pairs[j].bodyA.parent;
          var bB = pairs[j].bodyB.parent;
          var colliding_speed = bA.speed + bB.speed

          if(( bA.isStatic == false)&&( bB.isStatic == false))
          {
            if(colliding_speed_min < colliding_speed)
            {
              if( bA == boxes[i].body )
                boxes[i].hit_speed += colliding_speed

              if( bB == boxes[i].body )
                boxes[i].hit_speed += colliding_speed

            }

          }
        }  
      }

  });


  // an example of using collisionActive event on an engine
  Events.on(engine, 'collisionActive', function(event) {
      var pairs = event.pairs;

      // change object colours to show those starting a collision
      for( let i = 0; i < boxes.length; i++ )
      {
        var is_colliding = false;
        for (var j = 0; j < pairs.length; j++)
        {
          var bA = pairs[j].bodyA.parent;
          var bB = pairs[j].bodyB.parent;

          if( bA == boxes[i].body )
          {
            if(( 0.1 < bA.speed)
            &&( bB.isStatic == false))
            {
              is_colliding = true
              break
            }
          }
          else if( bB == boxes[i].body )
          {
            if(( 0.1 < bB.speed)
            &&( bA.isStatic == false))
            {
              is_colliding = true
              break
            }
          }
        }  
        
        if( is_colliding )
        {
          //boxes[i].color = [255,255,0]
        }
        else
        {
          //boxes[i].color = [255,255,255]
          boxes[i].hit_speed = 0
        }
    }

  });
/*
  // an example of using collisionEnd event on an engine
  Events.on(engine, 'collisionEnd', function(event) {
      var pairs = event.pairs;

      // change object colours to show those starting a collision
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];

        for( let i = 0; i < boxes.length; i++ )
        {
          if( pair.bodyA == boxes[i].body )
          {
            boxes[i].color = [0,255,0]
          }
          if( pair.bodyB == boxes[i].body )
          {
            boxes[i].color = [0,255,0]
          }
        }          
    }

  });
*/

  //____________________________draw
  
  createCanvas(width, height);
  
  

    
}



function mousePressed()
{
  boxes.push( new body_build(mouseX,mouseY,19,19) )
}




function draw() {
  background(50);
  var boxes_next = []
  for( let i = 0; i < boxes.length; i++ )
  {
    boxes[i].update();
    
    if(boxes[i].duplicate_phase == 1)
    {
      let box = boxes[i]
      let pos = box.body.position
      let duplicated_box = new body_build( 0,0,0,0,box = box)
      boxes_next.push( duplicated_box )

      let p = Matter.Vector.create(pos.x,pos.y);
      let coef = 0.0005
      let rA = coef*Math.random() - coef/2.0
      let rB = -coef*Math.random()
      let v = Matter.Vector.create(rA*box.w,rB*box.h);
      Body.applyForce(boxes[i].body      , p, v)
      Body.applyForce(duplicated_box.body, p, v)
    }
      
    boxes[i].show();
  }

  for( let toAdd of boxes_next)
    boxes.push(toAdd)
  
}