import * as THREE from 'three';
import Vector from '../utils/vector.js'
import { 
    utils,
    convert_coords_matter_to_three, 
    Draw_text_debug
} from '../utils/utils.js';
import { 
    line,
    addShape_line,
    circle,
} from '../utils/utils_three.js';

export class Mouse_manager
{
    constructor( 
        matter_engine,
        dom_canvas,
        screen_dims,
        fidget,
        debug)
    {
        
        //_____________ CREATE MOUSE IN MATTER
        this.matter_engine = matter_engine
        
        this.matter_mouse = Matter.Mouse.create(dom_canvas)
        
        const collision_info = 
        { 
            category : utils.collision_category.mouse, 
            mask     : utils.collision_category.inter
        }
        const physics_info = 
        { 
            // allow bodies on mouse to rotate
            //stiffness:0.01,
            damping:0.01,
            angularStiffness: 0,
        }        
        this.matter_constraint = Matter.MouseConstraint.create(
            this.matter_engine, 
            {
                mouse: this.matter_mouse,
                collisionFilter: collision_info,
                constraint: physics_info
            }
        );
            
        Matter.Composite.add(this.matter_engine.world, this.matter_constraint);
        this.clean()

        //
        this.screen_dims = screen_dims
        this.fidget = fidget
        this.mesh_line = null

        this.p_mouse_grap_from_body = null
        this.mouse_lock_selection = false

        this.draw_text_debug = null
        this.set_debug(debug)
 
        this.update_count = 0 
        this.selected_body_last_eval_name = ''   
        this.z = 0
        this.circle_touch_radius = 20
        this.cross_apply_radius = 10
    }

    set_debug( debug )
    {
        this.debug = debug
        if(this.debug != false)
        {
            this.draw_text_debug = new Draw_text_debug(this.screen_dims)
            this.draw_text_debug.mouse_cns = this.matter_constraint
        }   
        else
        {
            if( this.draw_text_debug != null )
            {
                this.draw_text_debug.clean()
                this.draw_text_debug = null
            }
            
        }  
    }

    setup(scene)
    {  
        let mouse_pos = new Vector( mouseX, mouseY) 
        let pos = new Vector( mouseX, mouseY) 
        
        let shape_coords = line( 
            convert_coords_matter_to_three(pos,this.screen_dims), 
            convert_coords_matter_to_three(mouse_pos,this.screen_dims) );
        this.mesh_line = addShape_line(  
            shape_coords, 
            [255,255,0])

        let shape_coords_touch = circle(this.circle_touch_radius)
        let mesh_circle = addShape_line(  
            shape_coords_touch, 
            [255,255,0])   
        this.group_circle = new THREE.Group();
        this.group_circle.add(mesh_circle)

        
        let shape_coords_cross_line_A = line( 
            new Vector(this.cross_apply_radius,this.cross_apply_radius), 
            new Vector(this.cross_apply_radius*-1,this.cross_apply_radius*-1))
        let mesh_cross_line_A = addShape_line(  
            shape_coords_cross_line_A, 
            [255,255,0])
        let shape_coords_cross_line_B = line( 
            new Vector(this.cross_apply_radius*-1,this.cross_apply_radius), 
            new Vector(this.cross_apply_radius   ,this.cross_apply_radius*-1))
        let mesh_cross_line_B = addShape_line(  
            shape_coords_cross_line_B, 
            [255,255,0])
        this.group_cross = new THREE.Group();
        this.group_cross.add(mesh_cross_line_A)
        this.group_cross.add(mesh_cross_line_B)

        this.group = new THREE.Group();

        this.group.add( this.mesh_line )
        this.group.add( this.group_circle )
        this.group.add( this.group_cross )
            
        scene.add( this.group )

        

        if(this.debug != false)
            this.draw_text_debug.setup_three(scene)        
    
    }

