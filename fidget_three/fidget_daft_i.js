import fidget from './fidget.js'
import { utils, clamp, rad, deg, anim_vectors, anim_values } from './utils.js'
import { body_build } from './body.js'
import Vector from './vector.js'
import Matrix from './matrix.js'
import { materials } from './shader.js'
import { effect } from './effect.js'

export default class fidget_daft_i extends fidget {

  constructor (
    m,
    s,
    screen_dims,
    z_depth_start,
    do_background,
    is_dynamic = true,
    shaders = [],
    debug = false,
    random_color = true
  ) {
    super(m, s, screen_dims, do_background, shaders, debug)

    ///////////////////////////////////////////////////////////////////////////////////////////
    let visual_bones_main_size = 150*s
    let bones_density_value = 0.44/s
    let inter_step_denstity = 0.022/s //0.01 / (s / 2.2) 
    let inter_step_selection_break_length = this.debug_mode.mouse_selection_break_length * (s / 2.2)

    ///////////////////////////////////////////////////////////////////////////////////////////
    this.is_dynamic = is_dynamic
    
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
      debug_matrix_axes: debug.matrix_axes,
      debug_cns_axes: debug.cns_axes,
      debug_force_visibility: debug.force_visibility
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
      scale_shape: s,
      parent: this.bodies.inters.background,
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
      m_shape: new Matrix().setScale(4*s), 
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
    density: 0.0022/s,
    }

    //////////////////////////////////////////////////////////////////////////



    this.title = 'dafti'

