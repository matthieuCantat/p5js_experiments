

import './libraries/matter.js';
import Matrix from './matrix.js'
import { utils, 
         create_boundary_wall_collision} from './utils.js';
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




let width       = 400
let height      = 400
var ground_enable = false
var F_sequence = null

var nbr = 10
var debug = false

var use_webgl = false
var shaders_nbr = 0

var shdrs = [] 

var do_shdr_test = false
var shdr_test = null


var end_update_count = 0
var draw_count = 0;

let screen_dims = {x:width,y:height}
let pM;

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