    update()
    {
        this.group.visible = false

        if(this.mouse_lock_selection)
        {
            if(userIsInteracting == false)
                this.mouse_lock_selection = false
            else
                this.switch_selection( null) 
        }

        let p_mouse_current = new Vector( mouseX, mouseY) 
        //if( p_mouse_current.mag() == 0)
        //    return

        let p_mouse_grap = new Vector( mouseX, mouseY) 

        if( this.matter_constraint == null )
            return ;

        let selected_body = this.matter_constraint.constraint.bodyB
        

        let delta = new Vector(0,0)
        let do_break = false
        let fidget_selected_body = null
        let m = null
        let do_save_p_mouse_grap_from_body = false

        let break_dist = 0
        if( userIsInteracting )
        {
            if( selected_body != null  )
            {
                fidget_selected_body = this.fidget.get_selected_body()

                if( fidget_selected_body != null)
                {
                    m = fidget_selected_body.get_out_matrix()
                    break_dist = fidget_selected_body.selection_break_length
    
                    do_save_p_mouse_grap_from_body = ((this.p_mouse_grap_from_body == null )||(this.selected_body_last_eval_name != fidget_selected_body.name))
                    if(do_save_p_mouse_grap_from_body)
                        this.p_mouse_grap_from_body = p_mouse_current.getMult(m.getInverse())
    
    
                    p_mouse_grap = this.p_mouse_grap_from_body.getMult(m)
                    delta = p_mouse_current.getSub(p_mouse_grap)
    
                    do_break = break_dist<delta.mag()
                    if(do_break)
                    {
                        this.mouse_lock_selection = true
                        this.switch_selection( null ) 
                        p_mouse_grap = p_mouse_current
                        this.p_mouse_grap_from_body = null 
                    } 

                    this.selected_body_last_eval_name = fidget_selected_body.name
                }
                else
                {
                    this.p_mouse_grap_from_body = null
                    this.selected_body_last_eval_name = ''                   
                } 

                this.group.visible = true
            }
            else{
                this.mouse_lock_selection = true
                this.selected_body_last_eval_name = ''
            }
          
        }
        else{
            this.p_mouse_grap_from_body = null
            this.selected_body_last_eval_name = ''
        }

        let p_mouse_grap_converted = convert_coords_matter_to_three(p_mouse_grap,this.screen_dims)
        let p_mouse_current_converted = convert_coords_matter_to_three(p_mouse_current,this.screen_dims)
        let shape_coords = line( 
            p_mouse_grap_converted, 
            p_mouse_current_converted)       
        this.mesh_line.geometry.setFromPoints(shape_coords.getPoints());

        this.group_cross.position.x = p_mouse_grap_converted.x()
        this.group_cross.position.y = p_mouse_grap_converted.y()

        this.group_circle.position.x = p_mouse_current_converted.x()
        this.group_circle.position.y = p_mouse_current_converted.y()

        this.group.position.z = this.z
        
        

        
        let fidget_skip = false
        if((this.debug !== true)&&(this.debug !== false)&&(this.debug !== this.fidget.fidget_sequence_i))
            fidget_skip = true


        if( (this.debug !== false)&&(fidget_skip === false) )
        {
          let p_mouse_grap_from_body = {x:0,y:0}
          if(this.p_mouse_grap_from_body != null)
            p_mouse_grap_from_body = this.p_mouse_grap_from_body.get_value()

          let body_name = 'null'
          let m_selected_body = {a:0,b:0,c:0,d:0,e:0,f:0}
          if( fidget_selected_body != null)
          {
            body_name = fidget_selected_body.name            
            m_selected_body = m
          }

            

          let texts_to_draw = [
                'selected_fidget : ' + this.fidget.fidget_sequence_i,
                'selected_body : ' + body_name,

                'update_count :' + this.update_count,
                'isMousePressed : ' + isMousePressed,
                'isScreenTouched : ' + isScreenTouched,
                'userIsInteracting : ' + userIsInteracting,

                'p_mouse_current : ' + Math.round(p_mouse_current.x()) + ' | ' + Math.round(p_mouse_current.y()),
                'p_mouse_current_coef : ' + Math.round(p_mouse_current.x()/this.screen_dims.x*100) + ' | ' + Math.round(p_mouse_current.y()/this.screen_dims.y*100),

                'm_selected_body : ' + Math.round(m_selected_body.a) + ' | ' + Math.round(m_selected_body.b) + ' | ' +Math.round(m_selected_body.c) + ' | ' +Math.round(m_selected_body.d) + ' | ' +Math.round(m_selected_body.e) + ' | ' +Math.round(m_selected_body.f),
                'p_selected_body : ' + Math.round(m_selected_body.e) + ' | ' +Math.round(m_selected_body.f),
                'p_selected_body_coef : ' + Math.round(m_selected_body.e/this.screen_dims.x*100) + ' | ' +Math.round(m_selected_body.f/this.screen_dims.y*100),

                'do_save_p_mouse_grap_from_body : ' + do_save_p_mouse_grap_from_body,
                'p_mouse_grap_from_body : ' + Math.round(p_mouse_grap_from_body.x) + ' | ' + Math.round(p_mouse_grap_from_body.y),
                
                'p_mouse_grap : ' + Math.round(p_mouse_grap.x()) + ' | ' + Math.round(p_mouse_grap.y()),
                'p_mouse_grap_coef : ' + Math.round(p_mouse_grap.x()/this.screen_dims.x*100) + ' | ' + Math.round(p_mouse_grap.y()/this.screen_dims.y*100),

                'dist : ' + Math.round(delta.mag()),
                'break_dist : ' + break_dist,
                'do_break : ' + do_break,
                'mouse_lock_selection : ' + this.mouse_lock_selection,
            ]   
            

          this.draw_text_debug.update_three(texts_to_draw)
        }  
        
        // next eval
        this.update_count += 1
    }


