

import Vector from '../utils/vector.js';
import { utils, 
  create_physics_engine,
  create_physics_engine_runner,
  create_boundary_wall_collision,
  strictObject,
} from '../utils/utils.js';
import * as THREE from 'three';
import { 
  Mouse_manager, 
  user_interaction_info
} from '../core/mouse.js'
import { body_build } from '../core/body.js';
import { bodies } from '../core/bodies.js';
import { materials,} from '../core/shader.js';
import Matrix from '../utils/matrix.js';
import { effect } from '../core/effect.js';

class state_step_tpl{
  constructor()
  {
      this.resoluton_coef = 0
      this.resoluton_coef_last = 0
      //this.update_count = 0
      this.in_use = false    
      this.used = false 
      this.time_start = null
  } 
}




class fidget_physics{

  constructor( in_options, fidget_main)
  {
    let defaultOptions = 
    {
      m:null, 
      s:1, 
      screen_dims:null, 
      do_background: true, 
      debug : false,   
      dom_canvas : null   
    }
    const args = { ...defaultOptions, ...in_options };

    this.fidget_main = fidget_main     
    this.screen_dims = args.screen_dims
    this.debug_mode = args.debug

    this.matter_engine        = create_physics_engine()
    create_boundary_wall_collision( 
      this.matter_engine, 
      this.screen_dims.x,
      this.screen_dims.y,
      false)

    this.Mouse = strictObject(new Mouse_manager( 
      this.matter_engine, 
      args.dom_canvas, 
      this.screen_dims, 
      this, 
      this.debug_mode.mouse_info) )  

    this.state = strictObject({
      resolution_coef : 0, 
      resolution_coef_last:0,
      switch_selection_happened_step : 0,
      current_step : 0,
      steps:[ 
        strictObject(new state_step_tpl), 
        strictObject(new state_step_tpl), 
        strictObject(new state_step_tpl), 
        strictObject(new state_step_tpl),
        strictObject(new state_step_tpl),
        strictObject(new state_step_tpl)],
      selection : [],
    })

    this.force_way = null
    this.anim_mode = false
    
    this.end_step = 0
    this.explode_happened = false
    this.resolution_coef_override = null
    this.is_dynamic = args.is_dynamic

    this.steps_info = {} // to fill in children
    
  }

  setup()
  {
    this.fidget_main.bodies.physics.init_out_matrix()
  }

  update()
  {
    if(this.is_dynamic)
    {
      const t = this.fidget_main.Game_engine.time 
      const end_step_start_time = this.state.steps[this.end_step-1].time_start 
      if( end_step_start_time != null)
      {
        const explode_time = Math.max(0, t - end_step_start_time)
        this.explode_effect({
          count:explode_time,
          pre_explode_animation_duration:20,
        })        
      }

    }

    this.state.resolution_coef_last = this.state.resolution_coef
    this.update_completion_info( ) 
    this.reset_current_step_completion()

    this.fidget_main.bodies.physics.update()

    this.animate_background_doors()
    let physics_engine_delta_ms = 16.666
    Matter.Engine.update(this.matter_engine, physics_engine_delta_ms)
    
  }


  animate_background_doors()
  {
    const t = this.fidget_main.Game_engine.time 
    const end_step_start_time = this.state.steps[this.end_step-1].time_start 

    let a = 0
    if( end_step_start_time != null )
      a =  Math.max( 0 , t - end_step_start_time)

    
    a -=30
    a = Math.max(0,a)
    a *=15
    if(this.anim_mode)
      a = this.state.steps[this.end_step-1].resoluton_coef*this.screen_dims.x/2    

    // a 0-->200
    let pA = new Vector(this.screen_dims.x/4,this.screen_dims.y/2)
    pA.v.x -= a
    this.fidget_main.bodies.store.geos.backgrounds[0].physics.set_out_position(pA, 'world', 'override')
  
      


    let pB = new Vector(this.screen_dims.x/4*3,this.screen_dims.y/2)
    pB.v.x += a
    this.fidget_main.bodies.store.geos.backgrounds[1].physics.set_out_position(pB,'world', 'override')  
   
    return true
  }  


