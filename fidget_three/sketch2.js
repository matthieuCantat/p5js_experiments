





import './libraries/matter.js';
import Vector from './vector.js'
import Matrix from './matrix.js'
import { utils, 
         create_boundary_wall_collision,
         rad} from './utils.js';
import fidgets_sequence from './fidgets_sequence.js'
import shader_build from './shader.js';

// prevents the mobile browser from processing some default
// touch events, like swiping left for "back" or scrolling
// the page.

document.ontouchmove = function(event) {
  event.preventDefault();
};


// Disable pull-to-refresh using JavaScript
document.body.addEventListener('touchmove', function(event) {
event.preventDefault();
}, { passive: false });


var matter_engine = Matter.Engine.create();

var mouseConstraint = Matter.MouseConstraint.create(matter_engine, {
  //mouse: mouse,
  collisionFilter: {category: utils.collision_category.mouse, mask: utils.collision_category.inter}, // <---
  constraint: {
      // allow bodies on mouse to rotate
      angularStiffness: 0,
      render: {
          visible: false
      }
  }
});


Matter.Composite.add(matter_engine.world, mouseConstraint);


/////////////////////////////////////////// setup screen
let width       = 400
let height      = 400
//width = window.innerWidth;
//height = window.innerHeight;
let screen_dims = {x:width,y:height}

/////////////////////////////////////////// setup game
var nbr = 1
var debug = false

var use_webgl = false
var shaders_nbr = 0

var ground_enable = false
var do_shdr_test = false

var draw_p5 = false

/////////////////////////////////////////// variables
var F_sequence = null
var shdrs = [] 

var shdr_test = null

var end_update_count = 0
var draw_count = 0;

let pM;

//////////////////////////////////////////// setup
let shader_resolution_div = 1.;
if( shdrs.length != 0 )
{
  shdrs[0].setup(p5,{x:100/shader_resolution_div,y:50/shader_resolution_div})  
  shdrs[1].setup(p5,{x:width/2/shader_resolution_div,y:height/shader_resolution_div})
}

if(do_shdr_test)
  shdr_test.setup(p5,{x:width/shader_resolution_div,y:height/shader_resolution_div})


Matter.Composite.add(matter_engine.world, create_boundary_wall_collision(width,height,ground_enable));

var runner = Matter.Runner.create();
Matter.Runner.run(runner, matter_engine);

matter_engine.gravity.scale = 0.0

let m = new Matrix()
m.setTranslation(width/2, height/2 )

let s = 2.2
F_sequence = new fidgets_sequence(nbr,m,s,screen_dims,matter_engine,mouseConstraint,shdrs,debug,use_webgl)
F_sequence.setup()



new p5(function(p5)
{
  

  p5.preload = function()
  {
    console.log('preload : sketch')
    for( let i =0; i < shaders_nbr; i++)
    {
      shdrs.push(new shader_build());
      shdrs[i].preload(p5);
    }
  
    if(do_shdr_test)
    {
      shdr_test = new shader_build()
      shdr_test.preload(p5)
    }
  }



  p5.setup = function()
  {
    console.log('setup : sketch')

    if(draw_p5)
    {
      if(use_webgl)
      {
        p5.createCanvas(width, height,p5.WEBGL);
        p5.drawingContext.getExtension("OES_standard_derivatives");
        //p5.pixelDensity(1);
        p5.noStroke();
        //p5.stroke(0);
      }
      else
      {
        p5.createCanvas(width, height);
        //pixelDensity(2);
      }
    }

  
  }

  p5.draw = function()
  {

    if( p5.mouseIsPressed == false)pM = null
    if( p5.touches.lengh  == 0    )pM = null
  
  
    //if( pM != null )
    //  circle(pM.x,pM.y,10)
  
    if(do_shdr_test)
    {
      shdr_test.iFrame = draw_count;
      shdr_test.iTime = p5.millis() / 1000.0; 
      shdr_test.iMouse = { x: 0, y: 0};
    
      shdr_test.bg_animation = 1.
      shdr_test.bg_grain = 1.
      shdr_test.bg_grain_scale = 14.
      shdr_test.bg_grid = 0.0
      shdr_test.bg_grid_scale = 10.0
      shdr_test.bg_grid_line_scale =  2.0
      shdr_test.bg_grid_point_scale =  2.0
    
      shdr_test.bg_typeA = 0.0;
      shdr_test.bg_typeB = 0.0;
      shdr_test.bg_typeC = 1.0;
      shdr_test.bg_typeD = 0.;
      shdr_test.bg_type_discoTarget= 0.;
    
      shdr_test.light_beam = 0.0
      shdr_test.debug = 0    
    
      shdr_test.update()
      shdr_test.as_image();
    }
    else{
      F_sequence.update()
      F_sequence.draw(p5)

    }
    draw_count += 1

  }


});




















