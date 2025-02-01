





import './libraries/matter.js';
import Vector from './utils/vector.js'
import Matrix from './utils/matrix.js'
import { utils, 
         create_boundary_wall_collision,
         rad,
         create_physics_engine,
         create_mouse_constraint,
         create_physics_engine_runner} from './utils/utils.js';

import { three_utils,} from './utils/utils_three.js';

         
import fidgets_sequence from './assets/fidgets_sequence.js'

import { OrbitControls } from './libraries/jsm/controls/OrbitControls.js';
import { RenderPass } from './libraries/jsm/postprocessing/RenderPass.js';
import { OutputPass } from './libraries/jsm/postprocessing/OutputPass.js';
import { EffectComposer } from './libraries/jsm/postprocessing/EffectComposer.js';

import { UnrealBloomPass } from './libraries/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from './libraries/jsm/postprocessing/ShaderPass.js';

import { Lensflare, LensflareElement } from './libraries/jsm/objects/Lensflare.js';

import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';


/*
// prevents the mobile browser from processing some default
// touch events, like swiping left for "back" or scrolling
// the page.
document.ontouchmove = function(event) {
  event.preventDefault();
};
*/


// Disable pull-to-refresh using JavaScript
document.body.addEventListener('touchmove', function(event) {
event.preventDefault();
}, { passive: false } );


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
let FULL_SCREEN_MODE = true
let width       = 400
let height      = 400//700
let lowerLeftCornerPos = new Vector(0,height+500);
if(FULL_SCREEN_MODE)
{
    width = window.innerWidth;
    height = window.innerHeight;
    lowerLeftCornerPos = new Vector(0,height);
}

let screen_dims = {x:width,y:height}

/////////////////////////////////////////// setup game
var nbr = 1
var debug = { disable_animation:true,
              switch_selected_inter_help:false,
              inter_step_physics : false,
              mouse_selection_break_length:260,

              show_geos:true,
              show_effects:true,              
              show_inters:false,
              show_inters_steps:false,
              show_bones:false,
              force_visibility:false,

              matrix_axes:false,
              cns_axes:false,
              fidget_steps_info:false,
              mouse_info:false,
              show_warning_log:false,

              do_bloom_selected: false,
              do_bloom: false, 
              do_shadows: false,         
              do_flare: false,     
                }


var assets_name = [
    'fidgets_sequence',
    'fidget_daft_i',
    'fidget_simple_slide',
    'fidget_windmill',
    'fidgets_grid',
]



/////////////////////////////////////////// variables
var current_asset = null

var shdrs = [] 



let m = new Matrix()
m.setTranslation(width/2, height/2 )

let s = 2.2

const args = {
    nbr : nbr,
    m : m,
    s : s,
    screen_dims : screen_dims,
    shdrs : shdrs,
    debug : debug
}
current_asset = new fidgets_sequence(args)




let three_canvas_container, stats;
let camera, scene, renderer;
let uniforms,light1;
let finalComposer,bloomComposer;
let light_lens_flare;



three_canvas_container = document.getElementById("three_canvas");

init_three_scene();
init_others()
init_three_render()


function init_three_scene() {


    // scene setup
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
    if( current_asset != null )
        current_asset.setup(scene)

}

function clear_three_render()
{
    renderer.dispose();
    renderer.domElement.parentNode.removeChild(renderer.domElement);
}

function init_three_render()
{    
    ///////////////// render
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    const width = window.innerWidth; //ADD
    const height = window.innerHeight; //ADD
    renderer.setSize( width, height );
    renderer.setAnimationLoop( animate );

    const three_canvas_container = document.getElementById('three_canvas');
    if (!three_canvas_container) {
        throw new Error("Container element not found!");
    }    
    three_canvas_container.appendChild( renderer.domElement );

    if(debug.do_shadows)
        {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        }

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
    
    /*
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 1;
    controls.maxDistance = 500;
    */
    
}

function init_others()
{
    
    // stats
    stats = new Stats();
    three_canvas_container.appendChild( stats.dom );

    ///////////////// action
    //three_canvas_container.style.touchAction = 'none';

    window.addEventListener( 'resize', onWindowResize );


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

    
    if( current_asset != null )
    {
        current_asset.update()
        current_asset.animate_three()

        //console.log('__________________' + animate_count)
        //console.log(`THREE Number of elements in the scene: ${countObjects(scene)}`);
        //console.log('Elements in the scene:', scene.children);
        //for( let F of current_asset.fidgets)
        //{
        //    //console.log( F.title , 'Mouse canvas element' , F.mouse_constraint.mouse.element);
        //    //console.log(F.mouse_constraint.world === F.matter_engine.world); // Should log true
        //}
            
    }

    //uniforms[ 'time' ].value = performance.now() / 1000;
    //current_asset.fidgets[0].bodies.geos.rectangle.mesh_three.shape.material.uniforms.time.value = performance.now() / 1000;

    if(debug.do_bloom)
    {
        let save_states = []
        for( let i = 0 ; i < current_asset.fidgets.length; i++)
            save_states.push( current_asset.fidgets[i].setup_bloom_pass() )
        bloomComposer.render()
        for( let i = 0 ; i < current_asset.fidgets.length; i++)
            current_asset.fidgets[i].clean_bloom_pass(save_states[i])

        finalComposer.render();
    }
    else
    {
        renderer.render( scene, camera );
    }

    stats.update();

    


    
    animate_count += 1


    
}


