




class fidget_daft_i extends fidget{

  ////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////// SETUP
  ////////////////////////////////////////////////////////////////////////////////////

    constructor(m,s,shaders = [],debug=false,random_color = true)
    {
        super(m, s, shaders, debug)

        this.title = 'dafti'

        this.bodies = {
          inters : {
            A:null,
            B:null,
            C:null,
          },
          geos : {
            circle:null,
            rectangle:null,
            rectangles:[],
          }
        }
        this.bodies_draw_order = {
          inters : [
            'B',
            'C',
            'A',
            ], 
          geos : [
            'circle',
            'rectangle',      
            'rectangles',
            ]         
        }
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
        let i_random = int(clamp( Math.random()*(this.possible_colors.length+1), 0,this.possible_colors.length-1))
        this.colors = this.possible_colors[i_random]
      }
      this.color_background = [ (this.colors[0][0]+0.2)*0.3,(this.colors[0][1]+0.2)*0.3,(this.colors[0][2]+0.2)*0.3]

    

      // build
      this.bodies.geos.circle = new body_build({
                                      m:this.m,
                                      m_offset:new Matrix(),
                                      x:0,
                                      y:0,
                                      w:50*s,
                                      type:utils.shape.circle,
                                      color: this.colors[0],
                                      shader: this.shaders.length != 0 ? this.shaders[0] : null,
                                      collision_category: utils.collision_category.blue,
                                      collision_mask: utils.collision_category.default ,    
                                      fix_rot:true,
                                      density:0.001,
                                      })
  
      this.bodies.geos.rectangle = new body_build({ 
                                        m:this.m,
                                        m_offset:new Matrix(),
                                        x:0,
                                        y:0,
                                        w : 74*s, 
                                        h : 18*s, 
                                        type : utils.shape.rectangle,
                                        color : this.colors[1],
                                        shader: this.shaders.length != 0 ? this.shaders[0] : null,
                                        collision_category : utils.collision_category.green,
                                        collision_mask : utils.collision_category.default,    
                                        axe_constraint : {
                                          axe:1,
                                          distPos: 50*s,
                                          distNeg: 0.001,  
                                        }
                                      })
      let oRect = {
        m:this.m,
        x:0,
        y:0, 
        w : 3.5*s, 
        h : 16.2*s, 
        color: this.colors[2],
        shader: this.shaders.length != 0 ? this.shaders[0] : null,
        collision_category: utils.collision_category.blue,
        collision_mask: utils.collision_category.default,// | utils.collision_category.blue,
        type: utils.shape.rectangle,
        axe_constraint : {
                            axe:1,
                            distPos: 66.1*s,
                            distNeg: 0.001,  
                          }
      } 
  
      let ray_tmp = 80
      let rot_tmp = 0 
      let offset_from_center = new Vector(0,0)
  
  
      // right 
      rot_tmp = 0-35  
      offset_from_center = new Vector(65,0)    

      var om_rA = new Matrix()
      om_rA.setTranslation(
        offset_from_center.x()+cos(rad(rot_tmp))*ray_tmp,
        offset_from_center.y()+sin(rad(rot_tmp))*ray_tmp)                                          
      this.bodies.geos.rectangles.push(new body_build({ ...oRect, 
                                              m_offset:om_rA,
                                              x:offset_from_center.x()+cos(rad(rot_tmp))*ray_tmp,
                                              y:offset_from_center.y()+sin(rad(rot_tmp))*ray_tmp,
                                              rot:rot_tmp+90,    
                                            })) 
  
  
      rot_tmp = 0+35  
      offset_from_center = new Vector(65,0)   

      var om_rB = new Matrix()
      om_rB.setTranslation(
        offset_from_center.x()+cos(rad(rot_tmp))*ray_tmp,
        offset_from_center.y()+sin(rad(rot_tmp))*ray_tmp)           
      this.bodies.geos.rectangles.push(new body_build({ ...oRect, 
                                              m_offset:om_rB,
                                              x:offset_from_center.x()+cos(rad(rot_tmp))*ray_tmp,
                                              y:offset_from_center.y()+sin(rad(rot_tmp))*ray_tmp,
                                              rot:rot_tmp+90,  
                                            })) 
  
