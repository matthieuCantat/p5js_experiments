
import Vector from './vector.js';
//import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import * as THREE from 'three';

////////////////////////////////////////////// utils
export function rad(value)
{
  return value*Math.PI/180
}
export function deg(value)
{
  return value/Math.PI*180
}

// provide concave decomposition support library
//Matter.Common.setDecomp(decomp)//Matter.Common.setDecomp(require('poly-decomp'));


export var utils = {
  color:{
    black : [0,0,0], 
    white : [250,250,250],
    red : [255,50,50], 
    green : [50,255,50],
    blue : [50,50,255],
    yellow : [250,250,0], 
    cyan : [0,250,250], 
    magenta : [250,0,250], 
    silver : [192,192,192],
    grey : [110,110,110],
    maroon : [128,50,50],
    olive : [128,128,50],
    teal: [0,128,128], 
    navy: [0,0,128], 
    purple:[128,0,128], 
    aquamarine:[128,250,212], 
    turquoise:[64,224,208 ], 
    paleGreen:[152,251,152 ], 
    skyBlue:[135,206,235 ], 
    violet:[238,130,238 ], 
    orangeRed:[255,69,0], 
    tomato:[255,99,71 ], 
    khaki:[240,230,140 ], 
    chocolate:[210,105,30 ], 
    lavender:[230,230,250 ], 
    sienna:[160,82,45 ], 
    rosyBrown:[188,143,143 ], 
    dark : [50,50,50],
    greyLight : [130,130,130],
    redLight : [130,50,50],
    gold : [170,130,0],  
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
    arc:11,
  }
}


export class constraint_build{
  
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
      matter_engine:null,
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
    this.matter_engine = args.matter_engine

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

    Matter.Composite.add( this.matter_engine.world, [ this.cns ])

