

import Vector from './vector.js';
import { utils, 
  switch_selection, 
  create_physics_engine,
  create_mouse_constraint,
  create_physics_engine_runner,
  create_boundary_wall_collision} from './utils.js';
import * as THREE from 'three';
import { Mouse_manager } from './utils_three.js'
class state_step_tpl{
  constructor()
  {
      this.resoluton_coef = 0
      this.resoluton_coef_last = 0
      this.update_count = 0
      this.apply_force_happened = false
      this.in_use = false    
      this.used = false 
  } 
}


export default class fidget{

  ////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////// SETUP
  ////////////////////////////////////////////////////////////////////////////////////

  constructor( m, s, screen_dims, matter_engine, mouse_constraint,shaders = [],debug=false)
  {
    matter_engine        = create_physics_engine()
    var matter_engine_runner = create_physics_engine_runner(matter_engine)
    mouse_constraint = create_mouse_constraint(matter_engine)
    create_boundary_wall_collision(matter_engine, screen_dims.x,screen_dims.y,false)
    



    this.m = m
    this.s = s
    this.screen_dims = screen_dims
    this.state = {
      update_count : 0,
      resolution_coef : 0, 
      resolution_coef_last:0,
      switch_selection_happened_step : 0,
      current_step : 0,
      steps:[ 
        new state_step_tpl, 
        new state_step_tpl, 
        new state_step_tpl, 
        new state_step_tpl,
        new state_step_tpl,
        new state_step_tpl]
    }

    this.force_way = null
    this.resolution_coef_override = null
    this.debug_mode = debug
    this.fidget_sequence_i = 0
    this.mouse_pressed_positions_at_update = []
    this.touch_enable = true
    this.anim_mode = false
    this.matter_engine = matter_engine
    this.matter_engine_runner = matter_engine_runner 
    this.mouse_constraint = mouse_constraint
    this.Mouse = new Mouse_manager( mouse_constraint, screen_dims, this, this.debug_mode.mouse_info)
    /////////////////////////////////////////////////////////////////// build

    this.bodies = {
      inters : {},
      geos : {},
    }
    this.bodies_draw_order = {
      inters : [], 
      geos : [],         
    }
    this.end_step = 0

    this.color_background = utils.color.dark
    this.show_step_helpers = [ 0, 0, 0 ]  
    

    this.shaders = shaders

     
      
    this.group_three = null
  }


  setup()
  {     
    console.log('setup : fidget')                      
    this.bodies_set_debug( this.debug_mode )
    this.bodies_set_visibility(this.debug_mode.show_inter, ['inters'])   
    this.bodies_init_out_matrix()
  }

  ////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////// UPDATE
  ////////////////////////////////////////////////////////////////////////////////////


  get_resolution_coef_info( resolution_coef_override = null)
  {
    return 1      
  }

  set_step_resolution( resolution_coef, update_interaction = false)
  {
    // utils
    var selected_body = this.mouse_constraint.constraint.bodyB

    // clean
    this.bodies_axe_clean_override()
    this.bodies_rot_clean_override()
    this.bodies_enable( 0, ['inters'] )

    ////////////////////////////////////////////////////////////////////////////////////
    let step = 0
    let res_coef = this.state.steps[step].resoluton_coef
    let do_it = this.state.current_step == step
    if( do_it )
    {
      //_________________________________________________________________Clean Inter 
      //_________________________________________________________________Clean Other

      //_________________________________________________________________Control

      //_________________________________________________________________Update
      this.state.switch_selection_happened_step = step
      this.update_step_count(step)
    }
    ////////////////////////////////////////////////////////////////////////////////////
  }

  update()
  {
    // resolution
    this.state.resolution_coef_last = this.state.resolution_coef

    this.get_resolution_coef_info( this.resolution_coef_override )
    this.set_step_resolution( this.state.resolution_coef, this.resolution_coef_override != null)

    this.bodies_update()

    this.state.update_count += 1
  }


