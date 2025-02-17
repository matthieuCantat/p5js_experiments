import { flatten_list,
  strictObject
  } from '../utils/utils.js';

import * as THREE from 'three';





export class bodies_physics
{
  
    constructor( in_options )
    {
      this.bodies = in_options.bodies_main         
    }


    constraints_enable(value,body_type_filter = [] )
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
        for( let cns in body.physics.relations.constraints )
          body.physics.relations.constraints[cns].enable(value) 
  
    }


    init_physics()
    {   
      for( let body of this.bodies.get_list_filtered( 'eval' ))
        body.physics.init_physics()   
    
      for( let effect in this.bodies.effects)
        if(this.bodies.effects[effect] != null)this.bodies.effects[effect].init_physics()     
  
    }
  
    init_constraints()
    {   
      for( let body of this.bodies.get_list_filtered( 'build' ))
      {
        //console.log(body.name,body.build_order,body.constraints_args)
        body.physics.set_out_matrix(body.physics.get_init_matrix())
        body.physics.init_constraints()
      }
  
      for( let effect in this.bodies.effects)
        if(this.bodies.effects[effect] != null)this.bodies.effects[effect].init_constraints()     
    
  
    }
  

      /*

    update_matrix( m, body_type_filter = [] )
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ) )
        body.physics.state.m = m  
    }
      */
  
    update( body_type_filter = [] )
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
        body.physics.update()
  
      for( let effect in this.bodies.effects)
        if(this.bodies.effects[effect] != null)this.bodies.effects[effect].update()      
    }

    clean_physics(body_type_filter = [])
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
        body.physics.clean_physics() 
      
      Matter.Composite.clear(this.bodies.matter_engine.world, true);
    }
 
  
    set_dynamic( value = null ,body_type_filter = [] )
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
      {
        if( value == null )
        {
          body.physics.dynamic = body.physics.dynamic_default
        }
        else
        {
          body.physics.dynamic = value
        }      
      }
    }  
  
  
  
    init_out_matrix( body_type_filter = [] )
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
        body.physics.init_out_matrix()
  
    }  
  

    apply_force_at_center( force, adjust_with_mass = false, body_type_filter = [] )
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
      {
        let p_center = body.physics.get_out_position('world')
        if(adjust_with_mass)
          body.physics.apply_force( p_center, force.getMult(body.physics.get_mass()) )
        else
          body.physics.apply_force( p_center, force)
      }
    }
  
  
  
    apply_exlode_force_from_point( explode_point, explode_power, default_dir, adjust_with_mass = false, body_type_filter = [] )
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
      {
        let p_center = body.physics.get_out_position('world')
        let v_dir = p_center.getSub(explode_point)
        if(v_dir.mag() < 0.001)
          v_dir = default_dir
        v_dir.normalize()
        v_dir.mult(explode_power)
        if(adjust_with_mass)
          v_dir.mult(body.physics.get_mass())
          
        
        body.physics.apply_force( p_center, v_dir)
      }
    }
}




export class bodies_render
{
  
    constructor( in_options )
    {
      this.bodies = in_options.bodies_main         
    }

  

    setup_shapes_three( body_type_filter = [] )
    {
      this.bodies.group_three = new THREE.Group();
  
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
        body.render.setup_shapes_three(this.bodies.group_three)  
  
      for( let effect in this.bodies.effects)
        if(this.bodies.effects[effect] != null)this.bodies.effects[effect].setup(this.bodies.group_three)  
  
      this.bodies.Mouse.setup(this.bodies.group_three)
    }  
  
  
    clean_shapes_three(body_type_filter = [])
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
        body.render.clean_shapes_three(this.bodies.group_three) 
  
