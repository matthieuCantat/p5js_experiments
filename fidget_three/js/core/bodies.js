import { 
  utils,
  flatten_list,
  strictObject
  } from '../utils/utils.js';



import * as THREE from 'three';
import Matrix from '../utils/matrix.js';
import { materials,} from '../core/shader.js';
import { body_build } from '../core/body.js';



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


    setup()
    {   
      for( let body of this.bodies.get_list_filtered( 'eval' ))
        body.physics.setup()   
    
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
  
    update( body_type_filter = [], record_state = false )
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
        body.physics.update(record_state)
  
      for( let effect in this.bodies.effects)
        if(this.bodies.effects[effect] != null)
          this.bodies.effects[effect].update()      
    }

    clean(body_type_filter = [])
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
        body.physics.clean() 
      
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
  
  
    clean(body_type_filter = [])
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
        body.render.clean(this.bodies.group_three) 
  
      for( let effect in this.bodies.effects)
        if(this.bodies.effects[effect] != null)this.bodies.effects[effect].clean(this.bodies.group_three)        
    }


    update( body_type_filter = [],  use_recoded_state = null )
    {
      for( let body of this.bodies.get_list_filtered( 'eval', body_type_filter ))
        body.render.update( use_recoded_state )
      

      
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
          body.state.visibility = body.render.state.visibility_default
        }
        else
        {
          body.state.visibility = value
        }
        //if( body.render.mesh_three != null )
        //  body.render.mesh_three.group.visible = body.state.visibility      
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
        this.Game_engine = null

        
            
        this.physics = strictObject(new bodies_physics( { bodies_main:this }))
        this.render = strictObject(new bodies_render( { bodies_main:this }))
                
    }


    set_completion_step(step)
    {
      const bodies = this.store.inters_step.steps;
  
      for( let i = 0; i < bodies.length; i++)
      {
        if( bodies[step] == null )
          continue 
  
        let body = null
        if( bodies[step].constructor === Array )
          body = bodies[step][0]
        else
          body = bodies[step]
                
  
        if(i < step)
          body.set_resolution_coef(1)
        else if(step < i)
          body.set_resolution_coef(0)
        else
          body.set_resolution_coef(null)
      }      
  
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
    

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////// utils body create
    /////////////////////////////////////////////////////////////////////////////////////////

    instance_each_others( bodies, mirror_info )
    {
  
      //bA-->bB
      for(let i = 0 ; i < bodies.length ; i++)
      {
        
        let iA = [mirror_info[i*2],mirror_info[i*2+1]]
        for(let j = 0 ; j < bodies.length ; j++)
        {
          if(i==j)
            continue
          let iB = [mirror_info[j*2],mirror_info[j*2+1]]
  
          let connect_to_dupli_ty ={
            name:'instance_ty_'+bodies[i].name+'_to_'+bodies[j].name, 
            type:'connect', 
            target:bodies[i], 
            attr:'ty',
            target_attr:'ty', 
            target_space:'anim',
            target_remap:[-1000,1000,-1000,1000],
            instance_mode: true }
            
            // reciever
            let reciever_axe_x = iB[0]
            let reciever_axe_y = iB[1]
            let emetor_axe_x = iA[0]
            let emetor_axe_y = iA[1]
            
            let r = connect_to_dupli_ty.target_remap
            if(reciever_axe_y == emetor_axe_y)
            {
              r = [r[0], r[1], r[2]*-1, r[3]*-1]
            }
            if(reciever_axe_x == emetor_axe_x)
            {
              r = [r[0], r[1], r[2]*-1, r[3]*-1]
            }
            
          connect_to_dupli_ty.target_remap = r
          bodies[j].physics.relations.constraints_args.push(connect_to_dupli_ty)
  
          ///////////////////////////////////////////////////////////////////////
  
  
  
          ///////////////////////////////////////////////////////////////////////
          let connect_to_dupli_is_selected ={
            name:'instance_is_selected_'+bodies[i].name+'_to_'+bodies[j].name, 
            type:'connect', 
            target:bodies[i], 
            attr:'is_selected',
            target_attr:'is_selected', 
            activate_when_target_is_selected: true }
  
          bodies[j].physics.relations.constraints_args.push(connect_to_dupli_is_selected)
          bodies[j].relations.instances.push(bodies[i])
          
        }      
      }
  
    }
  
    create_inter_from_geos( bodies_geos, inter_body_parent,scale)
    {
      
  
      for( let i = 0 ; i < bodies_geos.length; i += 1 )
      {
        let n = bodies_geos[i]
  
        if( this.store.geos[n].constructor === Array)
        {
          for( let j = 0 ; j < this.store.geos[n].length; j += 1 )
            this.store.inters[n][j] = this.build_inter_from_geo( this.store.geos[n][j], inter_body_parent, scale)
        }
        else
        {
          this.store.inters[n] = this.build_inter_from_geo( this.store.geos[n], inter_body_parent, scale)
        }
      }
  
    }
  
  
    build_inter_from_geo(geo_body,inter_body_parent,scale)
    {
      // info
      let opts_collision_mouse_interaction = {   
        collision_category: utils.collision_category.inter,
        collision_mask: utils.collision_category.mouse, 
      }
  
      let opts_visual_inter = {
        visibility:true,
        do_shape: true,
        do_line:true,                                           
        color:utils.color.grey,
        color_line: utils.color.black,
        material_three: materials.simple.text_checker_three_grey ,
      }  
  
      let scale_inter = 40.0 
  
  
      // build inter
      let geo_args = geo_body.get_args()
  
      // m_shape
      let vX = geo_args.m_shape.get_row(0)
      let vY = geo_args.m_shape.get_row(1)
      let vX_length = vX.mag()
      let vY_length = vY.mag()
      vX.normalize().mult(vX_length+scale_inter)
      vY.normalize().mult(vY_length+scale_inter)
  
      let m_shape = new Matrix(geo_args.m_shape)
      m_shape.set_row(0,vX)
      m_shape.set_row(1,vY)
  
      // name
      let name = geo_args.name.split('_')[1]
  
      // m_offset
      let m_geo_body   = geo_body.physics.get_init_matrix()
      let m_inter_body = inter_body_parent.physics.get_init_matrix()
  
      let inter_args = {
        ...geo_args,
        ...opts_collision_mouse_interaction,
        ...opts_visual_inter,
  
        name:'inters_'+name,
        highlight_bodies_when_selected:[geo_body],  
  
        parent: inter_body_parent,
        m_offset: m_geo_body.getMult( m_inter_body.getInverse() ),//get_matrix('base', 'world'),
        m_shape: m_shape,
  
        constraints:[
          {  name:'point' ,type:'dyn_point',target: inter_body_parent, stiffness: 0.999,damping:0.1,length:0.01},
          {  name:'orient',type:'kin_orient',target: inter_body_parent,stiffness: 1.0,damping:0.1,length:0.01},                                          
        ],                                      
        density:0.01/(scale/2.2), 
        selection_break_length: 60.*(scale/2.2),  
      }    
  
      return new body_build(inter_args)
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

