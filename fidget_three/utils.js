
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


export function convert_coords_matter_to_three(pos,screen_dims)
{
  let x = pos.x()
  let y = pos.y()
  // move origin from up and right corner screen to middle 
  x -= screen_dims.x/2 
  y -= screen_dims.y/2

  //inverse axe y
  y *= -1

  return new Vector(x,y)
}

export function convert_three_to_matter(pos,screen_dims)
{
  let x = pos.x()
  let y = pos.y()
  //inverse axe y
  y *= -1

  // move origin from up and right corner screen to middle 
  x += screen_dims.x/2 
  y += screen_dims.y/2



  return new Vector(x,y)
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
  let p = p_mouse.getSub(p_body)

  mouse_cns.constraint.bodyB = obj.body
  mouse_cns.constraint.pointB = p.get_value() 
  mouse_cns.constraint.angleB = 0
}


export class Draw_text_debug
{
  constructor(screen_dims)
  {
    this.firstPos = null
    this.history =  []
    this.hitHistory = []
    this.traceFrameCount = 6

    this.mouse_cns = null

    this.screen_dims = screen_dims
    this.font = null
    let Chrono = this
    const loader = new FontLoader();
    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {Chrono.font = font})    
  
    this.color = 0xFFFFFF;

    this.matLite = new THREE.MeshBasicMaterial( {
      color: this.color,
      transparent: false,
      opacity: 1.0,
      side: THREE.DoubleSide
    } );

    this.sText = 10;

    this.three_meshs = [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null]
    

  }

  setup_three(scene_three)
  {
    let Debug_inst = this
    const loader = new FontLoader();
    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {    
    
      let pos_x = Debug_inst.screen_dims.x/2*-1
      let hText = 100;
      
      
      for( let i = 0; i < Debug_inst.three_meshs.length ; i++)
      {
        let three_geometry = new THREE.ShapeGeometry( font.generateShapes('') );
        Debug_inst.three_meshs[i] = new THREE.Mesh( three_geometry, Debug_inst.matLite );
        Debug_inst.three_meshs[i].position.x = pos_x
        Debug_inst.three_meshs[i].position.y = hText     
        Debug_inst.three_meshs[i].position.z = 100   
        scene_three.add( Debug_inst.three_meshs[i] );

        hText -= Debug_inst.sText*1.6
      }

    })
    
  }

  update_three(texts_to_draw)
  {
    if( (this.font == null)||(this.three_meshs == null) )
      return false

    for( let i = 0; i < texts_to_draw.length; i++)
      this.three_meshs[i].geometry = new THREE.ShapeGeometry( this.font.generateShapes( texts_to_draw[i], this.sText ) );

    return true
  }
}


export function switch_selection( mouse_cns, next_elem = null , hack = false)
{
  if ( next_elem == null)
  {
    mouse_cns.constraint.bodyB = null
    mouse_cns.constraint.pointB = {x: 0 , y: 0}   
    return; 
  }
  
  let p = new Vector( 
    mouse_cns.constraint.pointA.x - next_elem.body.position.x,
    mouse_cns.constraint.pointA.y - next_elem.body.position.y)
  
  mouse_cns.constraint.bodyB = next_elem.body
  mouse_cns.constraint.pointB = {x: p.x() , y: p.y()}
  if(hack)
    mouse_cns.constraint.pointB = {x: - p.y(), y: p.x()}
  mouse_cns.constraint.angleB = 0
  


}

export function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length-size);
}


export class Chrono
{
  constructor(screen_dims)
  {
    this.p = new Vector(0,0)
    this.s = 1
    this.startTime = null
    this.time_str = '00:00:00'
    this.v = true
    this.three_shape = null
    this.three_geometry = null
    this.three_mesh = null
    this.screen_dims = screen_dims

    this.font = null
    let Chrono = this
    const loader = new FontLoader();
    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {Chrono.font = font})
    this.x_offset_to_center = -40
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