      // left
  
      rot_tmp = 180-35  
      offset_from_center = new Vector(-65,0)

      var om_rC = new Matrix()
      om_rC.setTranslation(
        offset_from_center.x()+cos(rad(rot_tmp))*ray_tmp,
        offset_from_center.y()+sin(rad(rot_tmp))*ray_tmp)           
      this.bodies.geos.rectangles.push(new body_build({ ...oRect,
                                              m_offset:om_rC, 
                                              x:offset_from_center.x()+cos(rad(rot_tmp))*ray_tmp,
                                              y:offset_from_center.y()+sin(rad(rot_tmp))*ray_tmp,
                                              rot:rot_tmp+90,
                                            }))  
      rot_tmp = 180+35    
      var om_rD = new Matrix()
      om_rD.setTranslation(
        offset_from_center.x()+cos(rad(rot_tmp))*ray_tmp,
        offset_from_center.y()+sin(rad(rot_tmp))*ray_tmp)                                             
      this.bodies.geos.rectangles.push(new body_build({ ...oRect, 
                                              m_offset:om_rD,
                                              x:offset_from_center.x()+cos(rad(rot_tmp))*ray_tmp,
                                              y:offset_from_center.y()+sin(rad(rot_tmp))*ray_tmp,
                                              rot:rot_tmp+90,       
                                            })) 
      
      // other
  
      this.bodies.inters.B = new body_build({
                                        m:this.m,
                                        m_offset:new Matrix(),
                                        x:0,
                                        y:0,
                                        w:400/2.4*s,
                                        type : utils.shape.circle,
                                        color:utils.color.grey,
                                        shader: this.shaders.length != 0 ? this.shaders[0] : null,
                                        collision_category: utils.collision_category.inter,
                                        collision_mask: utils.collision_category.mouse,
                                        fix_rot:true,
                                        limit_rot : [ 0, rad(90)],
                                      })
  
      this.bodies.inters.C = new body_build({  
                                      m:this.m,
                                      m_offset:new Matrix(),
                                      x:0,
                                      y:0,
                                      rot:0,
                                      w:200/2.4*s,
                                      type : utils.shape.circle,
                                      color:utils.color.grey,
                                      shader: this.shaders.length != 0 ? this.shaders[0] : null,
                                      collision_category: utils.collision_category.inter,
                                      collision_mask: utils.collision_category.mouse,
                                      axe_constraint : {
                                        axe:1,
                                        distPos: 50*s,
                                        distNeg: 0.001,  
                                      }
                                    })
      //this.inter3.c_axe.pos_override =1
      //this.inter3.c_axe.apply(0,createVector(0,0))
      //this.inter3.c_axe.pos_override =null  
    