      for( let effect in this.bodies.effects)
        if(this.bodies.effects[effect] != null)this.bodies.effects[effect].clean(this.bodies.group_three)        
    }


    animate_three( body_type_filter = [] )
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
      {
        let pos   = body.physics.get_out_position('world')
        let rot   = body.physics.get_out_rotation('world')
        let scale = body.physics.state.scale
        body.render.animate_three( pos, rot, scale)
      }

      
      for( let effect in this.bodies.effects)
        if(this.bodies.effects[effect] != null)this.bodies.effects[effect].animate_three()    
  
      this.bodies.Mouse.update()
    }  
   
  
    override_color(new_color = null,body_type_filter = [] )
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
        body.render.color = new_color || body.render.color_base
    }

  
    color_update_three_shape( body_type_filter = [] )
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
        body.render.update_color_three_shape()
    }

    override_color_three(new_color = null,body_type_filter = [] )
    {
      this.override_color(new_color, body_type_filter)
      this.color_update_three_shape(body_type_filter)
    }
    /*
    color_update_three_line( body_type_filter = [] )
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
        body.render.update_color_three_line()
    }
      */
  
  
  
  
    set_visibility_secondary( value, body_type_filter = [] )
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
      {
        body.render.state.visibility_secondary = value 
      }
          
    }   
  
    set_visibility( value = null ,body_type_filter = [] )
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
      {
        if( value == null )
        {
          body.render.state.visibility = body.render.state.visibility_default
        }
        else
        {
          body.render.state.visibility = value
        }
        if( body.render.mesh_three != null )
          body.render.mesh_three.group.visible = body.render.get_visibility() === 1       
      }
    }  
  

    apply_material( material = null, body_type_filter = [] )
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
        if( body.render.mesh_three.shape != null)
          body.render.mesh_three.shape.material = material || body.render.three_material
    }
  

}


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
        this.build_order = []

        this.debug_mode = null
        this.fidget_sequence_i = null
        this.group_three = null
        this.effects = null
        this.matter_engine = null
        this.Mouse = null

        
            
        this.physics = strictObject(new bodies_physics( { bodies_main:this }))
        this.render = strictObject(new bodies_render( { bodies_main:this }))
                
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
            if( this.debug_mode.show_warning_log )
              console.log('bodies_enable - this.store.'+b_type+'.'+key+' doesnt exists')
            continue
          }
          
          if( (body_type_filter.length === 0)||( body_type_filter.includes(b_type) ) )
          {
        
  
              let bodies = this.store[b_type][key]
              if( bodies.constructor === Array)
              {
                let bodies_ordered = bodies
                if( (bodies[0].constructor !== Array )&&(bodies[0].relations.instances.length != 0))
                  bodies_ordered = put_selected_instance_first(bodies_ordered)
  
  
                for( let i = 0; i < bodies_ordered.length; i++)
                {
                  if( bodies_ordered[i].constructor === Array)
                  {
                    let bodies_ordered_B = bodies_ordered[i]
                    if( (bodies_ordered[i][0].constructor !== Array )&&( bodies_ordered[i][0].relations.instances.length != 0 ))
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
              if( this.debug_mode.show_warning_log )
                console.log('bodies_enable - this.store.'+b_type+'.'+key+' doesnt exists')
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

    get_build_order()
    {
      let default_list = this.get_list_filtered('default')
      let indexes = []
      let indexes_sorted = []
      for( let body of default_list )
      {
        let i = body.relations.build_order
        indexes.push(i)
        indexes_sorted.push(i)
      }
      indexes_sorted.sort(function (a, b) {  return a - b;  })
  
      let build_order = []
      for(let i of indexes_sorted)
        build_order.push( default_list[indexes.indexOf(i)] )
  
      return build_order
    }  

    


    log_body_ids( body_type_filter = [] )
    {
      
      for( let i =0; i < this.eval_order.length; i+=2)
      {   
        let b_type = this.eval_order[i+0]
        let key = this.eval_order[i+1]
        if( ( this.store[b_type][key] === null)||( this.store[b_type][key].length === 0))
        {
          if(this.debug_mode.show_warning_log)
            console.log('bodies_log_body_ids - this.store.'+b_type+'.'+key+' doesnt exists')
          continue
        }
  
        if( (body_type_filter.length === 0)||( body_type_filter.includes(b_type) ) )
        {
          if( this.store[b_type][key].constructor === Array)
          {
            for( let i = 0; i < this.store[b_type][key].length; i++)
              console.log( this.fidget_sequence_i,b_type,key,i,this.store[b_type][key][i].physics.body.id)
          }
          else
          {
            console.log( this.fidget_sequence_i,b_type,key,this.store[b_type][key].physics.body.id)
          }       
        } 
      }
    }
  
  
  
    
    
    set_debug( value, body_type_filter = [] )
    {
  
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        for( let debug_title in value )
          if( debug_title in body.render.debug)
            body.render.debug[debug_title] = value[debug_title]    
    }
    

     
  
    set_visibility_override( value,body_type_filter = [] )
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        body.render.debug.force_visibility = value        
    }  
    
  
  
    do_update( value, body_type_filter = [] )
    {
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        body.physics.opts.do_update = value
    }
  
    enable( value, body_type_filter = [] )
    {
  
      for( let body of this.get_list_filtered( 'eval', body_type_filter ))
        body.enable(value)
  
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
          if(this.debug_mode.show_warning_log)
            console.log( 'bodies_list_enable - '+ i +' doesnt exists' )
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
    if( bodies[i].physics.state.is_last_instance_selected )
      bodies_ordered.push(bodies[i])
  }
  for( let i = 0; i < bodies.length; i++)
  {
    if( !bodies[i].physics.state.is_last_instance_selected )
      bodies_ordered.push(bodies[i])
  }  
  return bodies_ordered
}

