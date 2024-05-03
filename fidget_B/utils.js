




// create an engine
var engine = Matter.Engine.create();

////////////////////////////////////////////// utils
function rad(value)
{
  return value*Math.PI/180
}
function deg(value)
{
  return value/Math.PI*180
}

// provide concave decomposition support library
//Matter.Common.setDecomp(decomp)//Matter.Common.setDecomp(require('poly-decomp'));


var utils = {
  color:{
    dark : [50,50,50],
    grey : [110,110,110],
    red : [255,50,50],
    green : [50,255,50],
    blue : [50,50,255],
    cyan : [50,255,255],
    gold : [170,130,0],
    yellow : [250,250,0],  
  },
  collision_category:{
    none : 0x0000, 
    default : 0x0001, // for walls
    mouse : 0x0002, // red circles
    green : 0x0004, // yellow circles
    blue : 0x0008, // yellow circles
    other : 0x0010, // yellow circles
    inter : 0x0020 // for interaction    
  },
  shape:{
    circle:1,
    rectangle:0,
    trapezoid:10,
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
        this.cns = Matter.Constraint.create(out_options);
        break;
                                           
      }

    Matter.Composite.add( engine.world, [ this.cns ])

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

var star = [0,-1.0949659863945578, 0.26,-0.3349659863945578, 1,-0.3349659863945578, 0.38,0.08503401360544217, 0.64,0.9050340136054422,
  0,0.40503401360544217, -0.64,0.9050340136054422, -0.38,0.08503401360544217, -1,-0.3349659863945578, -0.26,-0.3349659863945578]
var arrow =[-0.2904761904761905,-1,-0.2904761904761905,-0.6,0.9095238095238095,-0.6,0.9095238095238095,0.6,-0.2904761904761905,0.6,-0.2904761904761905,1,-1.0904761904761906,0]
var chevron =[1,-1,0.5,0,1,1,-0.5,1,-1,0,-0.5,-1]
var horseShoe = [-0.04517900120336947,-0.7731498194945848,-0.3651790012033695,-0.5731498194945849,-0.46517900120336947,-0.15314981949458484,
  -0.46517900120336947,0.24685018050541516,-0.24517900120336947,0.6668501805054151,0.15482099879663053,0.7868501805054152,
  0.5548209987966305,0.7668501805054152,0.5548209987966305,0.40685018050541516,0.17482099879663054,0.4268501805054152,
  -0.06517900120336947,0.26685018050541515,-0.14517900120336946,-0.03314981949458485,-0.08517900120336946,-0.33314981949458483,
  0.15482099879663053,-0.4531498194945849,0.5748209987966305,-0.4531498194945849,0.5748209987966305,-0.7731498194945848,0.31482099879663056,-0.7731498194945848]


class cns_axe{

  constructor(in_options)
  {
    const defaultOptions = {
      axe:null,
      Follower:null,
      enable:true,
      vLineBase : null,
      pLineBase : null,
      distPos:null, 
      distNeg:null, 
      fix_angle : true, 
      extra_rotation : 0, 
      pos_override : null, 
      axe_rotation: 0,
      axe_rotation_center:createVector(0,0),     
    }   
    
    const args = { ...defaultOptions, ...in_options };

    this.Follower      = args.Follower
    this.enable        = args.enable
    this.vLineBase     = args.vLineBase 
    this.pLineBase     = args.pLineBase 
    this.distPos       = args.distPos
    this.distNeg       = args.distNeg
    this.fix_angle     = args.fix_angle
    this.extra_rotation= args.extra_rotation
    this.pos_override  = args.pos_override 
    this.axe_rotation  = args.axe_rotation 
    this.axe_rotation_center  = args.axe_rotation_center 
    this.debug = true  
    this.debug_pts = [null,null]
    this.current_pos = 0
    
    if( ( this.vLine == null )&&( args.axe != null) )
    {
      this.vLineBase = createVector(0,0)
      if( args.axe == 0 )this.vLineBase.x = 1.0
      else          this.vLineBase.y = 1.0
      if( this.Follower.rot != null)
        this.vLineBase.rotate(this.Follower.rot)
    }

    if( ( this.pLineBase == null )&&( this.Follower != null) )
      this.pLineBase = createVector(this.Follower.x,this.Follower.y)
  }


  apply(rot,rot_center)
  {
    rot = this.axe_rotation 
    rot_center = this.axe_rotation_center 

    //let extra_rotation_center = createVector(200,200)
    if( this.enable == false)
      return

    let vLine = createVector(this.vLineBase.x,this.vLineBase.y)
    let pLine = createVector(this.pLineBase.x,this.pLineBase.y)

    // Update axe postion rotation
    vLine.rotate(rad(rot))
    let vTmp = p5.Vector.sub( pLine, rot_center)
    vTmp.rotate(rad(rot))
    pLine = p5.Vector.add(rot_center,vTmp)


    
    // Set Follower on the line
    let B = this.Follower.body
    let pCurrent = createVector(B.position.x,B.position.y);
    let vDelta = p5.Vector.sub(pCurrent,pLine);
    let vToClosestPoint = p5.Vector.mult( vLine, p5.Vector.dot(vDelta,vLine) );
    let pClosest = p5.Vector.add(pLine,vToClosestPoint);

    let velCurrent = createVector(B.velocity.x,B.velocity.y)
    let vVelProj = p5.Vector.mult( vLine, p5.Vector.dot( velCurrent,vLine ) );

    if( pClosest != pCurrent)
    {
      Matter.Body.setVelocity(B,vVelProj)
      Matter.Body.setPosition(B, pClosest)
      pCurrent = pClosest
    }

    
    // Set limit
    var pLimitPos = createVector() 
    if( this.distPos != null )
    {
      let vToLimit = createVector(vLine.x,vLine.y)
      vToLimit.normalize()
      vToLimit = p5.Vector.mult(vToLimit,this.distPos)
      pLimitPos = p5.Vector.add(vToLimit,pLine)
    }

    var pLimitNeg = createVector()
    if( this.distNeg != null )
    {
      let vToLimit = createVector(vLine.x,vLine.y)
      vToLimit.normalize()
      vToLimit = p5.Vector.mult(vToLimit,this.distNeg*-1)
      pLimitNeg = p5.Vector.add(vToLimit,pLine)
    }

    vDelta = p5.Vector.sub(pCurrent,pLine);
    let dot = p5.Vector.dot( p5.Vector.normalize(vDelta),
                             p5.Vector.normalize(vLine))
    if(0<dot)
    {
      if( ( this.distPos != null )&&(this.distPos<= vDelta.mag()) )
      {
        let v2 = p5.Vector.sub(pLimitPos,pCurrent);
        //Matter.Body.setVelocity(this.body, p5.Vector.add(v,v2))
        Matter.Body.setPosition(B, pLimitPos)
        pCurrent = pLimitPos
      }
    }
    else
    {
      if( ( this.distNeg != null )&&(this.distNeg<= vDelta.mag()) )
      {
        let v2 = p5.Vector.sub(pLimitNeg,pCurrent);
        //Matter.Body.setVelocity(this.body, p5.Vector.add(v,v2) )
        Matter.Body.setPosition(B, pLimitNeg)
        pCurrent = pLimitNeg
      }
    }
    

    // Angle
    if( this.fix_angle == true )
    {
      Matter.Body.setAngle(B, this.Follower.rot+rad(rot))
      Matter.Body.setAngularVelocity(B, (B.angle - this.Follower.rot)*0.01)
    }



    // Debug
    if( this.distPos != null )this.debug_pts[0] = pLimitPos
    else                      this.debug_pts[0] = p5.Vector.add( pLine ,p5.Vector.mult(vLine,width*2))

    if( this.distNeg != null )this.debug_pts[1] = pLimitNeg
    else                      this.debug_pts[1] = p5.Vector.add( pLine ,p5.Vector.mult(vLine,width*-2))


  

    // Position override

    if( this.pos_override != null )
    {
      this.current_pos = this.pos_override
      
      let p_override = pLine;
      if( 0 < this.pos_override )
      {
        let v_tmp = p5.Vector.sub(pLimitPos, pLine)
        v_tmp = p5.Vector.mult( v_tmp, this.pos_override);
        p_override.add(v_tmp)
      }
      else
      {
        let v_tmp = p5.Vector.sub(pLimitNeg, pLine)
        v_tmp = p5.Vector.mult( v_tmp, abs(this.pos_override));
        p_override.add(v_tmp)
      }

      Matter.Body.setPosition(B, p_override)
      Matter.Body.setVelocity(B, {x:0,y:0} )
    }


    if(0<dot)
    {
      let vRef = p5.Vector.sub(pLimitPos,pLine);
      if( 0 < vRef.mag() )
      {
        let vCurrent = p5.Vector.sub(pCurrent,pLine);
        this.current_pos = vCurrent.mag() / vRef.mag() 
      }
      else
        this.current_pos = 0
    
    }
    else
    {
      let vRef = p5.Vector.sub(pLimitNeg,pLine);
      if( 0 < vRef.mag() )
      {
        let vCurrent = p5.Vector.sub(pCurrent,pLine);
        this.current_pos = vCurrent.mag() / vRef.mag() *-1
      }
      else
        this.current_pos = 0
    } 
  }


}

class body_build{
  
  constructor( in_options ){
  // Default options
    const defaultOptions = {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      slop: 0,
      box: null,
      type: -1,
      rot: 0,
      limit_rot: null,
      collision_category: utils.collision_category.default,
      collision_mask: utils.collision_category.default,
      fix_rot:false,
      color:utils.color.grey,
      axe_constraint: null,
      density:0.001,
      mass:null,
    };
    const args = { ...defaultOptions, ...in_options };
    
    this.x = args.x
    this.y = args.y
    this.w = args.w
    this.h = args.h
    this.slop = args.slop
    this.rot = rad(args.rot)
    this.extra_rotation = 0
    this.rot_override = null
    this.limit_rot = args.limit_rot
    this.scale = 1.0
    this.collision = args.collision
    this.fix_rot = args.fix_rot
    this.color = args.color
    this.color_base = args.color
    this.collision_category = args.collision_category
    this.collision_mask = args.collision_mask
    this.visibility = 1
    this.visibility_override = true
    this.density = args.density
    this.mass = args.mass

    this.constraints = []
    this.c_axe = null
    if(args.axe_constraint != null)
      this.c_axe = new cns_axe({ Follower:this, ...args.axe_constraint})

    var max_choice = 10
    if(args.type != -1)
      this.type = args.type
    else
      this.type = min(max(Math.round(Matter.Common.random(-1, max_choice+1)),0),max_choice)

    this.shape_vertices = Matter.Vertices.create([], Matter.Body)

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
          this.shape_vertices = Matter.Vertices.create(points_scale, Matter.Body)      
          break;     
        case 6:
          this.w = args.w/2
          var points_scale = []
          for(let i = 0; i < chevron.length;i+=2)
            points_scale.push( { x:chevron[i]*this.w, y:chevron[i+1]*this.w})
          this.shape_vertices = Matter.Vertices.create(points_scale, Matter.Body)      
          break;    
        case 7:
          this.w = args.w/2
          var points_scale = []
          for(let i = 0; i < star.length;i+=2)
            points_scale.push( { x:star[i]*this.w, y:star[i+1]*this.w})
          this.shape_vertices = Matter.Vertices.create(points_scale, Matter.Body)      
          break;   
        case 8:
          this.w = args.w/2
          var points_scale = []
          for(let i = 0; i < horseShoe.length;i+=2)
            points_scale.push( { x:horseShoe[i]*this.w, y:horseShoe[i+1]*this.w})
          this.shape_vertices = Matter.Vertices.create(points_scale, Matter.Body)      
          break;
        case 10:
          //this.w = args.w/2
          //this.h = args.h/2
          break;                                                       
        }
    }


    switch(this.type) {
      case 0:
        this.body = Matter.Bodies.rectangle(this.x, this.y, this.w, this.h);
        Matter.Body.rotate(this.body, this.rot)
        break;
      case 1:
        this.body = Matter.Bodies.circle(this.x, this.y, this.w);
        Matter.Body.rotate(this.body, this.rot)
        break;
      case 2:
        this.body = Matter.Bodies.polygon(this.x, this.y, 3, this.w);
        Matter.Body.rotate(this.body, this.rot)
        break;
      case 3:
        this.body = Matter.Bodies.polygon(this.x, this.y, 5, this.w);
        Matter.Body.rotate(this.body, this.rot)
        break;     
      case 4:
        this.body = Matter.Bodies.polygon(this.x, this.y, 6, this.w);
        Matter.Body.rotate(this.body, this.rot)
        break;  
      case 5:    
        this.body = Matter.Bodies.fromVertices(this.x, this.y, this.shape_vertices)
        Matter.Body.rotate(this.body, this.rot)
        break;     
      case 6: 
        this.body = Matter.Bodies.fromVertices(this.x, this.y, this.shape_vertices)
        Matter.Body.rotate(this.body, this.rot)
        break;    
      case 7:     
        this.body = Matter.Bodies.fromVertices(this.x, this.y, this.shape_vertices)
        Matter.Body.rotate(this.body, this.rot)
        break;   
      case 8:     
        this.body = Matter.Bodies.fromVertices(this.x, this.y, this.shape_vertices)
        Matter.Body.rotate(this.body, this.rot)
        break;      
      case 9:  
        var bodyA = Matter.Bodies.rectangle(this.x, this.y, this.w, this.h/3);   
        var bodyB = Matter.Bodies.rectangle(this.x, this.y, this.w/3, this.h); 
        this.body = Matter.Body.create({parts: [bodyA, bodyB]});
        Matter.Body.rotate(this.body, this.rot)
        break; 
      case 10:  
        this.body = Matter.Bodies.trapezoid(this.x, this.y, this.w, this.h , rad(this.slop*2))
        Matter.Body.rotate(this.body, this.rot)
        break;        
      }

    Matter.Body.setDensity(this.body, this.density)
    if( this.mass != null )
      Matter.Body.setMass(this.body, this.mass)

    if(this.fix_rot)
    {
      var options = {
        bodyA: this.body,
        pA: { x: 0, y: 0 },
        pB: { x: this.x, y: this.y },
        stiffness: 1.0
      }
      this.constraints.push( new constraint_build(options) )
    }

    this.body.collisionFilter = {
      category:this.collision_category,
      group:0,
      mask:this.collision_mask ,
    }

    Matter.Composite.add( engine.world, this.body)

    //this.color = [100,100,100]
    this.colorStroke = [0,0,0]
  }
 




  apply_scale( value )
  {
    this.scale = this.scale*value
    Matter.Body.scale( this.body, value, value, { x : this.body.position.x, y : this.body.position.y })

  }

  set_visibility(value)
  {
    this.visibility = value
    if(this.visibility)
      this.body.collisionFilter.category = this.collision_category
    else
      this.body.collisionFilter.category = utils.collision_category.other
  }

  update()
  {

    if(this.limit_rot!=null)
    {
      if( this.body.angle < this.limit_rot[0] )
      {
        Matter.Body.setAngle(this.body, this.limit_rot[0])
        Matter.Body.setAngularVelocity(this.body, 0)    
    
      }    
      if( this.limit_rot[1] < this.body.angle )
      {
        Matter.Body.setAngle(this.body, this.limit_rot[1])
        Matter.Body.setAngularVelocity(this.body, 0)      
      }    
    }

    if( this.c_axe != null )
      this.c_axe.apply()
 

    if(this.rot_override!=null)
      Matter.Body.setAngle(this.body, this.rot_override )
   
  }

  show(){
    //
    if( (this.visibility == 0 )||(this.visibility_override == false)) 
      return
    push(); // Start a new drawing state

    
    if(this.debug)
    {
      if(( this.c_axe != null)&&(this.c_axe.debug_pts[0]!=null)&&(this.c_axe.enable == true ))
        line(this.c_axe.debug_pts[0].x, this.c_axe.debug_pts[0].y, this.c_axe.debug_pts[1].x, this.c_axe.debug_pts[1].y);
    }


    fill(this.color)
    strokeWeight(1);
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
        circle(0,0,this.w*2*this.scale)
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
      case 9:       
        rectMode(CENTER)
        rect(0,0,this.w/3,this.h)
        rect(0,0,this.w,this.h/3)
        break;      
      case 10:       
        rectMode(CENTER)
        let w = this.w/2
        let h = this.h/2
        let ptA = createVector(-w,  h)
        let ptB = createVector(-w, -h)
        let ptC = createVector( w, -h)
        let ptD = createVector( w,  h)
        let vAB = p5.Vector.sub(ptB, ptA)
        let vDC = p5.Vector.sub(ptC, ptD)
        let slop_rad = rad(this.slop)
        vAB.rotate(slop_rad)
        vDC.rotate(slop_rad*-1)
        vAB.normalize()
        vDC.normalize()
        let new_length = this.h/cos(slop_rad)
        vAB.mult(new_length)
        vDC.mult(new_length)
        ptB = p5.Vector.add(ptA,vAB)
        ptC = p5.Vector.add(ptD,vDC)

        quad(ptA.x, ptA.y, ptB.x, ptB.y, ptC.x, ptC.y, ptD.x, ptD.y);
        break;                                               
      } 
      

    if (this.debug)
    {
      let len = 10
      let wid = 2
      strokeWeight(0);
      fill([255,0,0])
      rect( len/2.0, 0, len, wid)
      fill([0,255,0])
      rect( 0, len/2.0, wid, len)  
    }


    pop(); // Restore original state
  }
}