function displayAssetsList()
{
    //console.log(categories_sorted, fileLinks);
    const newCategoryElement = document.getElementById("menu-select");
    assets_name.forEach(option => {
        const newOption = document.createElement("option");
        newOption.value = option; // Set the value attribute
        newOption.textContent = option; // Set the text inside the option
        newCategoryElement.appendChild(newOption); // Add to the <select> element
    }); 
}


displayAssetsList()


const menuSelect = document.getElementById('menu-select');


async function loadAndExecuteClass( fileName, args) {
    try {
        // Dynamically import the module
        const module_str = `./assets/${fileName}.js`;
        const module = await import(module_str);

        // Check if the class exists and matches the file name
        if ( module.default ){//(module[fileName]) {
            const ClassToExecute = module.default;//module[fileName];

            // Instantiate the class
            const instance = new ClassToExecute(args);
    
            // Call a method or execute functionality of the class
            if (typeof instance.setup === 'function') {
                instance.setup(scene); // Assuming the class has an 'execute' method
                init_three_render()
            } else {
                console.log(`${fileName} loaded, but no 'execute' method found.`);
            }

            return instance;
        } else {
            console.error(`Class ${fileName} not found in the module.`);
        }
    } catch (error) {
        console.error(`Failed to load or execute ${fileName}:`, error);
    }
}
/*
const loadAndExecuteClass = async (className, ...args) => {
    try {
      // Dynamically import the module
      //const module = await import('./assets/'+className+'.js');
      const module_path = './assets/'+className+'.js'
      const module = await import('./assets/'+className+'.js');
      
      // Get the class by name from the module
      const ClassToLoad = module[className];

      console.log(module_path, module, ClassToLoad )
      
      if (!ClassToLoad) {
        throw new Error(`Class "${className}" not found in module.`);
      }
      
      // Instantiate the class with arguments
      const instance = new ClassToLoad(...args);
  
      // Return the instance or use it directly
      return instance;
    } catch (error) {
      console.error('Error loading or executing the class:', error);
    }
  };
*/

menuSelect.addEventListener('change', (event) =>{
  const class_name = event.target.value;

  // Remove existing objects

  if( current_asset != null )
  {
    current_asset.clean_scene(current_asset.scene)
    current_asset = null
    clear_three_render()
  }

  const args = {
    nbr : 5,
    m : m,
    s : s,
    screen_dims : screen_dims, 
    shdrs : shdrs,
    debug : debug,
  }
  
  //loadAndExecuteClass( class_name, args )
  

  // Add 
  if      (class_name === 'fidgets_grid'    )current_asset = new fidgets_grid(args) 
  else if (class_name === 'fidgets_sequence')current_asset = new fidgets_sequence(args)
  else if (class_name === 'fidget_daft_i'   )current_asset = new fidgets_sequence({...args , ...{fidget_choice:'fidget_daft_i'}}  )
  else if (class_name === 'fidget_windmill' )current_asset = new fidgets_sequence({...args , ...{fidget_choice:'fidget_windmill'}}  )
  else if (class_name === 'fidget_simple_slide'    )current_asset = new fidgets_sequence({...args , ...{fidget_choice:'fidget_simple_slide'}}  )

  current_asset.setup(scene)
  init_three_render()

});


function countObjects(obj) {
    let count = 1; // Count the current object
    obj.children.forEach((child) => {
      count += countObjects(child); // Recursively count children
    });
    return count;
  }

function getAssetsInfo()
{
    fetch('/js/assets/')
    .then(response => response.text())
    .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Assuming the directory listing page contains <a> tags for files
    assets_name = Array.from(doc.querySelectorAll('a'))
        .map(link => link.href) // Extract href attributes
        .filter(href => href.endsWith('.js')); // Exclude subfolders or parent links if present
    
    })
    .catch(error => console.error('Error fetching assets directory:', error));
}

//getAssetsInfo()



// JavaScript object to populate the list


    // Reference to the button and fieldset
    const toggleButton = document.getElementById("debug_menu_show");
    const fieldset = document.getElementById("debug_menu");

    // Event listener for the button
    toggleButton.addEventListener("click", function () {
    if (fieldset.style.display === "block") {
        // If the list is visible, hide it
        fieldset.style.display = "none";
        toggleButton.textContent = "Debug";
    } else {
        // If the list is hidden, show it
        if (fieldset.children.length === 1) {
        // Create checkboxes dynamically (only once)
        for (const [key, value] of Object.entries(debug)) {
            const label = document.createElement("label");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = 'debug';
            checkbox.value = key;

            const labelText = document.createTextNode(key);

            // Append checkbox and text to label
            label.appendChild(checkbox);
            label.appendChild(labelText);

            // Append label to the fieldset
            fieldset.appendChild(label);

            // Add event listener to log selected items
            checkbox.addEventListener("change", handleCheckboxChange);
        }
        }
        fieldset.style.display = "block"; // Show the list
        toggleButton.textContent = ""; // Update button text
    }
    });

    var debug_modified = { ...debug }
    // Function to handle checkbox selection
    function handleCheckboxChange() {
        
    const debug_elements_to_activate = Array.from(document.querySelectorAll("input[name='debug']:checked"))
        .map(checkbox => checkbox.value);


    
    for( let elem in debug)
    {
        if( ( 0 < debug_elements_to_activate.length )&&( elem.includes( debug_elements_to_activate) ))
        {
            debug_modified[elem] = !debug[elem]
            //console.log("Selected Debug:", elem);
        }
        else
            debug_modified[elem] = debug[elem]
    }
    /*
    for( let elem of debug_elements_to_activate )
        debug[elem] = true
    else
        debug[elem] = false
    */

    //debug.selected = checkbox.value
    current_asset.set_debug( debug_modified )
    
    }