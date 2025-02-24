import fidget from '../core/fidget.js'
import { 
  utils, 
  clamp, 
  rad, 
  deg, 
  anim_vectors, 
  anim_values } from '../utils/utils.js'
import { body_build } from '../core/body.js'
import Vector from '../utils/vector.js'
import Matrix from '../utils/matrix.js'
import { materials } from '../core/shader.js'
import { effect } from '../core/effect.js'

export default class fidget_daft_i extends fidget {

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
    //this.end_step = 4
    this.set_end_step( 4 )
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
      ...this.opts_global,
      ...opts_debug,
      scale_shape: this.s,
      type: 'sparcle_shock'
    }

    let opts_bones_main = {
      ...this.opts_global,
      ...opts_collision_no_interaction,
      ...opts_debug,      
      visibility: false,
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
      ...this.opts_global,
      ...opts_collision_no_interaction,
      ...opts_debug,      
      visibility: false,
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
      ...this.opts_global,
      ...opts_collision_mouse_interaction,
      ...opts_debug,         
      visibility: false,
      do_shape: true,
      do_line: true,
      color: utils.color.grey,
      color_line: utils.color.black,
      material_three: materials.simple.text_checker_three_grey,
      density: inter_step_denstity,
      selection_break_length: inter_step_selection_break_length      
    }

    let opts_geo = {
    ...this.opts_global,
    ...opts_collision_activate,
    ...opts_debug,
    m_offset: new Matrix(),
    do_shape: true,
    do_line: true,
    color_line: utils.color.black,
    density: 0.0022/this.s,
    }

    //////////////////////////////////////////////////////////////////////////



    this.title = 'dafti'

    this.bodies.store = {
      inters: {
        background: null,
        circle: null,
        rectangle: null,
        rectangles: []
      },
      inters_step: {
        steps: [],
        steps_instances: []
      },
      geos: {
        backgrounds: [],
        circle: null,
        rectangle: null,
        rectangles: []
      },
      bones: {
        rectangles: [],
        rectangles_pivots: [],
        rectangles_center: null,
        rectangle: null,
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

    this.bodies.store.bones.world = new body_build({
      ...opts_bones_main,
      name: 'bones_world',
    })

    this.bodies.store.geos.backgrounds.push( new body_build({
      ...this.opts_global,
      ...opts_collision_no_interaction,
      ...opts_debug,
      dynamic: false,
      name: 'geos_background_L_',
      parent: this.bodies.store.bones.world,
      m_offset: new Matrix().setTranslation(this.screen_dims.x/4,this.screen_dims.y/2),
      m_shape: new Matrix().setScale(this.screen_dims.x/2, this.screen_dims.y),
      type: utils.shape.rectangle,
      material_three: materials.old_custom_exemple, //materials.background.space_grid ,
      visibility: this.do_background,
    }) )
    this.bodies.store.geos.backgrounds.push(this.bodies.store.geos.backgrounds[0].get_mirror(false, true))

    this.bodies.store.bones.traj = new body_build({
      ...opts_bones_main,
      name: 'bones_traj',
      parent: this.bodies.store.bones.world,
      constraint_to_parent: true,
      m_offset: this.m,
    })
    
    if (this.is_dynamic)
      this.bodies.store.inters.background = new body_build({
        ...opts_inter_step,
        ...opts_collision_no_interaction,
        name: 'inters_background',
        parent: this.bodies.store.bones.traj,
        m_offset: new Matrix(),
        m_shape: new Matrix().setScale(145*this.s,92*this.s),
        type: utils.shape.rectangle,
        frictionAir: 0.3,
        constraints: [
          {
            name: 'point',
            type: 'dyn_point',
            target: this.bodies.store.bones.traj,
            stiffness: 0.05,
            damping: 0.01,
            length: 0.01
          },
          {
            name: 'orient',
            type: 'dyn_orient',
            target: this.bodies.store.bones.traj,
            stiffness: 0.2,
            damping: 0.01,
            length: 0.01
          },
          {
            name: 'rot_limit',
            type: 'kin_limit',
            target: this.bodies.store.bones.traj,
            x_min: -50,
            x_max: 50,
            y_min: -50,
            y_max: 50,
            rot_min: rad(-20),
            rot_max: rad(20),
            limit_lock: false
          }
        ],
      })
    
    this.bodies.store.bones.root = new body_build({
      ...opts_bones_main,
      dynamic: false,
      name: 'bones_root',
      parent: this.is_dynamic ? this.bodies.store.inters.background : this.bodies.store.bones.traj,
      constraint_to_parent: true,
    })
    

    //////////////////////////////////////////////////////////////////////////////////////////// CUSTOM
    

    if( this.is_dynamic )
    {

      this.bodies.store.inters_step.steps.push([
        new body_build({       
          ...opts_inter_step,
          name: 'inters_A_T__L_',
          parent: this.bodies.store.inters.background,
          m_offset: new Matrix().setTranslation(-59*this.s,-22.7*this.s),
          m_shape: new Matrix().setScale(41.5*this.s),
          type: utils.shape.circle,
          constraints: [
            { name: 'point', type: 'dyn_point', target: this.bodies.store.inters.background, ...opts_cns_disable_at_select},
            { name: 'orient', type: 'kin_orient', target: this.bodies.store.inters.background},
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
      this.bodies.store.inters_step.steps[0][0].get_resolution_coef = function(){
        return clamp(this.physics.relations.constraints.axe.update_and_get_current_pos(), 0, 1)
      }
      this.bodies.store.inters_step.steps[0][0].set_resolution_coef = function(res = null){this.physics.relations.constraints.axe.current_pos = res}

      this.bodies.store.inters_step.steps.push(
        new body_build({
          ...opts_inter_step,
          name: 'inters_B',
          parent: this.bodies.store.inters.background,
          m_offset: new Matrix(),
          m_shape: new Matrix().setScale(83*this.s,21*this.s),
          type: utils.shape.rectangle,
          constraints: [
            this.debug_mode.inter_step_physics
              ? {
                  name: 'point',
                  type: 'dyn_point',
                  target: this.bodies.store.inters.background,
                  stiffness: 0.999,
                  damping: 0.1,
                  length: 0.01
                }
              : {name: 'point',type: 'kin_point',target: this.is_dynamic  ? this.bodies.store.inters.background  : this.bodies.store.bones.traj},
            { name: 'orient', type: 'dyn_orient', target: this.bodies.store.inters.background, ...opts_cns_disable_at_select},
            {
              name: 'rot_limit',
              type: 'kin_limit',
              obj: this,
              rot_min: rad(0),
              rot_max: rad(90.5),
              limit_lock: true,
              transfer_delta_as_parent_force: this.debug_mode.inter_step_physics
            }
          ],

        })
      )
      

      this.bodies.store.inters_step.steps[1].get_resolution_coef = function () {return clamp(deg(this.physics.get_out_rotation('base')) / 90.0, 0, 1)}
      this.bodies.store.inters_step.steps[1].set_resolution_coef = function (res = null) {if (res != null)this.physics.set_out_rotation(rad(res * 90.5), 'world', 'override')}

      if (this.debug_mode.inter_step_physics == false)
        this.bodies.store.inters_step.steps[1].physics.relations.constraints_args.push({name: 'point_no_dyn', type: 'kin_point', target: this.is_dynamic ? this.bodies.store.inters.background : this.bodies.store.bones.traj})


      this.bodies.store.inters_step.steps.push(
        new body_build({
          ...opts_inter_step,

          name: 'inters_C',
          m_offset: new Matrix(),
          m_shape: new Matrix().setScale(21*this.s,83*this.s),
          parent: this.bodies.store.inters.background,

          type: utils.shape.rectangle,

          constraints: [
            { name: 'point', type: 'dyn_point', target: this.bodies.store.inters.background,...opts_cns_disable_at_select},
            { name: 'orient', type: 'kin_orient', target: this.bodies.store.inters.background },
            {
              name: 'axe',
              type: 'kin_axe',
              axe: 1,
              distPos: 50 * this.s,
              distNeg: 0.001,
              limit_lock: 1,
              transfer_delta_as_parent_force: this.debug_mode.inter_step_physics
            }
          ],

        })
      )
      this.bodies.store.inters_step.steps[2].get_resolution_coef = function () {return clamp(this.physics.relations.constraints.axe.current_pos, 0, 1)}
      this.bodies.store.inters_step.steps[2].set_resolution_coef = function (res = null) {this.physics.relations.constraints.axe.current_pos = res}
    }

    
  

    let bone_circle_opts = {
      ...opts_visual_bones,
      name: 'bones_circle',
      parent: this.bodies.store.bones.root,
      constraint_to_parent: true,
      constraints:[],
    }
    
    if (this.is_dynamic) {
      bone_circle_opts.constraints.push({
        name: 'connect_scale_iA',
        type: 'connect_multi',
        attr: 's',
        targets: [
          this.bodies.store.inters_step.steps[0][0],
          this.bodies.store.inters_step.steps[2]
        ],
        targets_attr: ['ty', 'ty'],
        targets_space: ['base', 'base'],
        targets_remap: [
          [0, 55 * (this.s / 2.2), 1, 1.82],
          [0, 110 * (this.s / 2.2), 0, 0.45 - 1.82]
        ]
      })
    }
    this.bodies.store.bones.circle = new body_build(bone_circle_opts)

    this.bodies.store.geos.circle = new body_build({
      ...opts_geo,
      name: 'geos_circle',
      parent: this.bodies.store.bones.circle,
      m_shape: new Matrix().setScale(50*this.s),
      type: utils.shape.circle,

      material_three: materials.raw_shader_exemple, //three_utils.material.simple.cyan_grid ,
      constraint_to_parent: true,
      constraints: [
        { name: 'connect_scale_bone',
          type: 'connect',
          target: this.bodies.store.bones.circle,
          attr: 's',
          target_attr: 's'
        }
      ],
    })



    this.bodies.store.bones.rectangles_center = new body_build({
      ...opts_visual_bones,
      name: 'bones_rectangle_center',
      parent: this.bodies.store.bones.root,
      constraint_to_parent: true,
    })
    

    let rectangle_pivot_opts = {
      ...opts_visual_bones,
      name: 'bones_rectangle_pivot_T__L_',
      parent: this.bodies.store.bones.rectangles_center,
      m_offset: new Matrix().setTranslation(-29.5*this.s, 0),
      m_transform: new Matrix().setRotation(rad(35)),
      constraint_to_parent: true,
      constraints: [],
    }
    
    if (this.is_dynamic) {

      rectangle_pivot_opts.constraints.push({
        name: 'connect_rot_iA',
        type: 'connect',
        target: this.bodies.store.inters_step.steps[0][0],
        attr: 'r',
        target_attr: 'ty',
        target_space: 'base',
        target_remap: [0, 55, 15.9*this.s, 0]
      })

      rectangle_pivot_opts.constraints.push({
        name: 'connect_tx_iB',
        type: 'connect_multi',
        attr: 'tx',
        targets: [
          this.bodies.store.inters_step.steps[1],
          this.bodies.store.inters_step.steps[2]
        ],
        targets_attr: ['r', 'ty'],
        targets_space: ['base', 'base'],
        targets_remap: [
          [0, 90, 0, 85 * (this.s / 2.2)],
          [0, 110 * (this.s / 2.2), 0, 140 * (this.s / 2.2) - 85 * (this.s / 2.2)]
        ]
      })

    }

    this.bodies.store.bones.rectangles_pivots.push(new body_build(rectangle_pivot_opts))

    this.bodies.store.bones.rectangles.push(
      new body_build({
        ...opts_visual_bones,
        name: 'bones_rectangle_T__L_',
        parent: this.bodies.store.bones.rectangles_pivots[0],
        constraint_to_parent: true,
        m_offset: new Matrix().setTranslation(-36.4*this.s, 0),
      })
    )

    let opts_rectangles = {
      ...opts_geo,
      name: 'geos_rectangle_T__L_',
      type: utils.shape.rectangle,
      parent: this.bodies.store.bones.rectangles[0],
      constraint_to_parent: true,
      m_shape: new Matrix().setScale(16*this.s,3.5*this.s),
      material_three: materials.raw_shader_exemple, //materials.simple.gradient_yellow_green_oblique_line_A ,
    }
    this.bodies.store.geos.rectangles.push(new body_build(opts_rectangles))
    
    
    if (this.is_dynamic) {

      this.effects.trailA = new effect({
        ...opts_rectangles,
        ...opts_effect_trail,
        body: this.bodies.store.geos.rectangles[0],
        trigger_body_max: this.bodies.store.inters_step.steps[1],
        trigger_value_max: 0.01
      })

    }

    // TOP RIGHT
    let axe_x = false
    let axe_y = true
    if(this.is_dynamic)
      this.bodies.store.inters_step.steps[0].push(this.bodies.store.inters_step.steps[0][0].get_mirror(axe_x, axe_y))
    this.bodies.store.bones.rectangles_pivots.push(  this.bodies.store.bones.rectangles_pivots[0].get_mirror(axe_x, axe_y))
    this.bodies.store.bones.rectangles.push(  this.bodies.store.bones.rectangles[0].get_mirror(axe_x, axe_y))
    this.bodies.store.geos.rectangles.push(  this.bodies.store.geos.rectangles[0].get_mirror(axe_x, axe_y))

    // BOTTOM LEFT
    axe_x = true
    axe_y = false
    if(this.is_dynamic)
      this.bodies.store.inters_step.steps[0].push(  this.bodies.store.inters_step.steps[0][0].get_mirror(axe_x, axe_y))
    this.bodies.store.bones.rectangles_pivots.push(  this.bodies.store.bones.rectangles_pivots[0].get_mirror(axe_x, axe_y))
    this.bodies.store.bones.rectangles.push(  this.bodies.store.bones.rectangles[0].get_mirror(axe_x, axe_y))
    this.bodies.store.geos.rectangles.push(  this.bodies.store.geos.rectangles[0].get_mirror(axe_x, axe_y))
    
    // BOTTOM RIGHT
    axe_x = true
    axe_y = true
    if(this.is_dynamic)
      this.bodies.store.inters_step.steps[0].push(  this.bodies.store.inters_step.steps[0][0].get_mirror(axe_x, axe_y))
    this.bodies.store.bones.rectangles_pivots.push(  this.bodies.store.bones.rectangles_pivots[0].get_mirror(axe_x, axe_y))
    this.bodies.store.bones.rectangles.push(  this.bodies.store.bones.rectangles[0].get_mirror(axe_x, axe_y))
    this.bodies.store.geos.rectangles.push(  this.bodies.store.geos.rectangles[0].get_mirror(axe_x, axe_y))

    if (this.is_dynamic) {
      this.bodies.store.inters_step.steps[0][0].relations.highlight_bodies_when_selected = [  this.bodies.store.geos.rectangles[0]]
      this.bodies.store.inters_step.steps[0][1].relations.highlight_bodies_when_selected = [  this.bodies.store.geos.rectangles[1]]
      this.bodies.store.inters_step.steps[0][2].relations.highlight_bodies_when_selected = [  this.bodies.store.geos.rectangles[2]]
      this.bodies.store.inters_step.steps[0][3].relations.highlight_bodies_when_selected = [  this.bodies.store.geos.rectangles[3]]
    }
    
    this.bodies.store.bones.rectangle = new body_build({
      ...opts_visual_bones,
      name: 'bones_rectangle',
      parent: this.bodies.store.bones.root,
      constraint_to_parent: true,
    })


    let oRectangle = {
      ...opts_geo,
      name: 'geos_rectangle',
      parent: this.bodies.store.bones.rectangle,
      m_shape: new Matrix().setScale(74*this.s,18*this.s),
      type: utils.shape.rectangle,
      material_three: materials.raw_shader_exemple, //materials.background_test, //materials.simple.gradient_gold_red_A ,
      constraint_to_parent: true,
      constraints: [],
    }

    if (this.is_dynamic) {
      oRectangle.constraints.push({
        name: 'connect_rot_iB',
        type: 'connect',
        target: this.bodies.store.inters_step.steps[1],
        attr: 'r',
        target_attr: 'r',
        target_space: 'base',
        target_remap: null
      })

      oRectangle.constraints.push({
        name: 'connect_ty_iC',
        type: 'connect',
        target: this.bodies.store.inters_step.steps[2],
        attr: 'ty',
        target_attr: 'ty',
        target_space: 'base',
        target_remap: null
      })
    }

    this.bodies.store.geos.rectangle = new body_build(oRectangle)

    if (this.is_dynamic)
    {

      this.bodies.store.inters_step.steps[1].relations.highlight_bodies_when_selected = [  this.bodies.store.geos.rectangle]
      this.bodies.store.inters_step.steps[2].relations.highlight_bodies_when_selected = [  this.bodies.store.geos.rectangle]

    this.effects.trailB = new effect({
        ...oRectangle,
        ...opts_effect_trail,
        body: this.bodies.store.geos.rectangle,
        trigger_body_min: this.bodies.store.inters_step.steps[0][0],
        trigger_value_min: 0.99,
        trigger_body_max: this.bodies.store.inters_step.steps[2],
        trigger_value_max: 1.0
      })

      /////////////////////////////////////////////
     

      this.effects.sparcles_shock_A = new effect({
        ...opts_sparcles_shock,
        name: 'colA',
        trigger_body_min: this.bodies.store.inters_step.steps[0][0],
        trigger_value_min: 0.99,
        parent: this.bodies.store.inters.background,
        p: new Vector(-66*this.s, 6.8*this.s),
        r: 0
      })

      this.effects.sparcles_shock_B = new effect({
        ...opts_sparcles_shock,
        name: 'colB',
        trigger_body_min: this.bodies.store.inters_step.steps[1],
        trigger_value_min: 0.99,
        parent: this.bodies.store.inters.background,
        p: new Vector(6.8*this.s, -36*this.s),
        r: -90
      })

      this.effects.sparcles_shock_C = new effect({
        ...opts_sparcles_shock,
        name: 'colC',
        trigger_body_min: this.bodies.store.inters_step.steps[2],
        trigger_value_min: 0.99,
        parent: this.bodies.store.inters.background,
        p: new Vector(0, 91*this.s),
        r: 0
      })

      this.bodies.create_inter_from_geos(
        ['circle', 'rectangle', 'rectangles'],
        this.bodies.store.inters.background,
        this.s
      )

      /*
      this.create_bones_from_geos(
        ['circle',
        'rectangle',
        'rectangles'], s )        
        */
    }
    
    if(this.is_dynamic)
      this.bodies.instance_each_others(
        [
          this.bodies.store.inters_step.steps[0][0],
          this.bodies.store.inters_step.steps[0][1],
          this.bodies.store.inters_step.steps[0][2],
          this.bodies.store.inters_step.steps[0][3]
        ],
        [false, false, 
          true, false, 
          false, true, 
          true, true]
      )

    
    this.bodies.draw_order = [
      this.bodies.store.geos.backgrounds[0],
      this.bodies.store.geos.backgrounds[1],
      this.bodies.store.inters.background,
      this.bodies.store.inters.circle,
      this.bodies.store.inters.rectangle,
      this.bodies.store.inters.rectangles[0],
      this.bodies.store.inters.rectangles[1],
      this.bodies.store.inters.rectangles[2],
      this.bodies.store.inters.rectangles[3],
      this.is_dynamic ? this.bodies.store.inters_step.steps[0][0]:null,
      this.is_dynamic ? this.bodies.store.inters_step.steps[0][1]:null,
      this.is_dynamic ? this.bodies.store.inters_step.steps[0][2]:null,
      this.is_dynamic ? this.bodies.store.inters_step.steps[0][3]:null,
      this.is_dynamic ? this.bodies.store.inters_step.steps[1]:null,
      this.is_dynamic ? this.bodies.store.inters_step.steps[2]:null,
      this.bodies.store.geos.circle,
      this.effects.trailA,
      this.effects.trailB,
      this.bodies.store.geos.rectangle,
      this.bodies.store.geos.rectangles[0],
      this.bodies.store.geos.rectangles[1],
      this.bodies.store.geos.rectangles[2],
      this.bodies.store.geos.rectangles[3],
      this.effects.sparcles_shock_A,
      this.effects.sparcles_shock_B,
      this.effects.sparcles_shock_C,
      this.bodies.store.bones.world,
      this.bodies.store.bones.traj,
      this.bodies.store.bones.root,
      this.bodies.store.bones.circle,
      this.bodies.store.bones.rectangle,
      this.bodies.store.bones.rectangles_center,
      this.bodies.store.bones.rectangles_pivots[0],
      this.bodies.store.bones.rectangles_pivots[1],
      this.bodies.store.bones.rectangles_pivots[2],
      this.bodies.store.bones.rectangles_pivots[3],
      this.bodies.store.bones.rectangles[0],
      this.bodies.store.bones.rectangles[1],
      this.bodies.store.bones.rectangles[2],
      this.bodies.store.bones.rectangles[3]
    ]
    

    this.z_depth_end = this.render.draw_order_to_body_z( args.z_depth_start,0.5)

    this.physics.Mouse.z = this.z_depth_end

    this.physics.Mouse.z = this.z_depth_end

    this.bodies.build_order = this.bodies.get_build_order()


    this.bodies.eval_order = [
      'bones','world',
      'geos','backgrounds',

      'bones','traj',

      'inters','background',
      'inters','circle',
      'inters','rectangle',
      'inters','rectangles',
      'inters_step','steps',

      'bones','root',

      'bones','circle',
      'bones','rectangle',
      'bones','rectangles_center',
      'bones','rectangles_pivots',
      'bones','rectangles',

      'geos','circle',
      'geos','rectangle',
      'geos','rectangles'
    ]
    
    this.physics.steps_info = [
      ///////////////////////////////////////////////////////////////////////////////////// 0
      {
        bodies_enable: [
          this.is_dynamic ? this.bodies.store.inters_step.steps[0][0]:null,
          this.is_dynamic ? this.bodies.store.inters_step.steps[0][1]:null,
          this.is_dynamic ? this.bodies.store.inters_step.steps[0][2]:null,
          this.is_dynamic ? this.bodies.store.inters_step.steps[0][3]:null,
          this.bodies.store.inters.background,
          this.bodies.store.inters.circle,
          this.bodies.store.inters.rectangle,
          this.bodies.store.inters.rectangles[0],
          this.bodies.store.inters.rectangles[1],
          this.bodies.store.inters.rectangles[2],
          this.bodies.store.inters.rectangles[3],
          this.bodies.store.geos.backgrounds[0],
          this.bodies.store.geos.backgrounds[1],
          this.bodies.store.geos.circle,
          this.bodies.store.geos.rectangle,
          this.bodies.store.geos.rectangles[0],
          this.bodies.store.geos.rectangles[1],
          this.bodies.store.geos.rectangles[2],
          this.bodies.store.geos.rectangles[3],
          this.bodies.store.bones.rectangles[0],
          this.bodies.store.bones.rectangles[1],
          this.bodies.store.bones.rectangles[2],
          this.bodies.store.bones.rectangles[3],
          this.bodies.store.bones.world,
          this.bodies.store.bones.traj,
          this.bodies.store.bones.root,
          this.bodies.store.bones.circle,
          this.bodies.store.bones.rectangle,
          this.bodies.store.bones.rectangles_center,
          this.bodies.store.bones.rectangles_pivots[0],
          this.bodies.store.bones.rectangles_pivots[1],
          this.bodies.store.bones.rectangles_pivots[2],
          this.bodies.store.bones.rectangles_pivots[3]
        ],

        constraints_disable: [
          'geos',
          'rectangle',
          null,
          'connect_rot_iB',
          'geos',
          'rectangle',
          null,
          'connect_ty_iC'
        ],
        switch_selection_transition:null,
      }, ///////////////////////////////////////////////////////////////////////////////////// 1
      {
        bodies_enable: [
          this.bodies.store.inters_step.steps[1],
          this.bodies.store.inters.background,
          this.bodies.store.inters.circle,
          //this.bodies.store.inters.rectangle,
          //this.bodies.store.inters.rectangles[0],
          //this.bodies.store.inters.rectangles[2],
          this.bodies.store.geos.backgrounds[0],
          this.bodies.store.geos.backgrounds[1],
          this.bodies.store.geos.circle,
          this.bodies.store.geos.rectangle,
          this.bodies.store.geos.rectangles[0],
          this.bodies.store.geos.rectangles[1],
          this.bodies.store.geos.rectangles[2],
          this.bodies.store.geos.rectangles[3],
          this.bodies.store.bones.rectangles[0],
          this.bodies.store.bones.rectangles[1],
          this.bodies.store.bones.rectangles[2],
          this.bodies.store.bones.rectangles[3],
          this.bodies.store.bones.world,
          this.bodies.store.bones.traj,
          this.bodies.store.bones.root,
          this.bodies.store.bones.circle,
          this.bodies.store.bones.rectangle,
          this.bodies.store.bones.rectangles_center,
          this.bodies.store.bones.rectangles_pivots[0],
          this.bodies.store.bones.rectangles_pivots[1],
          this.bodies.store.bones.rectangles_pivots[2],
          this.bodies.store.bones.rectangles_pivots[3]
        ],
        constraints_disable: ['geos', 'rectangle', null, 'connect_ty_iC'],
        switch_selection_transition:false,
      }, ///////////////////////////////////////////////////////////////////////////////////// 2
      {
        bodies_enable: [
          this.is_dynamic ? this.bodies.store.inters_step.steps[2] : null,
          this.bodies.store.inters.background,
          this.bodies.store.inters.circle,
          //this.bodies.store.inters.rectangle,
          //this.bodies.store.inters.rectangles[0],
          //this.bodies.store.inters.rectangles[2],
          this.bodies.store.geos.backgrounds[0],
          this.bodies.store.geos.backgrounds[1],
          this.bodies.store.geos.circle,
          this.bodies.store.geos.rectangle,
          this.bodies.store.geos.rectangles[0],
          this.bodies.store.geos.rectangles[1],
          this.bodies.store.geos.rectangles[2],
          this.bodies.store.geos.rectangles[3],
          this.bodies.store.bones.rectangles[0],
          this.bodies.store.bones.rectangles[1],
          this.bodies.store.bones.rectangles[2],
          this.bodies.store.bones.rectangles[3],
          this.bodies.store.bones.world,
          this.bodies.store.bones.traj,
          this.bodies.store.bones.root,
          this.bodies.store.bones.circle,
          this.bodies.store.bones.rectangle,
          this.bodies.store.bones.rectangles_center,
          this.bodies.store.bones.rectangles_pivots[0],
          this.bodies.store.bones.rectangles_pivots[1],
          this.bodies.store.bones.rectangles_pivots[2],
          this.bodies.store.bones.rectangles_pivots[3]
        ],
        constraints_disable: [],
        switch_selection_transition:true,
      }, ///////////////////////////////////////////////////////////////////////////////////// 3
      {
        bodies_enable: [
          this.bodies.store.geos.backgrounds[0],
          this.bodies.store.geos.backgrounds[1],
          this.bodies.store.geos.circle,
          this.bodies.store.geos.rectangle,
          this.bodies.store.geos.rectangles[0],
          this.bodies.store.geos.rectangles[1],
          this.bodies.store.geos.rectangles[2],
          this.bodies.store.geos.rectangles[3]
        ],
        constraints_disable: ['inters_step', 'steps', 2, 'point']
      }
    ]

    this.bodies.physics.init_physics()
    this.bodies.physics.init_constraints()

    
  }

  animation_idle() {
    
    this.bodies.physics.set_dynamic(false)
    this.bodies.physics.constraints_enable(false, ['bones'])

    let t = this.Game_engine.time
    this.bodies.store.bones.traj.physics.set_out_position(
      new Vector(Math.sin(t * 0.01) * 10, Math.sin(t * 0.05) * 10),
      'base',
      'override'
    )
    this.bodies.store.bones.traj.physics.set_out_rotation(
      Math.sin(t * 0.03) * 0.1,
      'base',
      'override'
    )

    this.bodies.store.bones.rectangles_pivots[0].physics.set_out_rotation(
      Math.sin(t * 0.04) * rad(-10),
      'base',
      'override'
    )
    this.bodies.store.bones.rectangles_pivots[1].physics.set_out_rotation(
      Math.sin(t * 0.04) * rad(10),
      'base',
      'override'
    )
    this.bodies.store.bones.rectangles_pivots[2].physics.set_out_rotation(
      Math.sin(t * 0.04) * rad(-10),
      'base',
      'override'
    )
    this.bodies.store.bones.rectangles_pivots[3].physics.set_out_rotation(
      Math.sin(t * 0.04) * rad(10),
      'base',
      'override'
    )
  }

  animation_entrance() {
    let start_time = 0
    let t = this.Game_engine.time
    let anim_duration = 100

    if (start_time + anim_duration == t) {
      this.bodies.physics.set_dynamic()
      this.bodies.physics.constraints_enable(true, ['bones'])
      this.physics.constraints_enable(false, this.physics.steps_info[0].constraints_disable)
      return false
    }
    if (start_time + anim_duration < t) {
      return false
    }

    this.bodies.physics.set_dynamic(false)
    this.bodies.physics.constraints_enable(false, ['bones'])

    let times = [start_time + 0, start_time + 20]
    let positions = [new Vector(0, 500), new Vector(0, 0)]
    let rotations = []
    let scales = []
    let interp_modes = ['linear']

    this.bodies.store.bones.traj.physics.set_out_position(
      anim_vectors(t, times, positions, interp_modes),
      'base',
      'override'
    )

    times = [start_time + 20, start_time + 30, start_time + 50]
    positions = [new Vector(0, 110), new Vector(0, 0), new Vector(0, 0)]
    rotations = [rad(90), rad(90), rad(0)]
    scales = []
    interp_modes = ['linear', 'smooth']

    this.bodies.store.bones.rectangle.physics.set_out_position(
      anim_vectors(t, times, positions, interp_modes),
      'base',
      'override'
    )
    this.bodies.store.bones.rectangle.physics.set_out_rotation(
      anim_values(t, times, rotations, interp_modes),
      'base',
      'override'
    )

    positions = []
    rotations = []
    scales = [0.45, 2, 1]
    interp_modes = ['linear', 'smooth']

    this.bodies.store.bones.circle.physics.set_out_scale(
      anim_values(t, times, scales, interp_modes),
      'base',
      'override'
    )

    scales = []
    interp_modes = ['linear', 'smooth']

    rotations = [rad(35), rad(35), rad(0)]
    positions = [new Vector(-75, 0), new Vector(65, 0), new Vector(65, 0)]
    this.bodies.store.bones.rectangles_pivots[0].physics.set_out_position(
      anim_vectors(t, times, positions, interp_modes),
      'parent',
      'override'
    )
    this.bodies.store.bones.rectangles_pivots[0].physics.set_out_rotation(
      anim_values(t, times, rotations, interp_modes),
      'base',
      'override'
    )

    rotations = [rad(35), rad(35), rad(0)]
    positions = [new Vector(75, 0), new Vector(-65, 0), new Vector(-65, 0)]
    this.bodies.store.bones.rectangles_pivots[2].physics.set_out_position(
      anim_vectors(t, times, positions, interp_modes),
      'parent',
      'override'
    )
    this.bodies.store.bones.rectangles_pivots[2].physics.set_out_rotation(
      anim_values(t, times, rotations, interp_modes),
      'base',
      'override'
    )

    rotations = [rad(-35), rad(-35), rad(0)]
    positions = [new Vector(-75, 0), new Vector(65, 0), new Vector(65, 0)]
    this.bodies.store.bones.rectangles_pivots[1].physics.set_out_position(
      anim_vectors(t, times, positions, interp_modes),
      'parent',
      'override'
    )
    this.bodies.store.bones.rectangles_pivots[1].physics.set_out_rotation(
      anim_values(t, times, rotations, interp_modes),
      'base',
      'override'
    )

    rotations = [rad(-35), rad(-35), rad(0)]
    positions = [new Vector(75, 0), new Vector(-65, 0), new Vector(-65, 0)]
    this.bodies.store.bones.rectangles_pivots[3].physics.set_out_position(
      anim_vectors(t, times, positions, interp_modes),
      'parent',
      'override'
    )
    this.bodies.store.bones.rectangles_pivots[3].physics.set_out_rotation(
      anim_values(t, times, rotations, interp_modes),
      'base',
      'override'
    )

    return true
  }
}