  clean()
  {
    this.fidget_main.bodies.physics.clean()
    this.Mouse.clean()
    Matter.Composite.clear(this.matter_engine.world, true);
    Matter.Events.off(this.matter_engine);  // Remove all events attached to the engine
    this.matter_engine = null

  }

  
  constraints_enable(value, body_cns_list = [] )
  {
    const bodies = this.fidget_main.bodies.store;
    for( let i = 0; i < body_cns_list.length; i+=4 )
    {
      let b_type = body_cns_list[i+0]
      let key    = body_cns_list[i+1]
      let j      = body_cns_list[i+2]
      let cns    = body_cns_list[i+3]

      if( (bodies[b_type][key] === null)||(bodies[b_type][key].length === 0))
      {
        if(this.debug_mode.show_warning_log)
          console.log('constraint enable - '+b_type+'.'+key+' doesnt exists')
        continue
      }      

      if( j === null)
      {
        const body = bodies[b_type][key]
        const constraint = body.physics.relations.constraints[cns]
        if(constraint == null )
        {
          if(this.debug_mode.show_warning_log)
            console.log('constraints_enable - this.bodies.'+b_type+'.'+key+'.constraints.'+cns+' doesnt exists')
          continue
        }        
        constraint.enable(value)
      }
      else 
      {
        const body = bodies[b_type][key][j]
        const constraint = body.physics.relations.constraints[cns]        
        if( constraint == null )
        {
          if(this.debug_mode.show_warning_log)
            console.log('constraints_enable - this.bodies.'+b_type+'.'+key+'['+j+'].constraints.'+cns+' doesnt exists')
          continue
        }         
        constraint.enable(value)
      }
        
    }

  }

  /////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////// SELETION
  /////////////////////////////////////////////////////////////////////////////////

  switch_selection_transition( current_step, selected_body, obj_last, obj_next)
  {
    if( this.state.switch_selection_happened_step != current_step)
    {
      if(selected_body != null)
      {
        if(this.force_way == null)
        {
          let current_way = 1
          if(this.state.resolution_coef < this.state.resolution_coef_last)
            current_way = -1
          else
            current_way = 1
  
          if(current_way == 1)
          {
            if(selected_body != obj_next.physics.body)
              this.Mouse.switch_selection( obj_next)
          }
          else
          {
            if(selected_body != obj_last.physics.body)
              this.Mouse.switch_selection(obj_last)     
          }
        }
        else if(this.force_way == 1)
        {
          if(selected_body != obj_next.physics.body)
            this.Mouse.switch_selection( obj_next )
        }
        else if(this.force_way == -1)
        {
          if(selected_body != obj_last.physics.body)
            this.Mouse.switch_selection(obj_last) 
        }
      }
      this.state.switch_selection_happened_step = current_step  
    }
  }


  get_selected_body(body_type_filter = [] )
  {
    let selected_body = null
    for( let body of this.fidget_main.bodies.get_list_filtered( 'build', body_type_filter ))
    {
      if(body.physics.state.is_selected)
      {
        selected_body = body
        break
      }
    }
  
    return selected_body
    
  }


  //////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////// resolution coef
  ///////////////////////////////////////////////////////////////////////////////////
  
  // fidget progress
  // fidget completion
  // fidget state
  // fidget advancement
  // 
  // update solving info
  update_completion_info( )
  {   
    // init
    this.state.resolution_coef = 0
    for( let i = 0 ; i < this.state.steps.length; i++)
      this.state.steps[i].resoluton_coef = 0
    this.state.current_step = 0

    // compute info
    for( let i = 0 ; i < this.fidget_main.bodies.store.inters_step.steps.length; i++)
    {
      if(this.fidget_main.bodies.store.inters_step.steps[i].constructor === Array )
        this.state.steps[i].resoluton_coef = this.fidget_main.bodies.store.inters_step.steps[i][0].get_resolution_coef()
      else
        this.state.steps[i].resoluton_coef = this.fidget_main.bodies.store.inters_step.steps[i].get_resolution_coef()


      this.state.resolution_coef += this.state.steps[i].resoluton_coef
      if(Math.round(this.state.steps[i].resoluton_coef*100)/100 == 1)
        this.state.current_step = i +1
    }
  }  

  // solving step reset step
  reset_current_step_completion()
  {
    const step = this.state.current_step

    if(this.state.steps[step].time_start == null)
      this.set_completion_step(step)
  }