    var om_iA = new Matrix()
    om_iA.setTranslation(-130,-50)
    this.bodies.inters.A = new body_build({  
                                    m:this.m,
                                    m_offset:om_iA,
                                    x:-130,
                                    y:-50,
                                    rot:0,
                                    w:100/2.4*s,
                                    type : utils.shape.circle,
                                    color:utils.color.grey,
                                    shader: this.shaders.length != 0 ? this.shaders[0] : null,
                                    collision_category: utils.collision_category.inter,
                                    collision_mask: utils.collision_category.mouse,
                                    axe_constraint : {
                                      axe:1,
                                      distPos: 25*s,
                                      distNeg: 0.001,  
                                    }
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
    var selected_body = mouseConstraint.constraint.bodyB

    // clean
    this.bodies_axe_enable(true)
    this.bodies_axe_clean_override()
    this.bodies_cns_modif(1.0)
    this.bodies_rot_clean_override()
    this.bodies_enable( 0, true, false )

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

        let y_offset = res_coef * 230 
        this.m.setTranslation(200,200+y_offset)
      }

    } 


  }
  
  do_pre_explode_animation(t,start_time,end_time)
  {
    let a = t - start_time
    a -= end_time/4
    a /= (end_time/4)
    a = min(1,max(0,a))
    
    let c1 = color(
      utils.color.gold[0],
      utils.color.gold[1],
      utils.color.gold[2])          
    
    let c2 = color(
      utils.color.white[0],
      utils.color.white[1],
      utils.color.white[2])

    this.bodies_override_color(lerpColor( c1,c2,a),false, true)
   
  }

  do_explode(step)
  {
    this.bodies_cns_modif(0.0001, false, true)
    this.bodies_axe_enable(false, false, true)
    
    // custom color
    this.bodies_override_color(null,false, true)

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
    let _value = this.state.steps[0].resoluton_coef*35 //min( max( 0, -a_inter1),35)
  
  
  
    this.bodies.geos.rectangles[0].c_axe.axe_rotation        = min( max( 0, _value),35)
    this.bodies.geos.rectangles[0].c_axe.axe_rotation_center = center_tmp.getAdd( offset_from_center)
  
    this.bodies.geos.rectangles[1].c_axe.axe_rotation        = min( max( 0, _value),35)*-1
    this.bodies.geos.rectangles[1].c_axe.axe_rotation_center = center_tmp.getAdd( offset_from_center)
  
    offset_from_center = new Vector(-65,0) 
  
    this.bodies.geos.rectangles[2].c_axe.axe_rotation        = min( max( 0, _value),35)
    this.bodies.geos.rectangles[2].c_axe.axe_rotation_center = center_tmp.getAdd( offset_from_center)
  
    this.bodies.geos.rectangles[3].c_axe.axe_rotation        = min( max( 0, _value),35)*-1
    this.bodies.geos.rectangles[3].c_axe.axe_rotation_center = center_tmp.getAdd( offset_from_center)
  }


  track_user_drag_error()
  {
    //for( let i = 0; i < this.show_step_helpers.length; i++)
    //  this.show_step_helpers[i] = 0


    if ( this.touch_enable == false )
      return 

    if( mouseIsPressed )
    {
      
      this.mouse_pressed_positions_at_update.push( createVector( pmouseX , pmouseY ) )    
      let size = this.mouse_pressed_positions_at_update.length
      if( 1 < size )
      {
        let p_first = this.mouse_pressed_positions_at_update[0]
        let p_last = this.mouse_pressed_positions_at_update[size-1]
        let v_delta = p5.Vector.sub(p_last,p_first)
        
        if( 0.01 < v_delta.mag() )
        {

          let A = this.obj_is_selected(mouseConstraint,this.bodies.inters.A)
          let B = this.obj_is_selected(mouseConstraint,this.bodies.inters.B)
          let C = this.obj_is_selected(mouseConstraint,this.bodies.inters.C)
          if( (A == false)&&
              (B == false)&&
              (C == false))
          {
            this.bodies_override_color(utils.color.black,false,true)
            this.color_background = utils.color.red
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
      this.bodies_override_color(null,false,true)
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
    this.get_resolution_coef_info( this.resolution_coef_override )
    this.set_step_resolution( this.state.resolution_coef, this.resolution_coef_override != null)
    this.track_user_drag_error()
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
    a = max(0,a)
    a *=15
    if(this.anim_mode)
      a = this.state.steps[3].resoluton_coef*200    

    push();
    translate(this.webgl_draw_coords_offset.x-a,this.webgl_draw_coords_offset.y)      
    fill(this.color_background[0],
      this.color_background[1],
      this.color_background[2])//fill(50,40,50)
    if(( 0 < this.state.steps[3].update_count-15)&&(this.anim_mode==false))
      fill(50,140,50)

    if(this.shaders.length != 0 )
    {
      this.shaders[1].iFrame = this.draw_count;
      this.shaders[1].iTime = millis() / 1000.0; 
      this.shaders[1].iMouse = { x: 0, y: 0};
    
      this.shaders[1].bg_animation = 1.
      this.shaders[1].bg_grain = 1.
      this.shaders[1].bg_grain_scale = 5.
      this.shaders[1].bg_grid = 1.0
      this.shaders[1].bg_grid_scale = 15.0
      this.shaders[1].bg_grid_line_scale =  2.0
      this.shaders[1].bg_grid_point_scale =  2.0
    
      this.shaders[1].bg_colorA = [48.96, 0.2, 0.2];
      this.shaders[1].bg_colorB = [117., 0.2, 80.];
      this.shaders[1].bg_colorC = [80.,97.92,0.2];
      this.shaders[1].bg_colorD = [0.2,48.96,48.96];
  
      this.shaders[1].bg_typeA = 0.0;
      this.shaders[1].bg_typeB = 1.0;
      this.shaders[1].bg_typeC = 0.0;
      this.shaders[1].bg_typeD = 0.0;
      this.shaders[1].bg_type_discoTarget= 0.;
    
      this.shaders[1].light_beam = 0.0
      this.shaders[1].debug = 0         
      this.shaders[1].as_texture() 
    }


    rect(0,0,width/2,height)

    fill(255);
    textSize(50);
    textAlign(CENTER);
    //text( this.fidget_sequence_i, width*0.2-a,height*0.95)
    pop();

    push();
    translate(this.webgl_draw_coords_offset.x+a,this.webgl_draw_coords_offset.y)         
    fill(this.color_background[0],
      this.color_background[1],
      this.color_background[2])//fill(50,40,50)
    if(( 0 < this.state.steps[3].update_count-15)&&(this.anim_mode==false))
      fill(50,140,50)

    if(this.shaders.length != 0 )
    {
      this.shaders[1].as_texture()
    }    


    rect(width/2+a,0,width/2,height)

    fill(255);
    textSize(20);
    textAlign(CENTER);
    //text( this.title , width*0.8,height*0.95)
    pop();

  }

  draw_help()
  {
    /////////////////////////////////////////////////
    /*
    if( this.show_step_helpers[0] )
    {     
      let coef = this.show_step_helpers[0] / 100 *255

      push();
      translate(this.webgl_draw_coords_offset.x,this.webgl_draw_coords_offset.y)        
      fill(0,0,0,0)
      stroke(utils.color.yellow[0],
        utils.color.yellow[1],
        utils.color.yellow[2],
        coef)
      let w = 1
      let h = 4
      let p = this.bodies.inters.A.get_matrix().get_row(2).get_value()
      rect( p.x-w/2-15,
        p.y,
            w,
            13*h)
      stroke(0)
      pop();

      this.show_step_helpers[0] -= 2
    }

    if(this.show_step_helpers[1] )
    {
      let coef = this.show_step_helpers[1] / 100 *255

      push();
      translate(this.webgl_draw_coords_offset.x,this.webgl_draw_coords_offset.y)          
      fill(0,0,0,0)
      stroke(utils.color.yellow[0],
        utils.color.yellow[1],
        utils.color.yellow[2],
        coef)
      let p = this.bodies.inters.B.get_matrix().get_row(2).get_value()
      arc(p.x,
        p.y, 
        this.bodies.inters.B.w*1.6,
        this.bodies.inters.B.w*1.6, PI, PI + HALF_PI);
      stroke(0)
      pop();
      this.show_step_helpers[1] -= 2
    }

    if(this.show_step_helpers[2] )
    {
      let coef = this.show_step_helpers[2] / 100 *255
      push();
      translate(this.webgl_draw_coords_offset.x,this.webgl_draw_coords_offset.y)          
      fill(0,0,0,0)
      stroke(utils.color.yellow[0],
        utils.color.yellow[1],
        utils.color.yellow[2],
        coef)
      let w = 1
      let h = 4
      let p = this.bodies.inters.C.get_matrix().get_row(2).get_value()
      rect( p.x-w/2,
        p.y-120,
            w,
            20*h+120)
      stroke(0)
      pop();

      this.show_step_helpers[2] -= 2
    }
    */

  }  

  draw()
  {
    this.draw_background()
    this.bodies_draw()
    this.draw_help()
  }
  
  
}
  
  
  