import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { cos, sin } from './libraries/jsm/nodes/Nodes.js';



let container, stats;

let camera, scene, renderer;

let group;

let targetRotation = 0;
let targetRotationOnPointerDown = 0;

let pointerX = 0;
let pointerXOnPointerDown = 0;

let windowHalfX = width/ 2;

let anim_pos = 0;
let anim_rot = 0;

let uniforms;


init();

function roundedRect( width, height, radius ) {

    let x = 0;
    let y = 0;
    let w = width/2.0;
    let h = height/2.0;
    
    let ctx = new THREE.Shape() 
    ctx.moveTo( x-w, y-h + radius );
    ctx.lineTo( x-w, y-h + height - radius );
    ctx.quadraticCurveTo( x-w, y-h + height, x-w + radius, y-h + height );
    ctx.lineTo( x-w + width - radius, y-h + height );
    ctx.quadraticCurveTo( x-w + width, y-h + height, x-w + width, y-h + height - radius );
    ctx.lineTo( x-w + width, y-h + radius );
    ctx.quadraticCurveTo( x-w + width, y-h, x-w + width - radius, y-h );
    ctx.lineTo( x-w + radius, y-h );
    ctx.quadraticCurveTo( x-w, y-h, x-w, y-h + radius );
    return ctx
}

function roundedTrap( width, height, slop, radius ) {

    let w = width/2.0;
    let h = height/2.0;
   
    let ptA = new Vector(-w,  h)
    let ptB = new Vector(-w, -h)
    let ptC = new Vector( w, -h)
    let ptD = new Vector( w,  h)

    let vAB = ptA.getSub(ptB)
    let vDC = ptD.getSub(ptC)
    let slop_rad = rad(slop)
    vAB.rotate(slop_rad)
    vDC.rotate(slop_rad*-1)
    vAB.normalize()
    vDC.normalize()
    let new_length = height/Math.cos(slop_rad)
    vAB.mult(new_length)
    vDC.mult(new_length)
    ptA = ptB.getAdd(vAB)
    ptD = ptC.getAdd(vDC)    


    let ctx = new THREE.Shape() 
    ctx.moveTo( ptB.x(), ptB.y() + radius );
    ctx.lineTo( ptA.x(), ptA.y() - radius );
    ctx.quadraticCurveTo( ptA.x(), ptA.y(), ptA.x() + radius, ptA.y() );
    ctx.lineTo( ptD.x() - radius, ptD.y() );
    ctx.quadraticCurveTo( ptD.x(), ptD.y(), ptD.x(), ptD.y() - radius );
    ctx.lineTo( ptC.x(), ptC.y() + radius );
    ctx.quadraticCurveTo( ptC.x(), ptC.y(), ptC.x() - radius, ptC.y() );
    ctx.lineTo( ptB.x() + radius, ptB.y() );
    ctx.quadraticCurveTo( ptB.x(), ptB.y(), ptB.x(), ptB.y() + radius );
    return ctx
}



function circle( radius ) {

    let ctx = new THREE.Shape()
    ctx.moveTo( 0, radius )

    let nbr_sample = 8*4
    let step = 3.14*2/nbr_sample
    let current = 0
    for( let i = 1; i < nbr_sample+1; i+=2)
    {
        current += step
        let pA = { x:Math.sin(current)*radius, y:Math.cos(current)*radius}
        current += step
        let pB = { x:Math.sin(current)*radius, y:Math.cos(current)*radius}
        ctx.quadraticCurveTo( pA.x, pA.y, pB.x, pB.y )
    }

      
    return ctx
}

