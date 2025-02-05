





import './libraries/matter.js';
import Vector from './utils/vector.js'
import Matrix from './utils/matrix.js'
import Game_engine from './core/game_engine.js';     
import fidgets_sequence from './assets/fidgets_sequence.js'

import { OrbitControls } from './libraries/jsm/controls/OrbitControls.js';
import { RenderPass } from './libraries/jsm/postprocessing/RenderPass.js';
import { OutputPass } from './libraries/jsm/postprocessing/OutputPass.js';
import { EffectComposer } from './libraries/jsm/postprocessing/EffectComposer.js';

import { UnrealBloomPass } from './libraries/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from './libraries/jsm/postprocessing/ShaderPass.js';

import { Lensflare, LensflareElement } from './libraries/jsm/objects/Lensflare.js';

import * as THREE from 'three';






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

let screen_dims = {
    x : width,
    y : height,
    pixelRatio : window.devicePixelRatio}

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


var shdrs = [] 

// BUILD GAME ENGIN
const Game_engine_args = {
    dom_canvas : document.getElementById("three_canvas"),
    screen_dims : screen_dims,
    debug : debug,
}
var game_engine = new Game_engine( Game_engine_args )

// BUILD ASSET
let m = new Matrix()
m.setTranslation(width/2, height/2 )

let s = 2.2

const asset_args = {
    nbr : nbr,
    m : m,
    s : s,
    screen_dims : screen_dims,
    shdrs : shdrs,
    debug : debug,
    dom_canvas : document.getElementById("three_canvas"),
}
var asset = null;//new fidgets_sequence(asset_args)

game_engine.setup_asset(asset)



////////////////////////////////////////////////////////////CALLBACKS

/*
// prevents the mobile browser from processing some default
// touch events, like swiping left for "back" or scrolling
// the page.
document.ontouchmove = function(event) {
    event.preventDefault();
  };
*/

/*
// Disable pull-to-refresh using JavaScript
document.body.addEventListener('touchmove', function(event) {
event.preventDefault();
}, { passive: false } );

  
window.addEventListener( 'resize', () => { game_engine.resize_render( width, height )} );
*/


//////////////////////////////////////////////////////////////////////////////////////////////////////

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

/*
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
                instance.setup(three_global_obj.scene); // Assuming the class has an 'execute' method
                init_three_render(three_global_obj,screen_dims,debug,animate_loop)
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
    */


menuSelect.addEventListener('change', (event) =>{
  const class_name = event.target.value;

  // Remove existing objects
  game_engine.remove_asset()

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
  let asset = null;
  if      (class_name === 'fidgets_grid'    )asset = new fidgets_grid(args) 
  else if (class_name === 'fidgets_sequence')asset = new fidgets_sequence(args)
  else if (class_name === 'fidget_daft_i'   )asset = new fidgets_sequence({...args , ...{fidget_choice:'fidget_daft_i'}}  )
  else if (class_name === 'fidget_windmill' )asset = new fidgets_sequence({...args , ...{fidget_choice:'fidget_windmill'}}  )
  else if (class_name === 'fidget_simple_slide'    )asset = new fidgets_sequence({...args , ...{fidget_choice:'fidget_simple_slide'}}  )
  game_engine.setup_asset(asset)

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

function debug_choice_window_fill()
{
    const menu = document.getElementById("debug_menu");
    // Create checkboxes dynamically (only once)
    for (const [key, value] of Object.entries(debug))
    {
        const checkbox_and_text = document.createElement("label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = 'debug';
        checkbox.value = key;
        checkbox.checked = value;

        const text = document.createTextNode(key);

        // Append checkbox and text to checkbox_and_text
        checkbox_and_text.appendChild(checkbox);
        checkbox_and_text.appendChild(text);

        // Append checkbox_and_text to the menu
        menu.appendChild(checkbox_and_text);

        // Add event listener to log selected items
        checkbox.addEventListener("change", handleCheckboxChange);
    } 
}

function toggle_debug_choice_window()
{
    const menu = document.getElementById("debug_menu");

    const debug_list_is_visible = menu.style.display === "block";
    if (debug_list_is_visible)
    {
        // hide it
        menu.style.display = "none";
        toggleButton.textContent = "Debug";
    } else {
        // If the list is hidden, show it
        const debug_list_is_empty = menu.children.length === 1;
        if (debug_list_is_empty)
            debug_choice_window_fill()
             
        // Show it
        menu.style.display = "block"; // Show the list
        toggleButton.textContent = ""; // Update button text
    }
}    

    // Event listener for the button
    toggleButton.addEventListener("click", toggle_debug_choice_window );

    var debug_modified = { ...debug }
    // Function to handle checkbox selection
    function handleCheckboxChange() {
        
    const debug_elements = Array.from(document.querySelectorAll("input[name='debug']"))

    
    for( let elem of debug_elements)
    {
        if( elem.value == "mouse_selection_break_length")
            continue
        console.log(elem.value, elem.checked)
        debug_modified[elem.value] = elem.checked
        /*
        if( ( 0 < debug_elements_to_activate.length )&&( elem.includes( debug_elements_to_activate) ))
        {
            debug_modified[elem] = !debug[elem]
            //console.log("Selected Debug:", elem);
        }
        else
            debug_modified[elem] = debug[elem]
        */
    }
    /*
    for( let elem of debug_elements_to_activate )
        debug[elem] = true
    else
        debug[elem] = false
    */

    //debug.selected = checkbox.value
    game_engine.asset.set_debug( debug_modified )
    
    }