  // solving 
  set_completion_step( step )
  {
    const inter_step_bodies = this.fidget_main.bodies.store.inters_step.steps
    this.fidget_main.bodies.enable( 0 )  
    this.fidget_main.bodies.list_enable( 1,this.steps_info[step].bodies_enable )

    this.fidget_main.bodies.physics.constraints_enable( true ) 
    this.constraints_enable(false, this.steps_info[step].constraints_disable )

    this.fidget_main.bodies.set_completion_step(step)
      
    
    
    if((this.debug_mode.switch_selected_inter_help)||(this.steps_info[step].switch_selection_transition))
    {
      if((step == 0)||(step == inter_step_bodies.length))
      {
        this.Mouse.switch_selection( null )
      }
      else
      {
        
        if(step < inter_step_bodies.length)
        {
          if( inter_step_bodies[step].constructor === Array )
          {
            if( inter_step_bodies[step-1].constructor === Array )
            {
              let selected_body = this.get_selected_body()
              let i = inter_step_bodies[step-1].indexOf(selected_body)
              
              if( i < inter_step_bodies.length )
                this.switch_selection_transition( step, this.get_selected_body(), inter_step_bodies[step-1], inter_step_bodies[step][i])   
              else
                this.Mouse.switch_selection(null)


            }
            else
            {
              this.switch_selection_transition( step, this.get_selected_body(), inter_step_bodies[step-1], inter_step_bodies[step][0])   
            }
            
          }
          else
          {
            this.switch_selection_transition( step, this.get_selected_body(), inter_step_bodies[step-1], inter_step_bodies[step])   
          }
          
        }
         
      }
        
    }
    this.clean_completion_info()
    this.state.steps[step].time_start = this.fidget_main.Game_engine.time   
    
  }

  clean_completion_info()
  {
    for( let i = 0; i < this.state.steps.length; i++)
      this.state.steps[i].time_start = null     
  }


  update_bodies_select_state(body_type_filter = [])
  {
    
    if(this.Mouse.mouse_lock_selection)
      return []

    const selected_body_list = []
    for( let body of this.fidget_main.bodies.get_list_filtered( 'build', body_type_filter ))
    {
      body.physics.state.is_touch = false

      let body_is_selected = false
      if( this.Mouse.matter_constraint )
        body_is_selected = body.physics.body == this.Mouse.matter_constraint.constraint.bodyB

      if( body_is_selected )
      {
        body.set_is_selected( true )
        if( user_interaction_info.userIsInteracting )
          body.physics.state.is_touch = true

        selected_body_list.push(body.name)
      }
      else
      {
        body.set_is_selected( false )
      }    

      body.update_is_selected_for_instance()
    }


    this.fidget_main.state.selection_changed = this.state.selection != selected_body_list
    this.state.selection = selected_body_list
    return selected_body_list
  }



  // EXPLODE !!!
  explode_effect(opts)
  {
    if( opts.count < opts.pre_explode_animation_duration )
      this.do_pre_explode_shading_animation( opts.count, 0, opts.pre_explode_animation_duration)
    else
      this.do_explode()
  }  
      
  do_pre_explode_shading_animation(t,start_time,end_time)
  {
    let a = t - start_time
    a -= end_time/4
    a /= (end_time/4)
    a = Math.min(1,Math.max(0,a))
    
    let c1 = utils.color.gold    
    let c2 = utils.color.white
    let cInterp = [
      c1[0]*(1-a)+c2[0]*a,
      c1[1]*(1-a)+c2[1]*a,
      c1[2]*(1-a)+c2[2]*a]
 
    this.fidget_main.state.geos_color_override = cInterp
  }
 

  do_explode()
  {
    this.fidget_main.bodies.enable(false,['effects'])
    this.fidget_main.bodies.physics.constraints_enable(false, ['geos'])
    
    // custom color
    this.fidget_main.state.geos_color_override = null
    
    this.fidget_main.bodies.physics.apply_force_at_center(new Vector(0,0.003),true,['geos'])
                                 
    if( this.explode_happened == false )
    {
      this.fidget_main.bodies.physics.apply_exlode_force_from_point(new Vector(this.screen_dims.x/2,this.screen_dims.y/2),0.09,new Vector(0,-1),true,['geos'])
      this.explode_happened = true
    }
  }  



  
  do_anim_override( anim = null )
  {
    if( anim != null)
      this.resolution_coef_override = anim*this.end_step
    else
      this.resolution_coef_override = null
  }

}




