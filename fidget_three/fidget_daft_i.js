
import fidget from './fidget.js';
import { 
  utils,
  clamp,
  rad,
  deg,
  userIsInteracting,
  mouseX, 
  mouseY,
  anim_vectors,
  anim_values } from './utils.js';
import { body_build,
  build_effects_trail,
  build_effects_particles_sparcles,
  build_effects_particles_shapes,
  build_effects_wall,
  anim_effect,
} from './body.js';
import Vector from './vector.js';
import Matrix from './matrix.js';
import * as ut from './utils_three.js';
import { and } from './libraries/jsm/nodes/Nodes.js';
import { three_utils,} from './utils_three.js';
import { materials,} from './shader.js';


export default class fidget_daft_i extends fidget{

  ////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////// SETUP
  ////////////////////////////////////////////////////////////////////////////////////

    constructor( 
      m,
      s,
      screen_dims, 
      z_depth_start,
      do_background,
      is_dynamic = true, 
      shaders = [],
      debug=false,
      random_color = true)
    {
        super(
          m, 
          s, 
          screen_dims,
          do_background,
          shaders, 
          debug)


        this.title = 'dafti'

        this.bodies = {
          inters : {
            background:null,
            circle:null,
            rectangle:null,
            rectangles:[],
          },
          inters_step : {
            steps:[],
            steps_instances:[],
          },          
          geos : {
            backgrounds:[],
            circle:null,
            rectangle:null,
            rectangles:[],
          },
          bones : {
            rectangles:[],
            rectangles_pivots:[],
            rectangles_center:null,
            rectangle:null,   
            circle:null,
            root:null,
            traj:null,
            world:null,   
          },     
          effects : {
            movA_trails:[],
            colA_sparcles:[],
            colA_shapes:[],
            colA_wall:null,
            movB_trails:[],
            colB_sparcles:[],
            colB_shapes:[],
            colB_wall:null,
            colC_sparcles:[],
            colC_shapes:[],
            colC_wall:null,
          },
          helpers : {
            stepA:null,
            stepB:null,
            stepC:null,
          },          
        }
 
      this.play_animation = null
      this.is_dynamic = is_dynamic
      this.end_step = 4

      this.possible_colors = [[utils.color.green,utils.color.red,utils.color.yellow],
      [utils.color.cyan,utils.color.magenta,utils.color.orangeRed],
      [utils.color.olive,utils.color.teal,utils.color.green],
      [utils.color.purple,utils.color.aquamarine,utils.color.turquoise],
      [utils.color.paleGreen,utils.color.skyBlue,utils.color.orangeRed],
      [utils.color.orangeRed,utils.color.tomato,utils.color.khaki],
      [utils.color.chocolate,utils.color.lavender,utils.color.red],
      [utils.color.rosyBrown,utils.color.redLight,utils.color.gold]]

      this.colors = [utils.color.green,utils.color.red,utils.color.yellow]
      if(random_color)
      {
        let i_random = Math.floor(clamp( Math.random()*(this.possible_colors.length+1), 0,this.possible_colors.length-1))
        this.colors = this.possible_colors[i_random]
      }
      this.color_background = [ (this.colors[0][0]+0.2)*0.3,(this.colors[0][1]+0.2)*0.3,(this.colors[0][2]+0.2)*0.3]

      var text_checker_three = ut.get_texture_grid_checker()
      var text_checker_three_grey = ut.get_texture_grid_checker_grey()  
      
      var textures = {
        uv_grid_opengl_grey: ut.get_texture('uv_grid_opengl_grey'),
        uv_grid_opengl: ut.get_texture('uv_grid_opengl'),
        cyan_grid: ut.get_texture('texture_cyan_grid'),
        gradient_blue_cyan_A: ut.get_texture('texture_gradient_blue_cyan_A'),
        gradient_blue_pink_A: ut.get_texture('texture_gradient_blue_pink_A'),
        gradient_blue_pink_B: ut.get_texture('texture_gradient_blue_pink_B'),
        gradient_blue_pink_C: ut.get_texture('texture_gradient_blue_pink_C'),
        gradient_blue_pink_D: ut.get_texture('texture_gradient_blue_pink_D'),
        gradient_gold_red_A: ut.get_texture('texture_gradient_gold_red_A'),
        gradient_yellow_green_oblique_line_A: ut.get_texture('texture_gradient_yellow_green_oblique_line_A'),
        grainy_gradient_blue_cyan_A: ut.get_texture('texture_grainy_gradient_blue_cyan_A'),
        grainy_gradient_blue_cyan_B: ut.get_texture('texture_grainy_gradient_blue_cyan_B'),
      }

      
      var textures_background = {
        uv_grid_opengl_grey: ut.get_texture('uv_grid_opengl_grey'),
        uv_grid_opengl: ut.get_texture('uv_grid_opengl'),
        abstract_shape_grid : ut.get_background('background_abstract_shape_grid'),
        big_spheres_grid    : ut.get_background('background_big_spheres_grid'),
        coherence_the_set_generation: ut.get_background('background_coherence_the_set_generation'),
        football_field     : ut.get_background('background_football_field'),
        purple_sphere_grid : ut.get_background('background_purple_sphere_grid'),
        space_grid         : ut.get_background('background_space_grid'),
        squares_grey_blur  : ut.get_background('background_squares_grey_blur'),
      }      



      let opts_global = {
        screen_dims: this.screen_dims,
        matter_engine: this.matter_engine, 
        mouse_constraint: this.mouse_constraint,
        fidget: this,
        dynamic: this.is_dynamic,
      }

      let opts_collision_no_interaction = {
        collision_category: utils.collision_category.none,
        collision_mask: utils.collision_category.none
      }    

      let opts_collision_activate = {      
        collision_category: utils.collision_category.blue,
        collision_mask: utils.collision_category.default , 
      }
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

      let opts_visual_bones = {
        visibility:true,
        do_shape: true,
        do_line:true,                                           
        color: utils.color.blue,
        color_line: utils.color.black,
        type: utils.shape.circle,  
        debug_matrix_axes: true,      
      }   
      let opts_visual_bones_main = {
        visibility:true,
        do_shape: false,
        do_line:true,                                           
        color: utils.color.blue,
        color_line: utils.color.blue,
        type: utils.shape.circle,  
        debug_matrix_axes: true,      
      }  

      let opts_debug = {
        debug_matrix_info: false,
        debug_matrix_axes: debug.matrix_axes,  
        debug_cns_axes: debug.cns_axes,   
        debug_force_visibility: debug.force_visibility,             
      }



    /////////////////////////////////////////////////////  
    


    let m_shape_bones_main = new Matrix()
    m_shape_bones_main.setScale(s*150)    

    let m_shape_bones = new Matrix()
    m_shape_bones.setScale(s*4)


    this.bodies.bones.world = new body_build({ 
      ...opts_global,
      ...opts_collision_no_interaction,
      ...opts_debug,
      ...opts_visual_bones_main,

      name:'bones_world',
      
      //m:this.m,
      //parent:this.bodies.inters.background,
      //m_offset:om_rA_bones,
      m_shape:m_shape_bones_main,
      //z:z_depth, 
      density:0.2/(s/2.2), 

    })   
     



    let m_shape = new Matrix()
    m_shape.set_row(0,m_shape.get_row(0).getMult(this.screen_dims.x/2))
    m_shape.set_row(1,m_shape.get_row(1).getMult(this.screen_dims.y))
    
    let oBackground = { 
      ...opts_global,
      ...opts_collision_no_interaction,
      ...opts_debug,
      dynamic: false,

      m:this.m,
      parent:this.bodies.bones.world,
      m_offset:new Matrix(),      
      //z:z_depth, 
      m_shape: m_shape,
      type: utils.shape.rectangle,

      do_shape: true,
      do_line:false,  
      bevel:0,       
      //color: this.color_background,
      material_three: materials.old_custom_exemple,//materials.background.space_grid ,
      color_line: utils.color.black,

      density:0.01/(s/2.2), 
      collision:false, 
      visibility:this.do_background,
      castShadow: false,
      receiveShadow: true,

    } 
    //z_depth += z_depth_incr

    /*
    let mo_background_L = new Matrix()                                    
    mo_background_L.setTranslation(this.screen_dims.x/4,this.screen_dims.y/2)   
    */

    let background_L = new body_build({ ...oBackground,
      name:'geos_background_L_',
      m_offset:new Matrix().setTranslation(this.screen_dims.x/4,this.screen_dims.y/2), 
    })
    this.bodies.geos.backgrounds.push(background_L)
    this.bodies.geos.backgrounds.push(background_L.get_mirror(false,true))
    
    /*
    let mo_background_R = new Matrix()                                    
    mo_background_R.setTranslation(this.screen_dims.x/4*3,this.screen_dims.y/2)    

    this.bodies.geos.backgrounds.push(new body_build({ ...oBackground,
                                                name:'geos_background_R', 
                                                m_offset:mo_background_R,
                                                                                                
                                              })) 
                                              */
          

    this.bodies.bones.traj = new body_build({ 
      ...opts_global,
      ...opts_collision_no_interaction,
      ...opts_debug,
      ...opts_visual_bones_main,

      name:'bones_traj',
      
      m:this.m,
      parent:this.bodies.bones.world,
      m_offset:this.m,
      m_shape:m_shape_bones_main,
      //z:z_depth, 

      constraints:[      
        { name:'point' ,type:'kin_point' ,target:this.bodies.bones.world},
        { name:'orient',type:'kin_orient',target:this.bodies.bones.world},  
      ],

      density:0.2/(s/2.2), 

    }) 
    /////////////////////////////////////////////////////  
    
    m_shape = new Matrix()
    m_shape.set_row(0,m_shape.get_row(0).getMult(350/2.4*s))
    m_shape.set_row(1,m_shape.get_row(1).getMult(220/2.4*s))
    
    if(this.is_dynamic)
    {

      this.bodies.inters.background = new body_build({ 
        ...opts_global,
        ...opts_collision_no_interaction,
        ...opts_visual_inter,
        ...opts_debug,

        name:'inters_background',
        highlight_selection:[],  
        
        m:this.m,
        parent:this.bodies.bones.traj,
        m_offset:new Matrix(),
        m_shape:m_shape,
        //z:z_depth,
        type : utils.shape.rectangle,

        constraints:[
          { name:'point'    ,type:'dyn_point',target:this.bodies.bones.traj, stiffness: 0.05,damping:0.01,length:0.01},
          { name:'orient'   ,type:'dyn_orient',target:this.bodies.bones.traj,stiffness: 0.2,damping:0.01,length:0.01},
          { name:'rot_limit',type:'kin_limit',target:this.bodies.bones.traj, 
            x_min:-50,
            x_max: 50,
            y_min:-50,
            y_max: 50,
            rot_min:rad(-20),
            rot_max:rad(20),
            limit_lock:false},
        ],    

        density:0.01/(s/2.2), 
        frictionAir:0.3,  
        selection_break_length: this.debug_mode.mouse_selection_break_length*(s/2.2),
                                                  
      })
    }

     
    this.bodies.bones.root = new body_build({ 
      ...opts_global,
      ...opts_collision_no_interaction,
      ...opts_debug,
      ...opts_visual_bones_main,
      dynamic: false,

      name:'bones_root',
      
      m:this.m,
      parent: this.is_dynamic ? this.bodies.inters.background : this.bodies.bones.traj,
      //m_offset:om_rA_bones,
      m_shape:m_shape_bones_main,
      //z:z_depth, 

      constraints:[      
        { name:'point' ,type:'kin_point' ,target:this.is_dynamic ?this.bodies.inters.background : this.bodies.bones.traj},
        { name:'orient',type:'kin_orient',target:this.is_dynamic ?this.bodies.inters.background : this.bodies.bones.traj},  
      ],

      density:0.2/(s/2.2), 

    })  
    
    
   
    let scale_inter = 40.0 

    var om_iA = new Matrix()
    om_iA.setTranslation(-130*(s/2.2),-50*(s/2.2))

    m_shape = new Matrix()
    m_shape.set_row(0,m_shape.get_row(0).getMult(100/2.4*s))
    m_shape.set_row(1,m_shape.get_row(1).getMult(100/2.4*s)) 

    
    if(this.is_dynamic)
    {


      this.bodies.inters_step.steps.push( [new body_build({  
                                      ...opts_global,
                                      ...opts_collision_mouse_interaction,
                                      ...opts_visual_inter,
                                      ...opts_debug,

                                      name:'inters_A_T__L_',     
                                      //highlight_selection:[this.bodies.geos.rectangles[3]],  
                                      m:this.m,
                                      parent:this.bodies.inters.background,                                    
                                      m_offset:om_iA,
                                      m_shape:m_shape,
                                      //z:z_depth,
                                      type : utils.shape.circle,

                                      constraints:[
                                        { name:'point' ,type:'dyn_point',target:this.bodies.inters.background,
                                          stiffness: 1.0,
                                          stiffness_at_selection:0.0,
                                          //stiffness_after_selection:0.0,
                                          damping:0.1,length:0.01},
                                        { name:'orient',type:'kin_orient',target:this.bodies.inters.background}, 
                                        { name:'axe'   ,type:'kin_axe', 
                                          axe:1, 
                                          distPos: 25*s, 
                                          distNeg: 0.001, 
                                          limit_lock: 1, 
                                          transfer_delta_as_parent_force: this.debug_mode.inter_step_physics },
                                      ], 

                                      density:0.01/(s/2.2), 
                                      selection_break_length: this.debug_mode.mouse_selection_break_length*(s/2.2),
                                                                              
                                    }) ] )
      this.bodies.inters_step.steps[0][0].get_resolution_coef = function(){ return clamp(this.constraints.axe.update_and_get_current_pos() ,0,1) }
      this.bodies.inters_step.steps[0][0].set_resolution_coef = function(res = null){ this.constraints.axe.current_pos = res }
      


      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(200/2.4*s))
      m_shape.set_row(1,m_shape.get_row(1).getMult(50/2.4*s))

      this.bodies.inters_step.steps.push( new body_build({ 
                                        ...opts_global,
                                        ...opts_collision_mouse_interaction,
                                        ...opts_visual_inter,
                                        ...opts_debug,

                                        name:'inters_B',   
                                        //highlight_selection:[this.bodies.geos.rectangle], 

                                        m:this.m,
                                        parent:this.bodies.inters.background,
                                        m_offset:new Matrix(),
                                        m_shape:m_shape,
                                        //z:z_depth,
                                        type : utils.shape.rectangle,

                                        constraints:[
                                          { name:'point' ,type:'dyn_point',
                                          target:this.bodies.inters.background, stiffness: 0.999,damping:0.1,length:0.01},
                                          { name:'orient' ,type:'dyn_orient' ,target:this.bodies.inters.background, 
                                          stiffness: 1.0,
                                          stiffness_at_selection:0.0,
                                          //stiffness_after_selection:0.0,
                                          damping:0.01,length:0.01},                 
                                          { name:'rot_limit', type:'kin_limit', 
                                            obj:this, 
                                            rot_min:rad(0),
                                            rot_max:rad(90.5),
                                            limit_lock:true,
                                            transfer_delta_as_parent_force: this.debug_mode.inter_step_physics },
                                        ],      

                                        density:0.01/(s/2.2), 
                                        selection_break_length: this.debug_mode.mouse_selection_break_length*(s/2.2),
                                                                                    
                                      }))
      this.bodies.inters_step.steps[1].get_resolution_coef = function(){ return clamp(deg(this.get_out_rotation('base'))/90.0     ,0,1) }  
      this.bodies.inters_step.steps[1].set_resolution_coef = function(res = null){ if(res!=null)this.set_out_rotation(rad(res*90.5),'world', 'override') }                     
                                                                             
      // other

      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(50/2.4*s))
      m_shape.set_row(1,m_shape.get_row(1).getMult(200/2.4*s))    

