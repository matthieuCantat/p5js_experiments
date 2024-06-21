
import fidget from './fidget.js';
import { utils,clamp,rad,deg,isMousePressed,mouseX, mouseY } from './utils.js';
import body_build from './body.js';
import Vector from './vector.js';
import Matrix from './matrix.js';
import * as ut from './utils_three.js';


export default class fidget_windmill extends fidget{


  ////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////// SETUP
  ////////////////////////////////////////////////////////////////////////////////////

  constructor( m, s, screen_dims, matter_engine,mouse_constraint, shaders = [],debug=false,random_color=true)
  {
    super(m, s, screen_dims, matter_engine,mouse_constraint,shaders, debug)

    this.title = 'windmill'

    this.bodies = {
      inters : {
        A:null,
        A_bg:null,
        B:null,
        B_mask:null,
        C:null,
        C_bg:null,
      },
      geos : {
        circle:null,
        rectangles:[],
        trapezoids:[],
        backgrounds:[],
      },
      helpers:{
        stepA:null,
        stepB:null,
        stepC:null,
      }
    }

    this.bodies_draw_order = [
        'geos','backgrounds',
        'inters','B',
        'inters','B_mask',
        'inters','A_bg',
        'inters','A',
        'inters','C_bg',
        'inters','C',
        'geos','circle',
        'geos','rectangles',      
        'geos','trapezoids',
        'helpers','stepA',
        'helpers','stepB',
        'helpers','stepC',
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
    this.show_step_helpers = [ 0, 0, 0 ]
    var text_checker_three = ut.get_texture_grid_checker()
    var text_checker_three_grey = ut.get_texture_grid_checker_grey()

    
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
  mo_tA.setTranslation(oRect.h*oTrap.posCoef,
                       oRect.h*oTrap.posCoef)             
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
  
   
                                
  }


  ////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////// UPDATE
  //////////////////////////////////////////////////////////////////////////////////// 

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
    this.bodies.geos.circle.apply_force( this.bodies.geos.circle.get_position(),
                                          new Vector(0, 0.05*0.13) )


    for( let i=0; i < this.bodies.geos.rectangles.length; i++ )
      this.bodies.geos.rectangles[i].apply_force( this.bodies.geos.rectangles[i].get_position(),
                                                  new Vector(0, 0.05*0.03) )  


    for( let i=0; i < this.bodies.geos.trapezoids.length; i++ )
      this.bodies.geos.trapezoids[i].apply_force( this.bodies.geos.trapezoids[i].get_position(),
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

    if( isMousePressed )
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



}