/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////



class fidget_render{

  constructor( in_options, fidget_main, fidget_physics)
  {
    let defaultOptions = 
    {
      m:null, 
      s:1, 
      screen_dims:null, 
      do_background: true, 
      debug : false,   
      dom_canvas : null   
    }
    const args = { ...defaultOptions, ...in_options };

    this.fidget_main = fidget_main
    this.physics = fidget_physics

    this.set_debug_init(args.debug)
    
    this.debug_mode = args.debug
    this.darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
    this.z_depth_end = 0
    
  }

  setup()
  {
    this.set_debug_setup()  
    this.fidget_main.bodies.render.setup_shapes_three()
    this.fidget_main.Game_engine.render_scene.add( this.fidget_main.bodies.group_three )      
  }

  set_debug_init(debug)
  {
    this.debug_mode = debug
    this.do_bloom_selected = debug.do_bloom_selected
    this.do_bloom = debug.do_bloom   
  }
    
  set_debug_setup()
  {
    this.physics.Mouse.set_debug(this.debug_mode.mouse_info)

    this.fidget_main.bodies.set_debug( this.debug_mode )
    this.fidget_main.bodies.render.set_visibility_secondary(this.debug_mode.show_inters, ['inters'])  
    this.fidget_main.bodies.render.set_visibility_secondary(this.debug_mode.show_inters_steps, ['inters_step']) 
    this.fidget_main.bodies.render.set_visibility_secondary(this.debug_mode.show_geos, ['geos']) 
    this.fidget_main.bodies.render.set_visibility_secondary(this.debug_mode.show_effects, ['effects']) 
    this.fidget_main.bodies.render.set_visibility_secondary(this.debug_mode.show_bones, ['bones']) 
  }

  set_debug(debug)
  {
    this.set_debug_init(debug)
    this.set_debug_setup()
  }

  clean()
  {
    this.fidget_main.bodies.render.clean()
    this.fidget_main.Game_engine.render_scene.remove(this.fidget_main.bodies.group_three)
    this.fidget_main.bodies.group_three = null
  }

  
  update()
  {
    this.fidget_main.bodies.render.override_color(this.fidget_main.state.geos_color_override, ['geos'])
    this.fidget_main.bodies.render.override_color_three(this.fidget_main.state.geos_color_override, ['geos'])      
    this.fidget_main.bodies.render.update()
  }


  

  mouse_select_highlight(body_type_filter = [], bloom = true)
  {
    
    if(this.physics.Mouse.mouse_lock_selection)
      return

    if( this.fidget_main.state.selection_changed == false )
      return

    let body_to_highlight = []
    let body_to_reduce    = []

    for( let body of this.fidget_main.bodies.get_list_filtered( 'build', body_type_filter ))
    {
      if( body.get_is_selected() )
      {
        body.render.color = utils.color.redLight
        body_to_highlight.concat( body.relations.highlight_bodies_when_selected )
      }
      else
      {
        body.render.color = body.render.color_base 
        body_to_reduce.concat(body.relations.highlight_bodies_when_selected)
      }    
    }

    for( let i = 0 ; i < body_to_reduce.length; i++)
    {
      body_to_reduce[i].render.color_line = [0,0,0]
      body_to_reduce[i].render.update_color_three_line()
      if(this.do_bloom_selected)
        body_to_reduce[i].render.bloom = body_to_reduce[i].render.bloom_default
    }

    for( let i = 0 ; i < body_to_highlight.length; i++)
    {
      body_to_highlight[i].render.color_line = [255,255,255]
      body_to_highlight[i].render.update_color_three_line()
      if(this.do_bloom_selected)
        body_to_highlight[i].render.bloom = true
    }
    //this.bodies.color_update_three(body_type_filter)

  }  