function init() {


    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );


    camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    camera.position.set( 0, 50, 500 );
    scene.add( camera );

    const light = new THREE.PointLight( 0xffffff, 2.5, 0, 0 );
    camera.add( light );

    group = new THREE.Group();
    group.position.y = 50;
    scene.add( group );

    const loader = new THREE.TextureLoader();
    const texture = loader.load( 'textures/uv_grid_opengl.jpg' );
    texture.colorSpace = THREE.SRGBColorSpace;

    // it's necessary to apply these settings in order to correctly display the texture on a shape geometry

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 0.008, 0.008 );

    function addShape( shape) {

        // flat shape with texture
        // note: default UVs generated by THREE.ShapeGeometry are simply the x- and y-coordinates of the vertices

        let geometry = new THREE.ShapeGeometry( shape );

        let mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: texture } ) );
        //mesh.position.set( x, y, z );
        //mesh.rotation.set( rx, ry, rz );
        //mesh.scale.set( s, s, s );
        group.add( mesh );
    }



    addShape( roundedRect( F_sequence.fidgets[0].bodies.geos.rectangles[0].w, F_sequence.fidgets[0].bodies.geos.rectangles[0].h, 2 ) );
    addShape( roundedRect( F_sequence.fidgets[0].bodies.geos.rectangles[1].w, F_sequence.fidgets[0].bodies.geos.rectangles[1].h, 2 ) );
    addShape( roundedRect( F_sequence.fidgets[0].bodies.geos.rectangles[2].w, F_sequence.fidgets[0].bodies.geos.rectangles[2].h, 2 ) );
    addShape( roundedRect( F_sequence.fidgets[0].bodies.geos.rectangles[3].w, F_sequence.fidgets[0].bodies.geos.rectangles[3].h, 2 ) );

    addShape( roundedTrap( F_sequence.fidgets[0].bodies.geos.trapezoids[0].w, F_sequence.fidgets[0].bodies.geos.trapezoids[0].h, -45, 0 ) );
    addShape( roundedTrap( F_sequence.fidgets[0].bodies.geos.trapezoids[1].w, F_sequence.fidgets[0].bodies.geos.trapezoids[1].h, -45, 0 ) );
    addShape( roundedTrap( F_sequence.fidgets[0].bodies.geos.trapezoids[2].w, F_sequence.fidgets[0].bodies.geos.trapezoids[2].h, -45, 0 ) );
    addShape( roundedTrap( F_sequence.fidgets[0].bodies.geos.trapezoids[3].w, F_sequence.fidgets[0].bodies.geos.trapezoids[3].h, -45, 0 ) );

    addShape( circle(F_sequence.fidgets[0].bodies.geos.circle.w) );
    
    
    ///////////////// Background shader
    uniforms = {
        time: { value: 1.0 }
    };

    const geometry = new THREE.PlaneGeometry( 2, 2 );
    uniforms = {
        time: { value: 1.0 }
    };

    const material = new THREE.ShaderMaterial( {

        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent

    } );

    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );	
    
    /////////////////


    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width, height );
    renderer.setAnimationLoop( animate );
    container.appendChild( renderer.domElement );

    stats = new Stats();
    container.appendChild( stats.dom );

    container.style.touchAction = 'none';
    container.addEventListener( 'pointerdown', onPointerDown );

    //

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    windowHalfX = width / 2;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height);

}

//

function onPointerDown( event ) {

    if ( event.isPrimary === false ) return;

    pointerXOnPointerDown = event.clientX - windowHalfX;
    targetRotationOnPointerDown = targetRotation;

    document.addEventListener( 'pointermove', onPointerMove );
    document.addEventListener( 'pointerup', onPointerUp );

}

function onPointerMove( event ) {

    if ( event.isPrimary === false ) return;

    pointerX = event.clientX - windowHalfX;

    targetRotation = targetRotationOnPointerDown + ( pointerX - pointerXOnPointerDown ) * 0.02;

}

function onPointerUp() {

    if ( event.isPrimary === false ) return;

    document.removeEventListener( 'pointermove', onPointerMove );
    document.removeEventListener( 'pointerup', onPointerUp );

}

//