      this.bodies.inters_step.steps.push( new body_build({ 
                                      ...opts_global,
                                      ...opts_collision_mouse_interaction, 
                                      ...opts_visual_inter,
                                      ...opts_debug,

                                      name:'inters_C', 
                                      //highlight_selection:[this.bodies.geos.rectangle], 

                                      m:this.m,
                                      m_offset:new Matrix(),
                                      m_shape:m_shape,
                                      parent:this.bodies.inters.background,
                                      //z:z_depth,
                                      
                                      type : utils.shape.rectangle,

                                      constraints:[
                                        { name:'point' ,type:'dyn_point',target:this.bodies.inters.background,
                                        stiffness: 1.0,
                                        stiffness_at_selection:0.0,
                                        //stiffness_after_selection:0.0,
                                        damping:0.1,length:0.01},                                        
                                        { name:'orient',type:'kin_orient',target:this.bodies.inters.background},                                         
                                        { name:'axe'   ,type:'kin_axe', 
                                          axe:1, 
                                          distPos: 50*s, 
                                          distNeg: 0.001, 
                                          limit_lock: 1,
                                          transfer_delta_as_parent_force: this.debug_mode.inter_step_physics, },
                                      ], 

                                      density:0.01/(s/2.2), 
                                      selection_break_length: this.debug_mode.mouse_selection_break_length*(s/2.2),
                                                                              
                                    }))
      this.bodies.inters_step.steps[2].get_resolution_coef = function(){ return clamp(this.constraints.axe.current_pos ,0,1) }
      this.bodies.inters_step.steps[2].set_resolution_coef = function(res = null){ this.constraints.axe.current_pos = res }

