





import './libraries/matter.js';
import Vector from './vector.js'
import Matrix from './matrix.js'
import { utils, 
         create_boundary_wall_collision,
         rad,
         create_physics_engine,
         create_mouse_constraint,
         create_physics_engine_runner} from './utils.js';

         
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




/////////////////////////////////////////// setup screen
let width       = 400
let height      = 400//700
width = window.innerWidth;
height = window.innerHeight;
let screen_dims = {x:width,y:height}

/////////////////////////////////////////// setup game
var nbr = 100
var debug = { disable_animation:true,
              switch_selected_inter_help:true,
              force_visibility:false,
              show_inter:false,
              matrix_axes:false,
              cns_axes:false,
              fidget_steps_info:false,
              mouse_info:false,
                }




/////////////////////////////////////////// variables
var F_sequence = null

var shdrs = [] 



let m = new Matrix()
m.setTranslation(width/2, height/2 )

let s = 2.2
F_sequence = new fidgets_sequence(nbr, m, s, screen_dims, shdrs, debug)
F_sequence.setup()


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
    F_sequence.setup_debug_three(scene)



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