  ////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////// DRAW
  ////////////////////////////////////////////////////////////////////////////////////

  
  draw_background()
  {
    let a = this.state.steps[3].update_count
    a -=30
    a = Math.max(0,a)
    a *=15
    if(this.anim_mode)
      a = this.state.steps[3].resoluton_coef*this.screen_dims.x/2    

    // a 0-->200
    let pA = new Vector(this.screen_dims.x/4,this.screen_dims.y/2)
    pA.v.x -= a
    this.bodies.geos.backgrounds[0].set_position(pA)
    if(( 0 < this.state.steps[3].update_count-15)&&(this.anim_mode==false))
    {
      this.bodies.geos.backgrounds[0].color = [50,140,50]
      this.bodies.geos.backgrounds[0].update_color_three()
    }
      


    let pB = new Vector(this.screen_dims.x/4*3,this.screen_dims.y/2)
    pB.v.x += a
    this.bodies.geos.backgrounds[1].set_position(pB)  
    if(( 0 < this.state.steps[3].update_count-15)&&(this.anim_mode==false))
    {
      this.bodies.geos.backgrounds[1].color = [50,140,50] 
      this.bodies.geos.backgrounds[1].update_color_three()      
    }
  }


  ////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////// UTILS
  ////////////////////////////////////////////////////////////////////////////////////

  do_anim_override( anim = null )
  {
    if( anim != null)
    {
      this.resolution_coef_override = anim*this.end_step
    }
    else
    {
      this.resolution_coef_override = null
    }
    
  }

  desactivate_touch()
  {
    this.bodies_enable(false, ['inters'])
    this.touch_enable = false

  }

