




class fidget_daft_i{

  constructor(p,s,debug=false)
  {
    // init
    this.bodies = {
      circle:null,
      rectangle:null,
      rectangles:[],
      inter1_L:null,
      inter2:null,
      inter3:null
    }

    this.bodies_order = [
      'inter3',
      'inter2',
      'inter1_L',
      'circle',
      'rectangle',
      'rectangles',
      ]
    

    this.state = {
      phase : 1,
      phase_last : -1,
      phase_4_wait : 0,
      phase_4_apply_forces_once : 0,  
    }

    // build
    this.bodies.circle = new body_build({  x:p.x,
                                    y:p.y,
                                    w:50*s,
                                    type:utils.shape.circle,
                                    color: utils.color.green,
                                    collision_category: utils.collision_category.blue,
                                    collision_mask: utils.collision_category.default ,    
                                    fix_rot:true,
                                    density:0.001,
                                    })

    this.bodies.rectangle = new body_build({ x:p.x,
                                      y:p.y,
                                      w : 74*s, 
                                      h : 18*s, 
                                      type : utils.shape.rectangle,
                                      color : utils.color.red,
                                      collision_category : utils.collision_category.green,
                                      collision_mask : utils.collision_category.default,    
                                      axe_constraint : {
                                        axe:1,
                                        distPos: 50*s,
                                        distNeg: 0.001,  
                                      }
                                    })
    let oRect = {
      x:p.x,
      y:p.y, 
      w : 3.5*s, 
      h : 16.2*s, 
      color: utils.color.yellow,
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
    let offset_from_center = createVector(0,0)


    // right 
    rot_tmp = 0-35  
    offset_from_center = createVector(65,0)                                        
    this.bodies.rectangles.push(new body_build({ ...oRect, 
                                            x:p.x+offset_from_center.x+cos(rad(rot_tmp))*ray_tmp,
                                            y:p.y+offset_from_center.y+sin(rad(rot_tmp))*ray_tmp,
                                            rot:rot_tmp+90,    
                                          })) 


    rot_tmp = 0+35  
    offset_from_center = createVector(65,0)   
    this.bodies.rectangles.push(new body_build({ ...oRect, 
                                            x:p.x+offset_from_center.x+cos(rad(rot_tmp))*ray_tmp,
                                            y:p.y+offset_from_center.y+sin(rad(rot_tmp))*ray_tmp,
                                            rot:rot_tmp+90,  
                                          })) 

    // left

    rot_tmp = 180-35  
    offset_from_center = createVector(-65,0)
    this.bodies.rectangles.push(new body_build({ ...oRect, 
                                            x:p.x+offset_from_center.x+cos(rad(rot_tmp))*ray_tmp,
                                            y:p.y+offset_from_center.y+sin(rad(rot_tmp))*ray_tmp,
                                            rot:rot_tmp+90,
                                          }))  
    rot_tmp = 180+35                                      
    this.bodies.rectangles.push(new body_build({ ...oRect, 
                                            x:p.x+offset_from_center.x+cos(rad(rot_tmp))*ray_tmp,
                                            y:p.y+offset_from_center.y+sin(rad(rot_tmp))*ray_tmp,
                                            rot:rot_tmp+90,       
                                          })) 

    offset_from_center = createVector(-65,0)
    this.bodies.inter1_L = new body_build({ x:p.x+offset_from_center.x,
                                    y:p.y+offset_from_center.y,
                                    w:ray_tmp*3.8/2.4*s,
                                    type : utils.shape.circle,
                                    color:utils.color.grey,
                                    collision_category: utils.collision_category.inter,
                                    collision_mask: utils.collision_category.mouse,
                                    fix_rot:true,
                                    limit_rot : [ -rad(35), 0], 
                                  })  

    // other

    this.bodies.inter2 = new body_build({    x:p.x,
                                      y:p.y,
                                      w:400/2.4*s,
                                      type : utils.shape.circle,
                                      color:utils.color.grey,
                                      collision_category: utils.collision_category.inter,
                                      collision_mask: utils.collision_category.mouse,
                                      fix_rot:true,
                                      limit_rot : [ 0, rad(90)],
                                    })

    this.bodies.inter3 = new body_build({  x:p.x,
                                    y:p.y,
                                    rot:0,
                                    w:200/2.4*s,
                                    type : utils.shape.circle,
                                    color:utils.color.grey,
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
    if( debug == false)
    {
        this.bodies.inter1_L.visibility_override = false 
        this.bodies.inter2.visibility_override = false  
        this.bodies.inter3.visibility_override = false         
    }
    else{
      this.bodies.inter1_L.visibility_override = true 
      this.bodies.inter2.visibility_override = true  
      this.bodies.inter3.visibility_override = true   
    }

  }


  get_current_phase(current_phase)
  {

    let r_tol = 5
    let t_tol = 0.1
  
    let a_inter1 = deg(this.bodies.inter1_L.body.angle)
    let a_inter2 = deg(this.bodies.inter2.body.angle)  
    let p_inter3 = this.bodies.inter3.c_axe.current_pos
  
    let inter1_is_fully_rotated = a_inter1 < -35.0+t_tol
    let inter2_is_at_init_rot = a_inter2 <= 0+r_tol 
    let inter2_is_fully_rotated = 90-r_tol < a_inter2 
    let inter3_is_at_init_pos = p_inter3 <= 0+t_tol
    let inter3_is_fully_extend  =  1-t_tol <= p_inter3
    
    let new_phase = current_phase
    if(current_phase == 1)
    {
      if( inter1_is_fully_rotated )
        new_phase = 1.5  
    }
    else if(current_phase == 1.5)
    {
      if( inter1_is_fully_rotated == false )
        new_phase = 1
      else if( inter2_is_at_init_rot == false )
        new_phase = 2
    }
    else if(current_phase == 2)
    {
      if( inter2_is_at_init_rot)
        new_phase = 1.5 
      else if( inter2_is_fully_rotated )
        new_phase = 2.5      
    }
    else if(current_phase == 2.5)
    {
      if( inter2_is_fully_rotated == false )
        new_phase = 2 
      else if(inter3_is_at_init_pos == false)
        new_phase = 3   
    }
    else if(current_phase == 3)
    {
      if( inter3_is_at_init_pos )
        new_phase = 2.5 
      if( inter3_is_fully_extend)
        new_phase = 4      
    }
    else if(current_phase == 4)
    {
      if( inter3_is_fully_extend == false )
        new_phase = 3
    }  

    return new_phase

  }

  set_color(new_color = null)
  {
    if( new_color != null)
    {
      for( let key in this.bodies)
      {
        if( this.bodies[key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[key].length; i++)
            this.bodies[key][i].color = new_color
        }
        else
          this.bodies[key].color = new_color
      }
        
    }
    else{
      for( let key in this.bodies)
      {      
        if( this.bodies[key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[key].length; i++)
            this.bodies[key][i].color = this.bodies[key][i].color_base
        }
        else
          this.bodies[key].color = this.bodies[key].color_base
      }
    }

  }


  update()
  {


    this.state.phase = this.get_current_phase(this.state.phase)

  
    let a_inter1 = deg(this.bodies.inter1_L.body.angle)
    let a_inter2 = deg(this.bodies.inter2.body.angle)  
  
    let center_tmp = createVector(c.x,c.y)
    let offset_from_center = createVector(65,0)
    let _value = min( max( 0, -a_inter1),35)
  
  
  
    this.bodies.rectangles[0].c_axe.axe_rotation        = min( max( 0, _value),35)
    this.bodies.rectangles[0].c_axe.axe_rotation_center = p5.Vector.add(center_tmp, offset_from_center)
  
    this.bodies.rectangles[1].c_axe.axe_rotation        = min( max( 0, _value),35)*-1
    this.bodies.rectangles[1].c_axe.axe_rotation_center = p5.Vector.add(center_tmp, offset_from_center)
  
    offset_from_center = createVector(-65,0) 
  
    this.bodies.rectangles[2].c_axe.axe_rotation        = min( max( 0, _value),35)
    this.bodies.rectangles[2].c_axe.axe_rotation_center = p5.Vector.add(center_tmp, offset_from_center)
  
    this.bodies.rectangles[3].c_axe.axe_rotation        = min( max( 0, _value),35)*-1
    this.bodies.rectangles[3].c_axe.axe_rotation_center = p5.Vector.add(center_tmp, offset_from_center)
    
  
  
  
  
    this.bodies.inter2.rot_override = null
    this.bodies.inter3.c_axe.pos_override = null
  
    this.bodies.rectangles[1].c_axe.pos_override = null
    this.bodies.rectangles[2].c_axe.pos_override = null
    this.bodies.rectangles[3].c_axe.pos_override = null
  
  
  
    if( this.state.phase == 1 )
    {
      // visibility
      this.set_visibility(1)
      this.bodies.inter2.set_visibility(0)
      this.bodies.inter3.set_visibility(0)
  
  
      // Keep position safe
      this.bodies.rectangle.c_axe.pos_override = -1
      for( let i=0; i < this.bodies.rectangles.length; i++)
        this.bodies.rectangles[i].c_axe.pos_override = -1
  
      // Control
      this.bodies.circle.scale = 1 + a_inter1/-35 * 0.85
  
    }
  
    
    if( this.state.phase == 1.5 )
    {
      // visibility
      this.set_visibility(1)
      this.bodies.inter3.set_visibility(0)
      this.bodies.rectangles[1].set_visibility(0)
      this.bodies.rectangles[3].set_visibility(0)
      
  
      // Matter.Mouse Matter.Constraint change
      if((mouseConstraint.constraint.bodyB != this.bodies.inter2.body)
      &&(this.state.phase_last == 1))
      {
        change_selected_obj(mouseConstraint,this.bodies.inter2)
      }
      
      
      if((mouseConstraint.constraint.bodyB != this.bodies.inter1_L.body)
      &&(this.state.phase_last == 2))
      {
        change_selected_obj(mouseConstraint,this.bodies.inter1_L)
  
        this.bodies.rectangle.rot_override = 0
      }
   
    }
  
    if( this.state.phase == 2 )
    {
      // visibility
      this.set_visibility(1)
      this.bodies.inter1_L.set_visibility(0)
      this.bodies.inter3.set_visibility(0)
      this.bodies.rectangles[1].set_visibility(0)
      this.bodies.rectangles[3].set_visibility(0)
  
  
      // Keep position safe
      this.bodies.circle.scale = 1.85
      this.bodies.inter3.pos_override = 0
      this.bodies.rectangle.pos_override = 0
  
      // Controle
      this.bodies.rectangle.rot_override = rad(a_inter2/85*90)
  
      var pos_override = (a_inter2 / 90)*1.63
      for( let i=0; i < this.bodies.rectangles.length; i++)
        this.bodies.rectangles[i].c_axe.pos_override = -1+pos_override
      
    }
  
    if( this.state.phase == 2.5 )
    {
      // visibility
      this.set_visibility(1)
      this.bodies.inter1_L.set_visibility(0)
      this.bodies.rectangles[1].set_visibility(0)
      this.bodies.rectangles[3].set_visibility(0)
  
  
      // Keep position safe
      this.bodies.rectangle.rot_override = rad(90)
      this.bodies.circle.scale = 1.85
      for( let i=0; i < this.bodies.rectangles.length; i++)
        this.bodies.rectangles[i].c_axe.pos_override = 0.63
  
  
      // Matter.Mouse Matter.Constraint change
      if((mouseConstraint.constraint.bodyB != this.bodies.inter3.body)
      &&(this.state.phase_last == 2))
      {
        change_selected_obj(mouseConstraint,this.bodies.inter3)
      }
  
      if((mouseConstraint.constraint.bodyB != this.bodies.inter2.body)
      &&(this.state.phase_last == 3))
      {
        change_selected_obj(mouseConstraint,this.bodies.inter2)
  
        // Keep position safe
        this.bodies.rectangle.c_axe.pos_override = 0
      }
  
    }
    
    if( this.state.phase == 3 )
    {
      // visibility
      this.set_visibility(1)
      this.bodies.inter1_L.set_visibility(0)
      this.bodies.inter2.set_visibility(0)
      this.bodies.rectangles[1].set_visibility(0)
      this.bodies.rectangles[3].set_visibility(0)
  
      // Keep position safe
      this.bodies.inter2.rot_override = rad(270)
  
      // Control
      this.bodies.rectangle.c_axe.pos_override = this.bodies.inter3.c_axe.current_pos
      for( let i=0; i < this.bodies.rectangles.length; i++)
        this.bodies.rectangles[i].c_axe.pos_override = 0.63+0.37*this.bodies.inter3.c_axe.current_pos*1.1
  
        this.bodies.circle.scale = 1.85 - 1.42*this.bodies.inter3.c_axe.current_pos*1.1
  
   
    }
  
    
    if( this.state.phase == 4 )
    {
      // visibility
      this.set_visibility(1)
      this.bodies.inter1_L.set_visibility(0)
      this.bodies.inter2.set_visibility(0)
      this.bodies.inter3.set_visibility(0)
      this.bodies.rectangles[1].set_visibility(0)
      this.bodies.rectangles[2].set_visibility(0)
      this.bodies.rectangles[3].set_visibility(0)
  
  
      // Keep position safe
      this.bodies.circle.scale = 1.85 - 1.42
  
      // custom color
      this.set_color( utils.color.gold )
  
  
      this.bodies.rectangle.c_axe.pos_override = 1
      for( let i=0; i < this.bodies.rectangles.length; i++)
        this.bodies.rectangles[i].c_axe.pos_override = 1
  
  
      this.state.phase_4_wait += 1
      if( 20 < this.state.phase_4_wait )
      {
        // custom color
        this.set_color()
  
        this.bodies.rectangles[0].set_visibility(1)
        this.bodies.rectangles[1].set_visibility(1)
  
        // Custom
        this.bodies.circle.constraints[0].cns.stiffness = 0.0001
  
        this.bodies.rectangle.c_axe.enable = false
        for( let i=0; i < this.bodies.rectangles.length; i++)
          this.bodies.rectangles[i].c_axe.enable = false
  
  
          
        //gravity
        Matter.Body.applyForce(this.bodies.circle.body, this.bodies.circle.body.position, {x:0,y:0.05*1.9})
        Matter.Body.applyForce(this.bodies.rectangle.body, this.bodies.rectangle.body.position, {x:0,y:0.05*0.4})

        Matter.Body.applyForce(this.bodies.rectangles[0].body,this.bodies.rectangles[0].body.position, {x:0,y:0.05*0.01})
        Matter.Body.applyForce(this.bodies.rectangles[1].body,this.bodies.rectangles[1].body.position, {x:0,y:0.05*0.01})

        if( this.state.phase_4_apply_forces_once == 0 )
        {
          let p_force = {x:c.x+2.1,y:c.y+50/2.4*scale_coef}
  
          let v_force = {x:0,y:-0.05*8}
          Matter.Body.applyForce(this.bodies.circle.body, p_force, v_force)
          Matter.Body.applyForce(this.bodies.rectangle.body, p_force, v_force)
  
          Matter.Body.applyForce(this.bodies.rectangles[0].body,this.bodies.rectangles[0].body.position, {x:-0.05*0.35,y:0})
          Matter.Body.applyForce(this.bodies.rectangles[1].body,this.bodies.rectangles[1].body.position, {x:0.05*0.35,y:0})
  
          
          this.state.phase_4_apply_forces_once += 1
          this.bodies.circle.scale = 1.85
        }
        if(this.state.phase_4_apply_forces_once == 1)
        {
          this.bodies.circle.scale = 1.85
        }
        
        this.bodies.rectangle.rot_override = null
  
      }  
      else
      {
        //this.bodies.inter1_L.c_axe.pos_override = 1
        this.bodies.rectangle.rot_override = rad(270)
      } 
      
  
    }
    else
    {
  
      //
      this.state.phase_4_wait = 0
      this.state.phase_4_apply_forces_once = 0
      // Custom
      this.bodies.circle.constraints[0].cns.stiffness = 1.0
      this.bodies.rectangle.c_axe.enable = true
      for( let i=0; i < this.bodies.rectangles.length; i++)
        this.bodies.rectangles[i].c_axe.enable = true
  
      
        
      engine.gravity.scale = 0.00
  
      //////////////////////////////
   
    }  
  
  
  






    // individual
    for( let key of this.bodies_order)
    {         
      if( this.bodies[key].constructor === Array)
      {
        for( let i = 0; i < this.bodies[key].length; i++)
          this.bodies[key][i].update()
      }
      else
        this.bodies[key].update()
    }
  }

  show()
  {
    for( let key of this.bodies_order)
    {      
      if( this.bodies[key].constructor === Array)
      {
        for( let i = 0; i < this.bodies[key].length; i++)
          this.bodies[key][i].show()
      }
      else
        this.bodies[key].show()
    }    
  }

  set_visibility( value )
  {
    for( let key in this.bodies)
    {      
      if( this.bodies[key].constructor === Array)
      {
        for( let i = 0; i < this.bodies[key].length; i++)
          this.bodies[key][i].set_visibility(value)
      }
      else
        this.bodies[key].set_visibility(value)
    }      
  }

  mouse_select_highlight(mouse_cns)
  {
    if( mouse_cns.constraint.bodyB != null )
    {
      for( let key in this.bodies)
      {      
        if( this.bodies[key].constructor === Array)
        {
          for( let i = 0; i < this.bodies[key].length; i++)
          {
            if( this.bodies[key][i].body == mouse_cns.constraint.bodyB )
              this.bodies[key][i].colorStroke = utils.color.red
            else
              this.bodies[key][i].colorStroke = [0,0,0] 
          }
        }
        else
        {
          if( this.bodies[key].body == mouse_cns.constraint.bodyB )
            this.bodies[key].colorStroke = utils.color.red
          else
            this.bodies[key].colorStroke = [0,0,0]          
        }
          
      }  
    }    
  }




}