      //z_depth += z_depth_incr

    }             
    
    let bone_circle_opts = { 
      ...opts_global,
      ...opts_collision_no_interaction,
      ...opts_debug,
      ...opts_visual_bones,
      dynamic: false,

      name:'bones_circle',
      
      m:this.m,
      parent:this.bodies.bones.root,
      //m_offset:om_rA_bones,
      m_shape:m_shape_bones,
      //z:z_depth, 

      constraints:[      
        { name:'point' ,type:'kin_point' ,target:this.bodies.bones.root},
        { name:'orient',type:'kin_orient',target:this.bodies.bones.root},       
      ],
      density:0.2/(s/2.2), 
    }

    if(this.is_dynamic)
    {
      bone_circle_opts.constraints.push( 
      { name:'connect_scale_iA', type:'connect_multi', 
      attr:'s',
      targets:[this.bodies.inters_step.steps[0][0],this.bodies.inters_step.steps[2]],
      targets_attr:['ty','ty'], 
      targets_space:['base','base'],
      targets_remap:[[0,55*(s/2.2),1,1.82],[0,110*(s/2.2),0,0.45-1.82]] },
      )
    }

    this.bodies.bones.circle = new body_build(bone_circle_opts)      
  
                                         
    m_shape = new Matrix()
    m_shape.set_row(0,m_shape.get_row(0).getMult(50*s))
    m_shape.set_row(1,m_shape.get_row(1).getMult(50*s))

    this.bodies.geos.circle = new body_build({ 
                                    ...opts_global,
                                    ...opts_collision_activate,
                                    ...opts_debug,

                                    name:'geos_circle',

                                    m:this.m,
                                    parent:this.bodies.bones.circle,
                                    m_offset:new Matrix(),
                                    m_shape: m_shape,
                                    //z:z_depth,
                                    type:utils.shape.circle,

                                    do_shape: true,
                                    do_line:true,   
                                    bevel:0,                                      
                                    //color: this.colors[0],
                                    color_line: utils.color.black,
                                    material_three: materials.raw_shader_exemple ,//three_utils.material.simple.cyan_grid ,
                                    castShadow: true,
                                    receiveShadow: true,
                                    bloom: this.debug_mode.do_bloom ? true : false,
  
                                    constraints:[
                                      { name:'point' ,type:'kin_point' ,target:this.bodies.bones.circle},
                                      { name:'orient',type:'kin_orient',target:this.bodies.bones.circle},  
                                      { name:'connect_scale_bone', type:'connect', target:this.bodies.bones.circle, 
                                        attr:'s',
                                        target_attr:'s'},
                                    ],                                      
                                    density:0.001/(s/2.2),     
                                                                               
                                    })

    /*     
    if(this.is_dynamic)
    {

      this.bodies.inters.circle.highlight_selection = [this.bodies.geos.circle]
    }
    */


                                  

    m_shape = new Matrix()
    m_shape.set_row(0,m_shape.get_row(0).getMult(16.21*s))
    m_shape.set_row(1,m_shape.get_row(1).getMult(3.51*s))

    let oRect = { 
      ...opts_global,
      ...opts_collision_activate,
      ...opts_debug,

      //m:this.m,
      //parent:this.bodies.inters.background,
      m_shape: m_shape,
      //z:z_depth, 
      type: utils.shape.rectangle,

      do_shape: true,
      do_line:true,           
      //color: this.colors[2],
      color_line: utils.color.black,
      material_three: materials.raw_shader_exemple,//materials.simple.gradient_yellow_green_oblique_line_A ,

      //constraints:[
      //  { name:'axe'   ,type:'kin_axe', axe:0, distPos: 66.1*s, distNeg: 0.001, limit_lock: 1 },
      //],         

      density:0.001/(s/2.2), 
                      
    } 
    //z_depth += z_depth_incr



    this.bodies.bones.rectangles_center = new body_build({ 
                                            ...opts_global,
                                            ...opts_collision_no_interaction,
                                            ...opts_debug,
                                            ...opts_visual_bones,
                                            dynamic: false,

                                            name:'bones_rectangle_center',
                                            
                                            m:this.m,
                                            parent:this.bodies.bones.root,
                                            //m_offset:om_rA_bones,
                                            m_shape:m_shape_bones,
                                            //z:z_depth, 
                                            constraints:[
                                              {  name:'point' ,type:'kin_point',target:this.bodies.bones.root, stiffness: 1.0,damping:0.1,length:0.01},
                                              {  name:'orient',type:'kin_orient',target:this.bodies.bones.root, stiffness: 1.0,damping:0.1,length:0.01}, 
                                            ], 
                                            density:0.2/(s/2.2), 

                                          })   

    let ray_tmp = 80*(s/2.2)
    let rot_tmp = 0 
    let offset_from_center = new Vector(0,0)
                        
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// RECTANGLES


    rot_tmp = 180+35    

    
    m_shape_bones = new Matrix()
    m_shape_bones.setScale(s*4)

    var om_rD_bones = new Matrix()
    om_rD_bones.setTranslation( -65*(s/2.2), 0)

    var om_rD_bones_transform = new Matrix()
    om_rD_bones_transform.setRotation(rad(rot_tmp+180))  


    let rectangle_pivot_opts = { 
      ...opts_global,
      ...opts_collision_no_interaction,
      ...opts_debug,
      ...opts_visual_bones,
      dynamic: false,

      name:'bones_rectangle_pivot_T__L_',
      
      m:this.m,
      parent:this.bodies.bones.rectangles_center,
      m_offset:om_rD_bones,
      m_transform:om_rD_bones_transform,
      m_shape:m_shape_bones,
      //z:z_depth, 

      constraints:[
        {  name:'point' ,type:'kin_point',target:this.bodies.bones.rectangles_center, stiffness: 1.0,damping:0.1,length:0.01},
        {  name:'orient',type:'kin_orient',target:this.bodies.bones.rectangles_center, stiffness: 1.0,damping:0.1,length:0.01},                                                                                                                                                           
      ],
      density:0.2/(s/2.2),                                               
            
    }


    if(this.is_dynamic)
    {
      rectangle_pivot_opts.constraints.push({ name:'connect_rot_iA', type:'connect', target:this.bodies.inters_step.steps[0][0], 
      attr:'r',
      target_attr:'ty', 
      target_space:'base',
      target_remap:[0,55*(s/2.2),35,0] })
      
      rectangle_pivot_opts.constraints.push(
        { name:'connect_tx_iB', type:'connect_multi', 
        attr:'tx',
        targets:[this.bodies.inters_step.steps[1],this.bodies.inters_step.steps[2]],
        targets_attr:['r','ty'], 
        targets_space:['base','base'],
        targets_remap:[[0,90,0,85*(s/2.2)],[0,110*(s/2.2) , 0,140*(s/2.2)-85*(s/2.2) ]],
        }
      )
      
    }

    
    this.bodies.bones.rectangles_pivots.push(new body_build(rectangle_pivot_opts)) 

    var om_rD = new Matrix()
    om_rD.setTranslation(ray_tmp*-1,0)   
    
    this.bodies.bones.rectangles.push(new body_build({ 
                                            ...opts_global,
                                            ...opts_collision_no_interaction,
                                            ...opts_debug,
                                            ...opts_visual_bones,
                                            dynamic: false,

                                            name:'bones_rectangle_T__L_',
                                            
                                            m:this.m,
                                            parent:this.bodies.bones.rectangles_pivots[0],
                                            m_offset:om_rD, 
                                            m_shape:m_shape_bones,
                                            //z:z_depth, 
                                            
                                            constraints:[
                                              {  name:'point' ,type:'kin_point',target:this.bodies.bones.rectangles_pivots[0], stiffness: 1.0,damping:0.1,length:0.01},
                                              {  name:'orient',type:'kin_orient',target:this.bodies.bones.rectangles_pivots[0], stiffness: 1.0,damping:0.1,length:0.01}, 
                                            ],  

                                            density:0.2/(s/2.2), 

                                          })) 

    let oRect_TL = { ...oRect, 
      name:'geos_rectangle_T__L_',

      parent:this.bodies.bones.rectangles[0],
      //m_offset:om_rD,
      m_shape:m_shape,
      bevel:0,
      castShadow: true,
      receiveShadow: false,
            
      constraints:[
        {  name:'point' ,type:'kin_point',target:this.bodies.bones.rectangles[0], stiffness: 1.0,damping:0.1,length:0.01},
        {  name:'orient',type:'kin_orient',target:this.bodies.bones.rectangles[0], stiffness: 1.0,damping:0.1,length:0.01}, 
      ],

    }  


    this.bodies.geos.rectangles.push(new body_build(oRect_TL))    
      
    if(this.is_dynamic)
    {  
      let oRect_trail = { 
        ...opts_global,
        ...opts_collision_no_interaction,
        ...opts_debug,

        parent:this.bodies.bones.rectangles[0],
        m_shape: m_shape,
        type: utils.shape.rectangle,

        do_shape: true,
        do_line:false,           

        density:0.001/(s/2.2), 

      }  
      this.bodies.effects.movA_trails = build_effects_trail(oRect_trail,this.bodies.geos.rectangles[0])                                

    
    }

    

    // TOP RIGHT
    let axe_x = false
    let axe_y = true
    this.bodies.inters_step.steps[0].push(this.bodies.inters_step.steps[0][0].get_mirror(  axe_x, axe_y))
    this.bodies.bones.rectangles_pivots.push(this.bodies.bones.rectangles_pivots[0].get_mirror( axe_x, axe_y)) 
    this.bodies.bones.rectangles.push(this.bodies.bones.rectangles[0].get_mirror( axe_x, axe_y))
    this.bodies.geos.rectangles.push(this.bodies.geos.rectangles[0].get_mirror( axe_x, axe_y))

    // BOTTOM LEFT
    axe_x = true
    axe_y = false
    this.bodies.inters_step.steps[0].push(this.bodies.inters_step.steps[0][0].get_mirror( axe_x, axe_y))
    this.bodies.bones.rectangles_pivots.push(this.bodies.bones.rectangles_pivots[0].get_mirror( axe_x, axe_y)) 
    this.bodies.bones.rectangles.push(this.bodies.bones.rectangles[0].get_mirror( axe_x, axe_y))
    this.bodies.geos.rectangles.push(this.bodies.geos.rectangles[0].get_mirror( axe_x, axe_y))


    // BOTTOM RIGHT
    axe_x = true
    axe_y = true    
    this.bodies.inters_step.steps[0].push(this.bodies.inters_step.steps[0][0].get_mirror( axe_x, axe_y))
    this.bodies.bones.rectangles_pivots.push(this.bodies.bones.rectangles_pivots[0].get_mirror( axe_x, axe_y)) 
    this.bodies.bones.rectangles.push(this.bodies.bones.rectangles[0].get_mirror( axe_x, axe_y))
    this.bodies.geos.rectangles.push(this.bodies.geos.rectangles[0].get_mirror( axe_x, axe_y))

    
    
    if(this.is_dynamic)
    {
      this.bodies.inters_step.steps[0][0].highlight_selection = [this.bodies.geos.rectangles[0]]
      this.bodies.inters_step.steps[0][1].highlight_selection = [this.bodies.geos.rectangles[1]]
      this.bodies.inters_step.steps[0][2].highlight_selection = [this.bodies.geos.rectangles[2]]
      this.bodies.inters_step.steps[0][3].highlight_selection = [this.bodies.geos.rectangles[3]]
    }




    this.bodies.bones.rectangle = new body_build({ 
      ...opts_global,
      ...opts_collision_no_interaction,
      ...opts_debug,
      ...opts_visual_bones,
      dynamic: false,

      name:'bones_rectangle',
      
      m:this.m,
      parent:this.bodies.bones.root,
      //m_offset:om_rA_bones,
      m_shape:m_shape_bones,
      //z:z_depth, 

      constraints:[      
        { name:'point' ,type:'kin_point' ,target:this.bodies.bones.root},
        { name:'orient',type:'kin_orient',target:this.bodies.bones.root},  
      ],

      density:0.2/(s/2.2), 

    })          

    m_shape = new Matrix()
    m_shape.set_row(0,m_shape.get_row(0).getMult(74*s))
    m_shape.set_row(1,m_shape.get_row(1).getMult(18*s))

    let oRectangle = { 
      ...opts_global,
      ...opts_collision_activate,
      ...opts_debug,

      name:'geos_rectangle',
       
      m:this.m,
      parent:this.bodies.bones.rectangle,
      m_offset:new Matrix(),
      m_shape:m_shape,
      //z:z_depth,
      type : utils.shape.rectangle,

      do_shape: true,
      do_line:true, 
      bevel:0,                                          
      //color : this.colors[1],
      color_line: utils.color.black,
      material_three: materials.background_test ,//materials.simple.gradient_gold_red_A ,
      castShadow: true,
      receiveShadow: false,

      constraints:[
        { name:'point' ,type:'kin_point' ,target:this.bodies.bones.rectangle},
        { name:'orient',type:'kin_orient',target:this.bodies.bones.rectangle},                                                                                  
        //{  name:'axe'   ,type:'kin_axe', axe:0, distPos: 50.0*s, distNeg: 0.001, limit_lock: 1 },               
      ],                                         

      density:0.001/(s/2.2),                                                                                 
    }
    

    if(this.is_dynamic)
    {
      oRectangle.constraints.push({ name:'connect_rot_iB', type:'connect', target:this.bodies.inters_step.steps[1], 
      attr:'r',
      target_attr:'r', 
      target_space:'base',
      target_remap: null })

      oRectangle.constraints.push({ name:'connect_ty_iC', type:'connect', target:this.bodies.inters_step.steps[2], 
      attr:'ty',
      target_attr:'ty', 
      target_space:'base',
      target_remap: null })

    }
    



    this.bodies.geos.rectangle = new body_build(oRectangle)
    
    if(this.is_dynamic)
    {  
      this.bodies.inters_step.steps[1].highlight_selection = [this.bodies.geos.rectangle]  
      this.bodies.inters_step.steps[2].highlight_selection = [this.bodies.geos.rectangle]       
      //this.bodies.inters.rectangle.highlight_selection = [this.bodies.geos.rectangle]   
      this.bodies.effects.movB_trails = build_effects_trail(oRectangle,this.bodies.geos.rectangle)
    



      let opts_sparcles = {
        ...opts_global,
        ...opts_debug,
        //z_depth:z_depth,
        scale_shape:s,
        parent:this.bodies.inters.background      
      }  

      let opts_colA_sparcles = {
        ...opts_sparcles,
        name:'colA',
        p:new Vector(-145*(s/2.2),15*(s/2.2)),
        r:0,      
      }                            
      this.bodies.effects.colA_sparcles = build_effects_particles_sparcles(opts_colA_sparcles) 
      this.bodies.effects.colA_shapes = build_effects_particles_shapes(opts_colA_sparcles)       
      this.bodies.effects.colA_wall = build_effects_wall(opts_colA_sparcles)

      let opts_colB_sparcles = {
        ...opts_sparcles,       
        name:'colB',
        p:new Vector(15*(s/2.2),-80*(s/2.2)),
        r:-90,     
      }                            
      this.bodies.effects.colB_sparcles = build_effects_particles_sparcles(opts_colB_sparcles) 
      this.bodies.effects.colB_shapes = build_effects_particles_shapes(opts_colB_sparcles)       
      this.bodies.effects.colB_wall = build_effects_wall(opts_colB_sparcles)

      let opts_colC_sparcles = {
        ...opts_sparcles,        
        name:'colC',
        p:new Vector(0,200*(s/2.2)),
        r:0,        
      }                            
      this.bodies.effects.colC_sparcles = build_effects_particles_sparcles(opts_colC_sparcles) 
      this.bodies.effects.colC_shapes = build_effects_particles_shapes(opts_colC_sparcles)       
      this.bodies.effects.colC_wall = build_effects_wall(opts_colC_sparcles)


    //z_depth += z_depth_incr

      if(this.is_dynamic)   
      {
        this.create_inter_from_geos(
          ['circle',
          'rectangle',
          'rectangles'], this.bodies.inters.background, s ) 
      }                                         

      /*
      this.create_bones_from_geos(
        ['circle',
        'rectangle',
        'rectangles'], s )        
        */
      }                                          

      this.instance_each_others(
        [ this.bodies.inters_step.steps[0][0],
          this.bodies.inters_step.steps[0][1],
          this.bodies.inters_step.steps[0][2],
          this.bodies.inters_step.steps[0][3],],
        [false,false,
         true,false,
         false,true,
         true,true])

         
        

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
                      this.bodies.effects.movA_trails[0],      
                      this.bodies.effects.movA_trails[1], 
                      this.bodies.effects.movA_trails[2], 
                      this.bodies.effects.movB_trails[0],
                      this.bodies.effects.movB_trails[1],
                      this.bodies.effects.movB_trails[2],                         
                      this.bodies.geos.rectangle,                      
                      this.bodies.geos.rectangles[0],
                      this.bodies.geos.rectangles[1],
                      this.bodies.geos.rectangles[2],
                      this.bodies.geos.rectangles[3],
                      this.bodies.effects.colA_sparcles[0], 
                      this.bodies.effects.colA_sparcles[1],          
                      this.bodies.effects.colA_sparcles[2],
                      this.bodies.effects.colA_shapes[0],
                      this.bodies.effects.colA_shapes[1],
                      this.bodies.effects.colA_shapes[2],
                      this.bodies.effects.colA_wall, 
                      this.bodies.effects.colB_sparcles[0],
                      this.bodies.effects.colB_sparcles[1],
                      this.bodies.effects.colB_sparcles[2],
                      this.bodies.effects.colB_shapes[0],
                      this.bodies.effects.colB_shapes[1],
                      this.bodies.effects.colB_shapes[2],
                      this.bodies.effects.colB_wall,
                      this.bodies.effects.colC_sparcles[0], 
                      this.bodies.effects.colC_sparcles[1],
                      this.bodies.effects.colC_sparcles[2],
                      this.bodies.effects.colC_shapes[0],
                      this.bodies.effects.colC_shapes[1],
                      this.bodies.effects.colC_shapes[2],
                      this.bodies.effects.colC_wall,                      
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
                      this.bodies.bones.rectangles[3],                                                               
            ] 
        let z_depth = z_depth_start
        let z_depth_incr = 0.5//0.1
        for(let i = 0 ; i < this.bodies_draw_order.length; i++)
        {
          if(this.bodies_draw_order[i] == null)
          {
            if(this.debug_mode.show_warning_log)console.log(' z_order - this.bodies_draw_order['+i+'] doesnt exists')
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
          'geos','rectangles',


          'effects','colA_sparcles',      
          'effects','colA_shapes',
          'effects','colA_wall',    
          'effects','movA_trails',       
          'effects','colB_sparcles',
          'effects','colB_shapes',
          'effects','colB_wall',
          'effects','movB_trails', 
          'effects','colC_sparcles', 
          'effects','colC_shapes',
          'effects','colC_wall',                                            
            ]    
 


    this.steps_info = [
      ///////////////////////////////////////////////////////////////////////////////////// 0
      {
        bodies_enable:[this.bodies.inters_step.steps[0][0], 
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
                      this.bodies.bones.rectangles_pivots[3],                    
                    ],

        constraints_disable:[
          //this.bodies.inters.background.constraints.point,
          //this.bodies.inters.background.constraints.orient,
          //this.bodies.inters.background.constraints.rot_limit,
          //this.bodies.inters_step.steps[0].constraints.point,
          //this.bodies.inters_step.steps[0].constraints.orient,
          //this.bodies.inters_step.steps[0].constraints.axe,
          //this.bodies.inters.circle.point,
          //this.bodies.inters.circle.orient,
          //this.bodies.inters_step.steps[1].constraints.point,
          //this.bodies.inters_step.steps[1].constraints.orient,
          //this.bodies.inters_step.steps[1].constraints.rot_limit,
          //this.bodies.inters.rectangle.constraints.point, 
          //this.bodies.inters.rectangle.constraints.orient,
          //this.bodies.inters_step.steps[2].constraints.point,
          //this.bodies.inters_step.steps[2].constraints.orient,
          //this.bodies.inters_step.steps[2].constraints.axe, 
          //this.bodies.geos.circle.constraints.point,
          //this.bodies.geos.circle.constraints.orient,
          //this.bodies.geos.circle.constraints.connect_scale_iA,
          //'bones','circle',null,'connect_scale_iC',
          //this.bodies.bones.rectangles_pivots[0].constraints.point,
          //this.bodies.bones.rectangles_pivots[0].constraints.orient,
          //this.bodies.bones.rectangles_pivots[0].constraints.connect_rot_iA,
          //'bones','rectangles_pivots',0,'connect_rot_iA',
          //'bones','rectangles_pivots',0,'connect_tx_iB',
          //'bones','rectangles_pivots',0,'connect_tx_iC',
          //this.bodies.geos.rectangles[0].constraints.point,
          //this.bodies.geos.rectangles[0].constraints.orient,
          //this.bodies.inters.rectangles[0].constraints.point,
          //this.bodies.inters.rectangles[0].constraints.orient,
          //this.bodies.bones.rectangles_pivots[1].constraints.point,
          //this.bodies.bones.rectangles_pivots[1].constraints.orient,
          //this.bodies.bones.rectangles_pivots[1].constraints.connect_rot_iA,
          //'bones','rectangles_pivots',1,'connect_rot_iA',
          //'bones','rectangles_pivots',1,'connect_tx_iB',
          //'bones','rectangles_pivots',1,'connect_tx_iC',
          //this.bodies.geos.rectangles[1].constraints.point,
          //this.bodies.geos.rectangles[1].constraints.orient,
          //this.bodies.inters.rectangles[1].constraints.point,
          //this.bodies.inters.rectangles[1].constraints.orient,
          //this.bodies.bones.rectangles_pivots[2].constraints.point,
          //this.bodies.bones.rectangles_pivots[2].constraints.orient,
          //this.bodies.bones.rectangles_pivots[2].constraints.connect_rot_iA,
          //'bones','rectangles_pivots',2,'connect_rot_iA',
          //'bones','rectangles_pivots',2,'connect_tx_iB',
          //'bones','rectangles_pivots',2,'connect_tx_iC',
          //this.bodies.geos.rectangles[2].constraints.point,
          //this.bodies.geos.rectangles[2].constraints.orient,
          //this.bodies.inters.rectangles[3].constraints.point,
          //this.bodies.inters.rectangles[3].constraints.orient,
          //this.bodies.bones.rectangles_pivots[3].constraints.point,
          //this.bodies.bones.rectangles_pivots[3].constraints.orient,
          //this.bodies.bones.rectangles_pivots[3].constraints.connect_rot_iA,
          //'bones','rectangles_pivots',3,'connect_rot_iA',
          //'bones','rectangles_pivots',3,'connect_tx_iB',
          //'bones','rectangles_pivots',3,'connect_tx_iC',
          //this.bodies.geos.rectangles[3].constraints.point,
          //this.bodies.geos.rectangles[3].constraints.orient,
          //this.bodies.geos.rectangle.constraints.point,
          //this.bodies.geos.rectangle.constraints.orient,
          'geos','rectangle',null,'connect_rot_iB',
          'geos','rectangle',null,'connect_ty_iC',
        ],

                  
      },///////////////////////////////////////////////////////////////////////////////////// 1
      {
        bodies_enable:[ 
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
          this.bodies.bones.rectangles_pivots[3],           
        ],
        constraints_disable:[
          //this.bodies.inters.background.constraints.point,
          //this.bodies.inters.background.constraints.orient,
          //this.bodies.inters.background.constraints.rot_limit,
          //this.bodies.inters_step.steps[0].constraints.point,
          //this.bodies.inters_step.steps[0].constraints.orient,
          //this.bodies.inters_step.steps[0].constraints.axe,
          //this.bodies.inters.circle.point,
          //this.bodies.inters.circle.orient,
          //this.bodies.inters_step.steps[1].constraints.point,
          //this.bodies.inters_step.steps[1].constraints.orient,
          //this.bodies.inters_step.steps[1].constraints.rot_limit,
          //this.bodies.inters.rectangle.constraints.point, 
          //this.bodies.inters.rectangle.constraints.orient,
          //this.bodies.inters_step.steps[2].constraints.point,
          //this.bodies.inters_step.steps[2].constraints.orient,
          //this.bodies.inters_step.steps[2].constraints.axe, 
          //this.bodies.geos.circle.constraints.point,
          //this.bodies.geos.circle.constraints.orient,
          //this.bodies.geos.circle.constraints.connect_scale_iA,
          //'bones','circle',null,'connect_scale_iC',
          //this.bodies.bones.rectangles_pivots[0].constraints.point,
          //this.bodies.bones.rectangles_pivots[0].constraints.orient,
          //this.bodies.bones.rectangles_pivots[0].constraints.connect_rot_iA,
          //this.bodies.bones.rectangles_pivots[0].constraints.connect_tx_iB,
          //'bones','rectangles_pivots',0,'connect_rot_iA',
          //'bones','rectangles_pivots',0,'connect_tx_iB',
          //'bones','rectangles_pivots',0,'connect_tx_iC',
          //this.bodies.geos.rectangles[0].constraints.point,
          //this.bodies.geos.rectangles[0].constraints.orient,
          //this.bodies.inters.rectangles[0].constraints.point,
          //this.bodies.inters.rectangles[0].constraints.orient,
          //this.bodies.bones.rectangles_pivots[1].constraints.point,
          //this.bodies.bones.rectangles_pivots[1].constraints.orient,
          //this.bodies.bones.rectangles_pivots[1].constraints.connect_rot_iA,
          //this.bodies.bones.rectangles_pivots[1].constraints.connect_tx_iB,
          //'bones','rectangles_pivots',1,'connect_rot_iA',
          //'bones','rectangles_pivots',1,'connect_tx_iB',
          //'bones','rectangles_pivots',1,'connect_tx_iC',
          //this.bodies.geos.rectangles[1].constraints.point,
          //this.bodies.geos.rectangles[1].constraints.orient,
          //this.bodies.inters.rectangles[1].constraints.point,
          //this.bodies.inters.rectangles[1].constraints.orient,
          //this.bodies.bones.rectangles_pivots[2].constraints.point,
          //this.bodies.bones.rectangles_pivots[2].constraints.orient,
          //this.bodies.bones.rectangles_pivots[2].constraints.connect_rot_iA,
          //this.bodies.bones.rectangles_pivots[2].constraints.connect_tx_iB,
          //'bones','rectangles_pivots',2,'connect_rot_iA',
          //'bones','rectangles_pivots',2,'connect_tx_iB',
          //'bones','rectangles_pivots',2,'connect_tx_iC',
          //this.bodies.geos.rectangles[2].constraints.point,
          //this.bodies.geos.rectangles[2].constraints.orient,
          //this.bodies.inters.rectangles[3].constraints.point,
          //this.bodies.inters.rectangles[3].constraints.orient,
          //this.bodies.bones.rectangles_pivots[3].constraints.point,
          //this.bodies.bones.rectangles_pivots[3].constraints.orient,
          //this.bodies.bones.rectangles_pivots[3].constraints.connect_rot_iA,
          //this.bodies.bones.rectangles_pivots[3].constraints.connect_tx_iB,
          //'bones','rectangles_pivots',3,'connect_rot_iA',
          //'bones','rectangles_pivots',3,'connect_tx_iB',
          //'bones','rectangles_pivots',3,'connect_tx_iC',
          //this.bodies.geos.rectangles[3].constraints.point,
          //this.bodies.geos.rectangles[3].constraints.orient,
          //this.bodies.geos.rectangle.constraints.point,
          //this.bodies.geos.rectangle.constraints.orient,
          //this.bodies.geos.rectangle.constraints.connect_rot_iB,    
          'geos','rectangle',null,'connect_ty_iC',
        ],
      }, ///////////////////////////////////////////////////////////////////////////////////// 2 
      {
        bodies_enable:[
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
          this.bodies.bones.rectangles_pivots[3],            
        ],
        constraints_disable:[
          //this.bodies.inters.background.constraints.point,
          //this.bodies.inters.background.constraints.orient,
          //this.bodies.inters.background.constraints.rot_limit,
          //this.bodies.inters_step.steps[0].constraints.point,
          //this.bodies.inters_step.steps[0].constraints.orient,
          //this.bodies.inters_step.steps[0].constraints.axe,
          //this.bodies.inters.circle.point,
          //this.bodies.inters.circle.orient,
          //this.bodies.inters_step.steps[1].constraints.point,
          //this.bodies.inters_step.steps[1].constraints.orient,
          //this.bodies.inters_step.steps[1].constraints.rot_limit,
          //this.bodies.inters.rectangle.constraints.point, 
          //this.bodies.inters.rectangle.constraints.orient,
          //this.bodies.inters_step.steps[2].constraints.point,
          //this.bodies.inters_step.steps[2].constraints.orient,
          //this.bodies.inters_step.steps[2].constraints.axe, 
          //this.bodies.geos.circle.constraints.point,
          //this.bodies.geos.circle.constraints.orient,
          //this.bodies.geos.circle.constraints.connect_scale_iA,
          //this.bodies.geos.circle.constraints.connect_scale_iC,
          //'bones','rectangles_pivots',0,'connect_rot_iA',
          //'bones','rectangles_pivots',0,'connect_tx_iB',
          //'bones','rectangles_pivots',0,'connect_tx_iC',
          //this.bodies.geos.rectangles[0].constraints.point,
          //this.bodies.geos.rectangles[0].constraints.orient,
          //this.bodies.inters.rectangles[0].constraints.point,
          //this.bodies.inters.rectangles[0].constraints.orient,
          //'bones','rectangles_pivots',1,'connect_rot_iA',
          //'bones','rectangles_pivots',1,'connect_tx_iB',
          //'bones','rectangles_pivots',1,'connect_tx_iC',
          //this.bodies.geos.rectangles[1].constraints.point,
          //this.bodies.geos.rectangles[1].constraints.orient,
          //this.bodies.inters.rectangles[1].constraints.point,
          //this.bodies.inters.rectangles[1].constraints.orient,
          //'bones','rectangles_pivots',2,'connect_rot_iA',
          //'bones','rectangles_pivots',2,'connect_tx_iB',
          //'bones','rectangles_pivots',2,'connect_tx_iC',
          //this.bodies.geos.rectangles[2].constraints.point,
          //this.bodies.geos.rectangles[2].constraints.orient,
          //this.bodies.inters.rectangles[3].constraints.point,
          //this.bodies.inters.rectangles[3].constraints.orient,
          //'bones','rectangles_pivots',3,'connect_rot_iA',
          //'bones','rectangles_pivots',3,'connect_tx_iB',
          //'bones','rectangles_pivots',3,'connect_tx_iC',
          //this.bodies.geos.rectangles[3].constraints.point,
          //this.bodies.geos.rectangles[3].constraints.orient,
          //this.bodies.geos.rectangle.constraints.point,
          //this.bodies.geos.rectangle.constraints.orient,
          //this.bodies.geos.rectangle.constraints.connect_rot_iB,
          //this.bodies.geos.rectangle.constraints.connect_ty_iC,   
        ],
      }, ///////////////////////////////////////////////////////////////////////////////////// 3
      {
        bodies_enable:[
          //this.bodies.inters_step.steps[2],
          //this.bodies.inters.background,
          //this.bodies.inters.circle,
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
          //this.bodies.bones.rectangles[0],
          //this.bodies.bones.rectangles[1],
          //this.bodies.bones.rectangles[2],
          //this.bodies.bones.rectangles[3],
          //this.bodies.bones.world,
          //this.bodies.bones.traj, 
          //this.bodies.bones.root,   
          //this.bodies.bones.circle,
          //this.bodies.bones.rectangle,                 
          //this.bodies.bones.rectangles_center,          
          //this.bodies.bones.rectangles_pivots[0],
          //this.bodies.bones.rectangles_pivots[1],
          //this.bodies.bones.rectangles_pivots[2],
          //this.bodies.bones.rectangles_pivots[3],            
        ],
        constraints_disable:[
          //this.bodies.inters.background.constraints.point,
          //this.bodies.inters.background.constraints.orient,
          //this.bodies.inters.background.constraints.rot_limit,
          //this.bodies.inters_step.steps[0].constraints.point,
          //this.bodies.inters_step.steps[0].constraints.orient,
          //this.bodies.inters_step.steps[0].constraints.axe,
          //this.bodies.inters.circle.point,
          //this.bodies.inters.circle.orient,
          //this.bodies.inters_step.steps[1].constraints.point,
          //this.bodies.inters_step.steps[1].constraints.orient,
          //this.bodies.inters_step.steps[1].constraints.rot_limit,
          //this.bodies.inters.rectangle.constraints.point, 
          //this.bodies.inters.rectangle.constraints.orient,
          'inters_step','steps',2,'point',
          //this.bodies.inters_step.steps[2].constraints.point,
          //this.bodies.inters_step.steps[2].constraints.orient,
          //this.bodies.inters_step.steps[2].constraints.axe, 
          //this.bodies.geos.circle.constraints.point,
          //this.bodies.geos.circle.constraints.orient,
          //this.bodies.geos.circle.constraints.connect_scale_iA,
          //this.bodies.geos.circle.constraints.connect_scale_iC,
          //this.bodies.bones.rectangles_pivots[0].constraints.point,
          //this.bodies.bones.rectangles_pivots[0].constraints.orient,
          //this.bodies.bones.rectangles_pivots[0].constraints.connect_rot_iA,
          //this.bodies.bones.rectangles_pivots[0].constraints.connect_tx_iB,
          //this.bodies.bones.rectangles_pivots[0].constraints.connect_tx_iC,
          //this.bodies.geos.rectangles[0].constraints.point,
          //this.bodies.geos.rectangles[0].constraints.orient,
          //this.bodies.inters.rectangles[0].constraints.point,
          //this.bodies.inters.rectangles[0].constraints.orient,
          //this.bodies.bones.rectangles_pivots[1].constraints.point,
          //this.bodies.bones.rectangles_pivots[1].constraints.orient,
          //this.bodies.bones.rectangles_pivots[1].constraints.connect_rot_iA,
          //this.bodies.bones.rectangles_pivots[1].constraints.connect_tx_iB,
          //this.bodies.bones.rectangles_pivots[1].constraints.connect_tx_iC,
          //this.bodies.geos.rectangles[1].constraints.point,
          //this.bodies.geos.rectangles[1].constraints.orient,
          //this.bodies.inters.rectangles[1].constraints.point,
          //this.bodies.inters.rectangles[1].constraints.orient,
          //this.bodies.bones.rectangles_pivots[2].constraints.point,
          //this.bodies.bones.rectangles_pivots[2].constraints.orient,
          //this.bodies.bones.rectangles_pivots[2].constraints.connect_rot_iA,
          //this.bodies.bones.rectangles_pivots[2].constraints.connect_tx_iB,
          //this.bodies.bones.rectangles_pivots[2].constraints.connect_tx_iC,
          //this.bodies.geos.rectangles[2].constraints.point,
          //this.bodies.geos.rectangles[2].constraints.orient,
          //this.bodies.inters.rectangles[3].constraints.point,
          //this.bodies.inters.rectangles[3].constraints.orient,
          //this.bodies.bones.rectangles_pivots[3].constraints.point,
          //this.bodies.bones.rectangles_pivots[3].constraints.orient,
          //this.bodies.bones.rectangles_pivots[3].constraints.connect_rot_iA,
          //this.bodies.bones.rectangles_pivots[3].constraints.connect_tx_iB,
          //this.bodies.bones.rectangles_pivots[3].constraints.connect_tx_iC,
          //this.bodies.geos.rectangles[3].constraints.point,
          //this.bodies.geos.rectangles[3].constraints.orient,
          //this.bodies.geos.rectangle.constraints.point,
          //this.bodies.geos.rectangle.constraints.orient,
          //this.bodies.geos.rectangle.constraints.connect_rot_iB,
          //this.bodies.geos.rectangle.constraints.connect_ty_iC,   
        ],
      },   
    ]                                              

      this.bodies_init_physics()
      this.bodies_init_constraints()
    }
  ////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////// UPDATE
  //////////////////////////////////////////////////////////////////////////////////// 

  get_resolution_coef_info( )
  {   
    // init
    this.state.resolution_coef = 0
    for( let i = 0 ; i < this.state.steps.length; i++)
      this.state.steps[i].resoluton_coef = 0
    this.state.current_step = 0

    // compute info
    for( let i = 0 ; i < this.bodies.inters_step.steps.length; i++)
    {
      if(this.bodies.inters_step.steps[i].constructor === Array )
        this.state.steps[i].resoluton_coef = this.bodies.inters_step.steps[i][0].get_resolution_coef()
      else
        this.state.steps[i].resoluton_coef = this.bodies.inters_step.steps[i].get_resolution_coef()

      this.state.resolution_coef += this.state.steps[i].resoluton_coef
      if(this.state.steps[i].resoluton_coef == 1)
        this.state.current_step = i +1
    }

    /*
    if ( this.anim_mode )
    {
      let s = [0,1,2,3]   
      A = clamp(this.resolution_coef_override ,s[0],s[0]+1)
      B = clamp(this.resolution_coef_override ,s[1],s[1]+1)-s[1]
      C = clamp(this.resolution_coef_override ,s[2],s[2]+1)-s[2]
      D = clamp(this.resolution_coef_override ,s[3],s[3]+1)-s[3]

    }
    */


  }
  

  set_step_resolution()
  {
    //this.bodies_enable(1,['effects'])
    /*
    let debug_body = this.get_selected_body()
    console.log(this.mouse_constraint.constraint.pointA,this.mouse_constraint.constraint.pointB)
    if( debug_body != null )
    {
      console.log(this.fidget_sequence_i,debug_body.name)
    }
    else{
      console.log(this.fidget_sequence_i,null)
    }
    */

    let step = 0
    let res_coef = this.state.steps[step].resoluton_coef
    let do_it = this.state.current_step == step
    if( do_it )
    {
      if(this.state.steps[step].update_count == 0 )
      {    
        this.bodies_enable( 0 )  
        this.bodies_list_enable( 1,this.steps_info[step].bodies_enable )

        this.bodies_constraints_enable( true ) 
        this.constraints_enable(false, this.steps_info[step].constraints_disable )

        this.set_resolution_coef_from_step(step)    
      }

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
      if(this.state.steps[step].update_count == 0 )
      {
        this.bodies_enable( 0 )  
        this.bodies_list_enable( 1,this.steps_info[step].bodies_enable )
          
        this.bodies_constraints_enable( true ) 
        this.constraints_enable(false, this.steps_info[step].constraints_disable )

        this.set_resolution_coef_from_step(step)

        let m = new Matrix(this.bodies.inters.circle.m_shape_init)
        m.scale(1.85,1.85)
        this.bodies.inters.circle.update_shape_coords(m)
        
        //_________________________________________________________________Mouse
        if(this.debug_mode.switch_selected_inter_help)
        {
          this.switch_selection_transition( step, this.get_selected_body(), this.bodies.inters_step.steps[0], this.bodies.inters_step.steps[1])
        }
        else
        {
          //if( (this.bodies.inters_step.steps[0].is_selected == true) &&(userIsInteracting == false) )
          //  switch_selection( this.mouse_constraint, null)  
        }        
      }       
   
      //_________________________________________________________________effects
      anim_effect({
        count:this.state.steps[step].update_count,
        sparcles:this.bodies.effects.colA_sparcles,
        shapes:this.bodies.effects.colA_shapes,
        wall:this.bodies.effects.colA_wall,
        trails:this.bodies.effects.movA_trails,
      })
       


          
      //_________________________________________________________________Update
      this.update_step_count(step)
    
    }  
  
    ////////////////////////////////////////////////////////////////////////////////////
    step = 2
    res_coef = this.state.steps[step].resoluton_coef
    do_it = this.state.current_step == step
    if( do_it )
    {
      if(this.state.steps[step].update_count == 0 )
      {
        this.bodies_enable( 0 ) 
        this.bodies_list_enable( 1,this.steps_info[step].bodies_enable )
          
        this.bodies_constraints_enable( true ) 
        this.constraints_enable(false, this.steps_info[step].constraints_disable )

        this.set_resolution_coef_from_step(step)

        //_________________________________________________________________Mouse
        if(this.debug_mode.switch_selected_inter_help)
        {      
          this.switch_selection_transition( step, this.get_selected_body(), this.bodies.inters_step.steps[1], this.bodies.inters_step.steps[2]) 
        }      
        else
        {
          //if( (this.bodies.inters_step.steps[1].is_selected == true) &&(userIsInteracting == false) )
          //  switch_selection( this.mouse_constraint, null)
        }          
      }   
      //_________________________________________________________________Control
      //_________________________________________________________________effects
      anim_effect({
        count:this.state.steps[step].update_count,
        sparcles:this.bodies.effects.colB_sparcles,
        shapes:this.bodies.effects.colB_shapes,
        wall:this.bodies.effects.colB_wall,
        trails:this.bodies.effects.movB_trails,
      })
      
  
      
      //_________________________________________________________________Update
      //this.state.switch_selection_happened_step = step
      this.update_step_count(step)   
      
      if(this.anim_mode)
        this.m.setTranslation(this.screen_dims.x/2,this.screen_dims.y/2)
        
    } 


    ////////////////////////////////////////////////////////////////////////////////////
    step = 3
    res_coef = this.state.steps[step].resoluton_coef
    do_it = this.state.current_step == step
    if( do_it )
    {
      if(this.state.steps[step].update_count == 0 )
      {
        this.bodies_enable( 0 )
        this.bodies_list_enable( 1, this.steps_info[step].bodies_enable )
          
        this.bodies_constraints_enable( true ) 
        this.constraints_enable(false, this.steps_info[step].constraints_disable )

        this.set_resolution_coef_from_step(step)

        if(this.debug_mode.switch_selected_inter_help)
        {      
          this.Mouse.switch_selection( null)
        }      
        else
        {
          //if( (this.bodies.inters_step.steps[1].is_selected == true) &&(userIsInteracting == false) )
          //  switch_selection( this.mouse_constraint, null)
        }         
      }      

      //_________________________________________________________________Clean Inter
      //_________________________________________________________________Clean Other
      //_________________________________________________________________Control
      //_________________________________________________________________effects

      anim_effect({
        count:this.state.steps[step].update_count,
        sparcles:this.bodies.effects.colC_sparcles,
        shapes:this.bodies.effects.colC_shapes,
        wall:this.bodies.effects.colC_wall,
        trails:this.bodies.effects.movB_trails,
      })
     
      //_________________________________________________________________Mouse
      
      //if(this.debug_mode.switch_selected_inter_help)
      //{
      //  this.switch_selection_transition( step, this.get_selected_body(), this.bodies.inters_step.steps[1], this.bodies.inters_step.steps[2]) 
      //}
      //else
      //{
      //  //if( (this.bodies.inters_step.steps[1].is_selected == true) &&(userIsInteracting == false) )
      //  //  switch_selection( this.mouse_constraint, null)  
      //}
        
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
      else{
        
        
        let y_offset = res_coef * this.screen_dims.y/2.*1.1 
        this.m.setTranslation(this.screen_dims.x/2,this.screen_dims.y/2+y_offset)
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
    this.bodies_enable(false,['effects'])
    this.bodies_constraints_enable(false, ['geos'])
    
    


    
    // custom color
    this.bodies_override_color(null, ['geos'])
    this.bodies_override_color_three(null, ['geos'])
    
    this.bodies.geos.circle.apply_force( this.bodies.geos.circle.get_out_position('world'),
                                        new Vector(0,0.05*1.9))
    
    this.bodies.geos.rectangle.apply_force( this.bodies.geos.rectangle.get_out_position('world'),
                                        new Vector(0,0.05*0.4))
    
    this.bodies.geos.rectangles[0].apply_force( this.bodies.geos.rectangles[0].get_out_position('world'),
                                        new Vector(0,0.05*0.01))

    this.bodies.geos.rectangles[1].apply_force( this.bodies.geos.rectangles[1].get_out_position('world'),
                                        new Vector(0,0.05*0.01))

    this.bodies.geos.rectangles[2].apply_force( this.bodies.geos.rectangles[2].get_out_position('world'),
                                        new Vector(0,0.05*0.01))
    
    this.bodies.geos.rectangles[3].apply_force( this.bodies.geos.rectangles[3].get_out_position('world'),
                                        new Vector(0,0.05*0.01))
                                        
            
        
    
    if( this.state.steps[step].apply_force_happened == false )
    {
        let p = this.m.get_row(2).get_value()
        let p_force = new Vector(p.x+2.1,p.x+50/2.4*this.s)
        let v_force = new Vector(0,-0.05*8)

      this.bodies.geos.circle.apply_force( p_force,
                                          v_force)
      
      this.bodies.geos.rectangle.apply_force( p_force,
                                          v_force)
      
      this.bodies.geos.rectangles[0].apply_force( this.bodies.geos.rectangles[0].get_out_position('world'),
                                          new Vector(-0.05*0.35, 0))

      this.bodies.geos.rectangles[1].apply_force( this.bodies.geos.rectangles[1].get_out_position('world'),
                                          new Vector(-0.05*0.35, -0.05*0.35))   

      this.bodies.geos.rectangles[2].apply_force( this.bodies.geos.rectangles[2].get_out_position('world'),
                                          new Vector(0.05*0.35, 0))

      this.bodies.geos.rectangles[3].apply_force( this.bodies.geos.rectangles[3].get_out_position('world'),
                                          new Vector(0.05*0.35, -0.05*0.35))

      this.state.steps[step].apply_force_happened = true
    }
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
        let v_delta = p_last.getSub(p_first)
        
        if( 0.01 < v_delta.mag() )
        {

          let selected_step = this.get_selected_step()
          if( selected_step == null )
          {
            this.bodies_override_color(utils.color.black, ['geos'])
            this.bodies_override_color_three(utils.color.black, ['geos'])
            if( this.bodies.geos.backgrounds.length !== 0 )
            {
              this.bodies.geos.backgrounds[0].color = utils.color.red
              this.bodies.geos.backgrounds[1].color = utils.color.red
              this.bodies.geos.backgrounds[0].update_color_three_shape()
              this.bodies.geos.backgrounds[1].update_color_three_shape()
            }

           
          }
          else
          {
            if(this.state.current_step == selected_step)this.show_step_helpers[selected_step] = 100
          }
              
        }
      }
    }
    else if( 0 < this.mouse_pressed_positions_at_update.length )
    {
      this.bodies_override_color(null, ['geos'])
      this.bodies_override_color_three(null, ['geos'])
      //this.color_background = utils.color.dark
      this.mouse_pressed_positions_at_update = []
    }
    else
    {
      this.mouse_pressed_positions_at_update = []
    }
    
  }


  update()
  {
    
    this.state.update_count += 1

    if(this.play_animation == 'entrance')
      this.override_with_animation_reverse_build(0)

    if(this.play_animation == 'idle')
      this.override_with_idle()
        
    this.anim_mode =  this.resolution_coef_override != null
    // resolution

    if(this.is_dynamic)
    {
      this.state.resolution_coef_last = this.state.resolution_coef
      this.get_resolution_coef_info( this.resolution_coef_override )
      this.set_step_resolution()
      //this.track_user_drag_error()  
    }

    this.bodies_update()
    
    this.draw_background()

    

    return true
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
      this.bodies.helpers.stepA.update_color_three_line()
    }

    if(this.show_step_helpers[1] )
    {
      let coef = this.show_step_helpers[1] / 100 
      this.bodies.helpers.stepB.transparency_line = 1.-coef
      this.show_step_helpers[1] -= 2
      this.bodies.helpers.stepB.update_color_three_line()
    }

    if(this.show_step_helpers[2] )
    {
      let coef = this.show_step_helpers[2] / 100 
      this.bodies.helpers.stepC.transparency_line = 1.-coef
      this.show_step_helpers[2] -= 2
      this.bodies.helpers.stepC.update_color_three_line()
    }
    

  }  

  
  setup_shapes_three()
  {
    this.bodies_setup_shapes_three()
  }

  animate_three()
  {
    this.bodies_animate_three()
    //this.draw_help_three()

  }  


  override_with_idle()
  {  
    this.bodies_set_dynamic(false)
    this.bodies_constraints_enable(false,['bones'])
    let t = this.state.update_count

    this.bodies.bones.traj.set_out_position(new Vector(Math.sin(t*0.01)*10 ,Math.sin(t*0.05)*10),'base','override')
    this.bodies.bones.traj.set_out_rotation(Math.sin(t*0.03)*0.1,'base','override')

    this.bodies.bones.rectangles_pivots[0].set_out_rotation(Math.sin(t*0.04)*rad(-10),'base','override')
    this.bodies.bones.rectangles_pivots[1].set_out_rotation(Math.sin(t*0.04)*rad(10),'base','override')
    this.bodies.bones.rectangles_pivots[2].set_out_rotation(Math.sin(t*0.04)*rad(-10),'base','override')
    this.bodies.bones.rectangles_pivots[3].set_out_rotation(Math.sin(t*0.04)*rad(10),'base','override')

  }

  override_with_animation_reverse_build( start_time )
  {  
    let t = this.state.update_count
    let anim_duration = 100

    if( start_time+anim_duration == t)
    {
      this.bodies_set_dynamic()
      this.bodies_constraints_enable(true,['bones'])  
      this.constraints_enable(false, this.steps_info[0].constraints_disable )
      return false
    }     
    if( start_time+anim_duration < t)
    {
      return false
    }
      

    this.bodies_set_dynamic(false)
    this.bodies_constraints_enable(false,['bones'])
    
    let times       = [     start_time+0,  start_time+20  , ]
    let positions   = [new Vector(0,500),new Vector(0,0), ]
    let rotations   = []
    let scales      = []
    let interp_modes = [               'linear'         , ]

    this.bodies.bones.traj.set_out_position( anim_vectors( t, times, positions,interp_modes),'base','override')

    times        = [     start_time+20,    start_time+30,     start_time+50, ]
    positions    = [new Vector(0,110),  new Vector(0,0), new Vector(0,0), ]
    rotations    = [          rad(90),          rad(90),          rad(0), ]
    scales      = []
    interp_modes = [                          'linear',        'smooth', ]

    this.bodies.bones.rectangle.set_out_position( anim_vectors( t, times, positions,interp_modes),'base','override')
    this.bodies.bones.rectangle.set_out_rotation( anim_values( t, times, rotations,interp_modes),'base','override')


    positions    = []
    rotations    = []
    scales       = [              0.45,               2,               1, ]
    interp_modes = [                          'linear',        'smooth', ]

    this.bodies.bones.circle.set_out_scale( anim_values( t, times, scales,interp_modes),'base','override')

    
    scales       = []
    interp_modes = [                          'linear',        'smooth', ]
    
    rotations    = [          rad(35),          rad(35),          rad(0), ]
    positions    = [    new Vector(-75,0),  new Vector(65,0), new Vector(65,0), ]
    this.bodies.bones.rectangles_pivots[0].set_out_position( anim_vectors( t, times, positions, interp_modes),'parent','override')
    this.bodies.bones.rectangles_pivots[0].set_out_rotation( anim_values( t, times, rotations, interp_modes),'base','override')

    rotations    = [          rad(35),          rad(35),          rad(0), ]
    positions    = [    new Vector(75,0),  new Vector(-65,0), new Vector(-65,0), ]
    this.bodies.bones.rectangles_pivots[2].set_out_position( anim_vectors( t, times, positions, interp_modes),'parent','override')
    this.bodies.bones.rectangles_pivots[2].set_out_rotation( anim_values( t, times, rotations, interp_modes),'base','override')
    
    rotations    = [          rad(-35),          rad(-35),          rad(0), ]
    positions    = [    new Vector(-75,0),  new Vector(65,0), new Vector(65,0), ]
    this.bodies.bones.rectangles_pivots[1].set_out_position( anim_vectors(  t, times, positions, interp_modes),'parent','override')
    this.bodies.bones.rectangles_pivots[1].set_out_rotation( anim_values( t, times, rotations, interp_modes),'base','override')
    
    rotations    = [          rad(-35),          rad(-35),          rad(0), ]
    positions    = [    new Vector(75,0),  new Vector(-65,0), new Vector(-65,0), ]
    this.bodies.bones.rectangles_pivots[3].set_out_position( anim_vectors(  t, times, positions, interp_modes),'parent','override')  
    this.bodies.bones.rectangles_pivots[3].set_out_rotation( anim_values( t, times, rotations, interp_modes),'base','override')
    


    return true

  }
}

  
  