    this.color = [100,100,100]
    this.colorStroke = [0,0,0]

  }

  update()
  {
    this.cns.pointB = this.pB
  }

  draw(p5){
    //
    p5.push(); // Start a new drawing state
    p5.fill(this.color)
    p5.strokeWeight(4);
    //p5.stroke(this.colorStroke)

    //p5.translate(this.body.position.x,this.body.position.y)
    //p5.rotate(this.body.angle);

    switch(this.type) {
      case 0:
        var pA = {x:this.cns.pointA.x, y:this.cns.pointA.y}
        if(this.cns.bodyA != null)
          pA = {x:this.cns.bodyA.position.x+this.cns.pointA.x, y:this.cns.bodyA.position.y+this.cns.pointA.y}
        var pB = {x:this.cns.pointB.x,y:this.cns.pointB.y}
        if(this.cns.bodyB != null)
          pB = {x:this.cns.bodyB.position.x+this.cns.pointB.x, y:this.cns.bodyB.position.y+this.cns.pointB.y}

          p5.line( pA.x, pA.y,pB.x, pB.y)
        break                                       
      }    
      p5.pop(); // Restore original state

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


export class cns_axe{

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
      axe_rotation_center:new Vector(0,0),     
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
      this.vLineBase = null
      if( args.axe == 0 )
        this.vLineBase = new Vector(1,0)
      else
        this.vLineBase = new Vector(0,1)

      if( this.Follower.rot != null)
        this.vLineBase.rotate(this.Follower.rot)
    }

    if( ( this.pLineBase == null )&&( this.Follower != null) )
      this.pLineBase = this.Follower.get_matrix().get_row(2)
  }


  apply()
  {

    if( this.Follower != null)
      this.pLineBase = this.Follower.get_matrix().get_row(2)

    

    let rot = this.axe_rotation 
    let rot_center = this.axe_rotation_center 

    //let extra_rotation_center = new Vector(200,200)
    if( this.enable == false)
      return

    let vLine = new Vector(this.vLineBase)
    let pLine = new Vector(this.pLineBase)

    // Update axe postion rotation
    vLine.rotate(rad(rot))
    let vTmp = pLine.getSub(rot_center)
    vTmp.rotate(rad(rot))
    pLine = rot_center.getAdd(vTmp)


    
    // Set Follower on the line
    
    let pCurrent = this.Follower.get_position();
    let vDelta = pCurrent.getSub(pLine);
    let vToClosestPoint = vLine.getMult( vDelta.dot(vLine) );
    let pClosest = pLine.getAdd(vToClosestPoint);

    let velCurrent = this.Follower.get_velocity();
    let vVelProj = vLine.getMult( velCurrent.dot(vLine) );

    if( pClosest != pCurrent)
    {
      this.Follower.set_velocity(vVelProj)
      this.Follower.set_position(pClosest)
      pCurrent = pClosest
    }

    
    // Set limit
    var pLimitPos = new Vector()
    if( this.distPos != null )
    {
      let vToLimit = new Vector(vLine)
      vToLimit.normalize().mult(this.distPos)
      pLimitPos = vToLimit.getAdd(pLine)
    }

    var pLimitNeg = new Vector()
    if( this.distNeg != null )
    {
      let vToLimit = new Vector(vLine)
      vToLimit.normalize().mult(this.distNeg*-1)
      pLimitNeg = vToLimit.getAdd(pLine)
    }

    vDelta = pCurrent.getSub(pLine);
    let dot = vDelta.getNormalized().dot(vLine.getNormalized())
    if(0<dot)
    {
      if( ( this.distPos != null )&&(this.distPos<= vDelta.mag()) )
      {
        this.Follower.set_position(pLimitPos)
        pCurrent = pLimitPos
      }
    }
    else
    {
      if( ( this.distNeg != null )&&(this.distNeg<= vDelta.mag()) )
      {
        this.Follower.set_position(pLimitNeg)
        pCurrent = pLimitNeg
      }
    }
    

    // Angle
    if( this.fix_angle == true )
    {
      this.Follower.set_angle(rad(rot))
      this.Follower.set_anglular_velocity((this.Follower.body.angle - this.Follower.rot)*0.01)
    }


    // Debug
    if( this.distPos != null )this.debug_pts[0] = pLimitPos
    else                      this.debug_pts[0] = vLine.getMult(width*2).add(pLine)

    if( this.distNeg != null )this.debug_pts[1] = pLimitNeg
    else                      this.debug_pts[1] = vLine.getMult(width*-2).add(pLine)


  

    // Position override
    
    if( this.pos_override != null )
    {
      this.current_pos = this.pos_override
      
      let p_override = pLine;
      if( 0 < this.pos_override )
      {
        let v_tmp = pLimitPos.getSub(pLine).mult(this.pos_override)
        p_override.add(v_tmp)
      }
      else
      {
        let v_tmp = pLimitNeg.getSub(pLine).mult(this.pos_override*-1)
        p_override.add(v_tmp)
      }
      this.Follower.set_position(p_override)
      this.Follower.set_velocity(new Vector())
    }
    else{

      if(0<dot)
      {
        let vRef = pLimitPos.getSub(pLine)
        if( 0 < vRef.mag() )
        {
          let vCurrent = pCurrent.getSub(pLine)
          this.current_pos = vCurrent.mag() / vRef.mag() 
        }
        else
          this.current_pos = 0
      
      }
      else
      {
        let vRef = pLimitNeg.getSub(pLine)
        if( 0 < vRef.mag() )
        {
          let vCurrent = pCurrent.getSub(pLine)
          this.current_pos = vCurrent.mag() / vRef.mag() *-1
        }
        else
          this.current_pos = 0
      } 
      
    }


  }


}

export function apply_force_to_all( bodies, pCenter, toggle )
{
  
  let vFromCenter = pCenter.getSub(new Vector(200,200))
  
  if( vFromCenter.mag() < 20 )
  {
    for( let B of bodies )
    {
      let pB = new Vector(B.body.position.x,B.body.position.y)

      var v = pB.getSub(pCenter)
      if(toggle)
        v = pCenter.getSub(pB)
      v.normalize()
      v.mult(0.02)

      B.apply_force(B.get_position(),v)

    }
  }

}