    switch_selection( next_elem = null , hack = false)
    {
      if ( next_elem == null)
      {
        this.matter_constraint.body = null
        this.matter_constraint.constraint.bodyB = null
        this.matter_constraint.constraint.pointB = null
        this.matter_constraint.constraint.angleB = 0  
        return; 
      }
      
      let p = new Vector( 
        this.matter_constraint.constraint.pointA.x - next_elem.body.position.x,
        this.matter_constraint.constraint.pointA.y - next_elem.body.position.y)
    
    this.matter_constraint.body = next_elem.body
    this.matter_constraint.constraint.bodyB = next_elem.body
    this.matter_constraint.constraint.pointB = {x: p.x() , y: p.y()}
      if(hack)
        this.matter_constraint.constraint.pointB = {x: - p.y(), y: p.x()}
      this.matter_constraint.constraint.angleB = 0
      
      this.fidget.mouse_select_highlight(this.matter_constraint)
    
    }    
    
    clean()
    {
        Matter.Mouse.clearSourceEvents(this.matter_mouse)
        Matter.Composite.remove(this.matter_engine.world, this.matter_constraint);
    }


}




////////////////////////////////////////////////// mouse pressed
// Declare the boolean value as a global variable
export var isMousePressed = false;
export var isScreenTouched = false;
export var userIsInteracting = false;
var userIsInteracting_last = null;
export var userInteractionChange = false;
export var mouseX = 0;
export var mouseY = 0;

let noEventTime = 0.05 * 1000;
let eventTimer;
// Function to be executed when no events occur
function executeWhenNoEvent() {
  //console.log('No events detected for 5 seconds.');
  // Place your desired code here
  userInteractionChange_update()
}

// Reset the timer whenever an event is detected
function resetTimer() {
    clearTimeout(eventTimer);
    eventTimer = setTimeout(executeWhenNoEvent, noEventTime);
}