    this.bodies = {
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
      },
      helpers: {
        stepA: null,
        stepB: null,
        stepC: null
      }
    }

    this.effects = {
      trailA: null,
      trailB: null,
      sparcles_shock_A: null,
      sparcles_shock_B: null,
      sparcles_shock_C: null
    }

    this.play_animation = null
    this.animations = {
      entrance: this.override_with_animation_reverse_build,
      idle: this.override_with_idle
    }

    ////////////////////////////////////////////////////////////////////////////////////////////

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
        m_shape: new Matrix().setScale(145*s,92*s),
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
          {
            name: 'rot_limit',
            type: 'kin_limit',
            target: this.bodies.bones.traj,
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
    
    this.bodies.bones.root = new body_build({
      ...opts_bones_main,
      dynamic: false,
      name: 'bones_root',
      parent: this.is_dynamic ? this.bodies.inters.background : this.bodies.bones.traj,
      constraint_to_parent: true,
    })

    if (this.is_dynamic) {
      this.bodies.inters_step.steps.push([
        new body_build({       
          ...opts_inter_step,
          name: 'inters_A_T__L_',
          parent: this.bodies.inters.background,
          m_offset: new Matrix().setTranslation(-59*s,-22.7*s),
          m_shape: new Matrix().setScale(41.5*s),
          type: utils.shape.circle,
          constraints: [
            { name: 'point', type: 'dyn_point', target: this.bodies.inters.background, ...opts_cns_disable_at_select},
            { name: 'orient', type: 'kin_orient', target: this.bodies.inters.background},
            {
              name: 'axe',
              type: 'kin_axe',
              axe: 1,
              distPos: 25 * s,
              distNeg: 0.001,
              limit_lock: 1,
              transfer_delta_as_parent_force: this.debug_mode.inter_step_physics
            }
          ],

        })
      ])
      this.bodies.inters_step.steps[0][0].get_resolution_coef = function(){return clamp(this.constraints.axe.update_and_get_current_pos(), 0, 1)}
      this.bodies.inters_step.steps[0][0].set_resolution_coef = function(res = null){this.constraints.axe.current_pos = res}

      this.bodies.inters_step.steps.push(
        new body_build({
          ...opts_inter_step,
          name: 'inters_B',
          parent: this.bodies.inters.background,
          m_offset: new Matrix(),
          m_shape: new Matrix().setScale(83*s,21*s),
          type: utils.shape.rectangle,
          constraints: [
            this.debug_mode.inter_step_physics
              ? {
                  name: 'point',
                  type: 'dyn_point',
                  target: this.bodies.inters.background,
                  stiffness: 0.999,
                  damping: 0.1,
                  length: 0.01
                }
              : {name: 'point',type: 'kin_point',target: this.is_dynamic  ? this.bodies.inters.background  : this.bodies.bones.traj},
            { name: 'orient', type: 'dyn_orient', target: this.bodies.inters.background, ...opts_cns_disable_at_select},
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
      this.bodies.inters_step.steps[1].get_resolution_coef = function () {return clamp(deg(this.get_out_rotation('base')) / 90.0, 0, 1)}
      this.bodies.inters_step.steps[1].set_resolution_coef = function (res = null) {if (res != null)this.set_out_rotation(rad(res * 90.5), 'world', 'override')}

      if (this.debug_mode.inter_step_physics == false)
        this.bodies.inters_step.steps[1].constraints_args.push({name: 'point_no_dyn', type: 'kin_point', target: this.is_dynamic ? this.bodies.inters.background : this.bodies.bones.traj})


      this.bodies.inters_step.steps.push(
        new body_build({
          ...opts_inter_step,

          name: 'inters_C',
          m_offset: new Matrix(),
          m_shape: new Matrix().setScale(21*s,83*s),
          parent: this.bodies.inters.background,

          type: utils.shape.rectangle,

          constraints: [
            { name: 'point', type: 'dyn_point', target: this.bodies.inters.background,...opts_cns_disable_at_select},
            { name: 'orient', type: 'kin_orient', target: this.bodies.inters.background },
            {
              name: 'axe',
              type: 'kin_axe',
              axe: 1,
              distPos: 50 * s,
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


  

    let bone_circle_opts = {
      ...opts_visual_bones,
      name: 'bones_circle',
      parent: this.bodies.bones.root,
      constraint_to_parent: true,
      constraints:[],
    }

    if (this.is_dynamic) {
      bone_circle_opts.constraints.push({
        name: 'connect_scale_iA',
        type: 'connect_multi',
        attr: 's',
        targets: [
          this.bodies.inters_step.steps[0][0],
          this.bodies.inters_step.steps[2]
        ],
        targets_attr: ['ty', 'ty'],
        targets_space: ['base', 'base'],
        targets_remap: [
          [0, 55 * (s / 2.2), 1, 1.82],
          [0, 110 * (s / 2.2), 0, 0.45 - 1.82]
        ]
      })
    }
    this.bodies.bones.circle = new body_build(bone_circle_opts)

    this.bodies.geos.circle = new body_build({
      ...opts_geo,
      name: 'geos_circle',
      parent: this.bodies.bones.circle,
      m_shape: new Matrix().setScale(50*s),
      type: utils.shape.circle,

      material_three: materials.raw_shader_exemple, //three_utils.material.simple.cyan_grid ,
      constraint_to_parent: true,
      constraints: [
        { name: 'connect_scale_bone',
          type: 'connect',
          target: this.bodies.bones.circle,
          attr: 's',
          target_attr: 's'
        }
      ],
    })



    this.bodies.bones.rectangles_center = new body_build({
      ...opts_visual_bones,
      name: 'bones_rectangle_center',
      parent: this.bodies.bones.root,
      constraint_to_parent: true,
    })


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// RECTANGLES

    let rectangle_pivot_opts = {
      ...opts_visual_bones,
      name: 'bones_rectangle_pivot_T__L_',
      parent: this.bodies.bones.rectangles_center,
      m_offset: new Matrix().setTranslation(-29.5*s, 0),
      m_transform: new Matrix().setRotation(rad(35)),
      constraint_to_parent: true,
      constraints: [],
    }

    if (this.is_dynamic) {
      rectangle_pivot_opts.constraints.push({
        name: 'connect_rot_iA',
        type: 'connect',
        target: this.bodies.inters_step.steps[0][0],
        attr: 'r',
        target_attr: 'ty',
        target_space: 'base',
        target_remap: [0, 55 * (s / 2.2), 35, 0]
      })

      rectangle_pivot_opts.constraints.push({
        name: 'connect_tx_iB',
        type: 'connect_multi',
        attr: 'tx',
        targets: [
          this.bodies.inters_step.steps[1],
          this.bodies.inters_step.steps[2]
        ],
        targets_attr: ['r', 'ty'],
        targets_space: ['base', 'base'],
        targets_remap: [
          [0, 90, 0, 85 * (s / 2.2)],
          [0, 110 * (s / 2.2), 0, 140 * (s / 2.2) - 85 * (s / 2.2)]
        ]
      })
    }
    this.bodies.bones.rectangles_pivots.push(new body_build(rectangle_pivot_opts))

    this.bodies.bones.rectangles.push(
      new body_build({
        ...opts_visual_bones,
        name: 'bones_rectangle_T__L_',
        parent: this.bodies.bones.rectangles_pivots[0],
        constraint_to_parent: true,
        m_offset: new Matrix().setTranslation(-36.4*s, 0),
      })
    )

    let opts_rectangles = {
      ...opts_geo,
      name: 'geos_rectangle_T__L_',
      type: utils.shape.rectangle,
      parent: this.bodies.bones.rectangles[0],
      constraint_to_parent: true,
      m_shape: new Matrix().setScale(16*s,3.5*s),
      material_three: materials.raw_shader_exemple, //materials.simple.gradient_yellow_green_oblique_line_A ,
    }
    this.bodies.geos.rectangles.push(new body_build(opts_rectangles))
    

    if (this.is_dynamic) {
      this.effects.trailA = new effect({
        ...opts_rectangles,
        ...opts_effect_trail,
        body: this.bodies.geos.rectangles[0],
        trigger_body_max: this.bodies.inters_step.steps[1],
        trigger_value_max: 0.01
      })
    }

    // TOP RIGHT
    let axe_x = false
    let axe_y = true
    this.bodies.inters_step.steps[0].push(this.bodies.inters_step.steps[0][0].get_mirror(axe_x, axe_y))
    this.bodies.bones.rectangles_pivots.push(  this.bodies.bones.rectangles_pivots[0].get_mirror(axe_x, axe_y))
    this.bodies.bones.rectangles.push(  this.bodies.bones.rectangles[0].get_mirror(axe_x, axe_y))
    this.bodies.geos.rectangles.push(  this.bodies.geos.rectangles[0].get_mirror(axe_x, axe_y))

    // BOTTOM LEFT
    axe_x = true
    axe_y = false
    this.bodies.inters_step.steps[0].push(  this.bodies.inters_step.steps[0][0].get_mirror(axe_x, axe_y))
    this.bodies.bones.rectangles_pivots.push(  this.bodies.bones.rectangles_pivots[0].get_mirror(axe_x, axe_y))
    this.bodies.bones.rectangles.push(  this.bodies.bones.rectangles[0].get_mirror(axe_x, axe_y))
    this.bodies.geos.rectangles.push(  this.bodies.geos.rectangles[0].get_mirror(axe_x, axe_y))

    // BOTTOM RIGHT
    axe_x = true
    axe_y = true
    this.bodies.inters_step.steps[0].push(  this.bodies.inters_step.steps[0][0].get_mirror(axe_x, axe_y))
    this.bodies.bones.rectangles_pivots.push(  this.bodies.bones.rectangles_pivots[0].get_mirror(axe_x, axe_y))
    this.bodies.bones.rectangles.push(  this.bodies.bones.rectangles[0].get_mirror(axe_x, axe_y))
    this.bodies.geos.rectangles.push(  this.bodies.geos.rectangles[0].get_mirror(axe_x, axe_y))

    if (this.is_dynamic) {
      this.bodies.inters_step.steps[0][0].highlight_selection = [  this.bodies.geos.rectangles[0]]
      this.bodies.inters_step.steps[0][1].highlight_selection = [  this.bodies.geos.rectangles[1]]
      this.bodies.inters_step.steps[0][2].highlight_selection = [  this.bodies.geos.rectangles[2]]
      this.bodies.inters_step.steps[0][3].highlight_selection = [  this.bodies.geos.rectangles[3]]
    }

    this.bodies.bones.rectangle = new body_build({
      ...opts_visual_bones,
      name: 'bones_rectangle',
      parent: this.bodies.bones.root,
      constraint_to_parent: true,
    })


    let oRectangle = {
      ...opts_geo,
      name: 'geos_rectangle',
      parent: this.bodies.bones.rectangle,
      m_shape: new Matrix().setScale(74*s,18*s),
      type: utils.shape.rectangle,
      material_three: materials.background_test, //materials.simple.gradient_gold_red_A ,
      constraint_to_parent: true,
      constraints: [],
    }

    if (this.is_dynamic) {
      oRectangle.constraints.push({
        name: 'connect_rot_iB',
        type: 'connect',
        target: this.bodies.inters_step.steps[1],
        attr: 'r',
        target_attr: 'r',
        target_space: 'base',
        target_remap: null
      })

      oRectangle.constraints.push({
        name: 'connect_ty_iC',
        type: 'connect',
        target: this.bodies.inters_step.steps[2],
        attr: 'ty',
        target_attr: 'ty',
        target_space: 'base',
        target_remap: null
      })
    }

    this.bodies.geos.rectangle = new body_build(oRectangle)

    if (this.is_dynamic) {
      this.bodies.inters_step.steps[1].highlight_selection = [  this.bodies.geos.rectangle]
      this.bodies.inters_step.steps[2].highlight_selection = [  this.bodies.geos.rectangle]

    this.effects.trailB = new effect({
        ...oRectangle,
        ...opts_effect_trail,
        body: this.bodies.geos.rectangle,
        trigger_body_min: this.bodies.inters_step.steps[0][0],
        trigger_value_min: 0.99,
        trigger_body_max: this.bodies.inters_step.steps[2],
        trigger_value_max: 1.0
      })

      /////////////////////////////////////////////
     

      this.effects.sparcles_shock_A = new effect({
        ...opts_sparcles_shock,
        name: 'colA',
        trigger_body_min: this.bodies.inters_step.steps[0][0],
        trigger_value_min: 0.99,
        p: new Vector(-66*s, 6.8*s),
        r: 0
      })

      this.effects.sparcles_shock_B = new effect({
        ...opts_sparcles_shock,
        name: 'colB',
        trigger_body_min: this.bodies.inters_step.steps[1],
        trigger_value_min: 0.99,
        p: new Vector(6.8*s, -36*s),
        r: -90
      })

      this.effects.sparcles_shock_C = new effect({
        ...opts_sparcles_shock,
        name: 'colC',
        trigger_body_min: this.bodies.inters_step.steps[2],
        trigger_value_min: 0.99,
        p: new Vector(0, 91*s),
        r: 0
      })

      this.create_inter_from_geos(
        ['circle', 'rectangle', 'rectangles'],
        this.bodies.inters.background,
        s
      )

      /*
      this.create_bones_from_geos(
        ['circle',
        'rectangle',
        'rectangles'], s )        
        */
    }

    this.instance_each_others(
      [
        this.bodies.inters_step.steps[0][0],
        this.bodies.inters_step.steps[0][1],
        this.bodies.inters_step.steps[0][2],
        this.bodies.inters_step.steps[0][3]
      ],
      [false, false, true, false, false, true, true, true]
    )

    this.bodies_draw_order = [
      this.bodies.geos.backgrounds[0],
      this.bodies.geos.backgrounds[1],
      this.bodies.inters.background,
      this.bodies.inters.circle,
      this.bodies.inters.rectangle,
      this.bodies.inters.rectangles[0],
      this.bodies.inters.rectangles[1],
      this.bodies.inters.rectangles[2],
      this.bodies.inters.rectangles[3],
      this.bodies.inters_step.steps[0][0],
      this.bodies.inters_step.steps[0][1],
      this.bodies.inters_step.steps[0][2],
      this.bodies.inters_step.steps[0][3],
      this.bodies.inters_step.steps[1],
      this.bodies.inters_step.steps[2],
      this.bodies.geos.circle,
      this.effects.trailA,
      this.effects.trailB,
      this.bodies.geos.rectangle,
      this.bodies.geos.rectangles[0],
      this.bodies.geos.rectangles[1],
      this.bodies.geos.rectangles[2],
      this.bodies.geos.rectangles[3],
      this.effects.sparcles_shock_A,
      this.effects.sparcles_shock_B,
      this.effects.sparcles_shock_C,
      this.bodies.bones.world,
      this.bodies.bones.traj,
      this.bodies.bones.root,
      this.bodies.bones.circle,
      this.bodies.bones.rectangle,
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
    let z_depth = z_depth_start
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
      'bones',
      'world',
      'geos',
      'backgrounds',

      'bones',
      'traj',

      'inters',
      'background',
      'inters',
      'circle',
      'inters',
      'rectangle',
      'inters',
      'rectangles',
      'inters_step',
      'steps',

      'bones',
      'root',

      'bones',
      'circle',
      'bones',
      'rectangle',
      'bones',
      'rectangles_center',
      'bones',
      'rectangles_pivots',
      'bones',
      'rectangles',

      'geos',
      'circle',
      'geos',
      'rectangle',
      'geos',
      'rectangles'
    ]

    this.steps_info = [
      ///////////////////////////////////////////////////////////////////////////////////// 0
      {
        bodies_enable: [
          this.bodies.inters_step.steps[0][0],
          this.bodies.inters_step.steps[0][1],
          this.bodies.inters_step.steps[0][2],
          this.bodies.inters_step.steps[0][3],
          this.bodies.inters.background,
          this.bodies.inters.circle,
          this.bodies.inters.rectangle,
          this.bodies.inters.rectangles[0],
          this.bodies.inters.rectangles[1],
          this.bodies.inters.rectangles[2],
          this.bodies.inters.rectangles[3],
          this.bodies.geos.backgrounds[0],
          this.bodies.geos.backgrounds[1],
          this.bodies.geos.circle,
          this.bodies.geos.rectangle,
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
          this.bodies.bones.rectangle,
          this.bodies.bones.rectangles_center,
          this.bodies.bones.rectangles_pivots[0],
          this.bodies.bones.rectangles_pivots[1],
          this.bodies.bones.rectangles_pivots[2],
          this.bodies.bones.rectangles_pivots[3]
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
        ]
      }, ///////////////////////////////////////////////////////////////////////////////////// 1
      {
        bodies_enable: [
          this.bodies.inters_step.steps[1],
          this.bodies.inters.background,
          this.bodies.inters.circle,
          //this.bodies.inters.rectangle,
          //this.bodies.inters.rectangles[0],
          //this.bodies.inters.rectangles[2],
          this.bodies.geos.backgrounds[0],
          this.bodies.geos.backgrounds[1],
          this.bodies.geos.circle,
          this.bodies.geos.rectangle,
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
          this.bodies.bones.rectangle,
          this.bodies.bones.rectangles_center,
          this.bodies.bones.rectangles_pivots[0],
          this.bodies.bones.rectangles_pivots[1],
          this.bodies.bones.rectangles_pivots[2],
          this.bodies.bones.rectangles_pivots[3]
        ],
        constraints_disable: ['geos', 'rectangle', null, 'connect_ty_iC']
      }, ///////////////////////////////////////////////////////////////////////////////////// 2
      {
        bodies_enable: [
          this.bodies.inters_step.steps[2],
          this.bodies.inters.background,
          this.bodies.inters.circle,
          //this.bodies.inters.rectangle,
          //this.bodies.inters.rectangles[0],
          //this.bodies.inters.rectangles[2],
          this.bodies.geos.backgrounds[0],
          this.bodies.geos.backgrounds[1],
          this.bodies.geos.circle,
          this.bodies.geos.rectangle,
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
          this.bodies.bones.rectangle,
          this.bodies.bones.rectangles_center,
          this.bodies.bones.rectangles_pivots[0],
          this.bodies.bones.rectangles_pivots[1],
          this.bodies.bones.rectangles_pivots[2],
          this.bodies.bones.rectangles_pivots[3]
        ],
        constraints_disable: []
      }, ///////////////////////////////////////////////////////////////////////////////////// 3
      {
        bodies_enable: [
          this.bodies.geos.backgrounds[0],
          this.bodies.geos.backgrounds[1],
          this.bodies.geos.circle,
          this.bodies.geos.rectangle,
          this.bodies.geos.rectangles[0],
          this.bodies.geos.rectangles[1],
          this.bodies.geos.rectangles[2],
          this.bodies.geos.rectangles[3]
        ],
        constraints_disable: ['inters_step', 'steps', 2, 'point']
      }
    ]

    this.bodies_init_physics()
    this.bodies_init_constraints()

    this.end_step = this.bodies.inters_step.steps.length +1
  }

  override_with_idle () {
    this.bodies_set_dynamic(false)
    this.bodies_constraints_enable(false, ['bones'])

    let t = this.state.update_count
    this.bodies.bones.traj.set_out_position(
      new Vector(Math.sin(t * 0.01) * 10, Math.sin(t * 0.05) * 10),
      'base',
      'override'
    )
    this.bodies.bones.traj.set_out_rotation(
      Math.sin(t * 0.03) * 0.1,
      'base',
      'override'
    )

    this.bodies.bones.rectangles_pivots[0].set_out_rotation(
      Math.sin(t * 0.04) * rad(-10),
      'base',
      'override'
    )
    this.bodies.bones.rectangles_pivots[1].set_out_rotation(
      Math.sin(t * 0.04) * rad(10),
      'base',
      'override'
    )
    this.bodies.bones.rectangles_pivots[2].set_out_rotation(
      Math.sin(t * 0.04) * rad(-10),
      'base',
      'override'
    )
    this.bodies.bones.rectangles_pivots[3].set_out_rotation(
      Math.sin(t * 0.04) * rad(10),
      'base',
      'override'
    )
  }

  override_with_animation_reverse_build () {
    let start_time = 0
    let t = this.state.update_count
    let anim_duration = 100

    if (start_time + anim_duration == t) {
      this.bodies_set_dynamic()
      this.bodies_constraints_enable(true, ['bones'])
      this.constraints_enable(false, this.steps_info[0].constraints_disable)
      return false
    }
    if (start_time + anim_duration < t) {
      return false
    }

    this.bodies_set_dynamic(false)
    this.bodies_constraints_enable(false, ['bones'])

    let times = [start_time + 0, start_time + 20]
    let positions = [new Vector(0, 500), new Vector(0, 0)]
    let rotations = []
    let scales = []
    let interp_modes = ['linear']

    this.bodies.bones.traj.set_out_position(
      anim_vectors(t, times, positions, interp_modes),
      'base',
      'override'
    )

    times = [start_time + 20, start_time + 30, start_time + 50]
    positions = [new Vector(0, 110), new Vector(0, 0), new Vector(0, 0)]
    rotations = [rad(90), rad(90), rad(0)]
    scales = []
    interp_modes = ['linear', 'smooth']

    this.bodies.bones.rectangle.set_out_position(
      anim_vectors(t, times, positions, interp_modes),
      'base',
      'override'
    )
    this.bodies.bones.rectangle.set_out_rotation(
      anim_values(t, times, rotations, interp_modes),
      'base',
      'override'
    )

    positions = []
    rotations = []
    scales = [0.45, 2, 1]
    interp_modes = ['linear', 'smooth']

    this.bodies.bones.circle.set_out_scale(
      anim_values(t, times, scales, interp_modes),
      'base',
      'override'
    )

    scales = []
    interp_modes = ['linear', 'smooth']

    rotations = [rad(35), rad(35), rad(0)]
    positions = [new Vector(-75, 0), new Vector(65, 0), new Vector(65, 0)]
    this.bodies.bones.rectangles_pivots[0].set_out_position(
      anim_vectors(t, times, positions, interp_modes),
      'parent',
      'override'
    )
    this.bodies.bones.rectangles_pivots[0].set_out_rotation(
      anim_values(t, times, rotations, interp_modes),
      'base',
      'override'
    )

    rotations = [rad(35), rad(35), rad(0)]
    positions = [new Vector(75, 0), new Vector(-65, 0), new Vector(-65, 0)]
    this.bodies.bones.rectangles_pivots[2].set_out_position(
      anim_vectors(t, times, positions, interp_modes),
      'parent',
      'override'
    )
    this.bodies.bones.rectangles_pivots[2].set_out_rotation(
      anim_values(t, times, rotations, interp_modes),
      'base',
      'override'
    )

    rotations = [rad(-35), rad(-35), rad(0)]
    positions = [new Vector(-75, 0), new Vector(65, 0), new Vector(65, 0)]
    this.bodies.bones.rectangles_pivots[1].set_out_position(
      anim_vectors(t, times, positions, interp_modes),
      'parent',
      'override'
    )
    this.bodies.bones.rectangles_pivots[1].set_out_rotation(
      anim_values(t, times, rotations, interp_modes),
      'base',
      'override'
    )

    rotations = [rad(-35), rad(-35), rad(0)]
    positions = [new Vector(75, 0), new Vector(-65, 0), new Vector(-65, 0)]
    this.bodies.bones.rectangles_pivots[3].set_out_position(
      anim_vectors(t, times, positions, interp_modes),
      'parent',
      'override'
    )
    this.bodies.bones.rectangles_pivots[3].set_out_rotation(
      anim_values(t, times, rotations, interp_modes),
      'base',
      'override'
    )

    return true
  }
}