      let converted_pos = convert_coords_matter_to_three(Chrono.p, Chrono.screen_dims)
      Chrono.three_mesh = new THREE.Mesh( Chrono.three_geometry, matLite );
      Chrono.three_mesh.position.z = 150;
      Chrono.three_mesh.position.x = converted_pos.x()+Chrono.x_offset_to_center
      Chrono.three_mesh.position.y = converted_pos.y()
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

    if(this.font == null)
      return false
    this.three_shape = this.font.generateShapes( this.time_str, 50 );
    this.three_geometry = new THREE.ShapeGeometry( this.three_shape );
    this.three_mesh.geometry = this.three_geometry;

    let converted_pos = convert_coords_matter_to_three(this.p, this.screen_dims)
    this.three_mesh.position.x = converted_pos.x()+this.x_offset_to_center
    this.three_mesh.position.y = converted_pos.y()
    //this.three_mesh.position.x = 0//this.p.x()-this.screen_dims.x/2 + this.x_offset_to_center
    //this.three_mesh.position.y = 0//this.p.y()*-1+this.screen_dims.y/2
    this.three_mesh.visible = this.v   
    this.three_mesh.scale.x = this.s*0.015  
    this.three_mesh.scale.y = this.s*0.015  
    this.three_mesh.scale.z = this.s*0.015  


    return true
  }

}

export function clamp(value,min_value,max_value)
{
  return Math.min(max_value,Math.max(min_value,value))
}

export function snap_point_on_line(p_line, v_line,p)
{
  let vDelta = p.getSub(p_line);
  let vDelta_on_line = proj_vector_on_line(v_line, vDelta)//v_line.getMult( vDelta_from_line.dot(v_line) );
  let p_on_line = p_line.getAdd(vDelta_on_line);
  return p_on_line
}

export function proj_vector_on_line(v_line, v)
{
  v_line.normalize()
  let v_proj = v_line.getMult( v.dot(v_line) );
  return v_proj
}


////////////////////////////////////////////////// mouse pressed
// Declare the boolean value as a global variable
export var isMousePressed = false;
export var isScreenTouched = false;
export var userIsInteracting = false;
export var mouseX = 0;
export var mouseY = 0;
// Function to handle the mousedown event
function handleMouseDown(event) {
    isMousePressed = true;
    userIsInteracting = isScreenTouched || isMousePressed
    //console.log('Mouse is pressed:', isMousePressed);
}

// Function to handle the mouseup event
function handleMouseUp(event) {
    isMousePressed = false;
    userIsInteracting = isScreenTouched || isMousePressed
    //console.log('Mouse is pressed:', isMousePressed);
}

// Function to handle the mousemove event
function handleMouseMove(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
  //console.log('Mouse position:', mouseX, mouseY);
}

function handleTouchDown(event) {
  isScreenTouched = true;
  userIsInteracting = isScreenTouched || isMousePressed
  //console.log('Mouse is pressed:', isMousePressed);
}

function handleTouchUp(event) {
  isScreenTouched = true;
  userIsInteracting = isScreenTouched || isMousePressed
  //console.log('Mouse is pressed:', isMousePressed);
}


function handleTouchMove(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
  //console.log('Mouse is pressed:', isMousePressed);
}

// Attach event listeners when the document is fully loaded
window.onload = function() {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchstart', handleTouchDown);
    document.addEventListener('touchend', handleTouchUp);
    document.addEventListener('touchmove', handleTouchMove);    
}
////////////////////////////////////////////////// mouse pressed


/*
// Get the status div
const statusDiv = document.getElementById('status');

// Function to update status
function updateStatus(message) {
    statusDiv.textContent = message;
}

// Add touch event listeners to the document
document.addEventListener('touchstart', function(event) {
    updateStatus('Screen touched');
    console.log('Touch start:', event.touches);
    isMousePressed = true;
    isScreenTouched = true;
}, false);

document.addEventListener('touchmove', function(event) {
    updateStatus('Touch moving');
    console.log('Touch move:', event.touches);
    isMousePressed = true;
}, false);

document.addEventListener('touchend', function(event) {
    updateStatus('Touch ended');
    console.log('Touch end:', event.changedTouches);
    isMousePressed = false;
    isScreenTouched = false;
}, false);

*/


















