





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
import fidgets_grid from './fidgets_grid.js'
import shader_build from './shader.js';
import { OrbitControls } from './libraries/jsm/controls/OrbitControls.js';

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
var nbr = 10
var debug = { disable_animation:true,
              switch_selected_inter_help:true,
              force_visibility:false,
              show_inters:false,
              show_inters_steps:false,
              show_bones:false,
              show_geos:true,
              show_effects:true,
              matrix_axes:false,
              cns_axes:false,
              fidget_steps_info:false,
              mouse_info:false,
              show_warning_log:false,
                }




/////////////////////////////////////////// variables
var F_sequence = null

var shdrs = [] 



let m = new Matrix()
m.setTranslation(width/2, height/2 )

let s = 2.2
F_sequence = new fidgets_sequence(nbr, m, s, screen_dims, shdrs, debug)
//F_sequence = new fidgets_grid(nbr, 5, screen_dims, shdrs, debug)
F_sequence.setup()



import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';


let container, stats;
let camera, scene, renderer;
let uniforms,light1;


init();


function init() {


    container = document.createElement( 'div' );
    document.body.appendChild( container );

    //////////////// scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000 );

    camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    camera.position.set( 0, 0, 500 );  
    let camera_far_dist = 1000 
    //camera = new THREE.PerspectiveCamera( 76, width / height, 1, camera_far_dist );
    //camera.position.set( 0, 0, 500 );
    //camera.rotation.set( 0, 0, 0 );
    
    scene.add( camera );

    //let light_group = new THREE.Group();
    //const light = new THREE.PointLight( 0xffffff, 2.5, 0, 0 );
    /*
    light1 = new THREE.PointLight( 0xffffff, 3.5, 0, 0 );
    const sphere = new THREE.SphereGeometry( 2.5, 16, 8 );
    light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
    light1.position.x = Math.sin(rad(45))*200
    light1.position.y = Math.cos(rad(45))*200
    light1.position.z = 100
    light1.castShadow = true
    */

    light1 = new THREE.DirectionalLight( 0xffffff, 3.5 );
    //const sphere = new THREE.SphereGeometry( 2.5, 16, 8 );
    //light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );

    light1.position.x = 200*2
    light1.position.y = 200*2
    light1.position.z = 100*2
    light1.castShadow = true  
    
    scene.add( light1 );
    //light_group.add(light)
    //light.position.set( Math.sin(0*0.01)*100, Math.cos(0*0.01)*100, -200)
    //camera.add( light1 );
    light1.shadow.radius = 5;  
    //light1.shadow.blurSamples = 250
    light1.shadow.camera.near = 0.5; // default
    light1.shadow.camera.far = 600*2; // default
    light1.shadow.camera.top = 200*2;
    light1.shadow.camera.bottom = -200*2;
    light1.shadow.camera.left = -200*2;
    light1.shadow.camera.right = 200*2;
    light1.shadow.mapSize.set( 2048, 2048 );

    let light2 = new THREE.AmbientLight( 0xffffff, 0.2 );
    scene.add( light2 );

    ///////////////// Background shader
     /*
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
    
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

    const mesh = new THREE.Mesh( geometry, material );
    camera.add( mesh );
    mesh.position.set( 0, 0, camera_far_dist * .5)
    */

    ///////////////// fidgets
    F_sequence.setup_shapes_fidgets_three(scene)
    F_sequence.setup_chrono_three(scene)
    F_sequence.setup_debug_three(scene)
  
    
    ///////////////// render
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width, height );
    renderer.setAnimationLoop( animate );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    //renderer.toneMapping = THREE.ReinhardToneMapping;

    container.appendChild( renderer.domElement );


    stats = new Stats();
    container.appendChild( stats.dom );

    ///////////////// action
    container.style.touchAction = 'none';

    window.addEventListener( 'resize', onWindowResize );


    
    /*
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 1;
    controls.maxDistance = 500;
    */
    
    
    
    
    

}

function onWindowResize() {



    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height);

}


//

var animate_count =0
function animate() {

    /*
    // light - change position
    light1.position.x = Math.sin(rad(45)+animate_count*0.01)*200
    light1.position.y = Math.cos(rad(45)+animate_count*0.01)*200
    */


    // other
    F_sequence.update()
    F_sequence.animate_three()
    //uniforms[ 'time' ].value = performance.now() / 1000;
    renderer.render( scene, camera );
    stats.update();

    


    
    animate_count += 1
}