function animate() {
    anim_pos += 1;

    let pos;
    let rot;


    
    pos = F_sequence.fidgets[0].bodies.geos.rectangles[0].get_position()
    rot = F_sequence.fidgets[0].bodies.geos.rectangles[0].get_rotation()
    group.children[0].position.x = pos.x()-200
    group.children[0].position.y = pos.y()*-1+200
    group.children[0].rotation.z = rot*-1
    group.children[0].visible = F_sequence.fidgets[0].bodies.geos.rectangles[0].get_visibility() == 1

    pos = F_sequence.fidgets[0].bodies.geos.rectangles[1].get_position()
    rot = F_sequence.fidgets[0].bodies.geos.rectangles[1].get_rotation()
    group.children[1].position.x = pos.x()-200
    group.children[1].position.y = pos.y()*-1+200
    group.children[1].rotation.z = rot*-1
    group.children[1].visible = F_sequence.fidgets[0].bodies.geos.rectangles[1].get_visibility() == 1

    pos = F_sequence.fidgets[0].bodies.geos.rectangles[2].get_position()
    rot = F_sequence.fidgets[0].bodies.geos.rectangles[2].get_rotation()
    group.children[2].position.x = pos.x()-200
    group.children[2].position.y = pos.y()*-1+200
    group.children[2].rotation.z = rot*-1
    group.children[2].visible = F_sequence.fidgets[0].bodies.geos.rectangles[2].get_visibility() == 1

    
    pos = F_sequence.fidgets[0].bodies.geos.rectangles[3].get_position()
    rot = F_sequence.fidgets[0].bodies.geos.rectangles[3].get_rotation()
    group.children[3].position.x = pos.x()-200
    group.children[3].position.y = pos.y()*-1+200
    group.children[3].rotation.z = rot*-1
    group.children[3].visible = F_sequence.fidgets[0].bodies.geos.rectangles[3].get_visibility() == 1

    ///////////////////////////////////////////////

    pos = F_sequence.fidgets[0].bodies.geos.trapezoids[0].get_position()
    rot = F_sequence.fidgets[0].bodies.geos.trapezoids[0].get_rotation()
    group.children[4].position.x = pos.x()-200
    group.children[4].position.y = pos.y()*-1+200
    group.children[4].rotation.z = rot*-1
    group.children[4].visible = F_sequence.fidgets[0].bodies.geos.trapezoids[0].get_visibility() == 1
    
    pos = F_sequence.fidgets[0].bodies.geos.trapezoids[1].get_position()
    rot = F_sequence.fidgets[0].bodies.geos.trapezoids[1].get_rotation()
    group.children[5].position.x = pos.x()-200
    group.children[5].position.y = pos.y()*-1+200
    group.children[5].rotation.z = rot*-1
    group.children[5].visible = F_sequence.fidgets[0].bodies.geos.trapezoids[1].get_visibility() == 1

    pos = F_sequence.fidgets[0].bodies.geos.trapezoids[2].get_position()
    rot = F_sequence.fidgets[0].bodies.geos.trapezoids[2].get_rotation()
    group.children[6].position.x = pos.x()-200
    group.children[6].position.y = pos.y()*-1+200
    group.children[6].rotation.z = rot*-1
    group.children[6].visible = F_sequence.fidgets[0].bodies.geos.trapezoids[2].get_visibility() == 1

    pos = F_sequence.fidgets[0].bodies.geos.trapezoids[3].get_position()
    rot = F_sequence.fidgets[0].bodies.geos.trapezoids[3].get_rotation()
    group.children[7].position.x = pos.x()-200
    group.children[7].position.y = pos.y()*-1+200
    group.children[7].rotation.z = rot*-1
    group.children[7].visible = F_sequence.fidgets[0].bodies.geos.trapezoids[3].get_visibility() == 1

    ///////////////////////////////////////////////

    pos = F_sequence.fidgets[0].bodies.geos.circle.get_position()
    rot = F_sequence.fidgets[0].bodies.geos.circle.get_rotation()
    group.children[8].position.x = pos.x()-200
    group.children[8].position.y = pos.y()*-1+200
    group.children[8].rotation.z = rot*-1+3.14/2
    group.children[8].visible = F_sequence.fidgets[0].bodies.geos.circle.get_visibility() == 1



    uniforms[ 'time' ].value = performance.now() / 1000;

    renderer.render( scene, camera );


    stats.update();



}
