import { flatten_list
  } from '../utils/utils.js';

import * as THREE from 'three';


export class bodies
{
  
    constructor( in_options )
    {
        this.store = {
            inters : {},
            geos : {},
        }
        this.eval_order = {
            inters : [], 
            geos : [],         
          }
        this.draw_order = []//in_options.draw_order

        this.debug_mode = null
        this.fidget_sequence_i = null
        this.group_three = null
        this.effects = null
        this.matter_engine = null
        this.Mouse = null
                
    }



    get_list_filtered( order = 'eval', body_type_filter = [] )//eval // draw
    {
  
      let bodies_list = []
  
      if( order == 'eval' )
      {
        for( let i =0; i < this.eval_order.length; i+=2)
        {   
          let b_type = this.eval_order[i+0]
          let key = this.eval_order[i+1]
          if( ( this.store[b_type][key] === null)||( this.store[b_type][key].length === 0))
          {
            if( this.debug_mode.show_warning_log )console.log('bodies_enable - this.store.'+b_type+'.'+key+' doesnt exists')
            continue
          }
          
          if( (body_type_filter.length === 0)||( body_type_filter.includes(b_type) ) )
          {
        
  
              let bodies = this.store[b_type][key]
              if( bodies.constructor === Array)
              {
                let bodies_ordered = bodies
                if( (bodies[0].constructor !== Array )&&(bodies[0].instances.length != 0))
                  bodies_ordered = put_selected_instance_first(bodies_ordered)
  
  
                for( let i = 0; i < bodies_ordered.length; i++)
                {
                  if( bodies_ordered[i].constructor === Array)
                  {
                    let bodies_ordered_B = bodies_ordered[i]
                    if( (bodies_ordered[i][0].constructor !== Array )&&( bodies_ordered[i][0].instances.length != 0 ))
                      bodies_ordered_B = put_selected_instance_first(bodies_ordered_B)
  
  
                    for( let j = 0; j < bodies_ordered_B.length; j++)
                      bodies_list.push(bodies_ordered_B[j])
                  }
                  else{
                    bodies_list.push(bodies_ordered[i])
                  }
                }
  
  
  
              }
              else
              {
                bodies_list.push(bodies)       
              }
            
          }
  
    
        } 
  
      }
     
  
      if( order == 'draw' )
      {
        bodies_list = this.draw_order
      }    
  
      if( order == 'build' )
      {
        bodies_list = this.get_build_order()
      }  
  
      if( order == 'default' )
      {
        for( let b_type in this.store)
        {   
          for( let key in this.store[b_type])
          {   
            if( ( this.store[b_type][key] === null)||( this.store[b_type][key].length === 0))
            {
              if( this.debug_mode.show_warning_log )console.log('bodies_enable - this.store.'+b_type+'.'+key+' doesnt exists')
              continue
            }
            
            if( (body_type_filter.length === 0)||( body_type_filter.includes(b_type) ) )
              for( let elem of flatten_list(this.store[b_type][key]) )
                bodies_list.push(elem) 
      
          } 
        } 
      }
  
      // //remove none
      // let bodies_list_clean = []
      // for( let elem of bodies_list)
      //   if(elem != null)
      //     bodies_list_clean.push(elem)
    
      return bodies_list
  
    }
  