// Function to handle the mousedown event
function handleMouseDown(event) {
    //console.log('handleMouseDown')
    isMousePressed = true;
    userIsInteracting_last = userIsInteracting
    userIsInteracting = isScreenTouched || isMousePressed
    if( userIsInteracting != userIsInteracting_last)
      userInteractionChange = true
    else
      userInteractionChange = false
    //console.log('Mouse is pressed:', isMousePressed);
    resetTimer()
}

// Function to handle the mouseup event
function handleMouseUp(event) {
    //console.log('handleMouseUp')
    isMousePressed = false;
    /*
    userIsInteracting_last = userIsInteracting
    userIsInteracting = isScreenTouched || isMousePressed
    if( userIsInteracting != userIsInteracting_last)
      userInteractionChange = true
    else
      userInteractionChange = false    
    */
    userIsInteracting_last = userIsInteracting
    userIsInteracting = false
    if( userIsInteracting != userIsInteracting_last)
      userInteractionChange = true
    else
      userInteractionChange = false
    //console.log('Mouse is pressed:', isMousePressed);
    resetTimer()
}

// Function to handle the mousemove event
function handleMouseMove(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
  //console.log('Mouse position:', mouseX, mouseY);
}

function handleTouchDown(event) {
  //console.log('handleTouchDown')
  isScreenTouched = true;
  userIsInteracting_last = userIsInteracting
  userIsInteracting = isScreenTouched || isMousePressed
  if( userIsInteracting != userIsInteracting_last)
    userInteractionChange = true
  else
    userInteractionChange = false  
  //console.log('Mouse is pressed:', isMousePressed);
  // mouse must be update sooner
  const touch = event.touches[0] || event.changedTouches[0]; 
  mouseX = touch.clientX;
  mouseY = touch.clientY;
  resetTimer()  
}

function handleTouchUp(event) {
  console.log('handleTouchUp')
  isScreenTouched = false;
  /*
  userIsInteracting_last = userIsInteracting
  userIsInteracting = isScreenTouched || isMousePressed
  if( userIsInteracting != userIsInteracting_last)
    userInteractionChange = true
  else
    userInteractionChange = false  
  */
  userIsInteracting_last = userIsInteracting
  userIsInteracting = false
  if( userIsInteracting != userIsInteracting_last)
    userInteractionChange = true
  else
    userInteractionChange = false
  //console.log('Mouse is pressed:', isMousePressed);
  resetTimer()
}

function userInteractionChange_update()
{
  //console.log('userInteractionChange_update')
  if( ( userInteractionChange == true))
  {
    userIsInteracting_last = userIsInteracting
    userInteractionChange = false 
  } 
}

function handleTouchMove(event) {
  const touch = event.touches[0] || event.changedTouches[0];
  
  mouseX = touch.clientX;
  mouseY = touch.clientY;
  //console.log('Mouse is pressed:', isMousePressed);
}

// Attach event listeners when the document is fully loaded
window.onload = function() {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchstart', handleTouchDown);
    document.addEventListener('touchend', handleTouchUp);
    document.addEventListener('touchmove', handleTouchMove);    
}
////////////////////////////////////////////////// mouse pressed


/*
// Get the status div
const statusDiv = document.getElementById('status');

// Function to update status
function updateStatus(message) {
    statusDiv.textContent = message;
}

// Add touch event listeners to the document
document.addEventListener('touchstart', function(event) {
    updateStatus('Screen touched');
    console.log('Touch start:', event.touches);
    isMousePressed = true;
    isScreenTouched = true;
}, false);

document.addEventListener('touchmove', function(event) {
    updateStatus('Touch moving');
    console.log('Touch move:', event.touches);
    isMousePressed = true;
}, false);

document.addEventListener('touchend', function(event) {
    updateStatus('Touch ended');
    console.log('Touch end:', event.changedTouches);
    isMousePressed = false;
    isScreenTouched = false;
}, false);

*/



export function create_mouse_constraint(matter_engine, dom_canvas)
{


    return mouse_constraint   
}