  update_step_count(step)
  {
    for( let i = 0; i < this.state.steps.length; i++ )
    {
      if(i == step)
        this.state.steps[i].update_count += 1
      else
        this.state.steps[i].update_count = 0
    } 
  }

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
            if(selected_body != obj_next.body)
              switch_selection( this.mouse_constraint, obj_next)
          }
          else
          {
            if(selected_body != obj_last.body)
              switch_selection(this.mouse_constraint, obj_last)     
          }
        }
        else if(this.force_way == 1)
        {
          if(selected_body != obj_next.body)
            switch_selection( this.mouse_constraint, obj_next)
        }
        else if(this.force_way == -1)
        {
          if(selected_body != obj_last.body)
            switch_selection(this.mouse_constraint, obj_last) 
        }
      }
      this.state.switch_selection_happened_step = current_step  
    }
  }

  bodies_log_body_ids( body_type_filter = [] )
  {
    for( let i =0; i < this.bodies_draw_order.length; i+=2)
    {   
      let b_type = this.bodies_draw_order[i+0]
      let key = this.bodies_draw_order[i+1]

      if( (body_type_filter.length == 0)||( body_type_filter.includes(b_type) ) )
      {
        if( this.bodies[b_type][key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[b_type][key].length; i++)
            console.log( this.fidget_sequence_i,b_type,key,i,this.bodies[b_type][key][i].body.id)
        }
        else
        {
          console.log( this.fidget_sequence_i,b_type,key,this.bodies[b_type][key].body.id)
        }       
      } 
    }
  }


  bodies_update_matrix( m, body_type_filter = [] )
  {
    for( let i =0; i < this.bodies_draw_order.length; i+=2)
    {   
      let b_type = this.bodies_draw_order[i+0]
      let key = this.bodies_draw_order[i+1]
 
      if( (body_type_filter.length == 0)||( body_type_filter.includes(b_type) ) )
      {

        if( this.bodies[b_type][key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[b_type][key].length; i++)
            this.bodies[b_type][key][i].m = m
        }
        else
          this.bodies[b_type][key].m = m
      
      } 
    }
  }

  bodies_update( body_type_filter = [] )
  {
    for( let i =0; i < this.bodies_draw_order.length; i+=2)
    {   
      let b_type = this.bodies_draw_order[i+0]
      let key = this.bodies_draw_order[i+1]
 
      if( (body_type_filter.length == 0)||( body_type_filter.includes(b_type) ) )
      {

        if( this.bodies[b_type][key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[b_type][key].length; i++)
            this.bodies[b_type][key][i].update()
        }
        else
          this.bodies[b_type][key].update()
      
      } 
    }
  }

  bodies_setup_shapes_three( body_type_filter = [] )
  {
  
    this.group_three = new THREE.Group();

    for( let i =0; i < this.bodies_draw_order.length; i+=2)
    {   
      let b_type = this.bodies_draw_order[i+0]
      let key = this.bodies_draw_order[i+1]
      if( (body_type_filter.length == 0)||( body_type_filter.includes(b_type) ) )
      {
    
        if( this.bodies[b_type][key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[b_type][key].length; i++)
          {
            this.bodies[b_type][key][i].setup_shapes_three(this.group_three)
          }
            
        }
        else
          this.bodies[b_type][key].setup_shapes_three(this.group_three)
        
      } 
    }

    this.Mouse.setup(this.group_three)
  }  
  bodies_animate_three( body_type_filter = [] )
  {

    for( let i =0; i < this.bodies_draw_order.length; i+=2)
    {   
      let b_type = this.bodies_draw_order[i+0]
      let key = this.bodies_draw_order[i+1]
   
      if( (body_type_filter.length == 0)||( body_type_filter.includes(b_type) ) )
      {
    
        if( this.bodies[b_type][key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[b_type][key].length; i++)
          {
            this.bodies[b_type][key][i].animate_three()
          }
            
        }
        else
          this.bodies[b_type][key].animate_three()
        
      } 
    }

    this.Mouse.update()
  }  
  /*
  bodies_set_visibility_three( value,body_type_filter = [] )
  {
    for( let b_type in this.bodies)
    {   
      if( (body_type_filter.length == 0)||( body_type_filter.includes(b_type) ) )
      {
        for( let key of this.bodies_draw_order[b_type])
        {      
          if( this.bodies[b_type][key].constructor === Array)
          {
            for( let i = 0; i < this.bodies[b_type][key].length; i++)
              this.bodies[b_type][key][i].visibility_override = value
          }
          else
            this.bodies[b_type][key].visibility_override = value
        }  
      } 
    } 
  }  
  */

  bodies_override_color(new_color = null,body_type_filter = [] )
  {

    for( let i =0; i < this.bodies_draw_order.length; i+=2)
    {   
      let b_type = this.bodies_draw_order[i+0]
      let key = this.bodies_draw_order[i+1]
   
      if( (body_type_filter.length == 0)||( body_type_filter.includes(b_type) ) )
      {
     
        if( this.bodies[b_type][key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[b_type][key].length; i++)
            this.bodies[b_type][key][i].color = new_color || this.bodies[b_type][key][i].color_base
        }
        else
          this.bodies[b_type][key].color = new_color || this.bodies[b_type][key].color_base
        
      } 
    }
  }
  bodies_override_color_three(new_color = null,body_type_filter = [] )
  {
    this.bodies_override_color(new_color, body_type_filter)
    this.bodies_color_update_three(body_type_filter)

  }
  bodies_color_update_three( body_type_filter = [] )
  {
    for( let i =0; i < this.bodies_draw_order.length; i+=2)
    {   
      let b_type = this.bodies_draw_order[i+0]
      let key = this.bodies_draw_order[i+1]
     
      if( (body_type_filter.length == 0)||( body_type_filter.includes(b_type) ) )
      {
    
        if( this.bodies[b_type][key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[b_type][key].length; i++)
            this.bodies[b_type][key][i].update_color_three()
        }
        else
          this.bodies[b_type][key].update_color_three()
        
      } 
    }
  }

  bodies_axe_clean_override( body_type_filter = [] )
  {
    for( let i =0; i < this.bodies_draw_order.length; i+=2)
    {   
      let b_type = this.bodies_draw_order[i+0]
      let key = this.bodies_draw_order[i+1]
     
      if( (body_type_filter.length == 0)||( body_type_filter.includes(b_type) ) )
      {
     
        if( this.bodies[b_type][key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[b_type][key].length; i++)
            if(this.bodies[b_type][key][i].constraints.axe != null)
              this.bodies[b_type][key][i].constraints.axe.pos_override = null
        }
        else
          if(this.bodies[b_type][key].constraints.axe != null)
            this.bodies[b_type][key].constraints.axe.pos_override = null
        
      } 
    }  
  }

  bodies_cns_enable(value,body_type_filter = [] )
  {
    for( let i =0; i < this.bodies_draw_order.length; i+=2)
    {   
      let b_type = this.bodies_draw_order[i+0]
      let key = this.bodies_draw_order[i+1]
     
      if( (body_type_filter.length == 0)||( body_type_filter.includes(b_type) ) )
      {

        if( this.bodies[b_type][key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[b_type][key].length; i++)
          {
            for( var cns in this.bodies[b_type][key][i].constraints )
            {
              this.bodies[b_type][key][i].constraints[cns].is_enable = value
            }

          }

        }
        else      
          for( var cns in this.bodies[b_type][key].constraints )
          {
            this.bodies[b_type][key].constraints[cns].is_enable = value          
          }
  
      }  
       
    }   
  }

  bodies_rot_clean_override( body_type_filter = [] )
  {
    for( let i =0; i < this.bodies_draw_order.length; i+=2)
    {   
      let b_type = this.bodies_draw_order[i+0]
      let key = this.bodies_draw_order[i+1]
     
      if( (body_type_filter.length == 0)||( body_type_filter.includes(b_type) ) )
      {
     
        if( this.bodies[b_type][key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[b_type][key].length; i++)
            this.bodies[b_type][key][i].rot_override = null 
        }
        else
          this.bodies[b_type][key].rot_override = null 
        
      } 
    }  
  }

  

  bodies_set_debug( value,body_type_filter = [] )
  {
    for( let i =0; i < this.bodies_draw_order.length; i+=2)
    {   
      let b_type = this.bodies_draw_order[i+0]
      let key = this.bodies_draw_order[i+1]
      
      if( (body_type_filter.length == 0)||( body_type_filter.includes(b_type) ) )
      {   
        if( this.bodies[b_type][key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[b_type][key].length; i++)
            this.bodies[b_type][key][i].debug = value 
        }
        else
          this.bodies[b_type][key].debug = value 
        
      } 
    }       
  }

  bodies_set_visibility( value,body_type_filter = [] )
  {
    
    for( let i =0; i < this.bodies_draw_order.length; i+=2)
    {   
      let b_type = this.bodies_draw_order[i+0]
      let key = this.bodies_draw_order[i+1]
       
      if( (body_type_filter.length == 0)||( body_type_filter.includes(b_type) ) )
      {
     
        if( this.bodies[b_type][key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[b_type][key].length; i++)
            this.bodies[b_type][key][i].visibility_override = value
        }
        else
          this.bodies[b_type][key].visibility_override = value
        
      } 
    } 
  }  


  bodies_init_out_matrix( body_type_filter = [] )
  {
    
    for( let i =0; i < this.bodies_draw_order.length; i+=2)
    {   
      let b_type = this.bodies_draw_order[i+0]
      let key = this.bodies_draw_order[i+1]
       
      if( (body_type_filter.length == 0)||( body_type_filter.includes(b_type) ) )
      {
     
        if( this.bodies[b_type][key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[b_type][key].length; i++)
            this.bodies[b_type][key][i].init_out_matrix()
        }
        else
          this.bodies[b_type][key].init_out_matrix()
        
      } 
    } 
  }  

  bodies_enable( value, body_type_filter = [] )
  {

    if( body_type_filter.length == 0)
    {
      this.matter_engine_runner.enabled = value 
      //console.log('enable',value)
    }



    for( let i =0; i < this.bodies_draw_order.length; i+=2)
    {   
      let b_type = this.bodies_draw_order[i+0]
      let key = this.bodies_draw_order[i+1]
       
      if( (body_type_filter.length == 0)||( body_type_filter.includes(b_type) ) )
      {

        if( this.bodies[b_type][key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[b_type][key].length; i++)
          {
            this.bodies[b_type][key][i].enable(value)
    
            if(body_type_filter.length == 0)
              this.bodies[b_type][key][i].do_update = value            
          }
            
        }
        else
          this.bodies[b_type][key].enable(value)
          
          if(body_type_filter.length == 0)
            this.bodies[b_type][key].do_update = value
        
      } 
    } 
  }

  get_selected_body(body_type_filter = [] )
  {
    for( let i =0; i < this.bodies_draw_order.length; i+=2)
    {   
      let b_type = this.bodies_draw_order[i+0]
      let key = this.bodies_draw_order[i+1]
       
      if( (body_type_filter.length == 0)||( body_type_filter.includes(b_type) ) )
      {

        if( this.bodies[b_type][key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[b_type][key].length; i++)
          {
            if(this.bodies[b_type][key][i].is_selected)
              return this.bodies[b_type][key][i]           
          }
            
        }
        else

          if(this.bodies[b_type][key].is_selected)
            return this.bodies[b_type][key]
        
      } 
    }   
    
    return null
    
  }


  mouse_select_highlight(mouse_cns,body_type_filter = [] )
  {
    if(this.Mouse.mouse_lock_selection)
      return

    let body_to_highlight = []
    let body_to_reduce    = []
    for( let k =0; k < this.bodies_draw_order.length; k+=2)
    {   
      let b_type = this.bodies_draw_order[k+0]
      let key = this.bodies_draw_order[k+1]
        
      if( (body_type_filter.length == 0)||( body_type_filter.includes(b_type) ) )
      {

        if( this.bodies[b_type][key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[b_type][key].length; i++)
          {
            if( this.bodies[b_type][key][i].body == mouse_cns.constraint.bodyB )
            {
              this.bodies[b_type][key][i].color = utils.color.redLight
              this.bodies[b_type][key][i].is_selected = true

              for( let j = 0; j < this.bodies[b_type][key][i].highlight_selection.length; j++)
                body_to_highlight.push(this.bodies[b_type][key][i].highlight_selection[j])
              
            }
            else
            {
              this.bodies[b_type][key][i].color = this.bodies[b_type][key][i].color_base 
              this.bodies[b_type][key][i].is_selected = false

              for( let j = 0; j < this.bodies[b_type][key][i].highlight_selection.length; j++)
                body_to_reduce.push(this.bodies[b_type][key][i].highlight_selection[j])  

            }
        
          }
        }
        else
        {
          if( this.bodies[b_type][key].body == mouse_cns.constraint.bodyB )
          {
            this.bodies[b_type][key].color = utils.color.redLight
            this.bodies[b_type][key].is_selected = true

            for( let j = 0; j < this.bodies[b_type][key].highlight_selection.length; j++)
              body_to_highlight.push(this.bodies[b_type][key].highlight_selection[j])  

          }
          else
          {
            this.bodies[b_type][key].color = this.bodies[b_type][key].color_base 
            this.bodies[b_type][key].is_selected = false

            for( let j = 0; j < this.bodies[b_type][key].highlight_selection.length; j++)
              body_to_reduce.push(this.bodies[b_type][key].highlight_selection[j])  

          }

        }

          
      } 
    

      for( let i = 0 ; i < body_to_reduce.length; i++)
      {
        body_to_reduce[i].color_line = [0,0,0]
        body_to_reduce[i].update_color_three()
      }
      for( let i = 0 ; i < body_to_highlight.length; i++)
      {
        body_to_highlight[i].color_line = [255,255,255]
        body_to_highlight[i].update_color_three()
      }
 
    } 
    
    this.bodies_color_update_three(body_type_filter)
  }





}