export function create_boundary_wall_collision(width,height,ground_enable=true)
{
    // create two boxes and a ground
    let thickness = 100
    let ground     = Matter.Bodies.rectangle(  width/2          ,  height+thickness/2, width    , thickness, { isStatic: true });
    let wall_left  = Matter.Bodies.rectangle( -thickness/2      ,  height/2          , thickness, height   , { isStatic: true });
    let wall_right = Matter.Bodies.rectangle(  width+thickness/2,  height/2          , thickness, height   , { isStatic: true });
    let wall_top   = Matter.Bodies.rectangle(  width/2          , -thickness/2       , width    , thickness, { isStatic: true });

    let boundaries = []
    if( ground_enable )
      boundaries.push(ground)
    boundaries.push(wall_left)
    boundaries.push(wall_right)
    boundaries.push(wall_top)


    return boundaries
}







export function change_selected_obj(mouse_cns,obj)
{

  let p_body = obj.get_position()
  let p_mouse = new Vector( 
    mouse_cns.constraint.pointA.x,
    mouse_cns.constraint.pointA.y)
  let p_local = p_mouse.getSub(p_body)

  mouse_cns.constraint.bodyB = obj.body
  mouse_cns.constraint.pointB = p_local.get_value() 
  mouse_cns.constraint.angleB = 0
}


export class Draw_debug
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

  draw(p5)
  {
    // text
    let sText = 10;
    let hText = 30;
    p5.strokeWeight(0);   
    p5.textSize(sText);
    p5.fill(255, 255, 255);
    p5.text('frameRate : ' + Math.round( p5.frameRate(), 2 ) , sText , hText );   
    p5.text(' '  , sText , hText+=sText );   
    p5.text('count : ' + this.fidget.state.update_count , sText , hText+=sText); 
    p5.text('res : ' + Math.round( this.fidget.state.resolution_coef, 2 ) + ' / 4' , sText , hText+=sText); 
    p5.text('last selection switch step : ' + this.fidget.state.switch_selection_happened_step , sText , hText+=sText); 
    p5.text(' '  , sText , hText+=sText );  

    p5.fill(255, 255, 255);
    if( this.fidget.state.steps[0].in_use )
      p5.fill(255, 255, 0);
    p5.text('0 - count: ' + this.fidget.state.steps[0].update_count , sText , hText+=sText); 
    p5.text('0 - res: ' + Math.round( this.fidget.state.steps[0].resoluton_coef, 2) + ' / 1' , sText , hText+=sText); 
    p5.text(' '  , sText , hText+=sText );   

    p5.fill(255, 255, 255);
    if( this.fidget.state.steps[1].in_use )
      p5.fill(255, 255, 0)

    p5.text('1 - count: ' + this.fidget.state.steps[1].update_count , sText , hText+=sText); 
    p5.text('1 - res Coef: ' + Math.round( this.fidget.state.steps[1].resoluton_coef, 2) + ' / 1' , sText , hText+=sText);        
    p5.text(' '  , sText , hText+=sText );   

    p5.fill(255, 255, 255);
    if( this.fidget.state.steps[2].in_use )
      p5.fill(255, 255, 0)

    p5.text('2 - count: ' + this.fidget.state.steps[2].update_count , sText , hText+=sText); 
    p5.text('2 - res Coef: ' + Math.round( this.fidget.state.steps[2].resoluton_coef, 2) + ' / 1' , sText , hText+=sText);    
    p5.text(' '  , sText , hText+=sText );   

    p5.fill(255, 255, 255);
    if( this.fidget.state.steps[3].in_use )
      p5.fill(255, 255, 0)

    p5.text('3 - count: ' + this.fidget.state.steps[3].update_count , sText , hText+=sText); 
    p5.text('3 - res Coef: ' + Math.round( this.fidget.state.steps[3].resoluton_coef, 2) + ' / 1' , sText , hText+=sText); 
    p5.text(' '  , sText , hText+=sText );   

    p5.fill(255, 255, 255);
    if( this.fidget.state.steps[4].in_use )
      p5.fill(255, 255, 0)

    p5.text('4 - count: ' + this.fidget.state.steps[4].update_count , sText , hText+=sText); 
    p5.text('4 - res Coef: ' + Math.round( this.fidget.state.steps[4].resoluton_coef, 2) + ' / 1' , sText , hText+=sText); 
    p5.text(' '  , sText , hText+=sText );   

    p5.fill(255, 255, 255);
    if( this.fidget.state.steps[5].in_use )
      p5.fill(255, 255, 0)    

    p5.text('5 - count: ' + this.fidget.state.steps[5].update_count , sText , hText+=sText); 
    p5.text('5 - res Coef: ' + Math.round( this.fidget.state.steps[5].resoluton_coef, 2) + ' / 1' , sText , hText+=sText);
    
    p5.fill(255, 255, 255);

    // mouse
    p5.strokeWeight(10)
    p5.circle(this.mouse_cns.constraint.pointA.x,this.mouse_cns.constraint.pointA.y,10)
    p5.strokeWeight(1)
    
    // mouse B
    let c = p5.color(255, 204, 0);
    p5.fill(c);  
    
    var mouseVector = new Vector(0,0)
    if( p5.mouseIsPressed )
    {
      this.history.push( new Vector( p5.pmouseX , p5.pmouseY , 20 ) )    
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

        mouseVector = pB.getSub(pA)
        var vSide = new Vector( mouseVector.y, -mouseVector.x)
        vSide.setScale(10)
        p5.triangle( pA.x()+vSide.x(), pA.y()+vSide.y(), pA.x()-vSide.x(), pA.y()-vSide.y(), pB.x(), pB.y())
      }
      this.history = []
    }
  
    if( 2 < this.history.length )
    {
      for( var i = 0 ; i < this.history.length - 1 ;i++)
      p5.line(this.history[i].x, this.history[i].y, this.history[i+1].x, this.history[i+1].y)    
    }
  
    for(  var j = 0 ; j < this.hitHistory.length ;j++)
    {
      p5.circle( this.hitHistory[j].x, this.hitHistory[j].y , this.hitHistory[j].z);  
      this.hitHistory[j].z -= 1.0;
      this.hitHistory[j].z = Math.max( this.hitHistory[j].z , 0 )
    }
      
  }
}

