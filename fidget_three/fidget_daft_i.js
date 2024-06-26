
import fidget from './fidget.js';
import { utils,switch_selection,clamp,rad,deg,userIsInteracting,mouseX, mouseY } from './utils.js';
import body_build from './body.js';
import Vector from './vector.js';
import Matrix from './matrix.js';
import * as ut from './utils_three.js';
import { and } from './libraries/jsm/nodes/Nodes.js';


export default class fidget_daft_i extends fidget{

  ////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////// SETUP
  ////////////////////////////////////////////////////////////////////////////////////

    constructor(m,s,screen_dims,matter_engine,mouse_constraint,shaders = [],debug=false,random_color = true)
    {
        super(m, s, screen_dims,matter_engine,mouse_constraint,shaders, debug)

        this.title = 'dafti'

        this.bodies = {
          inters : {
            background:null,
            circle:null,
            rectangle:null,
            rectangles:[],
            A:null,
            B:null,
            C:null,
            test:[],
          },
          geos : {
            backgrounds:[],
            circle:null,
            rectangle:null,
            rectangles:[],
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
        this.bodies_draw_order = [
            'geos','backgrounds', 
            'inters','background',
            'inters','circle',
            'inters','rectangle',
            'inters','rectangles',
            'inters','B',
            'inters','C',
            'inters','A',              
            'geos','circle',
            'effects','movB_trails',
            'geos','rectangle',  
            'effects','movA_trails',       
            'geos','rectangles',
            //'helpers','stepA',
            //'helpers','stepB',
            //'helpers','stepC', 
            'effects','colA_sparcles',       
            'effects','colA_shapes',
            'effects','colA_wall',           
            'effects','colB_sparcles', 
            'effects','colB_shapes', 
            'effects','colB_wall', 
            'effects','colC_sparcles', 
            //'effects','colC_shapes',
            //'effects','colC_wall',    
            'inters','test',                                     
            ]   
  
      
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
      


    /////////////////////////////////////////////////////   
    let z_depth = 0
    let z_depth_incr = 0.1

    let m_shape = new Matrix()
    m_shape.set_row(0,m_shape.get_row(0).getMult(this.screen_dims.x/2))
    m_shape.set_row(1,m_shape.get_row(1).getMult(this.screen_dims.y))
    
    let oBackground = {
      m:this.m,
      z:z_depth, 
      m_shape: m_shape,
      do_shape: true,
      do_line:true,         
      color: this.color_background,
      color_line: utils.color.black,
      collision_category: utils.collision_category.none,
      collision_mask: utils.collision_category.none,
      type: utils.shape.rectangle,
      density:0.01, 
      screen_dims: this.screen_dims,
      matter_engine: this.matter_engine,
      mouse_constraint: this.mouse_constraint,
      //texture_three: text_checker_three_grey,
    } 
    z_depth += z_depth_incr

    let mo_background_L = new Matrix()                                    
    mo_background_L.setTranslation(this.screen_dims.x/4,this.screen_dims.y/2)   

    this.bodies.geos.backgrounds.push(new body_build({ ...oBackground,
                                                name:'geo_background_L',
                                                m_offset:mo_background_L, 
                                                collision:false, 
                                                debug_matrix_info: false,
                                                debug_matrix_axes: debug.matrix_axes,  
                                                debug_cns_axes: debug.cns_axes,  
                                                debug_force_visibility: debug.force_visibility,                                          
                                              })) 
    let mo_background_R = new Matrix()                                    
    mo_background_R.setTranslation(this.screen_dims.x/4*3,this.screen_dims.y/2)    

    this.bodies.geos.backgrounds.push(new body_build({ ...oBackground,
                                                name:'geo_background_R', 
                                                m_offset:mo_background_R,
                                                collision:false,  
                                                debug_matrix_info: false,
                                                debug_matrix_axes: debug.matrix_axes,  
                                                debug_cns_axes: debug.cns_axes,  
                                                debug_force_visibility: debug.force_visibility,                                                                                                     
                                              })) 
                                            

    /////////////////////////////////////////////////////  

    m_shape = new Matrix()
    m_shape.set_row(0,m_shape.get_row(0).getMult(350/2.4*s))
    m_shape.set_row(1,m_shape.get_row(1).getMult(220/2.4*s))
    

    this.bodies.inters.background = new body_build({
      screen_dims: this.screen_dims,
      matter_engine: this.matter_engine, 
      mouse_constraint: this.mouse_constraint,

      name:'inter_background',
      highlight_selection:[],  
      
      m:this.m,
      parent:null,
      m_offset:new Matrix(),
      m_shape:m_shape,
      z:z_depth,
      type : utils.shape.rectangle,

      do_shape: true,
      do_line:true,                                           
      color:utils.color.grey,
      color_line: utils.color.black,
      texture_three: text_checker_three_grey, 
      shader: this.shaders.length != 0 ? this.shaders[0] : null,
      collision_category: utils.collision_category.none,
      collision_mask: utils.collision_category.none,
      //collision_category: utils.collision_category.inter,
      //collision_mask: utils.collision_category.mouse,
      constraints:[
        { name:'point'    ,type:'dyn_point', stiffness: 0.05,damping:0.01,length:0.01},
        { name:'orient'   ,type:'dyn_orient',stiffness: 0.2,damping:0.01,length:0.01},
        { name:'rot_limit',type:'kin_limit', x_min:-50,x_max:50,y_min:-50,y_max:50,rot_min:rad(-20),rot_max:rad(20)},
      ],    

      density:0.01, 
      frictionAir:0.3,  
      
      debug_matrix_info: false,
      debug_matrix_axes: debug.matrix_axes,  
      debug_cns_axes: debug.cns_axes,   
      debug_force_visibility: debug.force_visibility,                                                     
    })

    


    // build
    m_shape = new Matrix()
    m_shape.set_row(0,m_shape.get_row(0).getMult(50*s))
    m_shape.set_row(1,m_shape.get_row(1).getMult(50*s))
        
    this.bodies.geos.circle = new body_build({
                                    screen_dims: this.screen_dims,
                                    matter_engine: this.matter_engine,
                                    mouse_constraint: this.mouse_constraint,

                                    name:'geo_circle',

                                    m:this.m,
                                    parent:this.bodies.inters.background,
                                    m_offset:new Matrix(),
                                    m_shape: m_shape,
                                    z:z_depth,
                                    type:utils.shape.circle,

                                    do_shape: true,
                                    do_line:true,                                         
                                    color: this.colors[0],
                                    color_line: utils.color.black,
                                    texture_three: text_checker_three,
                                    shader: this.shaders.length != 0 ? this.shaders[0] : null,

                                    collision_category: utils.collision_category.blue,
                                    collision_mask: utils.collision_category.default ,    
                                    constraints:[
                                      { name:'point' ,type:'kin_point' ,target:this.bodies.inters.background},
                                      { name:'orient',type:'kin_orient',target:this.bodies.inters.background},
                                      //{  name:'point' ,type:'dyn_point',target:this.bodies.inters.background, stiffness: 0.1,damping:0.01,length:0.01},
                                      //{  name:'orient',type:'dyn_orient',target:this.bodies.inters.background,stiffness: 0.1,damping:0.01,length:0.01},                                          
                                    ],                                      
                                    density:0.001,     
                                    
                                    debug_matrix_info: false,
                                    debug_matrix_axes: debug.matrix_axes,  
                                    debug_cns_axes: debug.cns_axes,    
                                    debug_force_visibility: debug.force_visibility,                                                                                 
                                    })

    
      let scale_inter = 40.0 
      
      
      // build
      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(50*s+scale_inter))
      m_shape.set_row(1,m_shape.get_row(1).getMult(50*s+scale_inter))

      this.bodies.inters.circle = new body_build({
        screen_dims: this.screen_dims,
        matter_engine: this.matter_engine,
        mouse_constraint: this.mouse_constraint,

        name:'inter_circle',
        highlight_selection:[this.bodies.geos.circle],  

        m:this.m,
        parent:this.bodies.inters.background,
        m_offset:new Matrix(),
        m_shape:m_shape,
        z:z_depth,
        type:utils.shape.circle,

        do_shape: true,
        do_line:true,                                         
        color:utils.color.grey,
        color_line: utils.color.black,
        texture_three: text_checker_three_grey, 
        shader: this.shaders.length != 0 ? this.shaders[0] : null,

        collision_category: utils.collision_category.inter,
        collision_mask: utils.collision_category.mouse, 
        constraints:[
          {  name:'point' ,type:'dyn_point',target:this.bodies.inters.background, stiffness: 0.999,damping:0.1,length:0.01},
          {  name:'orient',type:'kin_orient',target:this.bodies.inters.background,stiffness: 1.0,damping:0.1,length:0.01},                                          
        ],                                      
        density:0.01,     
        
        debug_matrix_info: false,
        debug_matrix_axes: debug.matrix_axes,  
        debug_cns_axes: debug.cns_axes,    
        debug_force_visibility: debug.force_visibility,                                                                                 
        })


                                        
      z_depth += z_depth_incr  

      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(74*s))
      m_shape.set_row(1,m_shape.get_row(1).getMult(18*s))

      let oRectangle = { 
        screen_dims: this.screen_dims,
        matter_engine: this.matter_engine,  
        mouse_constraint: this.mouse_constraint,

        name:'geo_rectangle',
         

        m:this.m,
        parent:this.bodies.inters.background,
        m_offset:new Matrix(),
        m_shape:m_shape,
        z:z_depth,
        type : utils.shape.rectangle,

        do_shape: true,
        do_line:true,                                           
        color : this.colors[1],
        color_line: utils.color.black,
        //texture_three: text_checker_three, 
        shader: this.shaders.length != 0 ? this.shaders[0] : null,

        collision_category : utils.collision_category.green,
        collision_mask : utils.collision_category.default, 
        constraints:[
          //{  name:'point' ,type:'dyn_point',target:this.bodies.inters.background, stiffness: 0.1,damping:0.01,length:0.01},
          //{  name:'orient',type:'dyn_orient',target:this.bodies.inters.background,stiffness: 0.1,damping:0.01,length:0.01},  
          { name:'point' ,type:'kin_point' ,target:this.bodies.inters.background},
          { name:'orient',type:'kin_orient',target:this.bodies.inters.background},                                                                                  
          {  name:'axe'   ,type:'kin_axe', axe:0, distPos: 50.0*s, distNeg: 0.001 },
        ],                                         

        density:0.001, 

        debug_matrix_info: false,
        debug_matrix_axes: debug.matrix_axes,  
        debug_cns_axes: debug.cns_axes,      
        debug_force_visibility: debug.force_visibility,                                                                                 
      }


      this.bodies.geos.rectangle = new body_build(oRectangle)

      
      this.bodies.effects.movB_trails.push(new body_build({ ...oRectangle, 
                                              name:'effect_movB_trails1',

                                              do_shape: true,
                                              do_line:false,                                         
                                              color:utils.color.red,
                                              //color_line: utils.color.black,
                                              //texture_three: text_checker_three_grey, 

                                              collision_category: utils.collision_category.none,
                                              collision_mask: utils.collision_category.none,                                               
                                              constraints:[
                                                {  name:'point' ,type:'kin_point',target:this.bodies.geos.rectangle,  stiffness: 0.15},
                                                {  name:'orient',type:'kin_orient',target:this.bodies.geos.rectangle, stiffness: 0.15}, 
                                              ],


                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,     
                                              debug_force_visibility: debug.force_visibility,                                                          
                                            }))    
      this.bodies.effects.movB_trails.push(new body_build({ ...oRectangle, 
                                              name:'effect_movB_trails2',

                                              do_shape: true,
                                              do_line:false,                                         
                                              color:utils.color.blue,
                                              //color_line: utils.color.black,
                                              //texture_three: text_checker_three_grey, 

                                              collision_category: utils.collision_category.none,
                                              collision_mask: utils.collision_category.none,                                               
                                              constraints:[
                                                {  name:'point' ,type:'kin_point',target:this.bodies.geos.rectangle,  stiffness: 0.2},
                                                {  name:'orient',type:'kin_orient',target:this.bodies.geos.rectangle, stiffness: 0.2}, 
                                              ],

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,     
                                              debug_force_visibility: debug.force_visibility,                                                          
                                            }))  
                                                                                    
      this.bodies.effects.movB_trails.push(new body_build({ ...oRectangle, 
                                              name:'effect_movB_trails3',

                                              do_shape: true,
                                              do_line:false,                                         
                                              color:utils.color.green,
                                              //color_line: utils.color.black,
                                              //texture_three: text_checker_three_grey, 

                                              collision_category: utils.collision_category.none,
                                              collision_mask: utils.collision_category.none,                                               
                                              constraints:[
                                                {  name:'point' ,type:'kin_point',target:this.bodies.geos.rectangle,  stiffness: 0.3},
                                                {  name:'orient',type:'kin_orient',target:this.bodies.geos.rectangle, stiffness: 0.3}, 
                                              ],

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,     
                                              debug_force_visibility: debug.force_visibility,                                                          
                                            }))     




      scale_inter = 10.0                                      
      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(74*s+scale_inter))
      m_shape.set_row(1,m_shape.get_row(1).getMult(18*s+scale_inter))

