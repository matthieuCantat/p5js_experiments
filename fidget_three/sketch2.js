





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
let height      = 700
width = window.innerWidth;
height = window.innerHeight;
let screen_dims = {x:width,y:height}

/////////////////////////////////////////// setup game
var nbr = 10
var debug = true

var use_webgl = false
var shaders_nbr = 0

var ground_enable = false
var do_shdr_test = false

var draw_p5 = true

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

/*
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
      
      F_sequence.draw(p5)

    }
    draw_count += 1
  }
});
*/









import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';


let container, stats;
let camera, scene, renderer;
let uniforms;


init();


function init() {


    container = document.createElement( 'div' );
    document.body.appendChild( container );

    //////////////// scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );

    camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    camera.position.set( 0, 0, 500 );
    scene.add( camera );

    const light = new THREE.PointLight( 0xffffff, 2.5, 0, 0 );
    camera.add( light );


    ///////////////// fidgets
    F_sequence.setup_shapes_fidgets_three(scene)
    F_sequence.setup_chrono_three(scene)

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
    
    ///////////////// render
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width, height );
    renderer.setAnimationLoop( animate );
    container.appendChild( renderer.domElement );

    stats = new Stats();
    container.appendChild( stats.dom );

    ///////////////// action
    container.style.touchAction = 'none';

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {



    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height);

}


//

function animate() {
    F_sequence.update()
    F_sequence.animate_three()
    uniforms[ 'time' ].value = performance.now() / 1000;
    renderer.render( scene, camera );
    stats.update();

}
