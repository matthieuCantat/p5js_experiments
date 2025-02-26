





import './libraries/matter.js';
import Vector from './utils/vector.js'
import Game_engine from './core/game_engine.js';     
import Debug_options from './ui/debug_options.js'; 
import Asset_list_options from './ui/asset_list_options.js'; 

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
var nbr = 5
const debug_options = new Debug_options()




/////////////////////////////////////////// variables


// BUILD GAME ENGIN
const Game_engine_args = {
    dom_canvas : document.getElementById("three_canvas"),
    screen_dims : screen_dims,
    debug : debug_options,
}
var game_engine = new Game_engine( Game_engine_args )
const asset_list_options = new Asset_list_options(game_engine, screen_dims, debug_options)
game_engine.setup_asset_from_name( asset_list_options.current_asset, screen_dims, debug_options)

debug_options.set_game_engine(game_engine)


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
    const menu = document.getElementById("debug_menu");
    const debug_menu_is_open = menu.style.display === "block";
    if( debug_menu_is_open)
        return false

    // Disable pull-to-refresh
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

function record_btn()
{
    
    if( game_engine.record_state != "record" )
    {
        console.log("start recording")
        game_engine.record_state = "record"
    }
    else if( game_engine.record_state != "pause record" )
    {
        console.log("stop recording")
        game_engine.record_state = "pause record"
    }
    else if( game_engine.record_state != "record" )
    {
        console.log("restart recording")
        game_engine.record_state = "record"
    }
        

    
}

function play_btn()
{
    if( game_engine.record_state == "play" )
    {
        console.log("pause")
        game_engine.record_state = "pause"
    }
    else
    {
        console.log("play")
        game_engine.record_state = "play"
    }
    
}

function play_reverse_btn()
{
    if( game_engine.record_state == "play reverse" )
        {
            console.log("pause")
            game_engine.record_state = "pause"
        }
        else
        {
            console.log("play reverse")
            game_engine.record_state = "play reverse"
        }
}

function delete_record_btn()
{
    console.log("delete_record")
    game_engine.record_state = "delete"
}

document.getElementById("record_btn").addEventListener("click", record_btn );
document.getElementById("play_btn").addEventListener("click", play_btn );
document.getElementById("play_reverse_btn").addEventListener("click", play_reverse_btn );
document.getElementById("delete_record_btn").addEventListener("click", delete_record_btn );
game_engine.record_info_dom = document.getElementById("record_info")
game_engine.record_info_dom.innerHTML = ""