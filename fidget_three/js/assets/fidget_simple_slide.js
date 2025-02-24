
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


export default class fidget_simple_slide extends fidget{

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
      //this.end_step = 2
      this.set_end_step( 2 )
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
  
  
  
      this.title = 'simple_slide'
  
      this.bodies.store = {
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
            //{
            //  name: 'rot_limit',
            //  type: 'kin_limit',
            //  target: this.bodies.store.bones.traj,
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
      
      this.bodies.store.bones.root = new body_build({
        ...opts_bones_main,
        dynamic: false,
        name: 'bones_root',
        parent: this.is_dynamic ? this.bodies.store.inters.background : this.bodies.store.bones.traj,
        constraint_to_parent: true,
      })
      
    //////////////////////////////////////////////////////////////////////////////// steps
    let inter_size = 22
    if( this.is_dynamic )
    {

      this.bodies.store.inters_step.steps.push([
        new body_build({       
          ...opts_inter_step,
          name: 'inters_A_S_',
          parent: this.bodies.store.inters.background,
          m_offset: new Matrix().setTranslation(-30*this.s,0*this.s),
          m_shape: new Matrix().setScale(30*this.s+inter_size,7*this.s+inter_size),
          type: utils.shape.rectangle,
          constraints: [
            
            { name: 'point', type: 'dyn_point', target: this.bodies.store.inters.background, ...opts_cns_disable_at_select},
            { name: 'orient', type: 'kin_orient', target: this.bodies.store.inters.background},
            
            {
              name: 'axe',
              type: 'kin_axe',
              axe: 0,
              distPos: 60 * this.s,
              distNeg: 0.001,
              limit_lock: 1,
              transfer_delta_as_parent_force: this.debug_mode.inter_step_physics
            }
            
            
          ],

        })
      ])
      
      this.bodies.store.inters_step.steps[0][0].get_resolution_coef = function(){return clamp(this.physics.relations.constraints.axe.update_and_get_current_pos(), 0, 1)}
      this.bodies.store.inters_step.steps[0][0].set_resolution_coef = function(res = null){this.physics.relations.constraints.axe.current_pos = res}
      


      this.bodies.store.inters_step.steps_help.push(
        new body_build({
          ...opts_inter_step,
          ...opts_collision_no_interaction,
          name: 'inters_B_S_help',
          parent: this.bodies.store.inters.background,
          m_offset: new Matrix().setRotation(rad(1)),
          m_shape: new Matrix().setScale(100*this.s),
          type: utils.shape.circle,
          constraints: [
            {
                  name: 'point',
                  type: 'dyn_point',
                  target: this.bodies.store.inters.background,
                  stiffness: 0.999,
                  damping: 0.1,
                  length: 0.01
            },
            //{ name: 'orient', type: 'dyn_orient', target: this.bodies.store.inters.background, stiffness: 0.1,},
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
      

    }



    ////////////////////////////////////// rectangles




    this.bodies.store.bones.rectangles_center = new body_build({
      ...opts_visual_bones,
      name: 'bones_rectangle_center',
      parent: this.bodies.store.bones.root,
      constraint_to_parent: true,
      constraints:[]
    })
    

    let rectangle_pivot_opts = {
      ...opts_visual_bones,
      name: 'bones_rectangle_pivot_T__S_',
      parent: this.bodies.store.bones.rectangles_center,
      constraint_to_parent: true,
      constraints: [],
    }
    
    if (this.is_dynamic) {

      rectangle_pivot_opts.constraints.push({
        name: 'connect_rot_iA',
        type: 'connect',
        target: this.bodies.store.inters_step.steps_help[0],
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
      
    

    this.bodies.store.bones.rectangles_pivots.push(new body_build(rectangle_pivot_opts))

    this.bodies.store.bones.rectangles.push(
      new body_build({
        ...opts_visual_bones,
        name: 'bones_rectangle_T__S_',
        parent: this.bodies.store.bones.rectangles_pivots[0],
        constraint_to_parent: false,
        m_offset: new Matrix().setTranslation(-30*this.s,0*this.s),
        constraints: [
          {
            name: 'connect_tx_iA',
            type: 'connect',
            target: this.bodies.store.inters_step.steps[0][0],
            attr: 'tx',
            target_attr: 'tx',
            target_space: 'base',
            target_remap: [0, 200, 0, 200]
          },
        ] 
      })
    )

    let opts_rectangles = {
      ...opts_geo,
      name: 'geos_rectangle_T__S_',
      type: utils.shape.rectangle,
      parent: this.bodies.store.bones.rectangles[0],
      constraint_to_parent: true,
      m_shape: new Matrix().setScale(30*this.s,7*this.s),
      material_three: materials.raw_shader_exemple, //materials.simple.gradient_yellow_green_oblique_line_A ,
    }
    this.bodies.store.geos.rectangles.push(new body_build(opts_rectangles))

    if (this.is_dynamic) {
      this.bodies.store.inters_step.steps[0][0].relations.highlight_bodies_when_selected = [  this.bodies.store.geos.rectangles[0]]
    }
    


    this.bodies.draw_order = [
      this.bodies.store.geos.backgrounds[0],
      this.bodies.store.geos.backgrounds[1],
      this.bodies.store.inters.background,
      this.bodies.store.inters.circle,
      this.bodies.store.inters.trapezoids[0],
      this.bodies.store.inters.trapezoids[1],
      this.bodies.store.inters.trapezoids[2],
      this.bodies.store.inters.trapezoids[3],
      this.bodies.store.inters_step.steps_help[0],
      this.is_dynamic ? this.bodies.store.inters_step.steps[0][0]:null,
      this.is_dynamic ? this.bodies.store.inters_step.steps[0][1]:null,
      this.is_dynamic ? this.bodies.store.inters_step.steps[0][2]:null,
      this.is_dynamic ? this.bodies.store.inters_step.steps[0][3]:null,
      this.bodies.store.geos.circle,
      // this.effects.trailA,
      // this.effects.trailB,
      this.bodies.store.geos.trapezoids[0],
      this.bodies.store.geos.trapezoids[1],
      this.bodies.store.geos.trapezoids[2],
      this.bodies.store.geos.trapezoids[3],
      this.bodies.store.geos.rectangles[0],
      this.bodies.store.bones.world,
      this.bodies.store.bones.traj,
      this.bodies.store.bones.root,
      this.bodies.store.bones.circle,
      this.bodies.store.bones.trapezoids_center,
      this.bodies.store.bones.trapezoids[0],
      this.bodies.store.bones.trapezoids[1],
      this.bodies.store.bones.trapezoids[2],
      this.bodies.store.bones.trapezoids[3],
      this.bodies.store.bones.rectangles_center,
      this.bodies.store.bones.rectangles_pivots[0],
      this.bodies.store.bones.rectangles_pivots[1],
      this.bodies.store.bones.rectangles_pivots[2],
      this.bodies.store.bones.rectangles_pivots[3],
      this.bodies.store.bones.rectangles[0],
    ]

    


    this.z_depth_end = this.render.draw_order_to_body_z( args.z_depth_start,0.5)

    this.physics.Mouse.z = this.z_depth_end

    this.bodies.build_order = this.bodies.get_build_order()

    this.bodies.eval_order = [
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
    
    this.physics.steps_info = [
      ///////////////////////////////////////////////////////////////////////////////////// 0
      {
        bodies_enable: [
          this.bodies.store.inters_step.steps_help[0],
          this.is_dynamic ? this.bodies.store.inters_step.steps[0][0]:null,
          this.is_dynamic ? this.bodies.store.inters_step.steps[0][1]:null,
          this.is_dynamic ? this.bodies.store.inters_step.steps[0][2]:null,
          this.is_dynamic ? this.bodies.store.inters_step.steps[0][3]:null,
          this.bodies.store.inters.background,
          this.bodies.store.inters.circle,
          this.bodies.store.inters.trapezoids[0],
          this.bodies.store.inters.trapezoids[1],
          this.bodies.store.inters.trapezoids[2],
          this.bodies.store.inters.trapezoids[3],
          this.bodies.store.geos.backgrounds[0],
          this.bodies.store.geos.backgrounds[1],
          this.bodies.store.geos.circle,
          this.bodies.store.geos.trapezoids[0],
          this.bodies.store.geos.trapezoids[1],
          this.bodies.store.geos.trapezoids[2],
          this.bodies.store.geos.trapezoids[3],
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
          this.bodies.store.bones.trapezoids_center,
          this.bodies.store.bones.trapezoids[0],
          this.bodies.store.bones.trapezoids[1],
          this.bodies.store.bones.trapezoids[2],
          this.bodies.store.bones.trapezoids[3],
          this.bodies.store.bones.rectangles_center,
          this.bodies.store.bones.rectangles_pivots[0],
          this.bodies.store.bones.rectangles_pivots[1],
          this.bodies.store.bones.rectangles_pivots[2],
          this.bodies.store.bones.rectangles_pivots[3]
        ],

        constraints_disable: [
          // 'geos','rectangle',null,'connect_rot_iB',
          // 'geos','rectangle',null,'connect_ty_iC',
        ],
        switch_selection_transition:null,
      }, ///////////////////////////////////////////////////////////////////////////////////// 1
      {
        bodies_enable: [
          this.bodies.store.inters_step.steps_help[0],
          this.bodies.store.inters.background,
          this.bodies.store.inters.circle,
          this.bodies.store.geos.backgrounds[0],
          this.bodies.store.geos.backgrounds[1],
          this.bodies.store.geos.circle,
          this.bodies.store.geos.trapezoids[0],
          this.bodies.store.geos.trapezoids[1],
          this.bodies.store.geos.trapezoids[2],
          this.bodies.store.geos.trapezoids[3],
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
          this.bodies.store.bones.trapezoids_center,
          this.bodies.store.bones.trapezoids[0],
          this.bodies.store.bones.trapezoids[1],
          this.bodies.store.bones.trapezoids[2],
          this.bodies.store.bones.trapezoids[3],
          this.bodies.store.bones.rectangles_center,
          this.bodies.store.bones.rectangles_pivots[0],
          this.bodies.store.bones.rectangles_pivots[1],
          this.bodies.store.bones.rectangles_pivots[2],
          this.bodies.store.bones.rectangles_pivots[3]
        ],
        constraints_disable: [
          //'geos', 'rectangle', null, 'connect_ty_iC'
        ],
        switch_selection_transition:true,
      }, ///////////////////////////////////////////////////////////////////////////////////// 2
      {
        bodies_enable: [
          this.bodies.store.inters_step.steps_help[0],
          this.bodies.store.inters.background,
          this.bodies.store.inters.circle,
          this.bodies.store.geos.backgrounds[0],
          this.bodies.store.geos.backgrounds[1],
          this.bodies.store.geos.circle,
          this.bodies.store.geos.trapezoids[0],
          this.bodies.store.geos.trapezoids[1],
          this.bodies.store.geos.trapezoids[2],
          this.bodies.store.geos.trapezoids[3],
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
          this.bodies.store.bones.trapezoids_center,
          this.bodies.store.bones.trapezoids[0],
          this.bodies.store.bones.trapezoids[1],
          this.bodies.store.bones.trapezoids[2],
          this.bodies.store.bones.trapezoids[3],
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
          this.bodies.store.geos.trapezoids[0],
          this.bodies.store.geos.trapezoids[1],
          this.bodies.store.geos.trapezoids[2],
          this.bodies.store.geos.trapezoids[3],
          this.bodies.store.geos.rectangles[0],
          this.bodies.store.geos.rectangles[1],
          this.bodies.store.geos.rectangles[2],
          this.bodies.store.geos.rectangles[3]
        ],
        constraints_disable: [
          //'inters_step', 'steps', 2, 'point'
        ]
      }
    ]

    this.bodies.physics.init_physics()
    this.bodies.physics.init_constraints()

    

                                
  }




}

