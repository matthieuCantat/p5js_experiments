





import './libraries/matter.js';
import Vector from './utils/vector.js'
import Game_engine from './core/game_engine.js';     
import Debug_options from './ui/debug_options.js'; 
import Asset_list_options from './ui/asset_list_options.js'; 
import Record_state_panel from './ui/record_state_panel.js'

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







/////////////////////////////////////////// variables


// BUILD GAME ENGIN
const Game_engine_args = {
    dom_canvas : document.getElementById("three_canvas"),
    screen_dims : screen_dims,
    asset_name : "fidget_simple_slide"
}
var game_engine = new Game_engine( Game_engine_args )

const asset_list_options = new Asset_list_options(game_engine)
const debug_options = new Debug_options(game_engine)
const record_state_panel = new Record_state_panel(game_engine)


////////////////////////////////////////////////////////////CALLBACKS

/*
// prevents the mobile browser from processing some default
// touch events, like swiping left for "back" or scrolling
// the page.
document.ontouchmove = function(event) {
    event.preventDefault();
  };
*/




// Disable pull-to-refresh using JavaScript

function disable_pull_to_refresh(event)
{
    const canvas = document.getElementById("three_canvas");
    const menu = document.getElementById("debug_menu");
    const debug_menu_is_open = menu.style.display === "block";
    if( debug_menu_is_open)
    {
        //console.log('debug_menu_is_open')
        return false
    }

    // Disable pull-to-refresh
    //console.log('debug_menu_is_close')
    event.preventDefault();
    return true
}
document.body.addEventListener('touchmove', disable_pull_to_refresh, { passive: false } );


  
window.addEventListener( 'resize', () => { game_engine.resize_render( width, height )} );



//////////////////////////////////////////////////////////////////////////////////////////////////////


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




// Function to handle checkbox selection




/////////////////////////////// record
