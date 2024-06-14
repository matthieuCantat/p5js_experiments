
import fidget from './fidget.js';
import { utils,clamp,rad,deg,isMousePressed,mouseX, mouseY } from './utils.js';
import body_build from './body.js';
import Vector from './vector.js';
import Matrix from './matrix.js';
import * as ut from './utils_three.js';


export default class fidget_daft_i extends fidget{

  ////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////// SETUP
  ////////////////////////////////////////////////////////////////////////////////////

    constructor(m,s,screen_dims,matter_engine,mouseConstraint,shaders = [],debug=false,use_webgl = false,random_color = true)
    {
        super(m, s, screen_dims,matter_engine,mouseConstraint,shaders, debug,use_webgl)

        this.title = 'dafti'

        this.bodies = {
          inters : {
            A:null,
            B:null,
            C:null,
          },
          geos : {
            backgrounds:[],
            circle:null,
            rectangle:null,
            rectangles:[],
          },
          helpers : {
            stepA:null,
            stepB:null,
            stepC:null,
          },          
        }
        this.bodies_draw_order = [
            'geos','backgrounds', 
            'inters','B',
            'inters','C',
            'inters','A',     
            'geos','circle',
            'geos','rectangle',      
            'geos','rectangles',
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

      var text_checker_three = ut.get_texture_grid_checker()
      var text_checker_three_grey = ut.get_texture_grid_checker_grey()    
      


    /////////////////////////////////////////////////////   
    let z_depth = 0
    let z_depth_incr = 0.1
    
    let oBackground = {
      //m:this.m,
      x:0,
      y:0,
      z:z_depth, 
      w : this.screen_dims.x/2, 
      h : this.screen_dims.y, 
      do_shape: true,
      do_line:true,         
      color: this.color_background,
      color_line: utils.color.black,
      collision_category: utils.collision_category.none,
      collision_mask: utils.collision_category.none,
      type: utils.shape.rectangle,
      use_webgl: this.use_webgl,
      screen_dims: this.screen_dims,
      matter_engine: this.matter_engine,
      //texture_three: text_checker_three_grey,
    } 
    z_depth += z_depth_incr

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

      // build
      this.bodies.geos.circle = new body_build({
                                      m:this.m,
                                      m_offset:new Matrix(),
                                      x:0,
                                      y:0,
                                      z:z_depth,
                                      w:50*s,
                                      type:utils.shape.circle,
                                      do_shape: true,
                                      do_line:true,                                         
                                      color: this.colors[0],
                                      color_line: utils.color.black,
                                      shader: this.shaders.length != 0 ? this.shaders[0] : null,
                                      collision_category: utils.collision_category.blue,
                                      collision_mask: utils.collision_category.default ,    
                                      fix_rot:true,
                                      density:0.001,
                                      use_webgl: this.use_webgl,
                                      screen_dims: this.screen_dims,
                                      matter_engine: this.matter_engine,
                                      //texture_three: text_checker_three,                                      
                                      })
      z_depth += z_depth_incr  

      this.bodies.geos.rectangle = new body_build({ 
                                        m:this.m,
                                        m_offset:new Matrix(),
                                        x:0,
                                        y:0,
                                        z:z_depth,
                                        w : 74*s, 
                                        h : 18*s, 
                                        type : utils.shape.rectangle,
                                        do_shape: true,
                                        do_line:true,                                           
                                        color : this.colors[1],
                                        color_line: utils.color.black,
                                        shader: this.shaders.length != 0 ? this.shaders[0] : null,
                                        collision_category : utils.collision_category.green,
                                        collision_mask : utils.collision_category.default,    
                                        axe_constraint : {
                                          axe:1,
                                          distPos: 50*s,
                                          distNeg: 0.001,  
                                        },
                                        use_webgl: this.use_webgl,
                                        screen_dims: this.screen_dims,
                                        matter_engine: this.matter_engine,  
                                        //texture_three: text_checker_three,                                      
                                      })
      let oRect = {
        m:this.m,
        x:0,
        y:0, 
        z:z_depth,
        w : 3.51*s, 
        h : 16.21*s, 
        do_shape: true,
        do_line:true,           
        color: this.colors[2],
        color_line: utils.color.black,
        shader: this.shaders.length != 0 ? this.shaders[0] : null,
        collision_category: utils.collision_category.blue,
        collision_mask: utils.collision_category.default,// | utils.collision_category.blue,
        type: utils.shape.rectangle,
        axe_constraint : {
                            axe:1,
                            distPos: 66.1*s,
                            distNeg: 0.001,  
                          },
        use_webgl: this.use_webgl,
        screen_dims: this.screen_dims,
        matter_engine: this.matter_engine, 
        //texture_three: text_checker_three,                         
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
      this.bodies.geos.rectangles.push(new body_build({ ...oRect, 
                                              m_offset:om_rA,
                                              x:offset_from_center.x()+Math.cos(rad(rot_tmp))*ray_tmp,
                                              y:offset_from_center.y()+Math.sin(rad(rot_tmp))*ray_tmp,
                                              rot:rot_tmp+90,    
                                            })) 
  
  
      rot_tmp = 0+35  
      offset_from_center = new Vector(65,0)   

      var om_rB = new Matrix()
      om_rB.setTranslation(
        offset_from_center.x()+Math.cos(rad(rot_tmp))*ray_tmp,
        offset_from_center.y()+Math.sin(rad(rot_tmp))*ray_tmp)           
      this.bodies.geos.rectangles.push(new body_build({ ...oRect, 
                                              m_offset:om_rB,
                                              x:offset_from_center.x()+Math.cos(rad(rot_tmp))*ray_tmp,
                                              y:offset_from_center.y()+Math.sin(rad(rot_tmp))*ray_tmp,
                                              rot:rot_tmp+90,  
                                            })) 
  
      // left
  
      rot_tmp = 180-35  
      offset_from_center = new Vector(-65,0)

      var om_rC = new Matrix()
      om_rC.setTranslation(
        offset_from_center.x()+Math.cos(rad(rot_tmp))*ray_tmp,
        offset_from_center.y()+Math.sin(rad(rot_tmp))*ray_tmp)           
      this.bodies.geos.rectangles.push(new body_build({ ...oRect,
                                              m_offset:om_rC, 
                                              x:offset_from_center.x()+Math.cos(rad(rot_tmp))*ray_tmp,
                                              y:offset_from_center.y()+Math.sin(rad(rot_tmp))*ray_tmp,
                                              rot:rot_tmp+90,
                                            }))  
      rot_tmp = 180+35    
      var om_rD = new Matrix()
      om_rD.setTranslation(
        offset_from_center.x()+Math.cos(rad(rot_tmp))*ray_tmp,
        offset_from_center.y()+Math.sin(rad(rot_tmp))*ray_tmp)                                             
      this.bodies.geos.rectangles.push(new body_build({ ...oRect, 
                                              m_offset:om_rD,
                                              x:offset_from_center.x()+Math.cos(rad(rot_tmp))*ray_tmp,
                                              y:offset_from_center.y()+Math.sin(rad(rot_tmp))*ray_tmp,
                                              rot:rot_tmp+90,       
                                            })) 
      
      // other
  
      this.bodies.inters.B = new body_build({
                                        m:this.m,
                                        m_offset:new Matrix(),
                                        x:0,
                                        y:0,
                                        z:z_depth,
                                        w:400/2.4*s,
                                        type : utils.shape.circle,
                                        do_shape: true,
                                        do_line:true,                                           
                                        color:utils.color.grey,
                                        color_line: utils.color.black,
                                        shader: this.shaders.length != 0 ? this.shaders[0] : null,
                                        collision_category: utils.collision_category.inter,
                                        collision_mask: utils.collision_category.mouse,
                                        fix_rot:true,
                                        limit_rot : [ 0, rad(90)],
                                        use_webgl: this.use_webgl,
                                        screen_dims: this.screen_dims,
                                        matter_engine: this.matter_engine,                                        
                                      })
      z_depth += z_depth_incr            

      
      
      let mo_iBh = new Matrix()                                    
      mo_iBh.setTranslation(0,0.)   
      this.bodies.helpers.stepB = new body_build({  m:this.m,
                                                    m_offset:mo_iBh,
                                                    x:0,
                                                    y:0,                                                
                                                    w : 400/2.4*s*0.355, 
                                                    h : 1, 
                                                    rot:-90,
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
                                                    use_webgl: this.use_webgl,
                                                    screen_dims: this.screen_dims,
                                                    matter_engine: this.matter_engine,  
                                                    //texture_three: text_checker_three, 
                                                    arc_limites : [0, 3.14*0.5],    
                                                    }) 




      this.bodies.inters.C = new body_build({  
                                      m:this.m,
                                      m_offset:new Matrix(),
                                      x:0,
                                      y:0,
                                      z:z_depth,
                                      rot:0,
                                      w:200/2.4*s,
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
                                        distPos: 50*s,
                                        distNeg: 0.001,  
                                      },
                                      use_webgl: this.use_webgl,
                                      screen_dims: this.screen_dims,
                                      matter_engine: this.matter_engine,                                      
                                    })
      //this.inter3.c_axe.pos_override =1
      //this.inter3.c_axe.apply(0,createVector(0,0))
      //this.inter3.c_axe.pos_override =null  
    z_depth += z_depth_incr


    let mo_iCh = new Matrix()                                    
    mo_iCh.setTranslation(0.,-59*s/2.)       
    this.bodies.helpers.stepC = new body_build({  m:this.m,
                                                  m_offset:mo_iCh,
                                                  x:0,
                                                  y:0,  
                                                  rot:0,                                              
                                                  w : 1, 
                                                  h : 59*s, 
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
                                                  use_webgl: this.use_webgl,
                                                  screen_dims: this.screen_dims,
                                                  matter_engine: this.matter_engine,  
                                                  //texture_three: text_checker_three,     
                                                  }) 
    var om_iA = new Matrix()
    om_iA.setTranslation(-130,-50)
    this.bodies.inters.A = new body_build({  
                                    m:this.m,
                                    m_offset:om_iA,
                                    x:-130,
                                    y:-50,
                                    z:z_depth,
                                    rot:0,
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
                                      distPos: 25*s,
                                      distNeg: 0.001,  
                                    },
                                    use_webgl: this.use_webgl,
                                    screen_dims: this.screen_dims,
                                    matter_engine: this.matter_engine,                                    
                                  })

    z_depth += z_depth_incr

    let mo_iAh = new Matrix()                                    
    mo_iAh.setTranslation(-130,-50+25*s/2.)     
    this.bodies.helpers.stepA = new body_build({  m:this.m,
                                                  m_offset:mo_iAh,
                                                  x:0,
                                                  y:0,                                                
                                                  w : 1, 
                                                  h : 25*s, 
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
                                                  use_webgl: this.use_webgl,
                                                  screen_dims: this.screen_dims,
                                                  matter_engine: this.matter_engine,  
                                                  //texture_three: text_checker_three,     
                                                  })                              
    }
  ////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////// UPDATE
  //////////////////////////////////////////////////////////////////////////////////// 