    log_body_ids( body_type_filter = [] )
    {
      
      for( let i =0; i < this.eval_order.length; i+=2)
      {   
        let b_type = this.eval_order[i+0]
        let key = this.eval_order[i+1]
        if( ( this.store[b_type][key] === null)||( this.store[b_type][key].length === 0))
        {
          if(this.debug_mode.show_warning_log)console.log('bodies_log_body_ids - this.store.'+b_type+'.'+key+' doesnt exists')
          continue
        }
  
        if( (body_type_filter.length === 0)||( body_type_filter.includes(b_type) ) )
        {
          if( this.store[b_type][key].constructor === Array)
          {
            for( let i = 0; i < this.store[b_type][key].length; i++)
              console.log( this.fidget_sequence_i,b_type,key,i,this.store[b_type][key][i].body.id)
          }
          else
          {
            console.log( this.fidget_sequence_i,b_type,key,this.store[b_type][key].body.id)
          }       
        } 
      }
    }
  
  
    update_matrix( m, body_type_filter = [] )
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        body.m = m  
    }
  
    update( body_type_filter = [] )
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        body.update()
  
      for( let effect in this.effects)
        if(this.effects[effect] != null)this.effects[effect].update()      
    }
 
  
    setup_shapes_three( body_type_filter = [] )
    {
      this.group_three = new THREE.Group();
  
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        body.setup_shapes_three(this.group_three)  
  
      for( let effect in this.effects)
        if(this.effects[effect] != null)this.effects[effect].setup(this.group_three)  
  
      this.Mouse.setup(this.group_three)
    }  
  
    clean_physics(body_type_filter = [])
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        body.clean_physics() 
      
      Matter.Composite.clear(this.matter_engine.world, true);
    }

  
    clean_shapes_three(body_type_filter = [])
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        body.clean_shapes_three(this.group_three) 
  
      for( let effect in this.effects)
        if(this.effects[effect] != null)this.effects[effect].clean(this.group_three)        
    }


    animate_three( body_type_filter = [] )
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        body.animate_three()
      
      for( let effect in this.effects)
        if(this.effects[effect] != null)this.effects[effect].animate_three()    
  
      this.Mouse.update()
    }  
    /*
    bodies_set_visibility_three( value,body_type_filter = [] )
    {
      for( let b_type in this.store)
      {   
        if( (body_type_filter.length === 0)||( body_type_filter.includes(b_type) ) )
        {
          for( let key of this.eval_order[b_type])
          {      
            if( this.store[b_type][key].constructor === Array)
            {
              for( let i = 0; i < this.store[b_type][key].length; i++)
                this.store[b_type][key][i].visibility_override = value
            }
            else
              this.store[b_type][key].visibility_override = value
          }  
        } 
      } 
    }  
    */
  
    override_color(new_color = null,body_type_filter = [] )
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        body.color = new_color || body.color_base
    }
    override_color_three(new_color = null,body_type_filter = [] )
    {
      this.override_color(new_color, body_type_filter)
      this.color_update_three_shape(body_type_filter)
    }
  
    color_update_three_line( body_type_filter = [] )
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        body.update_color_three_line()
    }
  
  
    color_update_three_shape( body_type_filter = [] )
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        body.update_color_three_shape()
    }
  
    /*
    bodies_axe_clean_override( body_type_filter = [] )
    {
      for( let i =0; i < this.eval_order.length; i+=2)
      {   
        let b_type = this.eval_order[i+0]
        let key = this.eval_order[i+1]
        if( ( this.store[b_type][key] === null)||( this.store[b_type][key].length === 0))
        {
          console.log('bodies_axe_clean_override - this.store.'+b_type+'.'+key+' doesnt exists')
          continue
        }
  
        if( (body_type_filter.length === 0)||( body_type_filter.includes(b_type) ) )
        {
       
          if( this.store[b_type][key].constructor === Array)
          {
            for( let i = 0; i < this.store[b_type][key].length; i++)
              if(this.store[b_type][key][i].constraints.axe != null)
                this.store[b_type][key][i].constraints.axe.pos_override = null
          }
          else
            if(this.store[b_type][key].constraints.axe != null)
              this.store[b_type][key].constraints.axe.pos_override = null
          
        } 
      }  
    }
    */
  
    constraints_enable(value,body_type_filter = [] )
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        for( let cns in body.constraints )
          body.constraints[cns].enable(value) 
  
    }


    init_physics()
    {   
      for( let body of this.get_list_filtered( 'eval' ))
        body.init_physics()   
    
      for( let effect in this.effects)
        if(this.effects[effect] != null)this.effects[effect].init_physics()     
  
    }
  
    init_constraints()
    {   
      for( let body of this.get_list_filtered( 'build' ))
      {
        //console.log(body.name,body.build_order,body.constraints_args)
        body.set_out_matrix(body.get_init_matrix())
        body.init_constraints()
      }
  
      for( let effect in this.effects)
        if(this.effects[effect] != null)this.effects[effect].init_constraints()     
    
  
    }
  
    get_build_order()
    {
      let default_list = this.get_list_filtered('default')
      let indexes = []
      let indexes_sorted = []
      for( let b of default_list )
      {
        let i = b.build_order
        indexes.push(i)
        indexes_sorted.push(i)
      }
      indexes_sorted.sort(function (a, b) {  return a - b;  })
  
      let build_order = []
      for(let i of indexes_sorted)
        build_order.push( default_list[indexes.indexOf(i)] )
  
      return build_order
    }
  
    
  
    set_debug( value, body_type_filter = [] )
    {
  
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        body.debug = value     
    }
  
    set_visibility_secondary( value,body_type_filter = [] )
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
      {
        body.visibility_secondary = value 
      }
        
        
        
    }  
  
    set_visibility_override( value,body_type_filter = [] )
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        body.debug_force_visibility = value        
    }  
  
  
  
  
    set_visibility( value = null ,body_type_filter = [] )
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
      {
        if( value == null )
        {
          body.visibility = body.visibility_default
        }
        else
        {
          body.visibility = value
        }
        if( body.mesh_three != null )
          body.mesh_three.group.visible = body.get_visibility() == 1       
      }
    }  
  
  
  
  
    set_dynamic( value = null ,body_type_filter = [] )
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
      {
        if( value == null )
        {
          body.dynamic = body.dynamic_default
        }
        else
        {
          body.dynamic = value
        }      
      }
    }  
  
  
  
    init_out_matrix( body_type_filter = [] )
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        body.init_out_matrix()
  
    }  
  
  
    do_update( value, body_type_filter = [] )
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        body.do_update = value
    }
  
    enable( value, body_type_filter = [] )
    {
  
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        body.enable(value)
  
    }
  
    apply_material( material = null, body_type_filter = [] )
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        if( body.mesh_three.shape != null)
          body.mesh_three.shape.material = material || body.three_material
    }
  
  
    apply_force_at_center( force, adjust_with_mass = false, body_type_filter = [] )
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
      {
        let p_center = body.get_out_position('world')
        if(adjust_with_mass)
          body.apply_force( p_center, force.getMult(body.get_mass()) )
        else
          body.apply_force( p_center, force)
      }
    }
  
  
  
    apply_exlode_force_from_point( explode_point, explode_power, default_dir, adjust_with_mass = false, body_type_filter = [] )
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
      {
        let p_center = body.get_out_position('world')
        let v_dir = p_center.getSub(explode_point)
        if(v_dir.mag() < 0.001)
          v_dir = default_dir
        v_dir.normalize()
        v_dir.mult(explode_power)
        if(adjust_with_mass)
          v_dir.mult(body.get_mass())
          
        
        body.apply_force( p_center, v_dir)
      }
    }
  
  
  
    search_by_name( name, body_type_filter = [] )
    {
      let bodies_found = []
  
      for( let body of this.get_list_filtered( 'build', body_type_filter ))
      {
        let body_name = body.name
        if(body_name.indexOf(name) != -1 )
          bodies_found.push(body)
      }
  
  
      return bodies_found
  
    }
  
  
  
    get_list_attr_value_filtered( attr, value , body_type_filter = [] , inverse = false)
    {
      for( let body of this.get_list_filtered( 'build', body_type_filter ))
      {
        if((inverse == true)&&( body[attr] != value))
        {   
          body_list.push(body)       
        }
        if((inverse == false)&&( body[attr] == value))
        {   
          body_list.push(body)       
        }
      }
  
      return body_list
  
    }
  
  
    list_enable( value, bodies_list = [] )
    {
      for( let i = 0; i < bodies_list.length; i++ )
      {
        if(bodies_list[i] == null)
        {
          if(this.debug_mode.show_warning_log)console.log( 'bodies_list_enable - '+ i +' doesnt exists' )
          continue
        }
        bodies_list[i].enable(value) 
      }
    }    
}



function put_selected_instance_first( bodies )
{
  let bodies_ordered = []
  for( let i = 0; i < bodies.length; i++)
  {
    if( bodies[i].is_last_instance_selected )
      bodies_ordered.push(bodies[i])
  }
  for( let i = 0; i < bodies.length; i++)
  {
    if( !bodies[i].is_last_instance_selected )
      bodies_ordered.push(bodies[i])
  }  
  return bodies_ordered
}

