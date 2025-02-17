

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
      this.update_count = 0
      this.in_use = false    
      this.used = false 
  } 
}


export default class fidget{

  ////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////// SETUP
  ////////////////////////////////////////////////////////////////////////////////////

  constructor( in_options)
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


    let matter_engine        = create_physics_engine()
    let matter_engine_runner = create_physics_engine_runner(matter_engine)
    
    create_boundary_wall_collision(matter_engine, args.screen_dims.x,args.screen_dims.y,false)
    



    this.m = args.m
    this.s = args.s
    this.screen_dims = args.screen_dims
    this.state = strictObject({
      update_count : 0,
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
        strictObject(new state_step_tpl)]
    })
    this.set_debug_init(args.debug)
    this.force_way = null
    this.resolution_coef_override = null
    this.fidget_sequence_i = 0
    this.mouse_pressed_positions_at_update = []
    this.touch_enable = true
    this.anim_mode = false
    this.do_background = args.do_background
    this.debug_mode = args.debug


    this.matter_engine = matter_engine
    this.matter_engine_runner = matter_engine_runner     
    this.Mouse = strictObject(new Mouse_manager( 
      this.matter_engine, 
      args.dom_canvas, 
      this.screen_dims, 
      this, 
      this.debug_mode.mouse_info))    
    /////////////////////////////////////////////////////////////////// build

    this.bodies = strictObject(new bodies() )
    this.bodies.debug_mode = this.debug_mode
    this.bodies.fidget_sequence_i = this.fidget_sequence_i
    this.bodies.group_three = this.bodies.group_three
    this.bodies.effects = this.effects
    this.bodies.matter_engine = this.matter_engine
    this.bodies.Mouse = this.Mouse

    this.end_step = 0

    //this.color_background = utils.color.dark
    this.show_step_helpers = [ 0, 0, 0 ]  
    


    this.darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
    this.explode_happened = false
    
  }


  setup(scene)
  {     
    console.log('setup : fidget')  
    this.set_debug_setup()                      
    this.bodies.physics.init_out_matrix()

    this.bodies.render.setup_shapes_three()
    scene.add( this.bodies.group_three )    
  }

  set_debug_init(debug)
  {
    this.debug_mode = debug
    this.do_bloom_selected = debug.do_bloom_selected
    this.do_bloom = debug.do_bloom   
  }
    
  set_debug_setup()
  {
    this.Mouse.set_debug(this.debug_mode.mouse_info)

    this.bodies.set_debug( this.debug_mode )
    this.bodies.render.set_visibility_secondary(this.debug_mode.show_inters, ['inters'])  
    this.bodies.render.set_visibility_secondary(this.debug_mode.show_inters_steps, ['inters_step']) 
    this.bodies.render.set_visibility_secondary(this.debug_mode.show_geos, ['geos']) 
    this.bodies.render.set_visibility_secondary(this.debug_mode.show_effects, ['effects']) 
    this.bodies.render.set_visibility_secondary(this.debug_mode.show_bones, ['bones']) 
  }

  set_debug(debug)
  {
    this.set_debug_init(debug)
    this.set_debug_setup()
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
    var selected_body = this.Mouse.mouse_constraint.constraint.bodyB

    // clean
    this.bodies.axe_clean_override()
    this.bodies.rot_clean_override()
    this.bodies.enable( 0, ['inters'] )

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
    this.state.update_count += 1

    if(this.play_animation != null)
    {
      this[this.play_animation]()
      //this.anim_mode = true
    }
    else
    {
      //this.anim_mode = false
    }
        
    //this.anim_mode =  this.resolution_coef_override != null
    // resolution

    if(this.is_dynamic)
    {
      this.state.resolution_coef_last = this.state.resolution_coef
      this.get_resolution_coef_info( this.resolution_coef_override ) 
      this.setup_step_from_resolution_coef()

      // explode
      this.explode_effect({
        count:this.state.steps[this.end_step-1].update_count,
        pre_explode_animation_duration:20,
      })
   
    }
    this.bodies.physics.update()
    this.draw_background()

    //countElements(this.matter_engine.world);

    return true
  }


  ////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////// DRAW
  ////////////////////////////////////////////////////////////////////////////////////

  
  draw_background()
  {
    let a = this.state.steps[this.end_step-1].update_count
    a -=30
    a = Math.max(0,a)
    a *=15
    if(this.anim_mode)
      a = this.state.steps[this.end_step-1].resoluton_coef*this.screen_dims.x/2    

    // a 0-->200
    let pA = new Vector(this.screen_dims.x/4,this.screen_dims.y/2)
    pA.v.x -= a
    this.bodies.store.geos.backgrounds[0].physics.set_out_position(pA, 'world', 'override')
  
      


    let pB = new Vector(this.screen_dims.x/4*3,this.screen_dims.y/2)
    pB.v.x += a
    this.bodies.store.geos.backgrounds[1].physics.set_out_position(pB,'world', 'override')  
   
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
    this.bodies.enable(false, ['inters'])
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

  clean_physics()
  {
    this.bodies.physics.clean_physics()
    this.Mouse.clean()

    Matter.Events.off(this.matter_engine);  // Remove all events attached to the engine
    Matter.Runner.stop(this.matter_engine_runner);
    this.matter_engine = null
    this.matter_engine_runner = null

  }


  clean_scene(scene)
  {
    this.clean_physics()
    this.clean_shapes_three(scene)
  }
  



  constraints_enable(value, body_cns_list = [] )
  {
    for( let i = 0; i < body_cns_list.length; i+=4 )
    {
      let b_type = body_cns_list[i+0]
      let key    = body_cns_list[i+1]
      let j      = body_cns_list[i+2]
      let cns    = body_cns_list[i+3]

      if( (this.bodies.store[b_type][key] === null)||(this.bodies.store[b_type][key].length === 0))
      {
        if(this.debug_mode.show_warning_log)console.log('constraint enable - '+b_type+'.'+key+' doesnt exists')
        continue
      }      

      if( j === null)
      {
        const body = this.bodies.store[b_type][key]
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
        const body = this.bodies.store[b_type][key][j]
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


  create_inter_from_geos( bodies_geos, inter_body_parent,scale)
  {
    

    for( let i = 0 ; i < bodies_geos.length; i += 1 )
    {
      let n = bodies_geos[i]

      if( this.bodies.store.geos[n].constructor === Array)
      {
        for( let j = 0 ; j < this.bodies.store.geos[n].length; j += 1 )
          this.bodies.store.inters[n][j] = this.build_inter_from_geo( this.bodies.store.geos[n][j], inter_body_parent, scale)
      }
      else
      {
        this.bodies.store.inters[n] = this.build_inter_from_geo( this.bodies.store.geos[n], inter_body_parent, scale)
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

  
  clean_shapes_three(three_scene)
  {
    this.bodies.render.clean_shapes_three()
    three_scene.remove(this.bodies.group_three)
    this.bodies.group_three = null
  }
  
  animate_three()
  {
    this.bodies.render.animate_three()
  }
 

  enable(value)
  {
    this.matter_engine_runner.enabled = value
    this.bodies.enable(value)
    this.bodies.do_update( value)
    if( value == false )
      this.bodies.render.set_visibility(false)
    else
      this.bodies.render.set_visibility()

    if(value == true)
      this.update_step_count(-1)
  }


  explode_effect(opts)
  {
    if( opts.count < opts.pre_explode_animation_duration )
      this.do_pre_explode_animation( opts.count, 0, opts.pre_explode_animation_duration)
    else
      this.do_explode()
  }  
      
  
  do_pre_explode_animation(t,start_time,end_time)
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
 
    this.bodies.render.override_color(cInterp ['geos'])
    this.bodies.render.override_color_three(cInterp, ['geos'])   
  }

  do_explode()
  {
    this.bodies.enable(false,['effects'])
    this.bodies.physics.constraints_enable(false, ['geos'])
    
    // custom color
    this.bodies.render.override_color(null, ['geos'])
    this.bodies.render.override_color_three(null, ['geos'])
    
    this.bodies.physics.apply_force_at_center(new Vector(0,0.003),true,['geos'])
                                 
    if( this.explode_happened == false )
    {
      this.bodies.physics.apply_exlode_force_from_point(new Vector(this.screen_dims.x/2,this.screen_dims.y/2),0.09,new Vector(0,-1),true,['geos'])
      this.explode_happened = true
    }
  }  

  

  get_selected_body(body_type_filter = [] )
  {
    let selected_body = null
    for( let body of this.bodies.get_list_filtered( 'build', body_type_filter ))
    {
      if(body.physics.state.is_selected)
      {
        selected_body = body
        break
      }
    }
  
    return selected_body
    
  }


  mouse_select_highlight(body_type_filter = [], bloom = true)
  {
    

    if(this.Mouse.mouse_lock_selection)
      return

    let body_to_highlight = []
    let body_to_reduce    = []

    
    for( let body of this.bodies.get_list_filtered( 'build', body_type_filter ))
    {
      body.physics.state.is_touch = false

      if(( this.Mouse.matter_constraint != null )&&( body.physics.body == this.Mouse.matter_constraint.constraint.bodyB ))
      {
        body.render.color = utils.color.redLight
        body.set_is_selected( true )
        if(user_interaction_info.userIsInteracting)
        {
          body.physics.state.is_touch = true
        }
          
  

        for( let j = 0; j < body.relations.highlight_bodies_when_selected.length; j++)
          body_to_highlight.push( body.relations.highlight_bodies_when_selected[j] )  

      }
      else
      {
        body.render.color = body.render.color_base 
        body.set_is_selected( false )

        for( let j = 0; j < body.relations.highlight_bodies_when_selected.length; j++)
          body_to_reduce.push(body.relations.highlight_bodies_when_selected[j])  

      }    
      
      body.update_instance_is_selected_attr()
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

    let bodies = this.bodies.get_list_filtered( ['geos','effects'] )
    let color_lines = []
    for( let i = 0 ; i < bodies.length; i++)
    {
      color_lines.push(bodies[i].render.color_line )
      bodies[i].render.color_line = [0,0,0]
      bodies[i].render.update_color_three_line()
    }
    this.bodies.render.apply_material( this.darkMaterial,  ['geos','effects'] )
    for( let body of this.bodies.get_list_attr_value_filtered( 'bloom', true, ['geos','effects'] ) )
      body.render.reset_material()

      return {color_lines:color_lines}
  }

  clean_bloom_pass( save_state )
  {
    this.bodies.render.apply_material( null,['geos','effects'] )

    let bodies = this.bodies.get_list_filtered( ['geos','effects'] )
    for( let i = 0 ; i < bodies.length; i++)
    {
      bodies[i].render.color_line = save_state.color_lines[i]
      bodies[i].render.update_color_three_line()
    }    
  }


  get_resolution_coef_info( )
  {   
    // init
    this.state.resolution_coef = 0
    for( let i = 0 ; i < this.state.steps.length; i++)
      this.state.steps[i].resoluton_coef = 0
    this.state.current_step = 0

    // compute info
    for( let i = 0 ; i < this.bodies.store.inters_step.steps.length; i++)
    {
      if(this.bodies.store.inters_step.steps[i].constructor === Array )
        this.state.steps[i].resoluton_coef = this.bodies.store.inters_step.steps[i][0].get_resolution_coef()
      else
        this.state.steps[i].resoluton_coef = this.bodies.store.inters_step.steps[i].get_resolution_coef()


      this.state.resolution_coef += this.state.steps[i].resoluton_coef
      if(Math.round(this.state.steps[i].resoluton_coef*100)/100 == 1)
        this.state.current_step = i +1
    }
  }  

  setup_step_from_resolution_coef()
  {
    // compute info
    for( let step = 0 ; step < this.bodies.store.inters_step.steps.length+1; step++)
    {

      if( this.state.current_step == step )
      {
        
        if(this.state.steps[step].update_count == 0 )
        {      
          this.bodies.enable( 0 )  
          this.bodies.list_enable( 1,this.steps_info[step].bodies_enable )
  
          this.bodies.physics.constraints_enable( true ) 
          this.constraints_enable(false, this.steps_info[step].constraints_disable )
  
          this.set_resolution_coef_from_step(step)   
          
          
          if((this.debug_mode.switch_selected_inter_help)||(this.steps_info[step].switch_selection_transition))
          {
            if((step == 0)||(step == this.bodies.store.inters_step.steps.length))
            {
              this.Mouse.switch_selection( null )
              
            }
            else
            {
              
              if(step < this.bodies.store.inters_step.steps.length)
              {
                if( this.bodies.store.inters_step.steps[step].constructor === Array )
                {
                  if( this.bodies.store.inters_step.steps[step-1].constructor === Array )
                  {
                    let selected_body = this.get_selected_body()
                    let i = this.bodies.store.inters_step.steps[step-1].indexOf(selected_body)
                    
                    if( i < this.bodies.store.inters_step.steps.length )
                      this.switch_selection_transition( step, this.get_selected_body(), this.bodies.store.inters_step.steps[step-1], this.bodies.store.inters_step.steps[step][i])   
                    else
                      this.Mouse.switch_selection(null)


                  }
                  else
                  {
                    this.switch_selection_transition( step, this.get_selected_body(), this.bodies.store.inters_step.steps[step-1], this.bodies.store.inters_step.steps[step][0])   
                  }
                  
                }
                else
                {
                  this.switch_selection_transition( step, this.get_selected_body(), this.bodies.store.inters_step.steps[step-1], this.bodies.store.inters_step.steps[step])   
                }
                
              }
               
            }
              
          }
            
        }
        this.update_step_count(step)
      }      
    }
  }



  set_resolution_coef_from_step(step)
  {
    for( let i = 0; i < this.bodies.store.inters_step.steps.length; i++)
    {
      if( this.bodies.store.inters_step.steps[step] == null )
        continue 

      let body_step = null
      if(this.bodies.store.inters_step.steps[step].constructor === Array )
        body_step = this.bodies.store.inters_step.steps[step][0]
      else
        body_step = this.bodies.store.inters_step.steps[step]
              

      if(i < step)
        body_step.set_resolution_coef(1)
      else if(step < i)
        body_step.set_resolution_coef(0)
      else
        body_step.set_resolution_coef(null)
    }      
  }

  get_selected_step()
  {
    for( let i = 0; i < this.bodies.store.inters_step.steps.length; i++)
    {
      if( this.bodies.store.inters_step.steps[i].physics.state.is_selected)
        return i
    }    
    return null
  }

  draw_order_to_body_z(z_depth_start,z_depth_incr = 0.5)
  {
    let z_depth = z_depth_start
    for (let i = 0; i < this.bodies.draw_order.length; i++)
    {
      if (this.bodies.draw_order[i] == null)
      {
        if (this.debug_mode.show_warning_log)
          console.log(  ' z_order - this.bodies.draw_order[' + i + '] doesnt exists')
        continue
      }
      
      if( this.bodies.draw_order[i].type == 'body')
        this.bodies.draw_order[i].render.z = z_depth
      else
        this.bodies.draw_order[i].z = z_depth

      z_depth += z_depth_incr
    }
    
    this.z_depth_end = z_depth    

    return this.z_depth_end
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