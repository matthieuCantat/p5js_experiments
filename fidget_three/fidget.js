

import Vector from './vector.js';
import { utils, switch_selection } from './utils.js';
import * as ut from './utils_three.js';
import * as THREE from 'three';

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

  constructor( m, s, screen_dims, matter_engine, mouseConstraint,shaders = [],debug=false,use_webgl = false)
  {
    console.log('fidget',use_webgl)
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
    this.use_webgl = use_webgl
    this.matter_engine = matter_engine
    this.mouseConstraint = mouseConstraint
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

    this.webgl_draw_coords_offset = new Vector(-screen_dims.x/4,0)
    if( this.use_webgl == false )
      this.webgl_draw_coords_offset = new Vector(0,0)   
      
    this.group_three = null
  }

  preload()
  {
    console.log('preload : fidget')
    this.bodies_preload()
  }

  setup()
  {     
    console.log('setup : fidget')   

    this.bodies_setup()                      
    this.bodies_set_debug( this.debug_mode )
    this.bodies_set_visibility(this.debug_mode, ['inters'])   
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
    var selected_body = this.mouseConstraint.constraint.bodyB

    // clean
    this.bodies_axe_enable(['inters'])
    this.bodies_axe_clean_override()
    this.bodies_cns_modif(1.0)
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

  draw(p5)
  {
    this.bodies_draw(p5)
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
              switch_selection( this.mouseConstraint, obj_next)
          }
          else
          {
            if(selected_body != obj_last.body)
              switch_selection(this.mouseConstraint, obj_last)     
          }
        }
        else if(this.force_way == 1)
        {
          if(selected_body != obj_next.body)
            switch_selection( this.mouseConstraint, obj_next)
        }
        else if(this.force_way == -1)
        {
          if(selected_body != obj_last.body)
            switch_selection(this.mouseConstraint, obj_last) 
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

  bodies_draw( p5, body_type_filter = [] )
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
            this.bodies[b_type][key][i].draw(p5)
        }
        else
          this.bodies[b_type][key].draw(p5)
  
      } 
    }
  }
  bodies_setup_shapes_three( body_type_filter = [] )
  {
  
    console.log('bodies_setup_shapes_three')
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
  }  
  bodies_animate_three( body_type_filter = [] )
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
            this.bodies[b_type][key][i].animate_three()
          }
            
        }
        else
          this.bodies[b_type][key].animate_three()
        
      } 
    }
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
            if(this.bodies[b_type][key][i].c_axe != null)
              this.bodies[b_type][key][i].c_axe.pos_override = null
        }
        else
          if(this.bodies[b_type][key].c_axe != null)
            this.bodies[b_type][key].c_axe.pos_override = null
        
      } 
    }  
  }

  bodies_axe_enable(value,body_type_filter = [] )
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
            if(this.bodies[b_type][key][i].c_axe != null)
              this.bodies[b_type][key][i].c_axe.enable = value
        }
        else
          if(this.bodies[b_type][key].c_axe != null)
            this.bodies[b_type][key].c_axe.enable = value
        
      } 
    }     
  }

  bodies_cns_modif(value,body_type_filter = [] )
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
            for( let j = 0; j < this.bodies[b_type][key][i].constraints.length; j++)
              this.bodies[b_type][key][i].constraints[j].cns.stiffness = value
        }
        else      
          for( let j = 0; j < this.bodies[b_type][key].constraints.length; j++)
            this.bodies[b_type][key].constraints[j].cns.stiffness = value   
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

  bodies_setup( body_type_filter = [] )
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
            this.bodies[b_type][key][i].setup() 
        }
        else
          this.bodies[b_type][key].setup()
        
      } 
    }       
  }

  bodies_preload( body_type_filter = [] )
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
            this.bodies[b_type][key][i].preload() 
        }
        else
          this.bodies[b_type][key].preload()
        
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

  bodies_enable( value,body_type_filter = [] )
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
            this.bodies[b_type][key][i].enable(value)
        }
        else
          this.bodies[b_type][key].enable(value)
        
      } 
    } 
  }

  obj_is_selected(mouse_cns,obj)
  {
    if( mouse_cns.constraint.bodyB != null )
      if( obj.body == mouse_cns.constraint.bodyB )
        return true
    return false
  }

  mouse_select_highlight(mouse_cns,body_type_filter = [] )
  {
    if( mouse_cns.constraint.bodyB != null )
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
              if( this.bodies[b_type][key][i].body == mouse_cns.constraint.bodyB )
                this.bodies[b_type][key][i].color = utils.color.redLight
              else
                this.bodies[b_type][key][i].color = this.bodies[b_type][key][i].color_base           
            }
          }
          else
          {
            if( this.bodies[b_type][key].body == mouse_cns.constraint.bodyB )
              this.bodies[b_type][key].color = utils.color.redLight
            else
            this.bodies[b_type][key].color = this.bodies[b_type][key].color_base 
          }

           
        } 
      } 
 
    } 
    
    this.bodies_color_update_three(body_type_filter)
  }





}