  setup_bloom_pass()
  {

    let bodies = this.fidget_main.bodies.get_list_filtered( ['geos','effects'] )
    let color_lines = []
    for( let i = 0 ; i < bodies.length; i++)
    {
      color_lines.push(bodies[i].render.color_line )
      bodies[i].render.color_line = [0,0,0]
      bodies[i].render.update_color_three_line()
    }
    this.fidget_main.bodies.render.apply_material( this.darkMaterial,  ['geos','effects'] )
    for( let body of this.fidget_main.bodies.get_list_attr_value_filtered( 'bloom', true, ['geos','effects'] ) )
      body.render.reset_material()

      return {color_lines:color_lines}
  }

  clean_bloom_pass( save_state )
  {
    this.fidget_main.bodies.render.apply_material( null,['geos','effects'] )

    let bodies = this.fidget_main.bodies.get_list_filtered( ['geos','effects'] )
    for( let i = 0 ; i < bodies.length; i++)
    {
      bodies[i].render.color_line = save_state.color_lines[i]
      bodies[i].render.update_color_three_line()
    }    
  }



  draw_order_to_body_z(z_depth_start,z_depth_incr = 0.5)
  {
    let z_depth = z_depth_start
    for (let i = 0; i < this.fidget_main.bodies.draw_order.length; i++)
    {
      if (this.fidget_main.bodies.draw_order[i] == null)
      {
        if (this.debug_mode.show_warning_log)
          console.log(  ' z_order - this.bodies.draw_order[' + i + '] doesnt exists')
        continue
      }
      
      if( this.fidget_main.bodies.draw_order[i].type == 'body')
        this.fidget_main.bodies.draw_order[i].render.z = z_depth
      else
        this.fidget_main.bodies.draw_order[i].z = z_depth

      z_depth += z_depth_incr
    }
    
    this.z_depth_end = z_depth    

    return this.z_depth_end
  }  
  
}


/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

export default class fidget{

  constructor( in_options)
  {
    let defaultOptions = 
    {
      m:null, 
      s:1, 
      screen_dims:null, 
      do_background: true, 
      debug : false,   
      dom_canvas : null, 
      Game_engine : null,
    }
    const args = { ...defaultOptions, ...in_options };


    
    this.physics = strictObject( new fidget_physics(args, this) )
    this.render  = strictObject( new fidget_render(args, this, this.physics) )
    this.Game_engine = args.Game_engine

    this.state = strictObject({
      geos_color_override : null,
      selection_changed : false,
    })

  
  
    this.debug_mode = args.debug
    this.screen_dims = args.screen_dims

    this.m = args.m // for child class
    this.s = args.s // for child class


      
    /////////////////////////////////////////////////////////////////// build

    this.bodies = strictObject(new bodies() )
    this.bodies.debug_mode = this.debug_mode
    this.bodies.fidget_sequence_i = args.fidget_sequence_index
    this.bodies.group_three = this.bodies.group_three
    this.bodies.effects = this.effects
    this.bodies.matter_engine = this.physics.matter_engine
    this.bodies.Mouse = this.physics.Mouse
    this.bodies.Game_engine = this.Game_engine


    // body opts helper  
    this.opts_global = {
      screen_dims: this.screen_dims,
      matter_engine: this.physics.matter_engine,
      Mouse: this.physics.Mouse,
      fidget: this,
      dynamic: this.physics.is_dynamic,
      Game_engine: this.Game_engine,
    }


    
  }

  setup()
  {     
    this.physics.setup()               
    this.render.setup()  
  }

  clean()
  {
    this.physics.clean()
    this.render.clean()
  }

  
  // update()
  // {
  //   this.physics.update()
  //   this.render.update()
  //   return true
  // }
  

  enable(value)
  {

    this.bodies.enable(value)
    this.bodies.do_update(value)
    if( value == false )
      this.bodies.render.set_visibility(false)
    else
      this.bodies.render.set_visibility()

    if(value == true)
      this.physics.clean_completion_info()
  }

  set_end_step( end_step )
  {
    this.physics.end_step = end_step
  }

  get_end_step()
  {
    return this.physics.end_step
  }




}




function countElements(world) {
  const bodiesCount = world.bodies.length;
  const constraintsCount = world.constraints.length;
  const compositesCount = world.composites.length;
  
  console.log(`Bodies: ${bodiesCount}`);
  console.log(`Constraints: ${constraintsCount}`);
  console.log(`Composites: ${compositesCount}`);
  console.log(`Total elements: ${bodiesCount + constraintsCount + compositesCount}`);
  }