/*
export function arrowHead(start, vector, s = 1) {



  var norm = new Vector(vector.x, vector.y);
  norm.normalize();
  norm.mult(12)
  norm.mult(s)

  triangle(start.x-norm.y/2   , start.y+norm.x/2, 
           start.x+norm.x   , start.y+norm.y, 
           start.x+norm.y/2   , start.y-norm.x/2);


}

export function arrowHeads(start, vector, s = 1) {

  
  arrowHead(start, vector, s)
  let v_offset = p5.Vector.mult(vector,15*s)
  let p = p5.Vector.add( start,v_offset)
  arrowHead(p,vector, s)  
  p = p5.Vector.add( start,p5.Vector.mult(v_offset,2))
  arrowHead(p, vector, s)  
}
*/


export function switch_selection( mouse_cns, next_elem = null , hack = false)
{
  if ( next_elem == null)
  {
    mouse_cns.constraint.bodyB = null
    mouse_cns.constraint.pointB = {x: 0 , y: 0}   
    return; 
  }
  
  let p_local = new Vector( 
    mouse_cns.constraint.pointA.x - next_elem.body.position.x,
    mouse_cns.constraint.pointA.y - next_elem.body.position.y)
  
  mouse_cns.constraint.bodyB = next_elem.body
  mouse_cns.constraint.pointB = {x: p_local.x() , y: p_local.y()}
  if(hack)
    mouse_cns.constraint.pointB = {x: - p_local.y(), y: p_local.x()}
  mouse_cns.constraint.angleB = 0
  


}

export function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length-size);
}