function apply_force_to_all( vodies, pCenter, toggle )
{
  
  let vFromCenter = p5.Vector.sub(pCenter,createVector(200,200))
  
  if( vFromCenter.mag() < 20 )
  {
    for( let B of bodies )
    {
      let pB = createVector(B.body.position.x,B.body.position.y)

      var v = p5.Vector.sub(pB,pCenter)
      if(toggle)
        v = p5.Vector.sub(pCenter,pB)
      v.normalize()
      v = p5.Vector.mult(v,0.02)
      let v2 = Matter.Vector.create(v.x,v.y)

      Matter.Body.applyForce( B.body, B.body.position,  v2 )  
    }
  }

}

function create_boundary_wall_collision(width,height,ground_enable=true)
{
    // create two boxes and a ground
    let thickness = 100
    ground     = Matter.Bodies.rectangle(  width/2          ,  height+thickness/2, width    , thickness, { isStatic: true });
    wall_left  = Matter.Bodies.rectangle( -thickness/2      ,  height/2          , thickness, height   , { isStatic: true });
    wall_right = Matter.Bodies.rectangle(  width+thickness/2,  height/2          , thickness, height   , { isStatic: true });
    wall_top   = Matter.Bodies.rectangle(  width/2          , -thickness/2       , width    , thickness, { isStatic: true });

    let boundaries = []
    if( ground_enable )
      boundaries.push(ground)
    boundaries.push(wall_left)
    boundaries.push(wall_right)
    boundaries.push(wall_top)


    return boundaries
}







