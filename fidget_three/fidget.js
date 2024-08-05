

import Vector from './vector.js';
import { utils, 
  create_physics_engine,
  create_mouse_constraint,
  create_physics_engine_runner,
  create_boundary_wall_collision,
  userIsInteracting} from './utils.js';
import * as THREE from 'three';
import { Mouse_manager,  } from './utils_three.js'
import { body_build } from './body.js';
import { materials,} from './shader.js';
import Matrix from './matrix.js';

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

  constructor( 
    m, 
    s, 
    screen_dims, 
    do_background, 
    shaders = [],
    debug=false)
  {
    let matter_engine        = create_physics_engine()
    let matter_engine_runner = create_physics_engine_runner(matter_engine)
    let mouse_constraint = create_mouse_constraint(matter_engine)
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
    this.do_background = do_background
    this.do_bloom_selected = this.debug_mode.do_bloom_selected
    this.do_bloom = this.debug_mode.do_bloom
    /////////////////////////////////////////////////////////////////// build

    this.bodies = {
      inters : {},
      geos : {},
    }
    this.bodies_eval_order = {
      inters : [], 
      geos : [],         
    }
    this.end_step = 0

    //this.color_background = utils.color.dark
    this.show_step_helpers = [ 0, 0, 0 ]  
    

    this.shaders = shaders

     
      
    this.group_three = null


    this.darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );

  }


  setup()
  {     
    console.log('setup : fidget')                      
    this.bodies_set_debug( this.debug_mode )
    this.bodies_set_visibility_secondary(this.debug_mode.show_inters, ['inters'])  
    this.bodies_set_visibility_secondary(this.debug_mode.show_inters_steps, ['inters_step']) 
    this.bodies_set_visibility_secondary(this.debug_mode.show_geos, ['geos']) 
    this.bodies_set_visibility_secondary(this.debug_mode.show_effects, ['effects']) 
    this.bodies_set_visibility_secondary(this.debug_mode.show_bones, ['bones'])  
    this.bodies_init_out_matrix()
  }

  ////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////// UPDATE
  ////////////////////////////////////////////////////////////////////////////////////


  get_resolution_coef_info( resolution_coef_override = null)
  {
    return 1      
  }

  set_step_resolution( )
  {
    /*
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
    */
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
    this.bodies.geos.backgrounds[0].set_out_position(pA, 'world', 'override')
    /*
    if(( 0 < this.state.steps[3].update_count-15)&&(this.anim_mode==false))
    {
      this.bodies.geos.backgrounds[0].color = [50,140,50]
      this.bodies.geos.backgrounds[0].update_color_three_shape()
    }
    */
      


    let pB = new Vector(this.screen_dims.x/4*3,this.screen_dims.y/2)
    pB.v.x += a
    this.bodies.geos.backgrounds[1].set_out_position(pB,'world', 'override')  
    /*
    if(( 0 < this.state.steps[3].update_count-15)&&(this.anim_mode==false))
    {
      this.bodies.geos.backgrounds[1].color = [50,140,50] 
      this.bodies.geos.backgrounds[1].update_color_three_shape()      
    }
    */
  }


  ////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////// UTILS
  ////////////////////////////////////////////////////////////////////////////////////
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

          /*
          
          if((!reciever_axe_x)&&reciever_axe_y)
          {
            
            connect_to_dupli_ty.target_remap = [r[0], r[1], r[2]*-1, r[3]*-1]
          }        
          if(reciever_axe_x&&(!reciever_axe_y))
          {
            let r = connect_to_dupli_ty.target_remap
            connect_to_dupli_ty.target_remap = [r[0], r[1], r[2]*-1, r[3]*-1]        
          }

          // emmetor

          if((!emetor_axe_x)&&emetor_axe_y)
          {
            let r = connect_to_dupli_ty.target_remap
            connect_to_dupli_ty.target_remap = [r[0]*-1, r[1]*-1, r[2], r[3]]
          }        
          if(emetor_axe_x&&(!emetor_axe_y))
          {
            let r = connect_to_dupli_ty.target_remap
            connect_to_dupli_ty.target_remap = [r[0]*-1, r[1]*-1, r[2], r[3]]        
          }
          */
         
          
        connect_to_dupli_ty.target_remap = r
        bodies[j].constraints_args.push(connect_to_dupli_ty)
        //console.log(bodies[i].name,bodies[j].name)

        let connect_to_dupli_is_selected ={
          name:'instance_is_selected_'+bodies[i].name+'_to_'+bodies[j].name, 
          type:'connect', 
          target:bodies[i], 
          attr:'is_selected',
          target_attr:'is_selected', 
          activate_when_target_is_selected: true }

        bodies[j].constraints_args.push(connect_to_dupli_is_selected)
        bodies[j].instances.push(bodies[i])
        
      }      
    }

  }

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
              this.Mouse.switch_selection( obj_next)
          }
          else
          {
            if(selected_body != obj_last.body)
              this.Mouse.switch_selection(obj_last)     
          }
        }
        else if(this.force_way == 1)
        {
          if(selected_body != obj_next.body)
            this.Mouse.switch_selection( obj_next )
        }
        else if(this.force_way == -1)
        {
          if(selected_body != obj_last.body)
            this.Mouse.switch_selection(obj_last) 
        }
      }
      this.state.switch_selection_happened_step = current_step  
    }
  }

  bodies_log_body_ids( body_type_filter = [] )
  {
    
    for( let i =0; i < this.bodies_eval_order.length; i+=2)
    {   
      let b_type = this.bodies_eval_order[i+0]
      let key = this.bodies_eval_order[i+1]
      if( ( this.bodies[b_type][key] === null)||( this.bodies[b_type][key].length === 0))
      {
        if(this.debug_mode.show_warning_log)console.log('bodies_log_body_ids - this.bodies.'+b_type+'.'+key+' doesnt exists')
        continue
      }

      if( (body_type_filter.length === 0)||( body_type_filter.includes(b_type) ) )
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
    for( let body of this.bodies_get_list_filtered( 'eval', body_type_filter ))
      body.m = m
  }

  bodies_update( body_type_filter = [] )
  {
    for( let body of this.bodies_get_list_filtered( 'eval', body_type_filter ))
      body.update()
  }

  bodies_setup_shapes_three( body_type_filter = [] )
  {
    this.group_three = new THREE.Group();

    for( let body of this.bodies_get_list_filtered( 'eval', body_type_filter ))
      body.setup_shapes_three(this.group_three)  

    this.Mouse.setup(this.group_three)
  }  



  bodies_animate_three( body_type_filter = [] )
  {
    for( let body of this.bodies_get_list_filtered( 'eval', body_type_filter ))
      body.animate_three()
    this.Mouse.update()
  }  
  /*
  bodies_set_visibility_three( value,body_type_filter = [] )
  {
    for( let b_type in this.bodies)
    {   
      if( (body_type_filter.length === 0)||( body_type_filter.includes(b_type) ) )
      {
        for( let key of this.bodies_eval_order[b_type])
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
    for( let body of this.bodies_get_list_filtered( 'eval', body_type_filter ))
      body.color = new_color || body.color_base
  }
  bodies_override_color_three(new_color = null,body_type_filter = [] )
  {
    this.bodies_override_color(new_color, body_type_filter)
    this.bodies_color_update_three_shape(body_type_filter)
  }

  bodies_color_update_three_line( body_type_filter = [] )
  {
    for( let body of this.bodies_get_list_filtered( 'eval', body_type_filter ))
      body.update_color_three_line()
  }


  bodies_color_update_three_shape( body_type_filter = [] )
  {
    for( let body of this.bodies_get_list_filtered( 'eval', body_type_filter ))
      body.update_color_three_shape()
  }

  /*
  bodies_axe_clean_override( body_type_filter = [] )
  {
    for( let i =0; i < this.bodies_eval_order.length; i+=2)
    {   
      let b_type = this.bodies_eval_order[i+0]
      let key = this.bodies_eval_order[i+1]
      if( ( this.bodies[b_type][key] === null)||( this.bodies[b_type][key].length === 0))
      {
        console.log('bodies_axe_clean_override - this.bodies.'+b_type+'.'+key+' doesnt exists')
        continue
      }

      if( (body_type_filter.length === 0)||( body_type_filter.includes(b_type) ) )
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
  */

  bodies_constraints_enable(value,body_type_filter = [] )
  {
    for( let body of this.bodies_get_list_filtered( 'eval', body_type_filter ))
      for( let cns in body.constraints )
        body.constraints[cns].enable(value) 

  }

  constraints_enable(value, body_cns_list = [] )
  {
    for( let i = 0; i < body_cns_list.length; i+=4 )
    {
      let b_type = body_cns_list[i+0]
      let key    = body_cns_list[i+1]
      let j      = body_cns_list[i+2]
      let cns    = body_cns_list[i+3]

      if( (this.bodies[b_type][key] === null)||(this.bodies[b_type][key].length === 0))
      {
        if(this.debug_mode.show_warning_log)console.log('constraint enable - '+b_type+'.'+key+' doesnt exists')
        continue
      }      
      if( j === null)
      {
        if( this.bodies[b_type][key]['constraints'][cns] == null )
        {
          if(this.debug_mode.show_warning_log)console.log('constraints_enable - this.bodies.'+b_type+'.'+key+'.constraints.'+cns+' doesnt exists')
          continue
        }        
        this.bodies[b_type][key]['constraints'][cns].enable(value)
      }
      else 
      {
        if( this.bodies[b_type][key][j]['constraints'][cns] == null )
        {
          if(this.debug_mode.show_warning_log)console.log('constraints_enable - this.bodies.'+b_type+'.'+key+'['+j+'].constraints.'+cns+' doesnt exists')
          continue
        }         
        this.bodies[b_type][key][j]['constraints'][cns].enable(value)
      }
        
    }

  }


  create_inter_from_geos( bodies_geos, inter_body_parent,scale)
  {
    

    for( let i = 0 ; i < bodies_geos.length; i += 1 )
    {
      let n = bodies_geos[i]

      if( this.bodies.geos[n].constructor === Array)
      {
        for( let j = 0 ; j < this.bodies.geos[n].length; j += 1 )
          this.bodies.inters[n][j] = this.build_inter_from_geo( this.bodies.geos[n][j], inter_body_parent, scale)
      }
      else
      {
        this.bodies.inters[n] = this.build_inter_from_geo( this.bodies.geos[n], inter_body_parent, scale)
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
    let m_geo_body   = geo_body.get_init_matrix()
    let m_inter_body = inter_body_parent.get_init_matrix()

    let inter_args = {
      ...geo_args,
      ...opts_collision_mouse_interaction,
      ...opts_visual_inter,

      name:'inters_'+name,
      highlight_selection:[geo_body],  

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

  /*
  bodies_rot_clean_override( body_type_filter = [] )
  {
    for( let i =0; i < this.bodies_eval_order.length; i+=2)
    {   
      let b_type = this.bodies_eval_order[i+0]
      let key = this.bodies_eval_order[i+1]
     
      if( (body_type_filter.length === 0)||( body_type_filter.includes(b_type) ) )
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
  */

  bodies_init_physics()
  {   
    for( let body of this.bodies_get_list_filtered( 'draw' ))
    {
      body.init_physics()   
    }
        
  }

  bodies_init_constraints()
  {   
    for( let body of this.bodies_get_list_filtered( 'build' ))
    {
      //console.log(body.name,body.build_order,body.constraints_args)
      body.set_out_matrix(body.get_init_matrix())
      body.init_constraints()
    }
    
  }

  bodies_get_build_order()
  {
    let default_list = this.bodies_get_list_filtered('default')
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

  

  bodies_set_debug( value, body_type_filter = [] )
  {

    for( let body of this.bodies_get_list_filtered( 'eval', body_type_filter ))
      body.debug = value     
  }

  bodies_set_visibility_secondary( value,body_type_filter = [] )
  {
    for( let body of this.bodies_get_list_filtered( 'eval', body_type_filter ))
    {
      body.visibility_secondary = value 
    }
      
      
      
  }  

  bodies_set_visibility_override( value,body_type_filter = [] )
  {
    for( let body of this.bodies_get_list_filtered( 'eval', body_type_filter ))
      body.debug_force_visibility = value        
  }  




  bodies_set_visibility( value = null ,body_type_filter = [] )
  {
    for( let body of this.bodies_get_list_filtered( 'eval', body_type_filter ))
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




  bodies_set_dynamic( value = null ,body_type_filter = [] )
  {
    for( let body of this.bodies_get_list_filtered( 'eval', body_type_filter ))
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



  bodies_init_out_matrix( body_type_filter = [] )
  {
    for( let body of this.bodies_get_list_filtered( 'eval', body_type_filter ))
      body.init_out_matrix()

  }  

  enable(value)
  {
    this.matter_engine_runner.enabled = value
    this.bodies_enable(value)
    this.bodies_do_update( value)
    if( value == false )
      this.bodies_set_visibility(false)
    else
      this.bodies_set_visibility()

  }


  bodies_do_update( value, body_type_filter = [] )
  {
    for( let body of this.bodies_get_list_filtered( 'eval', body_type_filter ))
      body.do_update = value
  }

  bodies_enable( value, body_type_filter = [] )
  {

    for( let body of this.bodies_get_list_filtered( 'eval', body_type_filter ))
      body.enable(value)

  }

  bodies_apply_material( material = null, body_type_filter = [] )
  {
    for( let body of this.bodies_get_list_filtered( 'eval', body_type_filter ))
      if( body.mesh_three.shape != null)
        body.mesh_three.shape.material = material || body.three_material
  }


  bodies_search_by_name( name, body_type_filter = [] )
  {
    let bodies_found = []

    for( let body of this.bodies_get_list_filtered( 'build', body_type_filter ))
    {
      let body_name = body.name
      if(body_name.indexOf(name) != -1 )
        bodies_found.push(body)
    }


    return bodies_found

  }



  bodies_get_list_filtered( order = 'eval', body_type_filter = [] )//eval // draw
  {

    let bodies_list = []

    if( order == 'eval' )
    {
      for( let i =0; i < this.bodies_eval_order.length; i+=2)
      {   
        let b_type = this.bodies_eval_order[i+0]
        let key = this.bodies_eval_order[i+1]
        if( ( this.bodies[b_type][key] === null)||( this.bodies[b_type][key].length === 0))
        {
          if( this.debug_mode.show_warning_log )console.log('bodies_enable - this.bodies.'+b_type+'.'+key+' doesnt exists')
          continue
        }
        
        if( (body_type_filter.length === 0)||( body_type_filter.includes(b_type) ) )
        {
  
          if( this.bodies[b_type][key].constructor === Array)
          {
            for( let i = 0; i < this.bodies[b_type][key].length; i++)
            {
              bodies_list.push(this.bodies[b_type][key][i])
            }
          }
          else
          {
            bodies_list.push(this.bodies[b_type][key])       
          }
  
  
        } 
      } 

    }
   

    if( order == 'draw' )
    {
      bodies_list = this.bodies_draw_order
    }    

    if( order == 'build' )
    {
      bodies_list = this.bodies_get_build_order()
    }  

    if( order == 'default' )
    {
      for( let b_type in this.bodies)
      {   
        for( let key in this.bodies[b_type])
        {   
          if( ( this.bodies[b_type][key] === null)||( this.bodies[b_type][key].length === 0))
          {
            if( this.debug_mode.show_warning_log )console.log('bodies_enable - this.bodies.'+b_type+'.'+key+' doesnt exists')
            continue
          }
          
          if( (body_type_filter.length === 0)||( body_type_filter.includes(b_type) ) )
          {
    
            if( this.bodies[b_type][key].constructor === Array)
            {
              for( let i = 0; i < this.bodies[b_type][key].length; i++)
              {
                bodies_list.push(this.bodies[b_type][key][i])
              }
            }
            else
            {
              bodies_list.push(this.bodies[b_type][key])       
            }
    
    
          }
        } 
      } 
    }


    return bodies_list

  }


  bodies_get_list_attr_value_filtered( attr, value , body_type_filter = [] , inverse = false)
  {
    for( let body of this.bodies_get_list_filtered( 'build', body_type_filter ))
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


  bodies_list_enable( value, bodies_list = [] )
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

  get_selected_body(body_type_filter = [] )
  {
    let selected_body = null
    for( let body of this.bodies_get_list_filtered( 'build', body_type_filter ))
    {
      if(body.is_selected)
      {
        selected_body = body
        break
      }
    }
  
    return selected_body
    
  }


  mouse_select_highlight(mouse_cns,body_type_filter = [], bloom = true)
  {
    

    if(this.Mouse.mouse_lock_selection)
      return

    let body_to_highlight = []
    let body_to_reduce    = []

    
    for( let body of this.bodies_get_list_filtered( 'build', body_type_filter ))
    {
      body.is_touch = false

      if( body.body == mouse_cns.constraint.bodyB )
      {
        body.color = utils.color.redLight
        body.is_selected = true
        if(userIsInteracting)
        {
          body.is_touch = true
        }
          
  

        for( let j = 0; j < body.highlight_selection.length; j++)
          body_to_highlight.push(body.highlight_selection[j])  

      }
      else
      {
        body.color = body.color_base 
        body.is_selected = false

        for( let j = 0; j < body.highlight_selection.length; j++)
          body_to_reduce.push(body.highlight_selection[j])  

      }    
      
      body.update_instance_is_selected_attr()
    }

    for( let i = 0 ; i < body_to_reduce.length; i++)
    {
      body_to_reduce[i].color_line = [0,0,0]
      body_to_reduce[i].update_color_three_line()
      if(this.do_bloom_selected)
        body_to_reduce[i].bloom = body_to_reduce[i].bloom_default
    }

    for( let i = 0 ; i < body_to_highlight.length; i++)
    {
      body_to_highlight[i].color_line = [255,255,255]
      body_to_highlight[i].update_color_three_line()
      if(this.do_bloom_selected)
        body_to_highlight[i].bloom = true
    }



    //this.bodies_color_update_three(body_type_filter)

  }

  setup_bloom_pass()
  {

    let bodies = this.bodies_get_list_filtered( ['geos','effects'] )
    let color_lines = []
    for( let i = 0 ; i < bodies.length; i++)
    {
      color_lines.push(bodies[i].color_line )
      bodies[i].color_line = [0,0,0]
      bodies[i].update_color_three_line()
    }
    this.bodies_apply_material( this.darkMaterial,  ['geos','effects'] )
    for( let b of this.bodies_get_list_attr_value_filtered( 'bloom', true, ['geos','effects'] ) )
      b.reset_material()

      return {color_lines:color_lines}
  }

  clean_bloom_pass( save_state )
  {
    this.bodies_apply_material( null,['geos','effects'] )

    let bodies = this.bodies_get_list_filtered( ['geos','effects'] )
    for( let i = 0 ; i < bodies.length; i++)
    {
      bodies[i].color_line = save_state.color_lines[i]
      bodies[i].update_color_three_line()
    }    
  }





  set_resolution_coef_from_step(step)
  {
    for( let i = 0; i < this.bodies.inters_step.steps.length; i++)
    {
      if( this.bodies.inters_step.steps[step] == null )
        continue 
        
      if(i < step)
        this.bodies.inters_step.steps[step].set_resolution_coef(1)
      else if(step < i)
        this.bodies.inters_step.steps[step].set_resolution_coef(0)
      else
        this.bodies.inters_step.steps[step].set_resolution_coef(null)
    }      
  }

  get_selected_step()
  {
    for( let i = 0; i < this.bodies.inters_step.steps.length; i++)
    {
      if( this.bodies.inters_step.steps[i].is_selected)
        return i
    }    
    return null
  }


}