export class Chrono
{
  constructor()
  {
    this.p = new Vector(0,0)
    this.s = 1
    this.startTime = null
    this.time_str = '00:00:00'
    this.v = true
    this.three_shape = null
    this.three_geometry = null
    this.three_mesh = null

    this.font = null
    let Chrono = this
    const loader = new FontLoader();
    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {Chrono.font = font})
  }

  setup_three(scene_three)
  {
    let Chrono = this
    const loader = new FontLoader();
    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

      const color = 0xFFFFFF;

      const matLite = new THREE.MeshBasicMaterial( {
        color: color,
        transparent: false,
        opacity: 1.0,
        side: THREE.DoubleSide
      } );


      Chrono.three_shape = font.generateShapes( Chrono.time_str, 50 );
      Chrono.three_geometry = new THREE.ShapeGeometry( Chrono.three_shape );

      // make shape ( N.B. edge view not visible )

      Chrono.three_mesh = new THREE.Mesh( Chrono.three_geometry, matLite );
      Chrono.three_mesh.position.z = 150;
      Chrono.three_mesh.position.x = Chrono.p.x()-240
      Chrono.three_mesh.position.y = Chrono.p.y()*-1+200
      Chrono.three_mesh.visible = Chrono.v   
      Chrono.three_mesh.scale.x = Chrono.s*0.015  
      Chrono.three_mesh.scale.y = Chrono.s*0.015  
      Chrono.three_mesh.scale.z = Chrono.s*0.015        
      scene_three.add( Chrono.three_mesh );
    } ); //end load function   
    

  }

  start()
  {
    this.startTime = (new Date()).valueOf();
  }

  stop()
  {
    this.startTime = null;
  } 

  is_at_start()
  {
    return this.startTime == null;
  }


  getHMS(m ) {
    return [10,1000, 1000 * 60, 1000 * 60 * 60]
      .reduce((hms, scl) => {
        let gimmeTime = Math.floor((m / scl) % 60);
        hms.push(gimmeTime);
        return hms;
      }, []);
  }

  update() {
    if( this.startTime == null )
      return;
    const currentTime = (new Date()).valueOf();
    const deltaTime = (currentTime - this.startTime);
    const [ml,sec, min, hr] = this.getHMS(deltaTime);
    const time = `${pad(min,2)}:${pad(sec,2)}:${pad(ml,2)}`;
    this.time_str = time
  }

  draw(p5)
  {
    if(this.v == false)
      return
    p5.fill(255);
    p5.textSize(this.s);
    p5.textAlign(p5.CENTER);
    p5.text(this.time_str, this.p.x(), this.p.y());
  }

  update_three(group)
  {
    /*
    group.remove( textMesh1 );
   
    textGeo = new TextGeometry( text, {

      font: font,

      size: size,
      depth: depth,
      curveSegments: curveSegments,

      bevelThickness: bevelThickness,
      bevelSize: bevelSize,
      bevelEnabled: bevelEnabled

    } );

    textGeo.computeBoundingBox();

    const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

    textMesh1 = new THREE.Mesh( textGeo, materials );

    textMesh1.position.x = centerOffset;
    textMesh1.position.y = hover;
    textMesh1.position.z = 0;

    textMesh1.rotation.x = 0;
    textMesh1.rotation.y = Math.PI * 2;

    group.add( textMesh1 );
    */


    this.three_shape = this.font.generateShapes( this.time_str, 50 );
    this.three_geometry = new THREE.ShapeGeometry( this.three_shape );
    this.three_mesh.geometry = this.three_geometry;

    this.three_mesh.position.x = this.p.x()-240
    this.three_mesh.position.y = this.p.y()*-1+200
    this.three_mesh.visible = this.v   
    this.three_mesh.scale.x = this.s*0.015  
    this.three_mesh.scale.y = this.s*0.015  
    this.three_mesh.scale.z = this.s*0.015  



  }

}

export function clamp(value,min_value,max_value)
{
  return Math.min(max_value,Math.max(min_value,value))
}


////////////////////////////////////////////////// mouse pressed
// Declare the boolean value as a global variable
export var isMousePressed = false;
export var mouseX = 0;
export var mouseY = 0;
// Function to handle the mousedown event
function handleMouseDown(event) {
    isMousePressed = true;
    //console.log('Mouse is pressed:', isMousePressed);
}

// Function to handle the mouseup event
function handleMouseUp(event) {
    isMousePressed = false;
    //console.log('Mouse is pressed:', isMousePressed);
}

// Function to handle the mousemove event
function handleMouseMove(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
  //console.log('Mouse position:', mouseX, mouseY);
}

// Attach event listeners when the document is fully loaded
window.onload = function() {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
}
////////////////////////////////////////////////// mouse pressed






