function change_selected_obj(mouse_cns,obj)
{
  let p_local = createVector( 
    mouse_cns.constraint.pointA.x - obj.body.position.x,
    mouse_cns.constraint.pointA.y - obj.body.position.y)

  mouse_cns.constraint.bodyB = obj.body
  mouse_cns.constraint.pointB = {x: p_local.x , y: p_local.y}
  mouse_cns.constraint.angleB = 0
}


class Draw_debug
{
  constructor()
  {
    this.firstPos = null
    this.history =  []
    this.hitHistory = []
    this.traceFrameCount = 6

    this.fidget = null
    this.mouse_cns = null
  }

  draw()
  {
    // text
    let sText = 15;
    let hText = 30;
    strokeWeight(0);   
    textSize(sText);
    fill(255, 255, 255);
    text('frameRate: ' + frameRate() , sText , hText );  
    text('phase: ' + this.fidget.state.phase , sText , hText+=sText); 
    text('phase last: ' + this.fidget.state.phase_last , sText , hText+=sText); 
  
    // mouse
    strokeWeight(10)
    circle(this.mouse_cns.constraint.pointA.x,this.mouse_cns.constraint.pointA.y,10)
    strokeWeight(1)
    
    // mouse B
    let c = color(255, 204, 0);
    fill(c);  
    
    var mouseVector = createVector(0,0)
    if( mouseIsPressed )
    {
      this.history.push( createVector( pmouseX , pmouseY , 20 ) )    
    }
    else if( 0 < this.history.length )
    {
      if(  this.history.length < this.traceFrameCount )
      {
        this.hitHistory.push( this.history[0] )
      }
      else
      {
        var pA = this.history[0]
        var pB = this.history[this.history.length-1]

        mouseVector = p5.Vector.sub(pB,pA)
        var vSide = createVector( mouseVector.y, -mouseVector.x)
        vSide.setMag(10)
        triangle( pA.x+vSide.x, pA.y+vSide.y, pA.x-vSide.x, pA.y-vSide.y, pB.x, pB.y)
      }
      this.history = []
    }
  
    if( 2 < this.history.length )
    {
      for( var i = 0 ; i < this.history.length - 1 ;i++)
        line(this.history[i].x, this.history[i].y, this.history[i+1].x, this.history[i+1].y)    
    }
  
    for(  var j = 0 ; j < this.hitHistory.length ;j++)
    {
      circle( this.hitHistory[j].x, this.hitHistory[j].y , this.hitHistory[j].z);  
      this.hitHistory[j].z -= 1.0;
      this.hitHistory[j].z = max( this.hitHistory[j].z , 0 )
    }
      
  }
}