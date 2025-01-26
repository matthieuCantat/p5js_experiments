
import fidget from '../core/fidget.js'
import { utils, clamp, rad, deg, anim_vectors, anim_values } from '../utils/utils.js'
import { body_build } from '../core/body.js'
import Vector from '../utils/vector.js'
import Matrix from '../utils/matrix.js'
import { materials } from '../core/shader.js'
import { effect } from '../core/effect.js'


export default class fidget_windmill extends fidget{

    constructor (in_options) {
      super(in_options)
  
      let defaultOptions = 
      {
        m:null, 
        s:1, 
        screen_dims:null, 
        z_depth_start:0,
        do_background: true, 
        is_dynamic:true,
        debug : false,  
        play_animation:null,    
      }
      const args = { ...defaultOptions, ...in_options };
  
      ///////////////////////////////////////////////////////////////////////////////////////////
      let visual_bones_main_size = 150*this.s
      let bones_density_value = 0.44/this.s
      let inter_step_denstity = 0.022/this.s 
      let inter_step_selection_break_length = this.debug_mode.mouse_selection_break_length * (this.s / 2.2)
      this.end_step = 4
      ///////////////////////////////////////////////////////////////////////////////////////////
      this.is_dynamic = args.is_dynamic
      
      this.play_animation = args.play_animation//'animation_idle'
  
      if(this.play_animation != null)
      {
        this.anim_mode = true
        this.is_dynamic = false
      }
      else
      {
        this.anim_mode = false
        this.is_dynamic = true
      }
  
      this.colors = [utils.color.green, utils.color.red, utils.color.yellow]
      this.color_background = [
        (this.colors[0][0] + 0.2) * 0.3,
        (this.colors[0][1] + 0.2) * 0.3,
        (this.colors[0][2] + 0.2) * 0.3
      ]
  
      let opts_global = {
        screen_dims: this.screen_dims,
        matter_engine: this.matter_engine,
        mouse_constraint: this.mouse_constraint,
        fidget: this,
        dynamic: this.is_dynamic
      }
  
      let opts_collision_no_interaction = {
        collision: false,
        collision_category: utils.collision_category.none,
        collision_mask: utils.collision_category.none
      }
  
      let opts_collision_activate = {
        collision: true,
        collision_category: utils.collision_category.blue,
        collision_mask: utils.collision_category.default
      }
      let opts_collision_mouse_interaction = {
        collision: true,
        collision_category: utils.collision_category.inter,
        collision_mask: utils.collision_category.mouse
      }
  
      let opts_debug = {
        debug_matrix_info: false,
        debug_matrix_axes: this.debug_mode.matrix_axes,
        debug_cns_axes: this.debug_mode.cns_axes,
        debug_force_visibility: this.debug_mode.force_visibility
      }
  
      let opts_cns_disable_at_select = {
                stiffness: 1.0,
                stiffness_at_selection: 0.0,
                damping: 0.1,
                length: 0.01
              }
  
      let opts_effect_trail = {
        ...opts_collision_no_interaction,
        type: 'trail',
        do_line: false,
        material_three: null,
      }
  
      let opts_sparcles_shock = {
        ...opts_global,
        ...opts_debug,
        scale_shape: this.s,
        type: 'sparcle_shock'
      }
  
      let opts_bones_main = {
        ...opts_global,
        ...opts_collision_no_interaction,
        ...opts_debug,      
        visibility: true,
        do_shape: false,
        do_line: true,
        color: utils.color.blue,
        color_line: utils.color.blue,
        type: utils.shape.circle,
        debug_matrix_axes: true,
        m_shape: new Matrix().setScale(visual_bones_main_size),
        density: bones_density_value,      
      }
  
      let opts_visual_bones = {
        ...opts_global,
        ...opts_collision_no_interaction,
        ...opts_debug,      
        visibility: true,
        do_shape: true,
        do_line: true,
        color: utils.color.blue,
        color_line: utils.color.black,
        type: utils.shape.circle,
        debug_matrix_axes: true,
        dynamic: false,      
        density: bones_density_value,      
        m_shape: new Matrix().setScale(4*this.s), 
      }
  
      let opts_inter_step = {
        ...opts_global,
        ...opts_collision_mouse_interaction,
        ...opts_debug,         
        visibility: true,
        do_shape: true,
        do_line: true,
        color: utils.color.grey,
        color_line: utils.color.black,
        material_three: materials.simple.text_checker_three_grey,
        density: inter_step_denstity,
        selection_break_length: inter_step_selection_break_length      
      }
  
      let opts_geo = {
      ...opts_global,
      ...opts_collision_activate,
      ...opts_debug,
      m_offset: new Matrix(),
      do_shape: true,
      do_line: true,
      color_line: utils.color.black,
      density: 0.0022/this.s,
      }
  
      //////////////////////////////////////////////////////////////////////////
  
  
  
      this.title = 'windmill'
  
      this.bodies = {
        inters: {
          background: null,
          circle: null,
          rectangles: [],
          trapezoids: [],
        },
        inters_step: {
          steps: [],
          steps_help: [],
          steps_instances: []
        },
        geos: {
          backgrounds: [],
          circle: null,
          rectangles: [],
          trapezoids: [],
        },
        bones: {
          rectangles: [],
          rectangles_pivots: [],
          rectangles_center: null,
          trapezoids: [],
          trapezoids_center: null,
          circle: null,
          root: null,
          traj: null,
          world: null
        }
      }
  
      this.effects = {
        trailA: null,
        trailB: null,
        sparcles_shock_A: null,
        sparcles_shock_B: null,
        sparcles_shock_C: null
      }
  
  
      //////////////////////////////////////////////////////////////////////////////////////////// BASE
  
      this.bodies.bones.world = new body_build({
        ...opts_bones_main,
        name: 'bones_world',
      })
  
      this.bodies.geos.backgrounds.push( new body_build({
        ...opts_global,
        ...opts_collision_no_interaction,
        ...opts_debug,
        dynamic: false,
        name: 'geos_background_L_',
        parent: this.bodies.bones.world,
        m_offset: new Matrix().setTranslation(this.screen_dims.x/4,this.screen_dims.y/2),
        m_shape: new Matrix().setScale(this.screen_dims.x/2, this.screen_dims.y),
        type: utils.shape.rectangle,
        material_three: materials.old_custom_exemple, //materials.background.space_grid ,
        visibility: this.do_background,
      }) )
      this.bodies.geos.backgrounds.push(this.bodies.geos.backgrounds[0].get_mirror(false, true))
  
      this.bodies.bones.traj = new body_build({
        ...opts_bones_main,
        name: 'bones_traj',
        parent: this.bodies.bones.world,
        constraint_to_parent: true,
        m_offset: this.m,
      })
      
      if (this.is_dynamic)
        this.bodies.inters.background = new body_build({
          ...opts_inter_step,
          ...opts_collision_no_interaction,
          name: 'inters_background',
          parent: this.bodies.bones.traj,
          m_offset: new Matrix(),
          m_shape: new Matrix().setScale(145*this.s,92*this.s),
          type: utils.shape.rectangle,
          frictionAir: 0.3,
          constraints: [
            {
              name: 'point',
              type: 'dyn_point',
              target: this.bodies.bones.traj,
              stiffness: 0.05,
              damping: 0.01,
              length: 0.01
            },
            {
              name: 'orient',
              type: 'dyn_orient',
              target: this.bodies.bones.traj,
              stiffness: 0.2,
              damping: 0.01,
              length: 0.01
            },
            //{
            //  name: 'rot_limit',
            //  type: 'kin_limit',
            //  target: this.bodies.bones.traj,
            //  x_min: -50,
            //  x_max: 50,
            //  y_min: -50,
            //  y_max: 50,
            //  rot_min: rad(-20),
            //  rot_max: rad(20),
            //  limit_lock: false
            //}
          ],
        })
      
      this.bodies.bones.root = new body_build({
        ...opts_bones_main,
        dynamic: false,
        name: 'bones_root',
        parent: this.is_dynamic ? this.bodies.inters.background : this.bodies.bones.traj,
        constraint_to_parent: true,
      })
      
    //////////////////////////////////////////////////////////////////////////////// steps
    let inter_size = 22
    if( this.is_dynamic )
    {

      this.bodies.inters_step.steps.push([
        new body_build({       
          ...opts_inter_step,
          name: 'inters_A_S_',
          parent: this.bodies.inters.background,
          m_offset: new Matrix().setTranslation(0,30*this.s),
          m_shape: new Matrix().setScale(7*this.s+inter_size,30*this.s+inter_size),
          type: utils.shape.rectangle,
          constraints: [
            { name: 'point', type: 'dyn_point', target: this.bodies.inters.background, ...opts_cns_disable_at_select},
            { name: 'orient', type: 'kin_orient', target: this.bodies.inters.background},
            
            {
              name: 'axe',
              type: 'kin_axe',
              axe: 1,
              distPos: 25 * this.s,
              distNeg: 0.001,
              limit_lock: 1,
              transfer_delta_as_parent_force: this.debug_mode.inter_step_physics
            }
            
          ],

        })
      ])
      this.bodies.inters_step.steps[0][0].get_resolution_coef = function(){return clamp(this.constraints.axe.update_and_get_current_pos(), 0, 1)}
      this.bodies.inters_step.steps[0][0].set_resolution_coef = function(res = null){this.constraints.axe.current_pos = res}
      


      this.bodies.inters_step.steps_help.push(
        new body_build({
          ...opts_inter_step,
          ...opts_collision_no_interaction,
          name: 'inters_B_S_help',
          parent: this.bodies.inters.background,
          m_offset: new Matrix().setRotation(rad(1)),
          m_shape: new Matrix().setScale(100*this.s),
          type: utils.shape.circle,
          constraints: [
            {
                  name: 'point',
                  type: 'dyn_point',
                  target: this.bodies.inters.background,
                  stiffness: 0.999,
                  damping: 0.1,
                  length: 0.01
            },
            //{ name: 'orient', type: 'dyn_orient', target: this.bodies.inters.background, stiffness: 0.1,},
            {
              name: 'rot_limit',
              type: 'kin_limit',
              obj: this,
              rot_min: rad(0),
              rot_max: rad(270),
              clockwize_mode:true,
              limit_lock: true,
              transfer_delta_as_parent_force: this.debug_mode.inter_step_physics
            }
          ],

        })
      )
      


      this.bodies.inters_step.steps.push([
        new body_build({
          ...opts_inter_step,
          name: 'inters_B_S_',
          parent: this.bodies.inters.background,
          m_offset: new Matrix().setTranslation(0,55*this.s),
          m_shape: new Matrix().setScale(7*this.s+inter_size,30*this.s+inter_size),
          type: utils.shape.rectangle,
          constraints: [
            {
              name: 'point',
              type: 'dyn_point',
              target: this.bodies.inters_step.steps_help[0],
              stiffness: 0.999,
              damping: 0.1,
              length: 0.01
            },
            { name: 'orient', 
              type: 'kin_orient', 
              target: this.bodies.inters_step.steps_help[0],
            },
          ],

        })]
      )

      this.bodies.inters_step.steps[1][0].body_coef_ref = this.bodies.inters_step.steps_help[0]
      this.bodies.inters_step.steps[1][0].get_resolution_coef = function ()
      {
        let max_value = 270.0
        let min_value = 0
        let middle_value = 315.0

        let angle = deg(this.body_coef_ref.get_out_rotation('base',true))
        if( middle_value < angle )
          angle = 0
        
        
        return clamp(angle / 268.9, 0, 1)
      }
      this.bodies.inters_step.steps[1][0].set_resolution_coef = function (res = null) {/*if (res != null)this.body_coef_ref.set_out_rotation(rad(res * -91), 'world', 'override')*/}

      
      this.bodies.inters_step.steps.push(
        new body_build({
          ...opts_inter_step,

          name: 'inters_C',
          m_offset: new Matrix().setRotation(rad(180)).setTranslation(55*this.s,0),
          m_shape: new Matrix().setScale(30*this.s+inter_size,7*this.s+inter_size),
          parent: this.bodies.inters.background,

          type: utils.shape.rectangle,

          constraints: [
            { name: 'point', type: 'dyn_point', target: this.bodies.inters.background,...opts_cns_disable_at_select},
            { name: 'orient', type: 'kin_orient', target: this.bodies.inters.background },
            {
              name: 'axe',
              type: 'kin_axe',
              axe: 0,
              distPos: 25 * this.s,
              distNeg: 0.001,
              limit_lock: 1,
              transfer_delta_as_parent_force: this.debug_mode.inter_step_physics
            }
          ],

        })
      )
      this.bodies.inters_step.steps[2].get_resolution_coef = function () {return clamp(this.constraints.axe.current_pos, 0, 1)}
      this.bodies.inters_step.steps[2].set_resolution_coef = function (res = null) {this.constraints.axe.current_pos = res}
      
    }



    ////////////////////////////////////// rectangles




    this.bodies.bones.rectangles_center = new body_build({
      ...opts_visual_bones,
      name: 'bones_rectangle_center',
      parent: this.bodies.bones.root,
      constraint_to_parent: true,
      constraints:[
      {
        name: 'connect_ty_iA',
        type: 'connect',
        target: this.bodies.inters_step.steps[2],
        attr: 'tx',
        target_attr: 'tx',
        target_space: 'base',
        target_remap: [0, 100, 0, -100]
      },
      ]
    })
    

    let rectangle_pivot_opts = {
      ...opts_visual_bones,
      name: 'bones_rectangle_pivot_T__S_',
      parent: this.bodies.bones.rectangles_center,
      constraint_to_parent: true,
      constraints: [
      ],
    }
    
    if (this.is_dynamic) {

      rectangle_pivot_opts.constraints.push({
        name: 'connect_rot_iA',
        type: 'connect',
        target: this.bodies.inters_step.steps_help[0],
        attr: 'r',
        target_attr: 'r',
        target_space: 'base',
        target_remap: [-1000, 1000, -1000, 1000]
      })

      rectangle_pivot_opts.constraints.push({
        name: 'rot_limit',
        type: 'kin_limit',
        obj: this,
        rot_min: rad(0),
        rot_max: rad(270),
        clockwize_mode:true,
        limit_lock:true,
      })

    }
    

    this.bodies.bones.rectangles_pivots.push(new body_build(rectangle_pivot_opts))

    this.bodies.bones.rectangles.push(
      new body_build({
        ...opts_visual_bones,
        name: 'bones_rectangle_T__S_',
        parent: this.bodies.bones.rectangles_pivots[0],
        constraint_to_parent: true,
        m_offset: new Matrix().setTranslation(0,30*this.s),
        constraints: [
          {
            name: 'connect_ty_iA',
            type: 'connect',
            target: this.bodies.inters_step.steps[0][0],
            attr: 'ty',
            target_attr: 'ty',
            target_space: 'base',
            target_remap: [0, 100, 0, 100]
          },
        ]
      })
    )

    let opts_rectangles = {
      ...opts_geo,
      name: 'geos_rectangle_T__S_',
      type: utils.shape.rectangle,
      parent: this.bodies.bones.rectangles[0],
      constraint_to_parent: true,
      m_shape: new Matrix().setScale(7*this.s,30*this.s),
      material_three: materials.raw_shader_exemple, //materials.simple.gradient_yellow_green_oblique_line_A ,
    }
    this.bodies.geos.rectangles.push(new body_build(opts_rectangles))

    /////////////////////////////////// circle


    let bone_circle_opts = {
      ...opts_visual_bones,
      name: 'bones_circle',
      parent: this.bodies.bones.root,
      constraint_to_parent: true,
      constraints:[],
    }
    
    this.bodies.bones.circle = new body_build(bone_circle_opts)

    this.bodies.geos.circle = new body_build({
      ...opts_geo,
      name: 'geos_circle',
      parent: this.bodies.bones.circle,
      m_shape: new Matrix().setScale(17*this.s),
      type: utils.shape.circle,

      material_three: materials.raw_shader_exemple, //three_utils.material.simple.cyan_grid ,
      constraint_to_parent: true,
      constraints: [],
    })


    /////////////////////////////////// trapezoids

    

    this.bodies.bones.trapezoids_center = new body_build({
      ...opts_visual_bones,
      name: 'bones_trapezoids_center',
      parent: this.bodies.bones.root,
      constraint_to_parent: true,
      constraints: [
        {
          name: 'connect_ty_iA',
          type: 'connect',
          target: this.bodies.inters_step.steps_help[0],
          attr: 'r',
          target_attr: 'r',
          target_space: 'base',
          target_remap: [0, 270, 0, 270], 
          clockwize_mode: true,
        },
      ]      
    })
    
    this.bodies.bones.trapezoids.push(
      new body_build({
        ...opts_visual_bones,
        name: 'bones_trapezoid_T__S_',
        parent: this.bodies.bones.trapezoids_center,
        constraint_to_parent: true,
        m_offset: new Matrix().setTranslation(30*this.s*0.7, 30*this.s*0.7).setRotation(rad(-45)),
        constraints: [
          {
            name: 'connect_ty_iA',
            type: 'connect',
            target: this.bodies.inters_step.steps_help[0],
            attr: 'ty',
            target_attr: 'r',
            target_space: 'base',
            target_remap: [0, 270, 0, -28], 
            clockwize_mode: true,
          },
          {
            name: 'connect_r_iA',
            type: 'connect',
            target: this.bodies.inters_step.steps[2],
            attr: 'r',
            target_attr: 'tx',
            target_space: 'base',
            target_remap: [0, 50, 0, -45], 
            clockwize_mode: true,
          },          
        ]        
      })
    )
    
    let opts_trapezoids = {
      ...opts_geo,
      name: 'geos_trapezoid_T__S_',
      type: utils.shape.trapezoid,
      parent: this.bodies.bones.trapezoids[0],
      constraint_to_parent: true,
      m_shape: new Matrix().setScale(40*this.s,7*this.s),
      slop:45,
      material_three: materials.raw_shader_exemple, //materials.simple.gradient_yellow_green_oblique_line_A ,
    }
    this.bodies.geos.trapezoids.push(new body_build(opts_trapezoids))
        




    /////////////////////////////////


    // TOP RIGHT
    let m_ref = new Matrix(this.m)
    let m_transform = new Matrix(this.m).setRotation(rad(90))
    let name_search = '_S_'
    let name_replace = '_O_'
    if(this.is_dynamic)
    {
      this.bodies.inters_step.steps[0].push(this.bodies.inters_step.steps[0][0].get_duplicate(m_ref, m_transform, name_search,name_replace))
      this.bodies.inters_step.steps[1].push(this.bodies.inters_step.steps[1][0].get_duplicate(m_ref, m_transform, name_search,name_replace))
      this.bodies.bones.rectangles_pivots.push(this.bodies.bones.rectangles_pivots[0].get_duplicate(m_ref, m_transform, name_search,name_replace))
      this.bodies.bones.rectangles.push(this.bodies.bones.rectangles[0].get_duplicate(m_ref, m_transform, name_search,name_replace))
      this.bodies.geos.rectangles.push(this.bodies.geos.rectangles[0].get_duplicate(m_ref, m_transform, name_search,name_replace))
      this.bodies.bones.trapezoids.push(this.bodies.bones.trapezoids[0].get_duplicate(m_ref, m_transform, name_search,name_replace))
      this.bodies.geos.trapezoids.push(this.bodies.geos.trapezoids[0].get_duplicate(m_ref, m_transform, name_search,name_replace))
    }
    // BOTTOM LEFT
    m_transform = new Matrix(this.m).setRotation(rad(180))
    name_replace = '_N_'
    if(this.is_dynamic)
    {
      this.bodies.inters_step.steps[0].push(this.bodies.inters_step.steps[0][0].get_duplicate(m_ref, m_transform, name_search,name_replace))
      this.bodies.inters_step.steps[1].push(this.bodies.inters_step.steps[1][0].get_duplicate(m_ref, m_transform, name_search,name_replace))
      this.bodies.bones.rectangles_pivots.push(this.bodies.bones.rectangles_pivots[0].get_duplicate(m_ref, m_transform, name_search,name_replace))
      this.bodies.bones.rectangles.push(this.bodies.bones.rectangles[0].get_duplicate(m_ref, m_transform, name_search,name_replace))
      this.bodies.geos.rectangles.push(this.bodies.geos.rectangles[0].get_duplicate(m_ref, m_transform, name_search,name_replace))      
      this.bodies.bones.trapezoids.push(this.bodies.bones.trapezoids[0].get_duplicate(m_ref, m_transform, name_search,name_replace))
      this.bodies.geos.trapezoids.push(this.bodies.geos.trapezoids[0].get_duplicate(m_ref, m_transform, name_search,name_replace))      
    }
    // BOTTOM RIGHT
    m_transform = new Matrix(this.m).setRotation(rad(270))
    name_replace = '_E_'
    if(this.is_dynamic)
    {
      this.bodies.inters_step.steps[0].push(   this.bodies.inters_step.steps[0][0].get_duplicate(   m_ref, m_transform, name_search,name_replace))
      //this.bodies.inters_step.steps[1].push(   this.bodies.inters_step.steps[1][0].get_duplicate(   m_ref, m_transform, name_search,name_replace))
      this.bodies.bones.rectangles_pivots.push(this.bodies.bones.rectangles_pivots[0].get_duplicate(m_ref, m_transform, name_search,name_replace))
      this.bodies.bones.rectangles.push(       this.bodies.bones.rectangles[0].get_duplicate(       m_ref, m_transform, name_search,name_replace))
      this.bodies.geos.rectangles.push(        this.bodies.geos.rectangles[0].get_duplicate(        m_ref, m_transform, name_search,name_replace))
      this.bodies.bones.trapezoids.push(       this.bodies.bones.trapezoids[0].get_duplicate(       m_ref, m_transform, name_search,name_replace))
      this.bodies.geos.trapezoids.push(        this.bodies.geos.trapezoids[0].get_duplicate(        m_ref, m_transform, name_search,name_replace))            
    }

    
    if (this.is_dynamic) {
      this.bodies.inters_step.steps[0][0].highlight_selection = [  this.bodies.geos.rectangles[0]]
      this.bodies.inters_step.steps[0][1].highlight_selection = [  this.bodies.geos.rectangles[1]]
      this.bodies.inters_step.steps[0][2].highlight_selection = [  this.bodies.geos.rectangles[2]]
      this.bodies.inters_step.steps[0][3].highlight_selection = [  this.bodies.geos.rectangles[3]]

      this.bodies.inters_step.steps[1][0].highlight_selection = [  this.bodies.geos.rectangles[0]]
      this.bodies.inters_step.steps[1][1].highlight_selection = [  this.bodies.geos.rectangles[1]]
      this.bodies.inters_step.steps[1][2].highlight_selection = [  this.bodies.geos.rectangles[2]]
      //this.bodies.inters_step.steps[1][3].highlight_selection = [  this.bodies.geos.rectangles[3]]

      this.bodies.inters_step.steps[2].highlight_selection = [  
                                                              this.bodies.geos.rectangles[0],
                                                              this.bodies.geos.rectangles[1],
                                                              this.bodies.geos.rectangles[2],
                                                              this.bodies.geos.rectangles[3]]
                                                                    
    }

    
    this.create_inter_from_geos(
      ['circle', 'trapezoids'],
      this.bodies.inters.background,
      this.s
    )
    


    if(this.is_dynamic)
     this.instance_each_others(
       [
         this.bodies.inters_step.steps[0][0],
         this.bodies.inters_step.steps[0][1],
         this.bodies.inters_step.steps[0][2],
         this.bodies.inters_step.steps[0][3]
       ],
       [false, false, 
        false, false, 
         false, false, 
         false, false]
     )

    /*
    this.bodies.inters.B = new body_build({  
                                    m:this.m,
                                    m_offset:new Matrix(),
                                    x:0,
                                    y:0,
                                    w:400/2.4*s,
                                    type:utils.shape.circle, 
                                    do_shape: true,
                                    do_line:true,                                                                     
                                    color: utils.color.grey,
                                    color_line: utils.color.black,
                                    shader: this.shaders.length != 0 ? this.shaders[0] : null,
                                    collision_category: utils.collision_category.inter,
                                    collision_mask: utils.collision_category.mouse ,    
                                    fix_rot:true,
                                    density:0.001,
                                    limit_rot: [ 0, rad(270)],
                                    screen_dims: this.screen_dims,
                                    matter_engine: this.matter_engine,
                                    })

    this.bodies.inters.B_mask = new body_build({
                                    m:this.m,
                                    m_offset:new Matrix(),
                                    x:0,
                                    y:0,
                                    w:230/2.4*s,
                                    type:utils.shape.circle,
                                    do_shape: true,
                                    do_line:true,                                       
                                    color: utils.color.grey,
                                    color_line: utils.color.black,
                                    shader: this.shaders.length != 0 ? this.shaders[0] : null,
                                    collision_category: utils.collision_category.inter,
                                    collision_mask: utils.collision_category.mouse ,    
                                    fix_rot:true,
                                    density:0.001,
                                    limit_rot: [ 0, rad(270)],
                                    screen_dims: this.screen_dims,
                                    matter_engine: this.matter_engine,
                                    })                                    


    this.bodies.geos.circle = new body_build({ 
                                      m:this.m,
                                      m_offset:new Matrix(),
                                      x:0,
                                      y:0,
                                      w : 20*s, 
                                      h : 18*s, 
                                      type : utils.shape.circle,
                                      do_shape: true,
                                      do_line:true,                                      
                                      color : this.colors[1],
                                      color_line: utils.color.black,
                                      shader: this.shaders.length != 0 ? this.shaders[0] : null,
                                      collision_category : utils.collision_category.blue,
                                      collision_mask : utils.collision_category.default ,    
                                      fix_rot:true,
                                      screen_dims: this.screen_dims,
                                      matter_engine: this.matter_engine,
                                      //texture_three: text_checker_three,
                                    })
    let oRect = {
      m:this.m,
      x:0,
      y:0, 
      w : 7*s, 
      h : 30*s, 
      do_shape: true,
      do_line:true,
      color: this.colors[0],
      color_line: [0,0,0],
      shader: this.shaders.length != 0 ? this.shaders[0] : null,
      collision_category: utils.collision_category.blue,
      collision_mask: utils.collision_category.default,// | utils.collision_category.blue,
      type: utils.shape.rectangle,
      axe_constraint : {
                          axe:1,
                          distPos: 35*s,
                          distNeg: 0.001,  
                        },
      screen_dims: this.screen_dims,
      matter_engine: this.matter_engine,
      //texture_three: text_checker_three,
    } 

    let mo_rA = new Matrix()
    
    mo_rA.setTranslation(0,oRect.h)
    this.bodies.geos.rectangles.push(new body_build({ ...oRect, 
                                                m_offset:mo_rA,
                                                y:oRect.h,
                                                rot:0, 
                                                collision:false,                                               
                                              })) 
    
    let mo_rB = new Matrix()
    mo_rB.setTranslation(0,-oRect.h)
    this.bodies.geos.rectangles.push(new body_build({ ...oRect, 
                                                 m_offset:mo_rB,
                                                y:-oRect.h,
                                                rot:180,   
                                                collision:false, 
                                              })) 
    let mo_rC = new Matrix()
    mo_rC.setTranslation(-oRect.h,0)
    this.bodies.geos.rectangles.push(new body_build({ ...oRect, 
                                                 m_offset:mo_rC,
                                                x:-oRect.h,
                                                rot:90,  
                                                collision:false,  
                                              })) 
    let mo_rD = new Matrix()
    mo_rD.setTranslation(oRect.h,0)
    this.bodies.geos.rectangles.push(new body_build({ ...oRect, 
                                                m_offset:mo_rD,
                                                x:oRect.h,
                                                rot:-90,  
                                              })) 

    this.bodies.inters.A_bg = new body_build({  
                                    m:this.m,
                                    m_offset: new Matrix(),
                                    x:0,
                                    y:0,
                                    w:230/2.4*s,
                                    type:utils.shape.circle,
                                    do_shape: true,
                                    do_line:true,                                       
                                    color: utils.color.grey,
                                    color_line: utils.color.black,
                                    shader: this.shaders.length != 0 ? this.shaders[0] : null,
                                    collision_category: utils.collision_category.inter,
                                    collision_mask: utils.collision_category.mouse ,    
                                    fix_rot:true,
                                    density:0.001,
                                    limit_rot: [ 0, rad(270)],
                                    screen_dims: this.screen_dims,
                                    matter_engine: this.matter_engine,
                                    })    

    let mo_iA = new Matrix()
    mo_iA.setTranslation(0,oRect.h)                                    
    this.bodies.inters.A = new body_build({ 
                                          m:this.m,
                                          m_offset:mo_iA,
                                          x:0,
                                          y:oRect.h,
                                          w:40/2.4*3*s,
                                          type : utils.shape.circle,
                                          do_shape: true,
                                          do_line:true,                                             
                                          color:utils.color.grey,
                                          color_line: utils.color.black,
                                          shader: this.shaders.length != 0 ? this.shaders[0] : null,
                                          collision_category: utils.collision_category.inter,
                                          collision_mask: utils.collision_category.mouse,
                                          axe_constraint : {
                                            axe:1,
                                            distPos: 35/4*s,
                                            distNeg: 0.001,  
                                          },
                                          
                                          screen_dims: this.screen_dims,
                                          matter_engine: this.matter_engine,
                                        })  
       


  let mo_iAh = new Matrix()                                    
  mo_iAh.setTranslation(0,oRect.h+oRect.axe_constraint.distPos/2.)       
  this.bodies.helpers.stepA = new body_build({  m:this.m,
                                                m_offset:mo_iAh,
                                                x:0,
                                                y:0,                                                
                                                w : 1, 
                                                h : oRect.axe_constraint.distPos, 
                                                do_shape: false,
                                                do_line:true,         
                                                color: utils.color.yellow,
                                                color_line: utils.color.yellow,
                                                transparency_activate: true,
                                                transparency_line:1.0,
                                                shader: this.shaders.length != 0 ? this.shaders[0] : null,
                                                collision_category: utils.collision_category.none,
                                                collision_mask: utils.collision_category.none ,
                                                type:utils.shape.rectangle,
                                                
                                                screen_dims: this.screen_dims,
                                                matter_engine: this.matter_engine,  
                                                //texture_three: text_checker_three,     
                                                }) 



    // other
    let mo_iC_bg = new Matrix()
    mo_iC_bg.setTranslation(50,0) 
    this.bodies.inters.C_bg = new body_build({  
                                    m:this.m,
                                    m_offset:mo_iC_bg,
                                    x:50,
                                    y:0,
                                    w:300/2.4*s,
                                    type:utils.shape.circle,
                                    do_shape: true,
                                    do_line:true,                                       
                                    color: utils.color.grey,
                                    color_line: utils.color.black,
                                    shader: this.shaders.length != 0 ? this.shaders[0] : null,
                                    collision_category: utils.collision_category.inter,
                                    collision_mask: utils.collision_category.mouse ,    
                                    fix_rot:true,
                                    density:0.001,
                                    limit_rot: [ 0, rad(270)],
                                    
                                    screen_dims: this.screen_dims,
                                    matter_engine: this.matter_engine,
                                    })    

    let mo_iC = new Matrix()
    mo_iC.setTranslation(oRect.h,0)                                     
    this.bodies.inters.C = new body_build({ 
                                      m:this.m,
                                      m_offset:mo_iC,
                                      x:oRect.h,
                                      y:0,
                                      rot:-90,
                                      w:100/2.4*s,
                                      type : utils.shape.circle,
                                      do_shape: true,
                                      do_line:true,                                         
                                      color:utils.color.grey,
                                      color_line: utils.color.black,
                                      shader: this.shaders.length != 0 ? this.shaders[0] : null,
                                      collision_category: utils.collision_category.inter,
                                      collision_mask: utils.collision_category.mouse,
                                      axe_constraint : {
                                        axe:1,
                                        distPos: 35*s,
                                        distNeg: 0.001, 
                                      },
                                      
                                      screen_dims: this.screen_dims,
                                      matter_engine: this.matter_engine,
                                    })
    this.bodies.inters.C.c_axe.pos_override =1
    this.bodies.inters.C.c_axe.apply()
    this.bodies.inters.C.c_axe.pos_override =null


    let mo_iCh = new Matrix()                                    
    mo_iCh.setTranslation(oRect.h+oRect.axe_constraint.distPos/2.,0.)       
    this.bodies.helpers.stepC = new body_build({  m:this.m,
                                                  m_offset:mo_iCh,
                                                  x:0,
                                                  y:0,  
                                                  rot:-90,                                              
                                                  w : 1, 
                                                  h : oRect.axe_constraint.distPos, 
                                                  do_shape: false,
                                                  do_line:true,         
                                                  color: utils.color.yellow,
                                                  color_line: utils.color.yellow,
                                                  transparency_activate: true,
                                                  transparency_line:1.0,                                                  
                                                  shader: this.shaders.length != 0 ? this.shaders[0] : null,
                                                  collision_category: utils.collision_category.none,
                                                  collision_mask: utils.collision_category.none ,
                                                  type:utils.shape.rectangle,
                                                  
                                                  screen_dims: this.screen_dims,
                                                  matter_engine: this.matter_engine,  
                                                  //texture_three: text_checker_three,     
                                                  }) 
    let mo_iBh = new Matrix()                                    
    mo_iBh.setTranslation(0,0.)   
    this.bodies.helpers.stepB = new body_build({  m:this.m,
                                                  m_offset:mo_iBh,
                                                  x:0,
                                                  y:0,                                                
                                                  w : oRect.h+oRect.axe_constraint.distPos, 
                                                  h : oRect.axe_constraint.distPos, 
                                                  rot:180,
                                                  do_shape: false,
                                                  do_line:true,         
                                                  color: utils.color.yellow,
                                                  color_line: utils.color.yellow,
                                                  transparency_activate: true,
                                                  transparency_line:1.0,                                                  
                                                  shader: this.shaders.length != 0 ? this.shaders[0] : null,
                                                  collision_category: utils.collision_category.none,
                                                  collision_mask: utils.collision_category.none ,
                                                  type:utils.shape.arc,
                                                  
                                                  screen_dims: this.screen_dims,
                                                  matter_engine: this.matter_engine,  
                                                  //texture_three: text_checker_three, 
                                                  arc_limites : [0, 3.14*1.5],    
                                                  }) 
  
    /////////////////////////////////////////////////////   
    
    

    let oBackground = {
      //m:this.m,
      //m_offset:mo_background,
      w : this.screen_dims.x/2, 
      h : this.screen_dims.y, 
      do_shape: true,
      do_line:true,         
      color: this.color_background,
      color_line: utils.color.black,
      collision_category: utils.collision_category.none,
      collision_mask: utils.collision_category.none,
      type: utils.shape.rectangle,
      
      screen_dims: this.screen_dims,
      matter_engine: this.matter_engine,
      //texture_three: text_checker_three_grey,
    } 
    

    let mo_background_L = new Matrix()                                    
    mo_background_L.setTranslation(this.screen_dims.x/4,this.screen_dims.y/2)   

    this.bodies.geos.backgrounds.push(new body_build({ ...oBackground, 
                                                m_offset:mo_background_L,
                                                rot:0, 
                                                collision:false,                                               
                                              })) 

    let mo_background_R = new Matrix()                                    
    mo_background_R.setTranslation(this.screen_dims.x/4*3,this.screen_dims.y/2)                                                
    this.bodies.geos.backgrounds.push(new body_build({ ...oBackground,
                                                m_offset:mo_background_R, 
                                                rot:0, 
                                                collision:false,                                               
                                              })) 

    /////////////////////////////////////////////////////                                                


    let oTrap = { 
      m:this.m,
      w : 46*s, 
      posCoef:0.7, 
      h : 7*s, 
      slop : 45, 
      do_shape: true,
      do_line:true,         
      color: this.colors[2],
      color_line: utils.color.black,
      shader: this.shaders.length != 0 ? this.shaders[0] : null,
      collision_category: utils.collision_category.blue,
      collision_mask: utils.collision_category.default ,
      type:utils.shape.trapezoid,
  
      axe_constraint : {
        axe:1,
        distPos: 5*s,
        distNeg: 10*s,  
      },
      
      screen_dims: this.screen_dims,
      matter_engine: this.matter_engine,  
      //texture_three: text_checker_three,      
    } 

  let mo_tA = new Matrix()
  mo_tA.setTranslation(oRect.h*0.7,
                       oRect.h*0.7)             
  this.bodies.geos.trapezoids.push(new body_build({ ...oTrap,
                                          m_offset:mo_tA, 
                                          x:oRect.h*oTrap.posCoef,
                                          y:oRect.h*oTrap.posCoef,
                                          rot:-45,       
                                        })) 

  let mo_tB = new Matrix()
  mo_tB.setTranslation(-oRect.h*oTrap.posCoef,
                       oRect.h*oTrap.posCoef)   
  this.bodies.geos.trapezoids.push(new body_build({ ...oTrap, 
                                          m_offset:mo_tB,
                                          x:-oRect.h*oTrap.posCoef,
                                          y:oRect.h*oTrap.posCoef,
                                          rot:45,  
                                        })) 
  let mo_tC = new Matrix()
  mo_tC.setTranslation(-oRect.h*oTrap.posCoef,
                       -oRect.h*oTrap.posCoef)   
  this.bodies.geos.trapezoids.push(new body_build({ ...oTrap, 
                                          m_offset:mo_tC,
                                          x:-oRect.h*oTrap.posCoef,
                                          y:-oRect.h*oTrap.posCoef,
                                          rot:-45-180,      
                                        })) 

  let mo_tD = new Matrix()
  mo_tD.setTranslation(+oRect.h*oTrap.posCoef,
                       -oRect.h*oTrap.posCoef)   
  this.bodies.geos.trapezoids.push(new body_build({ ...oTrap, 
                                          m_offset:mo_tD,
                                          x:+oRect.h*oTrap.posCoef,
                                          y:-oRect.h*oTrap.posCoef,
                                          rot:45+180,     
                                        })) 
  */
   






    this.bodies_draw_order = [
      this.bodies.geos.backgrounds[0],
      this.bodies.geos.backgrounds[1],
      this.bodies.inters.background,
      this.bodies.inters.circle,
      this.bodies.inters.trapezoids[0],
      this.bodies.inters.trapezoids[1],
      this.bodies.inters.trapezoids[2],
      this.bodies.inters.trapezoids[3],
      this.bodies.inters_step.steps_help[0],
      this.is_dynamic ? this.bodies.inters_step.steps[0][0]:null,
      this.is_dynamic ? this.bodies.inters_step.steps[0][1]:null,
      this.is_dynamic ? this.bodies.inters_step.steps[0][2]:null,
      this.is_dynamic ? this.bodies.inters_step.steps[0][3]:null,
      this.is_dynamic ? this.bodies.inters_step.steps[1][0]:null,
      this.is_dynamic ? this.bodies.inters_step.steps[1][1]:null,
      this.is_dynamic ? this.bodies.inters_step.steps[1][2]:null,
      //this.is_dynamic ? this.bodies.inters_step.steps[1][3]:null,
      this.is_dynamic ? this.bodies.inters_step.steps[2]:null,
      this.bodies.geos.circle,
      // this.effects.trailA,
      // this.effects.trailB,
      this.bodies.geos.trapezoids[0],
      this.bodies.geos.trapezoids[1],
      this.bodies.geos.trapezoids[2],
      this.bodies.geos.trapezoids[3],
      this.bodies.geos.rectangles[0],
      this.bodies.geos.rectangles[1],
      this.bodies.geos.rectangles[2],
      this.bodies.geos.rectangles[3],
      // this.effects.sparcles_shock_A,
      // this.effects.sparcles_shock_B,
      // this.effects.sparcles_shock_C,
      this.bodies.bones.world,
      this.bodies.bones.traj,
      this.bodies.bones.root,
      this.bodies.bones.circle,
      this.bodies.bones.trapezoids_center,
      this.bodies.bones.trapezoids[0],
      this.bodies.bones.trapezoids[1],
      this.bodies.bones.trapezoids[2],
      this.bodies.bones.trapezoids[3],
      this.bodies.bones.rectangles_center,
      this.bodies.bones.rectangles_pivots[0],
      this.bodies.bones.rectangles_pivots[1],
      this.bodies.bones.rectangles_pivots[2],
      this.bodies.bones.rectangles_pivots[3],
      this.bodies.bones.rectangles[0],
      this.bodies.bones.rectangles[1],
      this.bodies.bones.rectangles[2],
      this.bodies.bones.rectangles[3]
    ]
    let z_depth = args.z_depth_start
    let z_depth_incr = 0.5 //0.1
    for (let i = 0; i < this.bodies_draw_order.length; i++)
    {
      if (this.bodies_draw_order[i] == null)
      {
        if (this.debug_mode.show_warning_log)
          console.log(  ' z_order - this.bodies_draw_order[' + i + '] doesnt exists')
        continue
      }
      this.bodies_draw_order[i].z = z_depth
      z_depth += z_depth_incr
    }
    this.z_depth_end = z_depth

    this.Mouse.z = this.z_depth_end

    this.bodies_build_order = this.bodies_get_build_order()

    this.bodies_eval_order = [
      'bones','world',
      'geos','backgrounds',

      'bones','traj',

      'inters','background',
      'inters','circle',
      'inters','trapezoids',
      'inters_step','steps',
      'inters_step','steps_help',

      'bones','root',

      'bones','circle',
      'bones','trapezoids_center',
      'bones','trapezoids',
      'bones','rectangles_center',
      'bones','rectangles_pivots',
      'bones','rectangles',

      'geos','circle',
      'geos','trapezoids',
      'geos','rectangles'
    ]
    
    this.steps_info = [
      ///////////////////////////////////////////////////////////////////////////////////// 0
      {
        bodies_enable: [
          this.bodies.inters_step.steps_help[0],
          this.is_dynamic ? this.bodies.inters_step.steps[0][0]:null,
          this.is_dynamic ? this.bodies.inters_step.steps[0][1]:null,
          this.is_dynamic ? this.bodies.inters_step.steps[0][2]:null,
          this.is_dynamic ? this.bodies.inters_step.steps[0][3]:null,
          this.bodies.inters.background,
          this.bodies.inters.circle,
          this.bodies.inters.trapezoids[0],
          this.bodies.inters.trapezoids[1],
          this.bodies.inters.trapezoids[2],
          this.bodies.inters.trapezoids[3],
          this.bodies.geos.backgrounds[0],
          this.bodies.geos.backgrounds[1],
          this.bodies.geos.circle,
          this.bodies.geos.trapezoids[0],
          this.bodies.geos.trapezoids[1],
          this.bodies.geos.trapezoids[2],
          this.bodies.geos.trapezoids[3],
          this.bodies.geos.rectangles[0],
          this.bodies.geos.rectangles[1],
          this.bodies.geos.rectangles[2],
          this.bodies.geos.rectangles[3],
          this.bodies.bones.rectangles[0],
          this.bodies.bones.rectangles[1],
          this.bodies.bones.rectangles[2],
          this.bodies.bones.rectangles[3],
          this.bodies.bones.world,
          this.bodies.bones.traj,
          this.bodies.bones.root,
          this.bodies.bones.circle,
          this.bodies.bones.trapezoids_center,
          this.bodies.bones.trapezoids[0],
          this.bodies.bones.trapezoids[1],
          this.bodies.bones.trapezoids[2],
          this.bodies.bones.trapezoids[3],
          this.bodies.bones.rectangles_center,
          this.bodies.bones.rectangles_pivots[0],
          this.bodies.bones.rectangles_pivots[1],
          this.bodies.bones.rectangles_pivots[2],
          this.bodies.bones.rectangles_pivots[3]
        ],

        constraints_disable: [
          // 'geos','rectangle',null,'connect_rot_iB',
          // 'geos','rectangle',null,'connect_ty_iC',
        ],
        switch_selection_transition:null,
      }, ///////////////////////////////////////////////////////////////////////////////////// 1
      {
        bodies_enable: [
          this.bodies.inters_step.steps_help[0],
          this.bodies.inters_step.steps[1][0],
          this.bodies.inters_step.steps[1][1],
          this.bodies.inters_step.steps[1][2],
          //this.bodies.inters_step.steps[1][3],
          this.bodies.inters.background,
          this.bodies.inters.circle,
          this.bodies.geos.backgrounds[0],
          this.bodies.geos.backgrounds[1],
          this.bodies.geos.circle,
          this.bodies.geos.trapezoids[0],
          this.bodies.geos.trapezoids[1],
          this.bodies.geos.trapezoids[2],
          this.bodies.geos.trapezoids[3],
          this.bodies.geos.rectangles[0],
          this.bodies.geos.rectangles[1],
          this.bodies.geos.rectangles[2],
          this.bodies.geos.rectangles[3],
          this.bodies.bones.rectangles[0],
          this.bodies.bones.rectangles[1],
          this.bodies.bones.rectangles[2],
          this.bodies.bones.rectangles[3],
          this.bodies.bones.world,
          this.bodies.bones.traj,
          this.bodies.bones.root,
          this.bodies.bones.circle,
          this.bodies.bones.trapezoids_center,
          this.bodies.bones.trapezoids[0],
          this.bodies.bones.trapezoids[1],
          this.bodies.bones.trapezoids[2],
          this.bodies.bones.trapezoids[3],
          this.bodies.bones.rectangles_center,
          this.bodies.bones.rectangles_pivots[0],
          this.bodies.bones.rectangles_pivots[1],
          this.bodies.bones.rectangles_pivots[2],
          this.bodies.bones.rectangles_pivots[3]
        ],
        constraints_disable: [
          //'geos', 'rectangle', null, 'connect_ty_iC'
        ],
        switch_selection_transition:true,
      }, ///////////////////////////////////////////////////////////////////////////////////// 2
      {
        bodies_enable: [
          this.bodies.inters_step.steps_help[0],
          this.is_dynamic ? this.bodies.inters_step.steps[2] : null,
          this.bodies.inters.background,
          this.bodies.inters.circle,
          this.bodies.geos.backgrounds[0],
          this.bodies.geos.backgrounds[1],
          this.bodies.geos.circle,
          this.bodies.geos.trapezoids[0],
          this.bodies.geos.trapezoids[1],
          this.bodies.geos.trapezoids[2],
          this.bodies.geos.trapezoids[3],
          this.bodies.geos.rectangles[0],
          this.bodies.geos.rectangles[1],
          this.bodies.geos.rectangles[2],
          this.bodies.geos.rectangles[3],
          this.bodies.bones.rectangles[0],
          this.bodies.bones.rectangles[1],
          this.bodies.bones.rectangles[2],
          this.bodies.bones.rectangles[3],
          this.bodies.bones.world,
          this.bodies.bones.traj,
          this.bodies.bones.root,
          this.bodies.bones.circle,
          this.bodies.bones.trapezoids_center,
          this.bodies.bones.trapezoids[0],
          this.bodies.bones.trapezoids[1],
          this.bodies.bones.trapezoids[2],
          this.bodies.bones.trapezoids[3],
          this.bodies.bones.rectangles_center,
          this.bodies.bones.rectangles_pivots[0],
          this.bodies.bones.rectangles_pivots[1],
          this.bodies.bones.rectangles_pivots[2],
          this.bodies.bones.rectangles_pivots[3]
        ],
        constraints_disable: [],
        switch_selection_transition:true,
      }, ///////////////////////////////////////////////////////////////////////////////////// 3
      {
        bodies_enable: [
          this.bodies.geos.backgrounds[0],
          this.bodies.geos.backgrounds[1],
          this.bodies.geos.circle,
          this.bodies.geos.trapezoids[0],
          this.bodies.geos.trapezoids[1],
          this.bodies.geos.trapezoids[2],
          this.bodies.geos.trapezoids[3],
          this.bodies.geos.rectangles[0],
          this.bodies.geos.rectangles[1],
          this.bodies.geos.rectangles[2],
          this.bodies.geos.rectangles[3]
        ],
        constraints_disable: [
          //'inters_step', 'steps', 2, 'point'
        ]
      }
    ]

    this.bodies_init_physics()
    this.bodies_init_constraints()

    

                                
  }










































/*

  get_resolution_coef_info()
  {
    

    let A = clamp(this.bodies.inters.A.c_axe.current_pos     ,0,1)
    let B = clamp(deg(this.bodies.inters.B.body.angle)/270   ,0,1)
    let C = clamp(1 - this.bodies.inters.C.c_axe.current_pos ,0,1) 
    let D = 0
    if ( this.anim_mode )
    {
      let s = [0,1,2,3]   
      A = clamp(this.resolution_coef_override ,s[0],s[0]+1)
      B = clamp(this.resolution_coef_override ,s[1],s[1]+1)-s[1]
      C = clamp(this.resolution_coef_override ,s[2],s[2]+1)-s[2]
      D = clamp(this.resolution_coef_override ,s[3],s[3]+1)-s[3]
    }
    
    let coef = A + B + C + D

    // fill resolution coef info
    this.state.resolution_coef = coef
    this.state.steps[0].resoluton_coef = A
    this.state.steps[1].resoluton_coef = B
    this.state.steps[2].resoluton_coef = C
    this.state.steps[3].resoluton_coef = D

    this.state.current_step = 0
    if(A==1)
      this.state.current_step = 1
    if(B==1)
      this.state.current_step = 2   
    if(C==1)
      this.state.current_step = 3      
    if((D==1)&&(!this.anim_mode))
      this.state.current_step = 4        
  }

  set_phase_resolution_control_0( res_coef )
  {
      for( let i = 0; i < this.bodies.geos.rectangles.length; i++ )
      this.bodies.geos.rectangles[i].c_axe.pos_override = res_coef

    for( let i = 0; i < this.bodies.geos.trapezoids.length; i++ )
      this.bodies.geos.trapezoids[i].c_axe.pos_override = res_coef

    if(  this.anim_mode )   
    {
      this.bodies.inters.A.c_axe.pos_override = res_coef
    }
  }

  set_phase_resolution_control_2( res_coef)
  {  
      for( let i = 0; i < this.bodies.geos.trapezoids.length; i++ )
        this.bodies.geos.trapezoids[i].c_axe.pos_override = res_coef*-2+1

      let max_angle = 270
      if( max_angle-1    < res_coef*max_angle )
        this.bodies.geos.rectangles[0].enable(0)
      else                          
        this.bodies.geos.rectangles[0].enable(1)
      if( max_angle/3-1  < res_coef*max_angle )
        this.bodies.geos.rectangles[1].enable(0)
      else                          
        this.bodies.geos.rectangles[1].enable(1)
      if( max_angle/3*2-1 < res_coef*max_angle )
        this.bodies.geos.rectangles[2].enable(0)
      else                          
        this.bodies.geos.rectangles[2].enable(1)
  
      if(  this.anim_mode )   
      {
        this.bodies.inters.B.rot_override = rad(res_coef*270)
      }
  }

  set_phase_resolution_control_4( res_coef)
  {  
    this.bodies.geos.rectangles[3].c_axe.pos_override = 1 - res_coef

        
    let rot_coef = 1.15
    var rot_tmp = (res_coef*rot_coef) 

    for( let i=0; i < this.bodies.geos.trapezoids.length; i++ )
    {
      let current_r = this.bodies.geos.trapezoids[i].rot
      let r = current_r+ rad(270)+rot_tmp*rad(45);
      this.bodies.geos.trapezoids[i].rot_override = r

      
      this.bodies.geos.trapezoids[i].c_axe.pos_override = -1      
    }

    if( this.anim_mode )   
    {
      this.bodies.inters.C.c_axe.pos_override = 1-res_coef
    }    
  } 



  set_step_resolution()
  {
    // utils
    var selected_body = this.mouse_constraint.constraint.bodyB
    
    // clean
    this.bodies_axe_enable( ['inters'])
    this.bodies_axe_clean_override()
    //this.bodies_cns_modif(1.0)
    this.bodies_rot_clean_override()
    this.bodies_enable( 0,  ['inters'] )

    ////////////////////////////////////////////////////////////////////////////////////
    let step = 0
    let res_coef = this.state.steps[step].resoluton_coef
    let do_it = this.state.current_step == step
    if( do_it )
    {
      //_________________________________________________________________Clean Inter
      this.bodies.inters.A.enable(1) 
      this.bodies.inters.A_bg.enable(1) 
      this.bodies.inters.B.rot_override = 0
      this.bodies.inters.C.c_axe.pos_override = 1    
      //_________________________________________________________________Clean Other

      //_________________________________________________________________Control
      this.set_phase_resolution_control_0( res_coef)

      //_________________________________________________________________Update
      this.state.switch_selection_happened_step = step
      this.update_step_count(step)
    }
    
    ////////////////////////////////////////////////////////////////////////////////////
    step = 1
    res_coef = this.state.steps[step].resoluton_coef
    do_it = this.state.current_step == step
    if( do_it )
    {         
      //_________________________________________________________________Clean Inter
      this.bodies.inters.B.enable(1) 
      this.bodies.inters.B_mask.enable(1) 
  
      this.bodies.inters.A.c_axe.pos_override = 1
      this.bodies.inters.C.c_axe.pos_override = 1

      //_________________________________________________________________Clean Other
      for( let i = 0; i < this.bodies.geos.rectangles.length; i++ )
        this.bodies.geos.rectangles[i].c_axe.pos_override = 1

      //_________________________________________________________________Control
      this.set_phase_resolution_control_2( res_coef)
      //_________________________________________________________________Mouse
      this.switch_selection_transition( step, selected_body, this.bodies.inters.A, this.bodies.inters.B)
      //_________________________________________________________________Update
      this.update_step_count(step)
    
    }  
  
    ////////////////////////////////////////////////////////////////////////////////////
    step = 2
    res_coef = this.state.steps[step].resoluton_coef
    do_it = this.state.current_step == step
    if( do_it )
    {
      //_________________________________________________________________Clean Inter
      this.bodies.inters.C.enable(1) 
      this.bodies.inters.C_bg.enable(1) 

      this.bodies.inters.A.c_axe.pos_override = 1
      this.bodies.inters.B.rot_override = rad(270)

      //_________________________________________________________________Clean Other
      this.bodies.geos.rectangles[0].enable(0)
      this.bodies.geos.rectangles[1].enable(0)
      this.bodies.geos.rectangles[2].enable(0)

      //_________________________________________________________________Control
      this.set_phase_resolution_control_4( res_coef)
      //_________________________________________________________________Mouse
      this.switch_selection_transition( step, selected_body, this.bodies.inters.B, this.bodies.inters.C) 
      //_________________________________________________________________Update
      //this.state.switch_selection_happened_step = step
      this.update_step_count(step)        
      
      if( this.anim_mode )
        this.m.setTranslation(this.screen_dims.x/2,this.screen_dims.y/2)
    } 
    ////////////////////////////////////////////////////////////////////////////////////
    step = 3
    res_coef = this.state.steps[step].resoluton_coef
    do_it = this.state.current_step == step
    if( do_it )
    {
      //_________________________________________________________________Clean Inter
      this.bodies.inters.A.c_axe.pos_override = 1
      this.bodies.inters.B.rot_override = rad(270)
      this.bodies.inters.C.c_axe.pos_override = -1

      //_________________________________________________________________Clean Other
      this.bodies.geos.rectangles[0].enable(0)
      this.bodies.geos.rectangles[1].enable(0)
      this.bodies.geos.rectangles[2].enable(0)

      for( let i=0; i < this.bodies.geos.trapezoids.length; i++ )
        this.bodies.geos.trapezoids[i].rot_override = this.bodies.geos.trapezoids[i].rot+ rad(270)+rad(45)   

      //_________________________________________________________________Control
      
      //_________________________________________________________________Mouse
      this.switch_selection_transition( step, selected_body, this.bodies.inters.B, this.bodies.inters.C) 
      //_________________________________________________________________Update
      //this.state.switch_selection_happened_step = step
      this.update_step_count(step) 

      //
      if( this.anim_mode == false )
      {
        let wait_time = 20
        let t = this.state.steps[step].update_count
        if( t < wait_time )
        {
          this.do_pre_explode_animation(t,0,wait_time)
        }
        else{
          this.do_explode(step)
        }  
      }
      else
      {
        //this.set_phase_resolution_control_4( 0.95)

        //this.bodies_cns_modif(0.0001, false, true)
        //this.bodies_axe_enable(false, false, true)   
        
        let y_offset = res_coef * this.screen_dims.y/2.*1.3 
        this.m.setTranslation(this.screen_dims.x/2,this.screen_dims.y/2+y_offset)

        //this.bodies.geos.circle.body.position.y = this.bodies.geos.circle.y + y_offset   
        //for( let i=0; i < this.bodies.geos.rectangles.length; i++ )
        //  this.bodies.geos.rectangles[i].body.position.y = this.bodies.geos.rectangles[i].y + y_offset     
        //
        //for( let i=0; i < this.bodies.geos.trapezoids.length; i++ )
        //  this.bodies.geos.trapezoids[i].body.position.y = this.bodies.geos.trapezoids[i].y + y_offset     
            
      
        }
    } 
   

   


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
 
    this.bodies_override_color(cInterp ['geos'])
    this.bodies_override_color_three(cInterp, ['geos'])
    
   
  }

  do_explode(step)
  {
    this.bodies_cns_modif(0.0001, ['geos'])
    this.bodies_axe_enable(false, ['geos'])
    
    // custom color
    this.bodies_override_color(null, ['geos'])
    this.bodies_override_color_three(null, ['geos'])


    //gravity
    this.bodies.geos.circle.apply_force( this.bodies.geos.circle.get_out_position('world'),
                                          new Vector(0, 0.05*0.13) )


    for( let i=0; i < this.bodies.geos.rectangles.length; i++ )
      this.bodies.geos.rectangles[i].apply_force( this.bodies.geos.rectangles[i].get_out_position('world'),
                                                  new Vector(0, 0.05*0.03) )  


    for( let i=0; i < this.bodies.geos.trapezoids.length; i++ )
      this.bodies.geos.trapezoids[i].apply_force( this.bodies.geos.trapezoids[i].get_out_position('world'),
                                                  new Vector(0, 0.05*0.03) )  




    if( this.state.steps[step].apply_force_happened == false )
    {
      
      let p_force = new Vector(this.m.get_row(2))
      let v_force = new Vector(-0.05,0)

      let _v = null

      this.bodies.geos.rectangles[3].apply_force(p_force,v_force)


      _v = new Vector(0,-0.01)
      this.bodies.geos.circle.apply_force( p_force, _v.add(v_force.getMult(2)) )
      _v = new Vector(0.05,-0.05)
      this.bodies.geos.trapezoids[0].apply_force( p_force, _v.add(v_force.getMult(2)) )
      _v = new Vector(0.05,0.05)
      this.bodies.geos.trapezoids[1].apply_force( p_force, _v.add(v_force.getMult(2)) ) 
      _v = new Vector(-0.05,0.05)
      this.bodies.geos.trapezoids[2].apply_force( p_force, _v.add(v_force.getMult(2)) ) 
      _v = new Vector(-0.05,-0.05)
      this.bodies.geos.trapezoids[3].apply_force( p_force, _v.add(v_force.getMult(2)) )
      
      this.state.steps[step].apply_force_happened = true
    }
  }  

  set_across_steps()
  {
    let a_inter2 = deg(this.bodies.inters.B.body.angle)
    let center_tmp = new Vector(this.m.get_row(2))

    for( let i = 0; i < this.bodies.geos.rectangles.length; i++)
      this.bodies.geos.rectangles[i].c_axe.axe_rotation_center = center_tmp
    for( let i = 0; i < this.bodies.geos.trapezoids.length; i++)
      this.bodies.geos.trapezoids[i].c_axe.axe_rotation_center = center_tmp

    this.bodies.geos.rectangles[0].c_axe.axe_rotation = Math.min( 270, a_inter2)
    this.bodies.geos.rectangles[1].c_axe.axe_rotation = Math.min( 90 , a_inter2)
    this.bodies.geos.rectangles[2].c_axe.axe_rotation = Math.min( 180, a_inter2)
    this.bodies.geos.rectangles[3].c_axe.axe_rotation = Math.min( 0  , a_inter2)

    for( let i = 0; i < this.bodies.geos.trapezoids.length; i++)
      this.bodies.geos.trapezoids[i].c_axe.axe_rotation = a_inter2
  
    this.bodies.inters.A.c_axe.axe_rotation = Math.min( 270, a_inter2) 
    this.bodies.inters.A.c_axe.axe_rotation_center = center_tmp
    this.bodies.inters.C.c_axe.axe_rotation = Math.min( 0  , a_inter2)
    this.bodies.inters.C.c_axe.axe_rotation_center = center_tmp
  }

  track_user_drag_error()
  {
    //for( let i = 0; i < this.show_step_helpers.length; i++)
    //  this.show_step_helpers[i] = 0
    
    if ( this.touch_enable == false )
      return 

    if( userIsInteracting )
    {
      
      this.mouse_pressed_positions_at_update.push( new Vector( mouseX , mouseY ) )    
      let size = this.mouse_pressed_positions_at_update.length
      if( 1 < size )
      {
        let p_first = this.mouse_pressed_positions_at_update[0]
        let p_last = this.mouse_pressed_positions_at_update[size-1]
        let v_delta = p_last.sub(p_first)
        
        if( 0.01 < v_delta.mag() )
        {
          
          let A = this.bodies.inters.A.is_selected
          let B = this.bodies.inters.B.is_selected
          let C = this.bodies.inters.C.is_selected
          if( (A == false)&&
              (B == false)&&
              (C == false))
          {
            this.bodies_override_color(utils.color.black, ['geos'])
            this.bodies_override_color_three(utils.color.black, ['geos'])

            this.bodies.geos.backgrounds[0].color = utils.color.red
            this.bodies.geos.backgrounds[1].color = utils.color.red
            this.bodies.geos.backgrounds[0].update_color_three()
            this.bodies.geos.backgrounds[1].update_color_three()
          }
          else
          {
            if(A && this.state.current_step == 0)this.show_step_helpers[0] = 100
            if(B && this.state.current_step == 1)this.show_step_helpers[1] = 100
            if(C && this.state.current_step == 2)this.show_step_helpers[2] = 100
          }
              
        }
      }
    }
    else if( 0 < this.mouse_pressed_positions_at_update.length )
    {
      this.bodies_override_color(null, ['geos'])
      this.bodies_override_color_three(null, ['geos'])
      this.color_background = utils.color.dark
      this.mouse_pressed_positions_at_update = []
    }
    else
    {
      this.mouse_pressed_positions_at_update = []
    }
  }

  update()
  {
    this.anim_mode =  this.resolution_coef_override != null
    this.set_across_steps()
    // resolution
    this.state.resolution_coef_last = this.state.resolution_coef
    this.get_resolution_coef_info()
    this.set_step_resolution()
    this.track_user_drag_error()
    this.bodies_update()
    this.draw_background()
    this.state.update_count += 1
  }


  ////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////// DRAW
  ////////////////////////////////////////////////////////////////////////////////////



  draw_help_three()
  {

    /////////////////////////////////////////////////
    if(this.show_step_helpers[0] )
    {
      let coef = this.show_step_helpers[0] / 100 
      this.bodies.helpers.stepA.transparency_line = 1.-coef
      this.show_step_helpers[0] -= 2
      this.bodies.helpers.stepA.update_color_three()
    }

    if(this.show_step_helpers[1] )
    {
      let coef = this.show_step_helpers[1] / 100 
      this.bodies.helpers.stepB.transparency_line = 1.-coef
      this.show_step_helpers[1] -= 2
      this.bodies.helpers.stepB.update_color_three()
    }

    if(this.show_step_helpers[2] )
    {
      let coef = this.show_step_helpers[2] / 100 
      this.bodies.helpers.stepC.transparency_line = 1.-coef
      this.show_step_helpers[2] -= 2
      this.bodies.helpers.stepC.update_color_three()
    }
    

  }  

  setup_shapes_three()
  {
    this.bodies_setup_shapes_three()
  }

  animate_three()
  {
    this.bodies_animate_three()
    this.draw_help_three()
  }



*/
}