  get_resolution_coef_info( resolution_coef_override = null)
  {   

    let A = clamp(this.bodies.inters.A.c_axe.current_pos ,0,1)//clamp(deg(this.bodies.inters.A.body.angle)*-1/35.0     ,0,1)
    let B = clamp(deg(this.bodies.inters.B.body.angle)/90.0     ,0,1)
    let C = clamp(this.bodies.inters.C.c_axe.current_pos ,0,1) 
    let D = 0

    if ( this.anim_mode )
    {
      let s = [0,1,2,3]   
      A = clamp(resolution_coef_override ,s[0],s[0]+1)
      B = clamp(resolution_coef_override ,s[1],s[1]+1)-s[1]
      C = clamp(resolution_coef_override ,s[2],s[2]+1)-s[2]
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
    if(D==1)
      this.state.current_step = 4             
  }
  

  set_step_resolution( resolution_coef, update_interaction = false)
  {
    // utils
    var selected_body = this.mouseConstraint.constraint.bodyB

    // clean
    this.bodies_axe_enable( ['inters'])
    this.bodies_axe_clean_override()
    this.bodies_cns_modif(1.0)
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

      //_________________________________________________________________Clean Other
      this.bodies.geos.rectangles[1].enable(1)
      this.bodies.geos.rectangles[3].enable(1)

      this.bodies.geos.rectangle.c_axe.pos_override = -1
      for( let i=0; i < this.bodies.geos.rectangles.length; i++)
          this.bodies.geos.rectangles[i].c_axe.pos_override = -1
      //_________________________________________________________________Control
      this.bodies.geos.circle.scale = 1 + res_coef * 0.85   
      if(  this.anim_mode )   
      {
        this.bodies.inters.A.c_axe.pos_override = res_coef
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
      this.bodies.inters.A.c_axe.pos_override = 1//rad(-36)
      this.bodies.inters.B.enable(1) 
      this.bodies.inters.C.c_axe.pos_override = 0

        
      //_________________________________________________________________Clean Other
      this.bodies.geos.rectangles[1].enable(0)
      this.bodies.geos.rectangles[3].enable(0)

      this.bodies.geos.circle.scale = 1.85
      this.bodies.geos.rectangle.pos_override = 0

      //_________________________________________________________________Control
        this.bodies.geos.rectangle.rot_override = rad(res_coef*90)

        var pos_override = (res_coef )*1.63
        for( let i=0; i < this.bodies.geos.rectangles.length; i++)
            this.bodies.geos.rectangles[i].c_axe.pos_override = -1+pos_override   
      
        if(  this.anim_mode )   
        {
          this.bodies.inters.B.rot_override = res_coef*rad(90)
        }      
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
      this.bodies.inters.A.c_axe.pos_override = 1//rad(-36)
      this.bodies.inters.B.rot_override = rad(270)
      this.bodies.inters.C.enable(1) 
      //_________________________________________________________________Clean Other
      this.bodies.geos.rectangles[1].enable(0)
      this.bodies.geos.rectangles[3].enable(0)
      this.bodies.geos.rectangle.rot_override = rad(90)
      //_________________________________________________________________Control
       
        this.bodies.geos.rectangle.c_axe.pos_override = res_coef
        for( let i=0; i < this.bodies.geos.rectangles.length; i++)
            this.bodies.geos.rectangles[i].c_axe.pos_override = 0.63+0.37*res_coef*1.1

        this.bodies.geos.circle.scale = 1.85 - 1.42*res_coef*1.1

        if(  this.anim_mode )   
        {
          this.bodies.inters.C.c_axe.pos_override = res_coef
        }          
      //_________________________________________________________________Mouse
      this.switch_selection_transition( step, selected_body, this.bodies.inters.B, this.bodies.inters.C) 
      //_________________________________________________________________Update
      //this.state.switch_selection_happened_step = step
      this.update_step_count(step)           
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
      this.bodies.inters.C.c_axe.pos_override = 1
      //_________________________________________________________________Clean Other

      this.bodies.geos.rectangles[1].enable(0)
      this.bodies.geos.rectangles[3].enable(0)
      this.bodies.geos.rectangle.rot_override = rad(90)

      // Keep position safe
      this.bodies.geos.circle.scale = 1.85 - 1.42

      this.bodies.geos.rectangle.c_axe.pos_override = 1
      for( let i=0; i < this.bodies.geos.rectangles.length; i++)
        this.bodies.geos.rectangles[i].c_axe.pos_override = 1
  

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
    this.bodies_cns_modif(0.0001, ['geos'])
    this.bodies_axe_enable(false, ['geos'])
    
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
  
  
    let center_tmp = this.m.get_row(2)
    let offset_from_center = new Vector(65,0)
    let _value = this.state.steps[0].resoluton_coef*35 //Math.min( Math.max( 0, -a_inter1),35)
  
  
  
    this.bodies.geos.rectangles[0].c_axe.axe_rotation        = Math.min( Math.max( 0, _value),35)
    this.bodies.geos.rectangles[0].c_axe.axe_rotation_center = center_tmp.getAdd( offset_from_center)
  
    this.bodies.geos.rectangles[1].c_axe.axe_rotation        = Math.min( Math.max( 0, _value),35)*-1
    this.bodies.geos.rectangles[1].c_axe.axe_rotation_center = center_tmp.getAdd( offset_from_center)
  
    offset_from_center = new Vector(-65,0) 
  
    this.bodies.geos.rectangles[2].c_axe.axe_rotation        = Math.min( Math.max( 0, _value),35)
    this.bodies.geos.rectangles[2].c_axe.axe_rotation_center = center_tmp.getAdd( offset_from_center)
  
    this.bodies.geos.rectangles[3].c_axe.axe_rotation        = Math.min( Math.max( 0, _value),35)*-1
    this.bodies.geos.rectangles[3].c_axe.axe_rotation_center = center_tmp.getAdd( offset_from_center)
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
        let v_delta = p_last.getSub(p_first)
        
        if( 0.01 < v_delta.mag() )
        {

          let A = this.obj_is_selected(this.mouseConstraint,this.bodies.inters.A)
          let B = this.obj_is_selected(this.mouseConstraint,this.bodies.inters.B)
          let C = this.obj_is_selected(this.mouseConstraint,this.bodies.inters.C)
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

  draw_help(p5)
  {
    /////////////////////////////////////////////////

    if( this.show_step_helpers[0] )
    {     
      let coef = this.show_step_helpers[0] / 100 *255

      p5.push();
      p5.translate(this.webgl_draw_coords_offset.x(),this.webgl_draw_coords_offset.y())        
      p5.fill(0,0,0,0)
      p5.stroke(utils.color.yellow[0],
        utils.color.yellow[1],
        utils.color.yellow[2],
        coef)
      let w = 1
      let h = 4
      let p = this.bodies.inters.A.get_matrix().get_row(2).get_value()
      p5.rect( p.x-w/2-15,
        p.y,
            w,
            13*h)
      p5.stroke(0)
      p5.pop();

      this.show_step_helpers[0] -= 2
    }

    if(this.show_step_helpers[1] )
    {
      let coef = this.show_step_helpers[1] / 100 *255

      p5.push();
      p5.translate(this.webgl_draw_coords_offset.x(),this.webgl_draw_coords_offset.y())          
      p5.fill(0,0,0,0)
      p5.stroke(utils.color.yellow[0],
        utils.color.yellow[1],
        utils.color.yellow[2],
        coef)
      let p = this.bodies.inters.B.get_matrix().get_row(2).get_value()
      p5.arc(p.x,
        p.y, 
        this.bodies.inters.B.w*1.6,
        this.bodies.inters.B.w*1.6, p5.PI, p5.PI + p5.HALF_PI);
      p5.stroke(0)
      p5.pop();
      this.show_step_helpers[1] -= 2
    }

    if(this.show_step_helpers[2] )
    {
      let coef = this.show_step_helpers[2] / 100 *255
      p5.push();
      p5.translate(this.webgl_draw_coords_offset.x(),this.webgl_draw_coords_offset.y())          
      p5.fill(0,0,0,0)
      p5.stroke(utils.color.yellow[0],
        utils.color.yellow[1],
        utils.color.yellow[2],
        coef)
      let w = 1
      let h = 4
      let p = this.bodies.inters.C.get_matrix().get_row(2).get_value()
      p5.rect( p.x-w/2,
        p.y-120,
            w,
            20*h+120)
      p5.stroke(0)
      p5.pop();

      this.show_step_helpers[2] -= 2
    }

  }  

  draw(p5)
  {
    this.bodies_draw(p5)
    this.draw_help(p5)
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
  
  
  