
class fidget_windmill{

    constructor(p,s,debug=false)
    {
      // init
      this.bodies = {
        inter2:null,
        circle:null,
        rectangles:[],
        inter1:null,
        inter3:null,
        trapezoids:[]
      }
  
      this.bodies_order = [
        'inter2',
        'inter1',
        'inter3',
        'circle',
        'rectangles',      
        'trapezoids',
        ]
      this.state = {
          phase : 1,
          phase_last : -1,
          phase_4_wait : 0,
          phase_4_apply_forces_once : 0,  
        }
            
      // build
      this.bodies.inter2 = new body_build({  x:p.x,
                                      y:p.y,
                                      w:400/2.4*s,
                                      type:utils.shape.circle,
                                      color: utils.color.grey,
                                      collision_category: utils.collision_category.inter,
                                      collision_mask: utils.collision_category.mouse ,    
                                      fix_rot:true,
                                      density:0.001,
                                      limit_rot: [ 0, rad(270)]
                                      })
  
      this.bodies.circle = new body_build({ x:p.x,
                                        y:p.y,
                                        w : 20*s, 
                                        h : 18*s, 
                                        type : utils.shape.circle,
                                        color : utils.color.red,
                                        collision_category : utils.collision_category.blue,
                                        collision_mask : utils.collision_category.default ,    
                                        fix_rot:true,
                                      })
      let oRect = {
        x:p.x,
        y:p.y, 
        w : 7*s, 
        h : 30*s, 
        color: utils.color.green,
        collision_category: utils.collision_category.blue,
        collision_mask: utils.collision_category.default,// | utils.collision_category.blue,
        type: utils.shape.rectangle,
        axe_constraint : {
                            axe:1,
                            distPos: 35*s,
                            distNeg: 0.001,  
                          }
      } 
                                        
      this.bodies.rectangles.push(new body_build({ ...oRect, 
                                                  y:p.y+oRect.h,
                                                  rot:0,    
                                                })) 
  
      this.bodies.rectangles.push(new body_build({ ...oRect, 
                                                  y:p.y-oRect.h,
                                                  rot:180,    
                                                })) 
  
      this.bodies.rectangles.push(new body_build({ ...oRect, 
                                                  x:p.x-oRect.h,
                                                  rot:90,    
                                                })) 
  
      this.bodies.rectangles.push(new body_build({ ...oRect, 
                                                  x:p.x+oRect.h,
                                                  rot:-90,    
                                                })) 
  
      this.bodies.inter1 = new body_build({ x:p.x,
                                            y:p.y+oRect.h,
                                            w:100/2.4*3*s,
                                            type : utils.shape.circle,
                                            color:utils.color.grey,
                                            collision_category: utils.collision_category.inter,
                                            collision_mask: utils.collision_category.mouse,
                                            axe_constraint : {
                                              axe:1,
                                              distPos: 35/4*s,
                                              distNeg: 0.001,  
                                            }
                                          })  
  
      // other
  
      this.bodies.inter3 = new body_build({ x:p.x+oRect.h,
                                        y:p.y,
                                        rot:-90,
                                        w:100/2.4*s,
                                        type : utils.shape.circle,
                                        color:utils.color.grey,
                                        collision_category: utils.collision_category.inter,
                                        collision_mask: utils.collision_category.mouse,
                                        axe_constraint : {
                                          axe:1,
                                          distPos: 35*s,
                                          distNeg: 0.001, 
                                        }
                                      })
      this.bodies.inter3.c_axe.pos_override =1
      this.bodies.inter3.c_axe.apply(0,createVector(0,0))
      this.bodies.inter3.c_axe.pos_override =null
  
  
      let oTrap = { 
        w : 46*s, 
        posCoef:0.7, 
        h : 7*s, 
        slop : 45, 
        color: utils.color.blue,
        collision_category: utils.collision_category.blue,
        collision_mask: utils.collision_category.default ,
        type:utils.shape.trapezoid,
    
        axe_constraint : {
          axe:1,
          distPos: 5*s,
          distNeg: 10*s,  
        }  
      } 
  
    this.bodies.trapezoids.push(new body_build({ ...oTrap, 
                                            x:p.x+oRect.h*oTrap.posCoef,
                                            y:p.y+oRect.h*oTrap.posCoef,
                                            rot:-45,       
                                          })) 
  
    this.bodies.trapezoids.push(new body_build({ ...oTrap, 
                                            x:p.x-oRect.h*oTrap.posCoef,
                                            y:p.y+oRect.h*oTrap.posCoef,
                                            rot:45,  
                                          })) 
  
    this.bodies.trapezoids.push(new body_build({ ...oTrap, 
                                            x:p.x-oRect.h*oTrap.posCoef,
                                            y:p.y-oRect.h*oTrap.posCoef,
                                            rot:-45-180,      
                                          })) 
  
    this.bodies.trapezoids.push(new body_build({ ...oTrap, 
                                            x:p.x+oRect.h*oTrap.posCoef,
                                            y:p.y-oRect.h*oTrap.posCoef,
                                            rot:45+180,     
                                          })) 
      //this.inter3.c_axe.pos_override =1
      //this.inter3.c_axe.apply(0,createVector(0,0))
      //this.inter3.c_axe.pos_override =null
      if( debug == false)
      {
        this.bodies.inter1.visibility_override = false 
        this.bodies.inter2.visibility_override = false 
        this.bodies.inter3.visibility_override = false 
      }
      else{
        this.bodies.inter1.visibility_override = true 
        this.bodies.inter2.visibility_override = true 
        this.bodies.inter3.visibility_override = true 
      }
  
    }
  
  
    get_current_phase(current_phase)
    {
  
      let r_tol = 5
      let t_tol = 0.1
    
      let p_inter1 = this.bodies.inter1.c_axe.current_pos
      let a_inter2 = deg(this.bodies.inter2.body.angle)
      let p_inter3 = this.bodies.inter3.c_axe.current_pos
    
      let inter1_is_fully_extend = 1.0-t_tol < p_inter1
      let inter2_is_at_init_rot = a_inter2 <= 0+r_tol 
      let inter2_is_fully_rotated = 270-r_tol < a_inter2 
      let inter3_is_at_init_pos =  1-t_tol <= p_inter3
      let inter3_is_fully_extend  =  p_inter3 <= 0+t_tol
    
      let new_phase = current_phase
      if(current_phase == 1)
      {
        if( inter1_is_fully_extend )
        new_phase = 1.5  
      }
      else if(current_phase == 1.5)
      {
        if( inter1_is_fully_extend == false )
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
  
      let p_inter1 = this.bodies.inter1.c_axe.current_pos
      let a_inter2 = deg(this.bodies.inter2.body.angle)
      let p_inter3 = this.bodies.inter3.c_axe.current_pos  
      
      this.bodies.inter1.c_axe.pos_override = null
      this.bodies.inter2.rot_override = null
      this.bodies.inter3.c_axe.pos_override = null
    
      this.bodies.rectangles[1].c_axe.pos_override = null
      this.bodies.rectangles[2].c_axe.pos_override = null
      this.bodies.rectangles[3].c_axe.pos_override = null
    
      this.bodies.trapezoids[0].c_axe.pos_override = null
      this.bodies.trapezoids[1].c_axe.pos_override = null
      this.bodies.trapezoids[2].c_axe.pos_override = null
      this.bodies.trapezoids[3].c_axe.pos_override = null  
    
      this.bodies.trapezoids[0].rot_override = null
      this.bodies.trapezoids[1].rot_override = null
      this.bodies.trapezoids[2].rot_override = null
      this.bodies.trapezoids[3].rot_override = null   
    
    
      if( this.state.phase == 1 )
      {
        // visibility
        this.bodies.inter1.set_visibility(1) 
        this.bodies.inter2.set_visibility(0) 
        this.bodies.inter3.set_visibility(0) 
    
        // Clean other phase state
        this.bodies.inter2.rot_override = 0
        this.bodies.inter3.c_axe.pos_override = 1
    
        // Custom
        let p_inter1 = max( 0 ,this.bodies.inter1.c_axe.current_pos)
        this.bodies.rectangles[0].c_axe.pos_override = p_inter1
        this.bodies.rectangles[1].c_axe.pos_override = p_inter1
        this.bodies.rectangles[2].c_axe.pos_override = p_inter1
        this.bodies.rectangles[3].c_axe.pos_override = p_inter1
      
        this.bodies.trapezoids[0].c_axe.pos_override = p_inter1
        this.bodies.trapezoids[1].c_axe.pos_override = p_inter1
        this.bodies.trapezoids[2].c_axe.pos_override = p_inter1
        this.bodies.trapezoids[3].c_axe.pos_override = p_inter1
        
    
      }
    
      
      if( this.state.phase == 1.5 )
      {
        // visibility
    
        // Clean other phase state
        this.bodies.inter3.c_axe.pos_override = 1
    
        // Custom
        if((mouseConstraint.constraint.bodyB != this.bodies.inter2.body)
        &&(this.state.phase_last == 1))
        {
          let p_local = createVector( 
            mouseConstraint.constraint.pointA.x - this.bodies.inter2.body.position.x,
            mouseConstraint.constraint.pointA.y - this.bodies.inter2.body.position.y)
    
          mouseConstraint.constraint.bodyB = this.bodies.inter2.body
          mouseConstraint.constraint.pointB = {x: p_local.x , y: p_local.y}
          mouseConstraint.constraint.angleB = 0
        }
        
        
        if((mouseConstraint.constraint.bodyB != this.bodies.inter1.body)
        &&(this.state.phase_last == 2))
        {
          let p_local = createVector( 
            mouseConstraint.constraint.pointA.x - this.bodies.inter1.body.position.x,
            mouseConstraint.constraint.pointA.y - this.bodies.inter1.body.position.y)
    
    
          mouseConstraint.constraint.bodyB = this.bodies.inter1.body
          mouseConstraint.constraint.pointB = {x: p_local.x , y: p_local.y}
          mouseConstraint.constraint.angleB = 0
        }
    
        this.bodies.inter1.set_visibility(1) 
        this.bodies.inter2.set_visibility(1) 
        this.bodies.inter3.set_visibility(0) 
      }
    
      if( this.state.phase == 2 )
      {
        // visibility
        this.bodies.inter1.set_visibility(0) 
        this.bodies.inter2.set_visibility(1) 
        this.bodies.inter3.set_visibility(0) 
    
        // Clean other phase state
        this.bodies.inter1.c_axe.pos_override = 1
        this.bodies.inter3.c_axe.pos_override = 1
    
        // Custom
        if( 20 < a_inter2)
        {
          for( let i=0; i < 3; i++ )
          {
            this.bodies.rectangles[i].body.collisionFilter = 
            {
              category:0,
              group:-1,
              mask:-1 ,          
            }
          } 
        }
      
        var pos_override = (a_inter2 / 270.0)*-2+1
      
        this.bodies.rectangles[0].c_axe.pos_override = 1
        this.bodies.rectangles[1].c_axe.pos_override = 1
        this.bodies.rectangles[2].c_axe.pos_override = 1
        this.bodies.rectangles[3].c_axe.pos_override = 1
    
        this.bodies.trapezoids[0].c_axe.pos_override = pos_override
        this.bodies.trapezoids[1].c_axe.pos_override = pos_override
        this.bodies.trapezoids[2].c_axe.pos_override = pos_override
        this.bodies.trapezoids[3].c_axe.pos_override = pos_override
      
      
        
        if( 270-1 < a_inter2 )
          this.bodies.rectangles[0].set_visibility(0)
        else                          
          this.bodies.rectangles[0].set_visibility(1)
        if( 90-1  < a_inter2 )
          this.bodies.rectangles[1].set_visibility(0)
        else                          
          this.bodies.rectangles[1].set_visibility(1)
        if( 180-1 < a_inter2 )
          this.bodies.rectangles[2].set_visibility(0)
        else                          
          this.bodies.rectangles[2].set_visibility(1)
    
    
    
        
      }
    
      if( this.state.phase == 2.5 )
      {
        // visibility
        this.bodies.inter1.set_visibility(0) 
        this.bodies.inter2.set_visibility(1) 
        this.bodies.inter3.set_visibility(1) 
        this.bodies.rectangles[0].set_visibility(0)
        this.bodies.rectangles[1].set_visibility(0)
        this.bodies.rectangles[2].set_visibility(0)
    
        // Clean other phase state
        this.bodies.inter1.c_axe.pos_override = 1
    
        if((mouseConstraint.constraint.bodyB != this.bodies.inter3.body)
        &&(this.state.phase_last == 2))
        {
          let p_local = createVector( 
            mouseConstraint.constraint.pointA.x - this.bodies.inter3.body.position.x,
            mouseConstraint.constraint.pointA.y - this.bodies.inter3.body.position.y)
    
    
          mouseConstraint.constraint.bodyB = this.bodies.inter3.body
          mouseConstraint.constraint.pointB = {x: - p_local.y, y: p_local.x}
          mouseConstraint.constraint.angleB = 0
        }
    
        if((mouseConstraint.constraint.bodyB != this.bodies.inter2.body)
        &&(this.state.phase_last == 3))
        {
          let p_local = createVector( 
            mouseConstraint.constraint.pointA.x - this.bodies.inter2.body.position.x,
            mouseConstraint.constraint.pointA.y - this.bodies.inter2.body.position.y)
    
          mouseConstraint.constraint.bodyB = this.bodies.inter2.body
          mouseConstraint.constraint.pointB = {x: -p_local.y, y: p_local.x}
          mouseConstraint.constraint.angleB = 0
        }
    
        //this.bodies.rectangles[3].c_axe.pos_override = this.bodies.inter3.c_axe.current_pos
      }
      
      if( this.state.phase == 3 )
      {
        // visibility
        this.bodies.inter1.set_visibility(0) 
        this.bodies.inter2.set_visibility(0) 
        this.bodies.inter3.set_visibility(1) 
        this.bodies.rectangles[0].set_visibility(0)
        this.bodies.rectangles[1].set_visibility(0)
        this.bodies.rectangles[2].set_visibility(0)
    
        // Clean other phase state
        this.bodies.inter1.c_axe.pos_override = 1
        this.bodies.inter2.rot_override = rad(270)
    
        // Custom
        this.bodies.rectangles[3].c_axe.pos_override = this.bodies.inter3.c_axe.current_pos
        let pos_rect = min(1,max(0,this.bodies.inter3.c_axe.current_pos))
    
        
        let rot_coef = 1.15
        var rot_tmp = ( 1 - pos_rect*rot_coef) 
    
        for( let i=0; i < this.bodies.trapezoids.length; i++ )
        {
          let current_r = this.bodies.trapezoids[i].rot
          let r = current_r+ rad(270)+rot_tmp*rad(45);
          this.bodies.trapezoids[i].rot_override = r
        }
     
      }
    
      
      if( this.state.phase == 4 )
      {
        // visibility
        this.bodies.inter1.set_visibility(0) 
        this.bodies.inter2.set_visibility(0) 
        this.bodies.inter3.set_visibility(0) 
        this.bodies.rectangles[0].set_visibility(0)
        this.bodies.rectangles[1].set_visibility(0)
        this.bodies.rectangles[2].set_visibility(0)
    
        // custom color
        this.bodies.circle.color = utils.color.gold 
        for( let i=0; i < this.bodies.rectangles.length; i++ )
          this.bodies.rectangles[i].color = utils.color.gold
        for( let i=0; i < this.bodies.trapezoids.length; i++ )
          this.bodies.trapezoids[i].color = utils.color.gold  
    
    
        this.state.phase_4_wait += 1
        if( 20 < this.state.phase_4_wait )
        {
    
    
          // Custom
          this.bodies.circle.constraints[0].cns.stiffness = 0.0001
          for( let i=0; i < this.bodies.rectangles.length; i++ )
            this.bodies.rectangles[i].c_axe.enable = false
    
          for( let i=0; i < this.bodies.trapezoids.length; i++ )
            this.bodies.trapezoids[i].c_axe.enable = false
    
          // custom color
          this.bodies.circle.color = this.bodies.circle.color_base
          for( let i=0; i < this.bodies.rectangles.length; i++ )
            this.bodies.rectangles[i].color = this.bodies.rectangles[i].color_base
          for( let i=0; i < this.bodies.trapezoids.length; i++ )
            this.bodies.trapezoids[i].color = this.bodies.trapezoids[i].color_base   
            
          //gravity
          Matter.Body.applyForce(
            this.bodies.circle.body, 
            this.bodies.circle.body.position, 
            {x:0,y:0.05*0.13})

          for( let i=0; i < this.bodies.rectangles.length; i++ )
            Matter.Body.applyForce(
              this.bodies.rectangles[i].body, 
              this.bodies.rectangles[i].body.position,
              {x:0,y:0.05*0.03})

          for( let i=0; i < this.bodies.trapezoids.length; i++ )
            Matter.Body.applyForce(
              this.bodies.trapezoids[i].body, 
              this.bodies.trapezoids[i].body.position,
              {x:0,y:0.05*0.03})

    
          if( this.state.phase_4_apply_forces_once )
          {
            let p_force = {x:c.x,y:c.y}
    
            let v_force = createVector(0.05,0)

            let _v = null

            Matter.Body.applyForce(this.bodies.rectangles[3].body, p_force, v_force)

            _v = p5.Vector.sub(createVector(0,-0.01),p5.Vector.mult(v_force,2))
            Matter.Body.applyForce(this.bodies.circle.body, p_force, _v,v_force)

            _v = p5.Vector.sub(createVector(0.05,-0.05),p5.Vector.mult(v_force,2))
            Matter.Body.applyForce(this.bodies.trapezoids[0].body, p_force, _v )

            _v = p5.Vector.sub(createVector(0.05,0.05),p5.Vector.mult(v_force,2))
            Matter.Body.applyForce(this.bodies.trapezoids[1].body, p_force, _v )

            _v = p5.Vector.sub(createVector(-0.05,0.05),p5.Vector.mult(v_force,2))
            Matter.Body.applyForce(this.bodies.trapezoids[2].body, p_force, _v )

            _v = p5.Vector.sub(createVector(-0.05,-0.05),p5.Vector.mult(v_force,2))
            Matter.Body.applyForce(this.bodies.trapezoids[3].body, p_force, _v )
            
            this.state.phase_4_apply_forces_once = false
          }
        }  
        else
        {
          this.bodies.inter1.c_axe.pos_override = 1
          this.bodies.inter2.rot_override = rad(270)
          for( let i=0; i < this.bodies.trapezoids.length; i++ )
            this.bodies.trapezoids[i].rot_override = this.bodies.trapezoids[i].rot+ rad(270)+rad(45);
        } 
    
      }
      else
      {
    
        //
        this.state.phase_4_wait = 0
        this.state.phase_4_apply_forces_once = true
        // Custom
        this.bodies.circle.constraints[0].cns.stiffness = 1.0
        this.bodies.rectangles[0].c_axe.enable = true
        this.bodies.rectangles[1].c_axe.enable = true
        this.bodies.rectangles[2].c_axe.enable = true
        this.bodies.rectangles[3].c_axe.enable = true
        
        this.bodies.trapezoids[0].c_axe.enable = true
        this.bodies.trapezoids[1].c_axe.enable = true
        this.bodies.trapezoids[2].c_axe.enable = true
        this.bodies.trapezoids[3].c_axe.enable = true   
          
        engine.gravity.scale = 0.00
    
        //////////////////////////////
    
        let center_tmp = createVector(c.x,c.y)
    
        for( let i = 0; i < this.bodies.rectangles.length; i++)
          this.bodies.rectangles[i].c_axe.axe_rotation_center = center_tmp
        for( let i = 0; i < this.bodies.trapezoids.length; i++)
          this.bodies.trapezoids[i].c_axe.axe_rotation_center = center_tmp
    
        this.bodies.rectangles[0].c_axe.axe_rotation = min( 270, a_inter2)
        this.bodies.rectangles[1].c_axe.axe_rotation = min( 90 , a_inter2)
        this.bodies.rectangles[2].c_axe.axe_rotation = min( 180, a_inter2)
        this.bodies.rectangles[3].c_axe.axe_rotation = min( 0  , a_inter2)
    
    
        for( let i = 0; i < this.bodies.trapezoids.length; i++)
          this.bodies.trapezoids[i].c_axe.axe_rotation = a_inter2
     
      }  
      let center_tmp = createVector(c.x,c.y)
      this.bodies.inter1.c_axe.axe_rotation = min( 270, a_inter2) 
      this.bodies.inter1.c_axe.axe_rotation_center = center_tmp
      this.bodies.inter3.c_axe.axe_rotation = min( 0  , a_inter2)
      this.bodies.inter3.c_axe.axe_rotation_center = center_tmp
    
    
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
      //update bodies
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
  
  
  