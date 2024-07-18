





import './libraries/matter.js';
import Vector from './vector.js'
import Matrix from './matrix.js'
import { utils, 
         create_boundary_wall_collision,
         rad,
         create_physics_engine,
         create_mouse_constraint,
         create_physics_engine_runner} from './utils.js';

import { three_utils,} from './utils_three.js';

         
import fidgets_sequence from './fidgets_sequence.js'
import fidgets_grid from './fidgets_grid.js'

import { OrbitControls } from './libraries/jsm/controls/OrbitControls.js';
import { RenderPass } from './libraries/jsm/postprocessing/RenderPass.js';
import { OutputPass } from './libraries/jsm/postprocessing/OutputPass.js';
import { EffectComposer } from './libraries/jsm/postprocessing/EffectComposer.js';

import { UnrealBloomPass } from './libraries/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from './libraries/jsm/postprocessing/ShaderPass.js';

import { Lensflare, LensflareElement } from './libraries/jsm/objects/Lensflare.js';

import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';



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

const loader = new THREE.TextureLoader();
const textureFlare0 = loader.load( './textures/lensflare/lensflare0.png' );
const textureFlare3 = loader.load( './textures/lensflare/lensflare3.png' );

function addLight( h, s, l, x, y, z ) {

    const light = new THREE.PointLight( 0xffffff, 1.5, 2000, 0 );
    light.color.setHSL( h, s, l );
    light.position.set( x, y, z );

    const lensflare = new Lensflare();
    lensflare.addElement( new LensflareElement( textureFlare0, 700*0.5, 0, light.color ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 60 *0.5, 0.6 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 70 *0.5, 0.7 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 120*0.5, 0.9 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 70 *0.5, 1 ) );
    light.add( lensflare );

    return light

}

/////////////////////////////////////////// setup screen
let width       = 400
let height      = 400//700
width = window.innerWidth;
height = window.innerHeight;
let screen_dims = {x:width,y:height}

/////////////////////////////////////////// setup game
var nbr = 1
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
              do_bloom_selected: true,
              do_bloom: false, 
              do_shadows: false,         
              do_flare: false,     
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





let container, stats;
let camera, scene, renderer;
let uniforms,light1;
let finalComposer,bloomComposer;
let light_lens_flare;

init();


function init() {


    container = document.createElement( 'div' );
    document.body.appendChild( container );

    //////////////// scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000 );

    camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    camera.position.set( 0, 0, 500 );  
    //let camera_far_dist = 1000 
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

    scene.add( light1 );
    //light_group.add(light)
    //light.position.set( Math.sin(0*0.01)*100, Math.cos(0*0.01)*100, -200)
    //camera.add( light1 );
    if(debug.do_shadows)
    {
        light1.castShadow = true
        //light1.shadow.radius = 5;  
        //light1.shadow.blurSamples = 250
        light1.shadow.camera.near = 0.5; // default
        light1.shadow.camera.far = 600*1.5; // default
        light1.shadow.camera.top = 200;
        light1.shadow.camera.bottom = -200;
        light1.shadow.camera.left = -200*0.5;
        light1.shadow.camera.right = 200*0.5;
        light1.shadow.mapSize.set( 200, 200 );

        //let light2 = new THREE.AmbientLight( 0xffffff, 0.2 );
        //scene.add( light2 );
    }

    if( debug.do_flare )
    {
        light_lens_flare = addLight( 0.995, 0.5, 0.9,100, 100, 100 )
        scene.add( light_lens_flare )
    }

   

    ///////////////// fidgets
    F_sequence.setup_shapes_fidgets_three(scene)
    F_sequence.setup_chrono_three(scene)
    F_sequence.setup_debug_three(scene)

    
    /*
    F_sequence.fidgets[0].bodies.geos.rectangle.mesh_three.shape.material = three_utils.material.background_test
    let colors = []
    let positions = []
    for ( let i = 0; i < 4; i ++ ) {

        // adding x,y,z
        positions.push( Math.random()* 255 );
        positions.push( Math.random()* 255 );
        positions.push( Math.random()* 255 );

        // adding r,g,b,a
        colors.push( Math.random() * 255 );
        colors.push( Math.random() * 255 );
        colors.push( Math.random() * 255 );
        colors.push( Math.random() * 255 );

    }
    const positionAttribute = new THREE.Float32BufferAttribute( positions, 3 );
    const colorAttribute = new THREE.Uint8BufferAttribute( colors, 4 );
    colorAttribute.normalized = true; // this will map the buffer values to 0.0f - +1.0f in the shader
    //F_sequence.fidgets[0].bodies.geos.rectangle.mesh_three.shape.geometry.setAttribute( 'position', positionAttribute ); // arleady in
    F_sequence.fidgets[0].bodies.geos.rectangle.mesh_three.shape.geometry.setAttribute( 'color', colorAttribute );
    */
    
    ///////////////// render
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width, height );
    renderer.setAnimationLoop( animate );
    if(debug.do_shadows)
    {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    }
    //renderer.toneMapping = THREE.ReinhardToneMapping;
    container.appendChild( renderer.domElement );

    if(debug.do_bloom)
    {
        //render pass
        const renderScene = new RenderPass( scene, camera );
        const outputPass = new OutputPass();

        const bloomPass = new UnrealBloomPass( new THREE.Vector2( width, height ), 1.5, 0.4, 0.85 );
        bloomPass.threshold = 0;
        bloomPass.strength = 1;
        bloomPass.radius = 0.1;
        
        bloomComposer = new EffectComposer( renderer );
        bloomComposer.renderToScreen = false;
        bloomComposer.addPass( renderScene );
        bloomComposer.addPass( bloomPass );
        
        const mixPass = new ShaderPass(
            new THREE.ShaderMaterial( {
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: bloomComposer.renderTarget2.texture }
                },
                vertexShader: document.getElementById( 'bloom_mix_vertexShader' ).textContent,
                fragmentShader: document.getElementById( 'bloom_mix_fragmentShader' ).textContent,
                defines: {}
            } ), 'baseTexture'
        );
        mixPass.needsSwap = true;


        finalComposer = new EffectComposer( renderer );
        finalComposer.addPass( renderScene );
        //finalComposer.addPass( bloomPass );
        finalComposer.addPass( mixPass );
        finalComposer.addPass( outputPass );
    }


    // stats
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

    if(debug.do_bloom)
    {
        bloomComposer.setSize( width, height );
        finalComposer.setSize( width, height );
    }

}


//

var animate_count =0
function animate() {

    if( debug.do_flare )
    {
        // light - change position
        light_lens_flare.position.x = Math.sin(rad(45)+animate_count*0.01)*120
        light_lens_flare.position.y = Math.cos(rad(45)+animate_count*0.01)*120
    }        

    
    // other
    F_sequence.update()
    F_sequence.animate_three()
    //uniforms[ 'time' ].value = performance.now() / 1000;
    //F_sequence.fidgets[0].bodies.geos.rectangle.mesh_three.shape.material.uniforms.time.value = performance.now() / 1000;

    if(debug.do_bloom)
    {
        let save_states = []
        for( let i = 0 ; i < F_sequence.fidgets.length; i++)
            save_states.push( F_sequence.fidgets[i].setup_bloom_pass() )
        bloomComposer.render()
        for( let i = 0 ; i < F_sequence.fidgets.length; i++)
            F_sequence.fidgets[i].clean_bloom_pass(save_states[i])

        finalComposer.render();
    }
    else
    {
        renderer.render( scene, camera );
    }

    stats.update();

    


    
    animate_count += 1
}