      this.bodies.inters.rectangle = new body_build({ 
        screen_dims: this.screen_dims,
        matter_engine: this.matter_engine,  
        mouse_constraint: this.mouse_constraint,

        name:'inter_rectangle',
        highlight_selection:[this.bodies.geos.rectangle],  
         

        m:this.m,
        parent:this.bodies.inters.background,
        m_offset:new Matrix(),
        m_shape: m_shape,
        z:z_depth,
        type : utils.shape.rectangle,

        do_shape: true,
        do_line:true,                                         
        color:utils.color.grey,
        color_line: utils.color.black,
        texture_three: text_checker_three_grey, 

        collision_category: utils.collision_category.inter,
        collision_mask: utils.collision_category.mouse, 
        constraints:[
          {  name:'point' ,type:'dyn_point',target:this.bodies.inters.background, stiffness: 0.999,damping:0.1,length:0.01},
          {  name:'orient',type:'kin_orient',target:this.bodies.inters.background,stiffness: 1.0,damping:0.1,length:0.01}, 
        ],

        density:0.01, 

        debug_matrix_info: false,
        debug_matrix_axes: debug.matrix_axes,  
        debug_cns_axes: debug.cns_axes,      
        debug_force_visibility: debug.force_visibility,                                                                                 
      })

                                            
      // other




      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(16.21*s))
      m_shape.set_row(1,m_shape.get_row(1).getMult(3.51*s))

      let oRect = {
        screen_dims: this.screen_dims,
        matter_engine: this.matter_engine, 
        mouse_constraint: this.mouse_constraint,

        m:this.m,
        parent:this.bodies.inters.background,
        m_shape: m_shape,
        z:z_depth, 
        type: utils.shape.rectangle,

        do_shape: true,
        do_line:true,           
        color: this.colors[2],
        color_line: utils.color.black,
        //texture_three: text_checker_three,
        shader: this.shaders.length != 0 ? this.shaders[0] : null,

        collision_category: utils.collision_category.blue,
        collision_mask: utils.collision_category.default,// | utils.collision_category.blue,
        constraints:[
          { name:'axe'   ,type:'kin_axe', axe:0, distPos: 66.1*s, distNeg: 0.001 },
        ],         

        density:0.001, 
                        
      } 
      z_depth += z_depth_incr
  
      let ray_tmp = 80
      let rot_tmp = 0 
      let offset_from_center = new Vector(0,0)
  
  
      // right 
      rot_tmp = 0-35  
      offset_from_center = new Vector(65,0)    

      var om_rA = new Matrix()
      om_rA.setTranslation(
        offset_from_center.x()+Math.cos(rad(rot_tmp))*ray_tmp,
        offset_from_center.y()+Math.sin(rad(rot_tmp))*ray_tmp)   
      om_rA.setRotation(rad(rot_tmp+180))                                       
      this.bodies.geos.rectangles.push(new body_build({ ...oRect, 
                                              name:'geo_rectangle_TR',

                                              m_offset:om_rA,

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            })) 

      scale_inter = 40.0                                       
      let m_shape_modif = new Matrix()
      m_shape_modif.set_row(0,m_shape_modif.get_row(0).getMult(16.21*s+scale_inter))
      m_shape_modif.set_row(1,m_shape_modif.get_row(1).getMult(3.51*s+scale_inter))                                            
      this.bodies.inters.rectangles.push(new body_build({ ...oRect, 
                                              name:'inter_rectangle_TR',
                                              highlight_selection:[this.bodies.geos.rectangles[0]],  

                                              m_offset:om_rA,
                                              m_shape:m_shape_modif,

                                              do_shape: true,
                                              do_line:true,                                         
                                              color:utils.color.grey,
                                              color_line: utils.color.black,
                                              texture_three: text_checker_three_grey, 
      
                                              collision_category: utils.collision_category.inter,
                                              collision_mask: utils.collision_category.mouse, 
                                              constraints:[
                                                {  name:'point' ,type:'dyn_point',target:this.bodies.inters.background, target_pos_offset:om_rA.get_row(2), stiffness: 0.999,damping:0.1,length:0.01},
                                                {  name:'orient',type:'kin_orient',target:this.bodies.inters.background, target_pos_offset:om_rA.get_row(2), stiffness: 1.0,damping:0.1,length:0.01}, 
                                              ],
                                              density:0.2, 

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            }))                                             
  
      rot_tmp = 0+35  
      offset_from_center = new Vector(65,0)   

      var om_rB = new Matrix()
      om_rB.setTranslation(
        offset_from_center.x()+Math.cos(rad(rot_tmp))*ray_tmp,
        offset_from_center.y()+Math.sin(rad(rot_tmp))*ray_tmp) 
      om_rB.setRotation(rad(rot_tmp+180))            
      this.bodies.geos.rectangles.push(new body_build({ ...oRect, 
                                              name:'geo_rectangle_BR', 
                                              

                                              m_offset:om_rB,
                                              m_shape:m_shape,

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,
                                              debug_cns_axes: debug.cns_axes,    
                                              debug_force_visibility: debug.force_visibility,                                                    
                                            })) 
  
      this.bodies.inters.rectangles.push(new body_build({ ...oRect, 
                                              name:'inter_rectangle_BR',
                                              highlight_selection:[this.bodies.geos.rectangles[1]],   

                                              m_offset:om_rB,
                                              m_shape:m_shape_modif,

                                              do_shape: true,
                                              do_line:true,                                         
                                              color:utils.color.grey,
                                              color_line: utils.color.black,
                                              texture_three: text_checker_three_grey, 
      
                                              collision_category: utils.collision_category.inter,
                                              collision_mask: utils.collision_category.mouse, 
                                              constraints:[
                                                {  name:'point' ,type:'dyn_point',target:this.bodies.inters.background, target_pos_offset:om_rB.get_row(2), stiffness: 0.999,damping:0.1,length:0.01},
                                                {  name:'orient',type:'kin_orient',target:this.bodies.inters.background, target_pos_offset:om_rB.get_row(2),stiffness: 1.0,damping:0.1,length:0.01}, 
                                              ],

                                              density:0.2, 
                                                                                            
                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            }))  

      // left
  
      rot_tmp = 180-35  
      offset_from_center = new Vector(-65,0)

      var om_rC = new Matrix()
      om_rC.setTranslation(
        offset_from_center.x()+Math.cos(rad(rot_tmp))*ray_tmp,
        offset_from_center.y()+Math.sin(rad(rot_tmp))*ray_tmp)  
      om_rC.setRotation(rad(rot_tmp+180))             
      this.bodies.geos.rectangles.push(new body_build({ ...oRect,
                                              name:'geo_rectangle_BL',   

                                              m_offset:om_rC,
                                              m_shape:m_shape, 

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,
                                              debug_cns_axes: debug.cns_axes,    
                                              debug_force_visibility: debug.force_visibility,                                                    
                                            })) 
                                            
      this.bodies.inters.rectangles.push(new body_build({ ...oRect, 
                                              name:'inter_rectangle_BL',
                                              highlight_selection:[this.bodies.geos.rectangles[2]],   

                                              m_offset:om_rC,
                                              m_shape:m_shape_modif,

                                              do_shape: true,
                                              do_line:true,                                         
                                              color:utils.color.grey,
                                              color_line: utils.color.black,
                                              texture_three: text_checker_three_grey, 
      
                                              collision_category: utils.collision_category.inter,
                                              collision_mask: utils.collision_category.mouse, 
                                              constraints:[
                                                {  name:'point' ,type:'dyn_point',target:this.bodies.inters.background, target_pos_offset:om_rC.get_row(2), stiffness: 0.999,damping:0.1,length:0.01},
                                                {  name:'orient',type:'kin_orient',target:this.bodies.inters.background, target_pos_offset:om_rC.get_row(2),stiffness: 1.0,damping:0.1,length:0.01}, 
                                              ],

                                              density:0.2, 
                                                                                            
                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            }))                                              
      rot_tmp = 180+35    
      var om_rD = new Matrix()
      om_rD.setTranslation(
        offset_from_center.x()+Math.cos(rad(rot_tmp))*ray_tmp,
        offset_from_center.y()+Math.sin(rad(rot_tmp))*ray_tmp)   
      om_rD.setRotation(rad(rot_tmp+180))                                          
      this.bodies.geos.rectangles.push(new body_build({ ...oRect, 
                                              name:'geo_rectangle_TL',

                                              m_offset:om_rD,
                                              m_shape:m_shape,

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,     
                                              debug_force_visibility: debug.force_visibility,                                                          
                                            })) 
      
      this.bodies.inters.rectangles.push(new body_build({ ...oRect, 
                                              name:'inter_rectangle_TL',
                                              highlight_selection:[this.bodies.geos.rectangles[3]], 

                                              m_offset:om_rD,
                                              m_shape:m_shape_modif,

                                              do_shape: true,
                                              do_line:true,                                         
                                              color:utils.color.grey,
                                              color_line: utils.color.black,
                                              texture_three: text_checker_three_grey, 
      
                                              collision_category: utils.collision_category.inter,
                                              collision_mask: utils.collision_category.mouse, 
                                              constraints:[
                                                {  name:'point' ,type:'dyn_point',target:this.bodies.inters.background, target_pos_offset:om_rD.get_row(2), stiffness: 0.999,damping:0.1,length:0.01},
                                                {  name:'orient',type:'kin_orient',target:this.bodies.inters.background, target_pos_offset:om_rD.get_row(2),stiffness: 1.0,damping:0.1,length:0.01}, 
                                              ],

                                              density:0.2, 
                                                                                            
                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            }))                                               
      
      this.bodies.effects.movA_trails.push(new body_build({ ...oRect, 
                                              name:'effect_movA_trails1',

                                              m_offset:om_rD,
                                              m_shape:m_shape,

                                              do_shape: true,
                                              do_line:false,                                         
                                              color:utils.color.red,
                                              //color_line: utils.color.black,
                                              //texture_three: text_checker_three_grey, 

                                              collision_category: utils.collision_category.none,
                                              collision_mask: utils.collision_category.none,                                               
                                              constraints:[
                                                {  name:'point' ,type:'kin_point',target:this.bodies.geos.rectangles[3],  stiffness: 0.15},
                                                {  name:'orient',type:'kin_orient',target:this.bodies.geos.rectangles[3], stiffness: 0.15}, 
                                              ],


                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,     
                                              debug_force_visibility: debug.force_visibility,                                                          
                                            }))    
      this.bodies.effects.movA_trails.push(new body_build({ ...oRect, 
                                              name:'effect_movA_trails2',

                                              m_offset:om_rD,
                                              m_shape:m_shape,

                                              do_shape: true,
                                              do_line:false,                                         
                                              color:utils.color.blue,
                                              //color_line: utils.color.black,
                                              //texture_three: text_checker_three_grey, 

                                              collision_category: utils.collision_category.none,
                                              collision_mask: utils.collision_category.none,                                               
                                              constraints:[
                                                {  name:'point' ,type:'kin_point',target:this.bodies.geos.rectangles[3],  stiffness: 0.2},
                                                {  name:'orient',type:'kin_orient',target:this.bodies.geos.rectangles[3], stiffness: 0.2}, 
                                              ],


                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,     
                                              debug_force_visibility: debug.force_visibility,                                                          
                                            }))                                             
      this.bodies.effects.movA_trails.push(new body_build({ ...oRect, 
                                              name:'effect_movA_trails3',

                                              m_offset:om_rD,
                                              m_shape:m_shape,

                                              do_shape: true,
                                              do_line:false,                                         
                                              color:utils.color.green,
                                              //color_line: utils.color.black,
                                              //texture_three: text_checker_three_grey, 

                                              collision_category: utils.collision_category.none,
                                              collision_mask: utils.collision_category.none,                                               
                                              constraints:[
                                                {  name:'point' ,type:'kin_point',target:this.bodies.geos.rectangles[3],  stiffness: 0.3},
                                                {  name:'orient',type:'kin_orient',target:this.bodies.geos.rectangles[3], stiffness: 0.3}, 
                                              ],


                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,     
                                              debug_force_visibility: debug.force_visibility,                                                          
                                            }))                                              
      // other

      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(200/2.4*s))
      m_shape.set_row(1,m_shape.get_row(1).getMult(50/2.4*s))

      this.bodies.inters.B = new body_build({
                                        screen_dims: this.screen_dims,
                                        matter_engine: this.matter_engine,  
                                        mouse_constraint: this.mouse_constraint,

                                        name:'inter_B',   
                                        highlight_selection:[this.bodies.geos.rectangle], 
                                        selection_break_length:300.0, 

                                        m:this.m,
                                        parent:this.bodies.inters.background,
                                        m_offset:new Matrix(),
                                        m_shape:m_shape,
                                        z:z_depth,
                                        type : utils.shape.rectangle,

                                        do_shape: true,
                                        do_line:true,                                           
                                        color:utils.color.grey,
                                        color_line: utils.color.black,
                                        texture_three: text_checker_three_grey,
                                        shader: this.shaders.length != 0 ? this.shaders[0] : null,

                                        collision_category: utils.collision_category.inter,
                                        collision_mask: utils.collision_category.mouse,
                                        constraints:[
                                          { name:'point' ,type:'dyn_point',target:this.bodies.inters.background,stiffness: 0.999,damping:0.1,length:0.01},
                                          //{ name:'point' ,type:'kin_point' ,target:this.bodies.inters.background},
                                          { name:'orient' ,type:'dyn_orient' ,target:this.bodies.inters.background, stiffness: 1.0,stiffness_at_selection:0.0,damping:0.01,length:0.01},  
                                          //{ name:'orient' ,type:'kin_orient' ,target:this.bodies.inters.background},                 
                                          { name:'rot_limit'   ,type:'kin_limit', obj:this, rot_min:rad(0),rot_max:rad(95)},
                                        ],      

                                        density:0.01, 

                                        debug_matrix_info: false,
                                        debug_matrix_axes: debug.matrix_axes,  
                                        debug_cns_axes: debug.cns_axes,    
                                        debug_force_visibility: debug.force_visibility,                                                                                     
                                      })
      z_depth += z_depth_incr            

      
      
      let mo_iBh = new Matrix()                                    
      mo_iBh.setTranslation(0,0.)  

      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(400/2.4*s*0.355))
      m_shape.set_row(1,m_shape.get_row(1).getMult(1))   

      this.bodies.helpers.stepB = new body_build({ 
                                                    screen_dims: this.screen_dims,
                                                    matter_engine: this.matter_engine,  
                                                    mouse_constraint: this.mouse_constraint,

                                                    name:'helper_B', 

                                                    m:this.m,
                                                    parent:this.bodies.inters.background,                                                      
                                                    m_offset:mo_iBh,
                                                    m_shape:m_shape,                                              
                                                    //rot:-90,
                                                    type:utils.shape.arc,
                                                    arc_limites : [0, 3.14*0.5],                                                     

                                                    do_shape: false,
                                                    do_line:true,         
                                                    color: utils.color.yellow,
                                                    color_line: utils.color.yellow,
                                                    //texture_three: text_checker_three,
                                                    transparency_activate: true,
                                                    transparency_line:1.0,                                                  
                                                    shader: this.shaders.length != 0 ? this.shaders[0] : null,

                                                    collision_category: utils.collision_category.none,
                                                    collision_mask: utils.collision_category.none ,
                                                 
                                                    density:0.01,    
                                                    }) 



      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(50/2.4*s))
      m_shape.set_row(1,m_shape.get_row(1).getMult(200/2.4*s))    

      this.bodies.inters.C = new body_build({ 
                                      screen_dims: this.screen_dims,
                                      matter_engine: this.matter_engine,  
                                      mouse_constraint: this.mouse_constraint,

                                      name:'inter_C', 
                                      highlight_selection:[this.bodies.geos.rectangle], 
                                      selection_break_length:300.0,

                                      m:this.m,
                                      m_offset:new Matrix(),
                                      m_shape:m_shape,
                                      parent:this.bodies.inters.background,
                                      z:z_depth,
                                      //rot:0,
                                      type : utils.shape.rectangle,

                                      do_shape: true,
                                      do_line:true,                                         
                                      color:utils.color.grey,
                                      color_line: utils.color.black,
                                      texture_three: text_checker_three_grey, 
                                      shader: this.shaders.length != 0 ? this.shaders[0] : null,

                                      collision_category: utils.collision_category.inter,
                                      collision_mask: utils.collision_category.mouse,
                                      constraints:[
                                        { name:'point' ,type:'dyn_point',target:this.bodies.inters.background, stiffness: 1.0,stiffness_at_selection:0.0,damping:0.1,length:0.01},
                                        //{ name:'orient',type:'dyn_orient',target:this.bodies.inters.background, stiffness: 0.01,damping:0.01,length:0.01},
                                        //{ name:'point' ,type:'kin_point' ,target:this.bodies.inters.background},
                                        { name:'orient',type:'kin_orient',target:this.bodies.inters.background},                                         
                                        { name:'axe'   ,type:'kin_axe', axe:1, distPos: 50*s, distNeg: 0.001 },
                                      ], 

                                      density:0.01, 

                                      debug_matrix_info: false,
                                      debug_matrix_axes: debug.matrix_axes,  
                                      debug_cns_axes: debug.cns_axes,   
                                      debug_force_visibility: debug.force_visibility,                                                                                 
                                    })
 
    z_depth += z_depth_incr


    let mo_iCh = new Matrix()                                    
    mo_iCh.setTranslation(0.,-59*s/2.)      
    
    m_shape = new Matrix()
    m_shape.set_row(0,m_shape.get_row(0).getMult(1))
    m_shape.set_row(1,m_shape.get_row(1).getMult(59*s))  

    this.bodies.helpers.stepC = new body_build({  
                                                  screen_dims: this.screen_dims,
                                                  matter_engine: this.matter_engine, 
                                                  mouse_constraint: this.mouse_constraint,

                                                  name:'helper_C',   

                                                  m:this.m,
                                                  parent:this.bodies.inters.background,                                                    
                                                  m_offset:mo_iCh,  
                                                  m_shape:m_shape,                                          
                                                  type:utils.shape.rectangle,

                                                  do_shape: false,
                                                  do_line:true,         
                                                  color: utils.color.yellow,
                                                  color_line: utils.color.yellow,
                                                  transparency_activate: true,
                                                  transparency_line:1.0,     
                                                  //texture_three: text_checker_three,                                              
                                                  shader: this.shaders.length != 0 ? this.shaders[0] : null,

                                                  collision_category: utils.collision_category.none,
                                                  collision_mask: utils.collision_category.none ,
                                                  
                                                  density:0.01, 

                                                  }) 
    var om_iA = new Matrix()
    om_iA.setTranslation(-130,-50)

    m_shape = new Matrix()
    m_shape.set_row(0,m_shape.get_row(0).getMult(100/2.4*s))
    m_shape.set_row(1,m_shape.get_row(1).getMult(100/2.4*s)) 

    this.bodies.inters.A = new body_build({  
                                    screen_dims: this.screen_dims,
                                    matter_engine: this.matter_engine,
                                    mouse_constraint: this.mouse_constraint,

                                    name:'inter_A',     
                                    highlight_selection:[this.bodies.geos.rectangles[3]],  
                                    selection_break_length:300.0,

                                    m:this.m,
                                    parent:this.bodies.inters.background,                                    
                                    m_offset:om_iA,
                                    m_shape:m_shape,
                                    z:z_depth,
                                    type : utils.shape.circle,

                                    do_shape: true,
                                    do_line:true,                                       
                                    color:utils.color.grey,
                                    color_line: utils.color.black,
                                    texture_three: text_checker_three_grey, 
                                    shader: this.shaders.length != 0 ? this.shaders[0] : null,

                                    collision_category: utils.collision_category.inter,
                                    collision_mask: utils.collision_category.mouse,
                                    constraints:[
                                      { name:'point' ,type:'dyn_point',target:this.bodies.inters.background, target_pos_offset:om_iA.get_row(2),stiffness: 1.0,stiffness_at_selection:0.0,damping:0.1,length:0.01},
                                      //{ name:'orient',type:'dyn_orient',target:this.bodies.inters.background, target_pos_offset:om_iA.get_row(2),stiffness: 0.1,damping:0.01,length:0.01},
                                      //{ name:'point' ,type:'kin_point' ,target:this.bodies.inters.background},
                                      { name:'orient',type:'kin_orient',target:this.bodies.inters.background}, 
                                      { name:'axe'   ,type:'kin_axe', axe:1, distPos: 25*s, distNeg: 0.001 },
                                    ], 

                                    density:0.01, 
             
                                    debug_matrix_info: false,
                                    debug_matrix_axes: debug.matrix_axes,  
                                    debug_cns_axes: debug.cns_axes, 
                                    debug_force_visibility: debug.force_visibility,                                                                                
                                  })



      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(8*s))
      m_shape.set_row(1,m_shape.get_row(1).getMult(2*s))

      let oEffectsA = {
        screen_dims: this.screen_dims,
        matter_engine: this.matter_engine, 
        mouse_constraint: this.mouse_constraint,

        m:this.m,
        parent:this.bodies.inters.background,
        m_shape: m_shape,
        z:z_depth, 
        type: utils.shape.rectangle,

        do_shape: true,
        do_line:false,           
        color: utils.color.white,
        color_line: utils.color.white,
        //texture_three: text_checker_three,
        shader: this.shaders.length != 0 ? this.shaders[0] : null,

        collision_category: utils.collision_category.none,
        collision_mask: utils.collision_category.none,// | utils.collision_category.blue,         

        density:0.001, 
                        
      } 
      var om_EA1 = new Matrix()
      om_EA1.setTranslation(-145,15)
      om_EA1.setRotation(rad(90))                                       
      this.bodies.effects.colA_sparcles.push(new body_build({ ...oEffectsA, 
                                              name:'effect_colA_sparcles1',

                                              m_offset:om_EA1,

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            })) 

      m_shape_modif = new Matrix()
      m_shape_modif.set_row(0,m_shape_modif.get_row(0).getMult(2*s))
      m_shape_modif.set_row(1,m_shape_modif.get_row(1).getMult(2*s))                                            
      this.bodies.effects.colA_shapes.push(new body_build({ ...oEffectsA, 
                                              name:'effect_colA_shape1',

                                              m_offset:om_EA1,
                                              m_shape: m_shape_modif,
                                              z:z_depth, 
                                              type: utils.shape.rectangle,

                                              do_shape: false,
                                              do_line:true, 

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            }))                                             


      om_EA1 = new Matrix()
      om_EA1.setTranslation(-145,15)
      om_EA1.setRotation(rad(45))                                       
      this.bodies.effects.colA_sparcles.push(new body_build({ ...oEffectsA, 
                                              name:'effect_colA_sparcles2',

                                              m_offset:om_EA1,

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            })) 


      m_shape_modif = new Matrix()
      m_shape_modif.set_row(0,m_shape_modif.get_row(0).getMult(2*s))
      m_shape_modif.set_row(1,m_shape_modif.get_row(1).getMult(2*s))                                            
      this.bodies.effects.colA_shapes.push(new body_build({ ...oEffectsA, 
                                              name:'effect_colA_shape1',

                                              m_offset:om_EA1,
                                              m_shape: m_shape_modif,
                                              z:z_depth, 
                                              type: utils.shape.rectangle,

                                              do_shape: false,
                                              do_line:true, 

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            }))                                             

      om_EA1 = new Matrix()
      om_EA1.setTranslation(-145,15)
      om_EA1.setRotation(rad(135))                                       
      this.bodies.effects.colA_sparcles.push(new body_build({ ...oEffectsA, 
                                              name:'effect_colA_sparcles3',

                                              m_offset:om_EA1,

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            })) 

      m_shape_modif = new Matrix()
      m_shape_modif.set_row(0,m_shape_modif.get_row(0).getMult(2*s))
      m_shape_modif.set_row(1,m_shape_modif.get_row(1).getMult(2*s))                                            
      this.bodies.effects.colA_shapes.push(new body_build({ ...oEffectsA, 
                                              name:'effect_colA_shape1',

                                              m_offset:om_EA1,
                                              m_shape: m_shape_modif,
                                              z:z_depth, 
                                              type: utils.shape.rectangle,

                                              do_shape: false,
                                              do_line:true, 

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            }))                                             


      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(55*s))
      m_shape.set_row(1,m_shape.get_row(1).getMult(1.*s))

      om_EA1 = new Matrix()
      om_EA1.setTranslation(-145,4)
      om_EA1.setRotation(rad(0))                                       
      this.bodies.effects.colA_wall = new body_build({  
                                    screen_dims: this.screen_dims,
                                    matter_engine: this.matter_engine,
                                    mouse_constraint: this.mouse_constraint,

                                    name:'effect_colA_wall',     
                                    highlight_selection:[this.bodies.geos.rectangles[3]],  

                                    m:this.m,
                                    parent:this.bodies.inters.background,                                    
                                    m_offset:om_EA1,
                                    m_shape:m_shape,
                                    z:z_depth,
                                    type : utils.shape.rectangle,

                                    do_shape: true,
                                    do_line:false,                                       
                                    color:utils.color.white,
                                    color_line: utils.color.black,
                                    //texture_three: text_checker_three_grey, 
                                    shader: this.shaders.length != 0 ? this.shaders[0] : null,

                                    collision_category: utils.collision_category.none,
                                    collision_mask: utils.collision_category.none,
                               

                                    density:0.01, 
             
                                    debug_matrix_info: false,
                                    debug_matrix_axes: debug.matrix_axes,  
                                    debug_cns_axes: debug.cns_axes, 
                                    debug_force_visibility: debug.force_visibility,                                                                                
                                  }) 




      ////////////////////////////////////////////////////////////////////

      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(8*s))
      m_shape.set_row(1,m_shape.get_row(1).getMult(2*s))

      let oEffectsB = {
        screen_dims: this.screen_dims,
        matter_engine: this.matter_engine, 
        mouse_constraint: this.mouse_constraint,

        m:this.m,
        parent:this.bodies.inters.background,
        m_shape: m_shape,
        z:z_depth, 
        type: utils.shape.rectangle,

        do_shape: true,
        do_line:false,           
        color: utils.color.white,
        color_line: utils.color.white,
        //texture_three: text_checker_three,
        shader: this.shaders.length != 0 ? this.shaders[0] : null,

        collision_category: utils.collision_category.none,
        collision_mask: utils.collision_category.none,// | utils.collision_category.blue,         

        density:0.001, 
                        
      } 
      om_EA1 = new Matrix()
      om_EA1.setTranslation(15,-80)
      om_EA1.setRotation(rad(0))                                       
      this.bodies.effects.colB_sparcles.push(new body_build({ ...oEffectsB, 
                                              name:'effect_colB_sparcles1',

                                              m_offset:om_EA1,

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            })) 


      m_shape_modif = new Matrix()
      m_shape_modif.set_row(0,m_shape_modif.get_row(0).getMult(2*s))
      m_shape_modif.set_row(1,m_shape_modif.get_row(1).getMult(2*s))                                            
      this.bodies.effects.colB_shapes.push(new body_build({ ...oEffectsA, 
                                              name:'effect_colB_shape1',

                                              m_offset:om_EA1,
                                              m_shape: m_shape_modif,
                                              z:z_depth, 
                                              type: utils.shape.rectangle,

                                              do_shape: false,
                                              do_line:true, 

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            }))                                             


      om_EA1 = new Matrix()
      om_EA1.setTranslation(15,-80)
      om_EA1.setRotation(rad(45))                                       
      this.bodies.effects.colB_sparcles.push(new body_build({ ...oEffectsB, 
                                              name:'effect_colB_sparcles2',

                                              m_offset:om_EA1,

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            })) 



      m_shape_modif = new Matrix()
      m_shape_modif.set_row(0,m_shape_modif.get_row(0).getMult(2*s))
      m_shape_modif.set_row(1,m_shape_modif.get_row(1).getMult(2*s))                                            
      this.bodies.effects.colB_shapes.push(new body_build({ ...oEffectsA, 
                                              name:'effect_colB_shape2',

                                              m_offset:om_EA1,
                                              m_shape: m_shape_modif,
                                              z:z_depth, 
                                              type: utils.shape.rectangle,

                                              do_shape: false,
                                              do_line:true, 

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            }))   

      om_EA1 = new Matrix()
      om_EA1.setTranslation(15,-80)
      om_EA1.setRotation(rad(-45))                                       
      this.bodies.effects.colB_sparcles.push(new body_build({ ...oEffectsB, 
                                              name:'effect_colB_sparcles3',

                                              m_offset:om_EA1,

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            })) 


      m_shape_modif = new Matrix()
      m_shape_modif.set_row(0,m_shape_modif.get_row(0).getMult(2*s))
      m_shape_modif.set_row(1,m_shape_modif.get_row(1).getMult(2*s))                                            
      this.bodies.effects.colB_shapes.push(new body_build({ ...oEffectsA, 
                                              name:'effect_colB_shape2',

                                              m_offset:om_EA1,
                                              m_shape: m_shape_modif,
                                              z:z_depth, 
                                              type: utils.shape.rectangle,

                                              do_shape: false,
                                              do_line:true, 

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            }))                                               



      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(55*s))
      m_shape.set_row(1,m_shape.get_row(1).getMult(1.*s))

      om_EA1 = new Matrix()
      om_EA1.setTranslation(20,-80)
      om_EA1.setRotation(rad(90))                                       
      this.bodies.effects.colB_wall = new body_build({  
                                    screen_dims: this.screen_dims,
                                    matter_engine: this.matter_engine,
                                    mouse_constraint: this.mouse_constraint,

                                    name:'effect_colB_wall',     
                                    highlight_selection:[this.bodies.geos.rectangles[3]],  

                                    m:this.m,
                                    parent:this.bodies.inters.background,                                    
                                    m_offset:om_EA1,
                                    m_shape:m_shape,
                                    z:z_depth,
                                    type : utils.shape.rectangle,

                                    do_shape: true,
                                    do_line:false,                                       
                                    color:utils.color.white,
                                    color_line: utils.color.black,
                                    //texture_three: text_checker_three_grey, 
                                    shader: this.shaders.length != 0 ? this.shaders[0] : null,

                                    collision_category: utils.collision_category.none,
                                    collision_mask: utils.collision_category.none,
                               

                                    density:0.01, 
             
                                    debug_matrix_info: false,
                                    debug_matrix_axes: debug.matrix_axes,  
                                    debug_cns_axes: debug.cns_axes, 
                                    debug_force_visibility: debug.force_visibility,                                                                                
                                  }) 


      //////////////////////////////////////////////////////////

      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(8*s))
      m_shape.set_row(1,m_shape.get_row(1).getMult(2*s))

      let oEffectsC = {
        screen_dims: this.screen_dims,
        matter_engine: this.matter_engine, 
        mouse_constraint: this.mouse_constraint,

        m:this.m,
        parent:this.bodies.inters.background,
        m_shape: m_shape,
        z:z_depth, 
        type: utils.shape.rectangle,

        do_shape: true,
        do_line:false,           
        color: utils.color.white,
        color_line: utils.color.white,
        //texture_three: text_checker_three,
        shader: this.shaders.length != 0 ? this.shaders[0] : null,

        collision_category: utils.collision_category.none,
        collision_mask: utils.collision_category.none,// | utils.collision_category.blue,         

        density:0.001, 
                        
      } 
      om_EA1 = new Matrix()
      om_EA1.setTranslation(0,200)
      om_EA1.setRotation(rad(90))                                      
      this.bodies.effects.colC_sparcles.push(new body_build({ ...oEffectsC, 
                                              name:'effect_colC_sparcles1',

                                              m_offset:om_EA1,

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            })) 

      om_EA1 = new Matrix()
      om_EA1.setTranslation(0,200)
      om_EA1.setRotation(rad(45))                                       
      this.bodies.effects.colC_sparcles.push(new body_build({ ...oEffectsC, 
                                              name:'effect_colC_sparcles2',

                                              m_offset:om_EA1,

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            })) 
      om_EA1 = new Matrix()
      om_EA1.setTranslation(0,200)
      om_EA1.setRotation(rad(135))                                       
      this.bodies.effects.colC_sparcles.push(new body_build({ ...oEffectsC, 
                                              name:'effect_colC_sparcles3',

                                              m_offset:om_EA1,

                                              debug_matrix_info: false,
                                              debug_matrix_axes: debug.matrix_axes,  
                                              debug_cns_axes: debug.cns_axes,  
                                              debug_force_visibility: debug.force_visibility,                                                         
                                            })) 

    z_depth += z_depth_incr

    let mo_iAh = new Matrix()                                    
    mo_iAh.setTranslation(-130,-50+25*s/2.)    

    m_shape = new Matrix()
    m_shape.set_row(0,m_shape.get_row(0).getMult(1))
    m_shape.set_row(1,m_shape.get_row(1).getMult(25*s)) 

    this.bodies.helpers.stepA = new body_build({  
                                                  screen_dims: this.screen_dims,
                                                  matter_engine: this.matter_engine,
                                                  mouse_constraint: this.mouse_constraint,

                                                  name:'helper_A',  

                                                  m:this.m,
                                                  m_offset:mo_iAh,
                                                  m_shape:m_shape,
                                                  parent:this.bodies.inters.background,                                               
                                                  type:utils.shape.rectangle,

                                                  do_shape: false,
                                                  do_line:true,         
                                                  color: utils.color.yellow,
                                                  color_line: utils.color.yellow,
                                                  transparency_activate: true,
                                                  transparency_line:1.0,
                                                  //texture_three: text_checker_three,
                                                  shader: this.shaders.length != 0 ? this.shaders[0] : null,

                                                  collision_category: utils.collision_category.none,
                                                  collision_mask: utils.collision_category.none ,

                                                  density:0.01,  
                                                  })      
        
      /*                                          
      ////////////////////////////////////////////////////////////////////////////////////////// test                                            
      
      let m_ref = new Matrix()
      m_ref.setTranslation(0,300)
      //m_ref.setRotation(rad(45))
      let scale_ref = 50
      let pos_dist = 100
      let neg_dist = 50
      let col_thickness = 100
      let margin = 1



      let opt_test = {
        screen_dims: this.screen_dims,
        matter_engine: this.matter_engine,  
        mouse_constraint: this.mouse_constraint,

        parent:this.bodies.inters.background,
      }

      let m_offset_A = new Matrix(m_ref)

      let p_ref = m_ref.get_row(2)
      let vY_ref = m_ref.get_row(1)
      vY_ref.normalize()
      vY_ref.mult(scale_ref/2.0+col_thickness/2.0+margin)
      let vX_ref = m_ref.get_row(0)
      vX_ref.normalize()
      let offset_pos = pos_dist - (pos_dist + neg_dist)/2
      vX_ref.mult(offset_pos)
      let p_offset = p_ref.getAdd(vY_ref).getAdd(vX_ref)
      m_offset_A.set_row(2, p_offset)

      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(pos_dist+neg_dist))
      m_shape.set_row(1,m_shape.get_row(1).getMult(col_thickness))

      this.bodies.inters.test.push( new body_build({ ...opt_test,

            name:'inter_rectangle',
            

            m:this.m,
            
            m_offset:m_offset_A,
            m_shape: m_shape,
            z:z_depth,
            type : utils.shape.rectangle,

            do_shape: true,
            do_line:true,                                         
            color:utils.color.grey,
            color_line: utils.color.black,
            texture_three: text_checker_three_grey, 

            collision_category: utils.collision_category.mouse,
            collision_mask: utils.collision_category.inter ,
            constraints:[
              {  name:'point' ,type:'dyn_point',target:this.bodies.inters.background, target_pos_offset: m_offset_A.get_row(2) , stiffness: 0.8, damping:0.1,length:0.01},
              {  name:'orient',type:'kin_orient',target:this.bodies.inters.background,stiffness: 1.0,damping:0.1,length:0.01}, 
            ],

            density:0.01, 

            debug_matrix_info: false,
            debug_matrix_axes: debug.matrix_axes,  
            debug_cns_axes: debug.cns_axes,      
            debug_force_visibility: debug.force_visibility,                                                                                 
          })
      )


      let m_offset_B = new Matrix(m_ref)

      p_ref = m_ref.get_row(2)
      vY_ref = m_ref.get_row(1)
      vY_ref.normalize()
      vY_ref.mult(scale_ref/2.0+col_thickness/2.0+margin)
      vX_ref = m_ref.get_row(0)
      vX_ref.normalize()
      offset_pos = pos_dist - (pos_dist + neg_dist)/2
      vX_ref.mult(offset_pos)
      p_offset = p_ref.getSub(vY_ref).getAdd(vX_ref)
      m_offset_B.set_row(2, p_offset)

      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(pos_dist+neg_dist))
      m_shape.set_row(1,m_shape.get_row(1).getMult(col_thickness))

      this.bodies.inters.test.push( new body_build({ ...opt_test,

            name:'inter_rectangle',
            

            m:this.m,
            
            m_offset:m_offset_B,
            m_shape: m_shape,
            z:z_depth,
            type : utils.shape.rectangle,

            do_shape: true,
            do_line:true,                                         
            color:utils.color.grey,
            color_line: utils.color.black,
            texture_three: text_checker_three_grey, 

            collision_category: utils.collision_category.mouse,
            collision_mask: utils.collision_category.inter ,
            constraints:[
              {  name:'point' ,type:'dyn_point',target:this.bodies.inters.background, target_pos_offset: m_offset_B.get_row(2) , stiffness: 0.8,damping:0.1,length:0.01},
              {  name:'orient',type:'kin_orient',target:this.bodies.inters.background,stiffness: 1.0,damping:0.1,length:0.01}, 
            ],

            density:0.01, 

            debug_matrix_info: false,
            debug_matrix_axes: debug.matrix_axes,  
            debug_cns_axes: debug.cns_axes,      
            debug_force_visibility: debug.force_visibility,                                                                                 
          })
      )


      let m_offset_C = new Matrix(m_ref)

      p_ref = m_ref.get_row(2)
      vX_ref = m_ref.get_row(0)
      vX_ref.normalize()
      vX_ref.mult(pos_dist+col_thickness/2.0)
      p_offset = p_ref.getAdd(vX_ref)
      m_offset_C.set_row(2, p_offset)

      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(col_thickness))
      m_shape.set_row(1,m_shape.get_row(1).getMult(scale_ref+col_thickness*2.0))

      this.bodies.inters.test.push( new body_build({ ...opt_test,

            name:'inter_rectangle',
            

            m:this.m,
            
            m_offset:m_offset_C,
            m_shape: m_shape,
            z:z_depth,
            type : utils.shape.rectangle,

            do_shape: true,
            do_line:true,                                         
            color:utils.color.grey,
            color_line: utils.color.black,
            texture_three: text_checker_three_grey, 

            collision_category: utils.collision_category.mouse,
            collision_mask: utils.collision_category.inter ,
            constraints:[
              {  name:'point' ,type:'dyn_point',target:this.bodies.inters.background, target_pos_offset: m_offset_C.get_row(2) , stiffness: 0.8,damping:0.1,length:0.01},
              {  name:'orient',type:'kin_orient',target:this.bodies.inters.background,stiffness: 1.0,damping:0.1,length:0.01}, 
            ],

            density:0.01, 

            debug_matrix_info: false,
            debug_matrix_axes: debug.matrix_axes,  
            debug_cns_axes: debug.cns_axes,      
            debug_force_visibility: debug.force_visibility,                                                                                 
          })
      )


      let m_offset_D = new Matrix(m_ref)

      p_ref = m_ref.get_row(2)
      vX_ref = m_ref.get_row(0)
      vX_ref.normalize()
      vX_ref.mult((neg_dist+col_thickness/2.0)*-1.)
      p_offset = p_ref.getAdd(vX_ref)
      m_offset_D.set_row(2, p_offset)

      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(col_thickness))
      m_shape.set_row(1,m_shape.get_row(1).getMult(scale_ref+col_thickness*2.0))

      this.bodies.inters.test.push( new body_build({ ...opt_test,

            name:'inter_rectangle',
            

            m:this.m,
            
            m_offset:m_offset_D,
            m_shape: m_shape,
            z:z_depth,
            type : utils.shape.rectangle,

            do_shape: true,
            do_line:true,                                         
            color:utils.color.grey,
            color_line: utils.color.black,
            texture_three: text_checker_three_grey, 

            collision_category: utils.collision_category.mouse,
            collision_mask: utils.collision_category.inter ,
            constraints:[
              {  name:'point' ,type:'dyn_point',target:this.bodies.inters.background, target_pos_offset: m_offset_D.get_row(2) , stiffness: 0.8,damping:0.1,length:0.01},
              {  name:'orient',type:'kin_orient',target:this.bodies.inters.background,stiffness: 1.0,damping:0.1,length:0.01}, 
            ],

            density:0.01, 

            debug_matrix_info: false,
            debug_matrix_axes: debug.matrix_axes,  
            debug_cns_axes: debug.cns_axes,      
            debug_force_visibility: debug.force_visibility,                                                                                 
          })
      )      

      let m_offset = new Matrix(m_ref)

      m_shape = new Matrix()
      m_shape.set_row(0,m_shape.get_row(0).getMult(scale_ref))
      m_shape.set_row(1,m_shape.get_row(1).getMult(scale_ref))

      this.bodies.inters.test.push( new body_build({ ...opt_test,

            name:'inter_rectangle',
            

            m:this.m,
            
            m_offset:m_offset,
            m_shape: m_shape,
            z:z_depth,
            type : utils.shape.circle,

            do_shape: true,
            do_line:true,                                         
            color:utils.color.grey,
            color_line: utils.color.black,
            texture_three: text_checker_three_grey, 

            collision_category: utils.collision_category.inter,//what it is
            collision_mask: utils.collision_category.mouse ,//what it can collide with
            constraints:[
              {  name:'point' ,type:'dyn_point',target:this.bodies.inters.background, target_pos_offset: m_offset.get_row(2), stiffness: 0.01,damping:0.1,length:0.01},
              {  name:'orient',type:'kin_orient',target:this.bodies.inters.background,stiffness: 1.0,damping:0.1,length:0.01}, 
            ],

            density:0.9, 

            debug_matrix_info: false,
            debug_matrix_axes: debug.matrix_axes,  
            debug_cns_axes: debug.cns_axes,      
            debug_force_visibility: debug.force_visibility,                                                                                 
          })
      )
      */


    }
  ////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////// UPDATE
  //////////////////////////////////////////////////////////////////////////////////// 

  get_resolution_coef_info( )
  {   

    let A = clamp(this.bodies.inters.A.constraints.axe.current_pos ,0,1)//clamp(deg(this.bodies.inters.A.body.angle)*-1/35.0     ,0,1)
    let B = clamp(deg(this.bodies.inters.B.get_local_rotation())/90.0     ,0,1)
    let C = clamp(this.bodies.inters.C.constraints.axe.current_pos ,0,1) 
    let D = 0
    
    if ( this.anim_mode )
    {
      let s = [0,1,2,3]   
      A = clamp(this.resolution_coef_override ,s[0],s[0]+1)
      B = clamp(this.resolution_coef_override ,s[1],s[1]+1)-s[1]
      C = clamp(this.resolution_coef_override ,s[2],s[2]+1)-s[2]
      D = clamp(this.resolution_coef_override ,s[3],s[3]+1)-s[3]

    }
    let coef = A + B + C+ D
    

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
  

  set_step_resolution( resolution_coef, update_interaction = false)
  {

    // clean
    this.bodies_axe_clean_override()
    this.bodies_rot_clean_override()
    this.bodies_enable( 0,  ['inters'] )
    this.bodies_enable( 0,  ['effects'] )
    for( let i=0; i < this.bodies.inters.test.length; i++)
      this.bodies.inters.test[i].enable(1)     
    
    ////////////////////////////////////////////////////////////////////////////////////
    let step = 0
    let res_coef = this.state.steps[step].resoluton_coef
    let do_it = this.state.current_step == step
    if( do_it )
    {
      //_________________________________________________________________Clean Inter
      this.bodies.inters.A.enable(1) 
      this.bodies.inters.background.enable(1)
      this.bodies.inters.circle.enable(1)
      this.bodies.inters.rectangle.enable(1)
      for( let i=0; i < this.bodies.inters.rectangles.length; i++)
        this.bodies.inters.rectangles[i].enable(1)

      //_________________________________________________________________Clean Other
      this.bodies.geos.rectangles[1].enable(1)
      this.bodies.geos.rectangles[3].enable(1)

      this.bodies.geos.rectangle.constraints.axe.pos_override = -1
      for( let i=0; i < this.bodies.geos.rectangles.length; i++)
          this.bodies.geos.rectangles[i].constraints.axe.pos_override = -1
      //_________________________________________________________________Control

      this.bodies.geos.circle.scale = 1 + res_coef * 0.85 
      
      if(  this.anim_mode )   
      {
        this.bodies.inters.A.constraints.axe.pos_override = res_coef
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
      
      //_________________________________________________________________Clean Inter
      this.bodies.inters.A.constraints.axe.pos_override = 1//rad(-36)
      this.bodies.inters.B.enable(1) 
      this.bodies.inters.background.enable(1)
      this.bodies.inters.C.constraints.axe.pos_override = 0
      this.bodies.inters.circle.enable(1)
      //this.bodies.inters.rectangle.enable(1)
      for( let i=0; i < this.bodies.inters.rectangles.length; i++)
        this.bodies.inters.rectangles[i].enable(1)
        
      //_________________________________________________________________Clean Other
      this.bodies.geos.rectangles[1].enable(0)
      this.bodies.geos.rectangles[3].enable(0)

      this.bodies.geos.circle.scale = 1.85
      this.bodies.geos.rectangle.pos_override = 0

      //_________________________________________________________________Control
      this.bodies.geos.rectangle.m_transform.setRotation(rad(res_coef*90))

      var pos_override = (res_coef )*1.63
      for( let i=0; i < this.bodies.geos.rectangles.length; i++)
          this.bodies.geos.rectangles[i].constraints.axe.pos_override = -1+pos_override   
    

      let m = new Matrix(this.bodies.inters.circle.m_shape_init)
      m.scale(1.85,1.85)
      this.bodies.inters.circle.update_shape_coords(m)

      if(  this.anim_mode )   
      {
        this.bodies.inters.B.rot_override = res_coef*rad(90)
      }      
      //_________________________________________________________________effects



    

      if(this.state.steps[step].update_count == 0)  
      {      
        for( let i=0; i < this.bodies.effects.colA_sparcles.length; i++)
        {
          let force = new Vector(0.001, 0)
          force = force.rotate(this.bodies.effects.colA_sparcles[i].get_rotation())
          let pos = this.bodies.effects.colA_sparcles[i].get_position()
          this.bodies.effects.colA_sparcles[i].apply_force( pos, force )
          this.bodies.effects.colA_shapes[i].apply_force( pos, force.getMult(0.1) )
        }
      }
      if( this.state.steps[step].update_count < 10) 
      {
        this.bodies.effects.colA_wall.enable(1)

        let m = new Matrix(this.bodies.effects.colA_wall.m_shape_init)
        m = m.scale(0.01+this.state.steps[step].update_count*0.1,1)
        this.bodies.effects.colA_wall.update_shape_coords(m)
      }


      if( this.state.steps[step].update_count < 20) 
      {
        for( let i=0; i < this.bodies.effects.colA_sparcles.length; i++)
          this.bodies.effects.colA_sparcles[i].enable(1)       
      }


      if( this.state.steps[step].update_count < 40) 
      {
        for( let i=0; i < this.bodies.effects.colA_shapes.length; i++)
          this.bodies.effects.colA_shapes[i].enable(1)   
          
          for( let i=0; i < this.bodies.effects.movA_trails.length; i++)
          this.bodies.effects.movA_trails[i].enable(1)    
                  
      }            
         
      //_________________________________________________________________Mouse
      if(this.debug_mode.switch_selected_inter_help)
      {
        this.switch_selection_transition( step, this.get_selected_body(), this.bodies.inters.A, this.bodies.inters.B)
      }
      else
      {
        //if( (this.bodies.inters.A.is_selected == true) &&(userIsInteracting == false) )
        //  switch_selection( this.mouse_constraint, null)  
      }

          
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
      this.bodies.inters.A.constraints.axe.pos_override = 1//rad(-36)
      //this.bodies.inters.B.m_transform.setRotation(rad(270))
      this.bodies.inters.C.enable(1) 
      this.bodies.inters.background.enable(1)
      this.bodies.inters.circle.enable(1)
      //this.bodies.inters.rectangle.enable(1)
      for( let i=0; i < this.bodies.inters.rectangles.length; i++)
        this.bodies.inters.rectangles[i].enable(1)      
      //_________________________________________________________________Clean Other
      this.bodies.geos.rectangles[1].enable(0)
      this.bodies.geos.rectangles[3].enable(0)
      //_________________________________________________________________Control
      this.bodies.geos.rectangle.m_transform.setRotation(rad(90))
       
      this.bodies.geos.rectangle.constraints.axe.pos_override = res_coef
      for( let i=0; i < this.bodies.geos.rectangles.length; i++)
          this.bodies.geos.rectangles[i].constraints.axe.pos_override = 0.63+0.37*res_coef*1.1

      this.bodies.geos.circle.scale = 1.85 - 1.42*res_coef*1.1

      if(  this.anim_mode )   
      {
        this.bodies.inters.C.constraints.axe.pos_override = res_coef
      } 

      //_________________________________________________________________effects
      /*
      for( let i=0; i < this.bodies.effects.colB_sparcles.length; i++)
      {
        if( this.state.steps[step].update_count < 20) 
          this.bodies.effects.colB_sparcles[i].enable(1)

        if(this.state.steps[step].update_count == 0)  
        {
          let force = new Vector(0.001, 0)
          force = force.rotate(this.bodies.effects.colB_sparcles[i].get_rotation())
          this.bodies.effects.colB_sparcles[i].apply_force( this.bodies.effects.colB_sparcles[i].get_position(), force )
        }

      }
      */ 


      if(this.state.steps[step].update_count == 0)  
      {      
        for( let i=0; i < this.bodies.effects.colB_sparcles.length; i++)
        {
          let force = new Vector(0.001, 0)
          force = force.rotate(this.bodies.effects.colB_sparcles[i].get_rotation())
          let pos = this.bodies.effects.colB_sparcles[i].get_position()
          this.bodies.effects.colB_sparcles[i].apply_force( pos, force )
          this.bodies.effects.colB_shapes[i].apply_force( pos, force.getMult(0.1) )
        }
      }


      if( this.state.steps[step].update_count < 10) 
      {
        this.bodies.effects.colB_wall.enable(1)

        let m = new Matrix(this.bodies.effects.colB_wall.m_shape_init)
        m = m.scale(0.01+this.state.steps[step].update_count*0.5,1)
        this.bodies.effects.colB_wall.update_shape_coords(m)
      }
      

      if( this.state.steps[step].update_count < 20) 
      {
        for( let i=0; i < this.bodies.effects.colB_sparcles.length; i++)
          this.bodies.effects.colB_sparcles[i].enable(1)
      }      

      if( this.state.steps[step].update_count < 40) 
      {
        for( let i=0; i < this.bodies.effects.colB_shapes.length; i++)
          this.bodies.effects.colB_shapes[i].enable(1)    
          
        for( let i=0; i < this.bodies.effects.movB_trails.length; i++)
          this.bodies.effects.movB_trails[i].enable(1)             
      }   

      
      //_________________________________________________________________Mouse
      if(this.debug_mode.switch_selected_inter_help)
      {      
        this.switch_selection_transition( step, this.get_selected_body(), this.bodies.inters.B, this.bodies.inters.C) 
      }      
      else
      {
        //if( (this.bodies.inters.B.is_selected == true) &&(userIsInteracting == false) )
        //  switch_selection( this.mouse_constraint, null)
      }
      
      
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
      
      //_________________________________________________________________Clean Inter
      this.bodies.inters.A.constraints.axe.pos_override = 1
      //this.bodies.inters.B.m_transform.setRotation(rad(270))
      this.bodies.inters.C.constraints.axe.pos_override = 1

      //_________________________________________________________________Clean Other

      this.bodies.geos.rectangles[1].enable(0)
      this.bodies.geos.rectangles[3].enable(0)

      // Keep position safe
      this.bodies.geos.circle.scale = 1.85 - 1.42

      this.bodies.geos.rectangle.constraints.axe.pos_override = 1
      for( let i=0; i < this.bodies.geos.rectangles.length; i++)
        this.bodies.geos.rectangles[i].constraints.axe.pos_override = 1
  

      //_________________________________________________________________Control

      //_________________________________________________________________effects
      for( let i=0; i < this.bodies.effects.colC_sparcles.length; i++)
      {
        if( this.state.steps[step].update_count < 20) 
          this.bodies.effects.colC_sparcles[i].enable(1)

        if(this.state.steps[step].update_count == 0)  
        {
          let force = new Vector(0.001, 0)
          force = force.rotate(this.bodies.effects.colC_sparcles[i].get_rotation())
          this.bodies.effects.colC_sparcles[i].apply_force( this.bodies.effects.colC_sparcles[i].get_position(), force )
        }

      }   

      if( this.state.steps[step].update_count < 40) 
      {

        for( let i=0; i < this.bodies.effects.movB_trails.length; i++)
          this.bodies.effects.movB_trails[i].enable(1)             
      }         
      //_________________________________________________________________Mouse
      
      if(this.debug_mode.switch_selected_inter_help)
      {
        this.switch_selection_transition( step, this.get_selected_body(), this.bodies.inters.B, this.bodies.inters.C) 
      }
      else
      {
        //if( (this.bodies.inters.B.is_selected == true) &&(userIsInteracting == false) )
        //  switch_selection( this.mouse_constraint, null)  
      }
        
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
    this.bodies_cns_enable(false, ['geos'])
    
    
    // custom color
    this.bodies_override_color(null, ['geos'])
    this.bodies_override_color_three(null, ['geos'])

    this.bodies.geos.circle.apply_force( this.bodies.geos.circle.get_position(),
                                        new Vector(0,0.05*1.9))
    
    this.bodies.geos.rectangle.apply_force( this.bodies.geos.rectangle.get_position(),
                                        new Vector(0,0.05*0.4))
    
    this.bodies.geos.rectangles[0].apply_force( this.bodies.geos.rectangles[0].get_position(),
                                        new Vector(0,0.05*0.01))


    this.bodies.geos.rectangles[2].apply_force( this.bodies.geos.rectangles[2].get_position(),
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
      
      this.bodies.geos.rectangles[0].apply_force( this.bodies.geos.rectangles[0].get_position(),
                                          new Vector(-0.05*0.35, 0))

                                          
      this.bodies.geos.rectangles[2].apply_force( this.bodies.geos.rectangles[2].get_position(),
                                          new Vector(0.05*0.35, 0))

      this.state.steps[step].apply_force_happened = true
    }
  }  

  set_across_steps()
  {

    let offset_from_center = new Vector(65,0)
    let _value = this.state.steps[0].resoluton_coef*35 //Math.min( Math.max( 0, -a_inter1),35)
  
    
    this.bodies.geos.rectangles[0].constraints.axe.extra_rotation        = Math.min( Math.max( 0, _value),35)
    this.bodies.geos.rectangles[0].constraints.axe.extra_rotation_center = offset_from_center
  
    this.bodies.geos.rectangles[1].constraints.axe.extra_rotation        = Math.min( Math.max( 0, _value),35)*-1
    this.bodies.geos.rectangles[1].constraints.axe.extra_rotation_center = offset_from_center
  
    offset_from_center = new Vector(-65,0) 
  
    this.bodies.geos.rectangles[2].constraints.axe.extra_rotation        = Math.min( Math.max( 0, _value),35)
    this.bodies.geos.rectangles[2].constraints.axe.extra_rotation_center = offset_from_center
  
    this.bodies.geos.rectangles[3].constraints.axe.extra_rotation        = Math.min( Math.max( 0, _value),35)*-1
    this.bodies.geos.rectangles[3].constraints.axe.extra_rotation_center = offset_from_center

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
    this.anim_mode =  this.resolution_coef_override != null
    this.set_across_steps()
    // resolution
    this.state.resolution_coef_last = this.state.resolution_coef
    this.get_resolution_coef_info( this.resolution_coef_override )
    this.set_step_resolution( this.state.resolution_coef, this.resolution_coef_override != null)
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
    //this.draw_help_three()
  }  
}
  
  
  