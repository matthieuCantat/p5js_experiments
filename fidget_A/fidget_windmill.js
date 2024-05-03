
class state_step_tpl{
  constructor()
  {
      this.resoluton_coef = 0
      this.resoluton_coef_last = 0
      this.update_count = 0
      this.apply_force_happened = false
      this.in_use = false    
      this.used = false 
  } 
}


class fidget_windmill{

  constructor( p, s, debug=false)
  {
    /*
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
    */

    this.bodies = {
      inters : {
        A:null,
        B:null,
        C:null,
      },
      geos : {
        circle:null,
        rectangles:[],
        trapezoids:[],
      }
    }
    this.bodies_draw_order = {
      inters : [
        'B',
        'A',
        'C',
        ], 
      geos : [
        'circle',
        'rectangles',      
        'trapezoids',
        ]         
    }
    /*
    this.inters_draw_order = [
      'B',
      'A',
      'C',
      ]

    this.bodies.geos = {
      circle:null,
      rectangles:[],
      trapezoids:[]
    }

    this.geos_draw_order = [
      'circle',
      'rectangles',      
      'trapezoids',
      ]
    */


    this.state = {
        update_count : 0,
        resolution_coef : 0, 
        resolution_coef_last:0,
        switch_selection_happened_step : 0,
        current_step : 0,
        steps:[ 
          new state_step_tpl, 
          new state_step_tpl, 
          new state_step_tpl, 
          new state_step_tpl,
          new state_step_tpl,
          new state_step_tpl]
      }

    this.force_way = null
    this.resolution_coef_override = null

          



    // build
    this.bodies.inters.B = new body_build({  x:p.x,
                                    y:p.y,
                                    w:400/2.4*s,
                                    type:utils.shape.circle,
                                    color: utils.color.grey,
                                    collision_category: utils.collision_category.inter,
                                    collision_mask: utils.collision_category.mouse ,    
                                    fix_rot:true,
                                    density:0.001,
                                    limit_rot: [ 0, rad(270)],
                                    })

    this.bodies.geos.circle = new body_build({ x:p.x,
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
                                      
    this.bodies.geos.rectangles.push(new body_build({ ...oRect, 
                                                y:p.y+oRect.h,
                                                rot:0, 
                                                collision:false,                                                 
                                              })) 

    this.bodies.geos.rectangles.push(new body_build({ ...oRect, 
                                                y:p.y-oRect.h,
                                                rot:180,   
                                                collision:false, 
                                              })) 

    this.bodies.geos.rectangles.push(new body_build({ ...oRect, 
                                                x:p.x-oRect.h,
                                                rot:90,  
                                                collision:false,  
                                                
                                              })) 

    this.bodies.geos.rectangles.push(new body_build({ ...oRect, 
                                                x:p.x+oRect.h,
                                                rot:-90,  
                                              })) 


    this.bodies.inters.A = new body_build({ x:p.x,
                                          y:p.y+oRect.h,
                                          w:60/2.4*3*s,
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

    this.bodies.inters.C = new body_build({ x:p.x+oRect.h,
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
    this.bodies.inters.C.c_axe.pos_override =1
    this.bodies.inters.C.c_axe.apply(0,createVector(0,0))
    this.bodies.inters.C.c_axe.pos_override =null


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

  this.bodies.geos.trapezoids.push(new body_build({ ...oTrap, 
                                          x:p.x+oRect.h*oTrap.posCoef,
                                          y:p.y+oRect.h*oTrap.posCoef,
                                          rot:-45,       
                                        })) 

  this.bodies.geos.trapezoids.push(new body_build({ ...oTrap, 
                                          x:p.x-oRect.h*oTrap.posCoef,
                                          y:p.y+oRect.h*oTrap.posCoef,
                                          rot:45,  
                                        })) 

  this.bodies.geos.trapezoids.push(new body_build({ ...oTrap, 
                                          x:p.x-oRect.h*oTrap.posCoef,
                                          y:p.y-oRect.h*oTrap.posCoef,
                                          rot:-45-180,      
                                        })) 

  this.bodies.geos.trapezoids.push(new body_build({ ...oTrap, 
                                          x:p.x+oRect.h*oTrap.posCoef,
                                          y:p.y-oRect.h*oTrap.posCoef,
                                          rot:45+180,     
                                        })) 

    this.set_debug( debug )

    if( debug == false)
    {
      this.bodies.inters.A.visibility_override = false 
      this.bodies.inters.B.visibility_override = false 
      this.bodies.inters.C.visibility_override = false 
    }
    else{
      this.bodies.inters.A.visibility_override = true 
      this.bodies.inters.B.visibility_override = true 
      this.bodies.inters.C.visibility_override = true 
    }
    

  }



  get_resolution_coef_info( resolution_coef_override = null)
  {
    let s = [0,1,2]   

    let A = clamp(this.bodies.inters.A.c_axe.current_pos     ,0,1)
    let B = clamp(deg(this.bodies.inters.B.body.angle)/270   ,0,1)
    let C = clamp(1 - this.bodies.inters.C.c_axe.current_pos ,0,1) 
    if ( resolution_coef_override != null )
    {
      A = clamp(resolution_coef_override ,s[0],s[0]+1)
      B = clamp(resolution_coef_override ,s[1],s[1]+1)-s[1]
      C = clamp(resolution_coef_override ,s[2],s[2]+1)-s[2]
    }
    let coef = A + B + C

    // fill resolution coef info
    this.state.resolution_coef = coef
    this.state.steps[0].resoluton_coef = A
    this.state.steps[1].resoluton_coef = B
    this.state.steps[2].resoluton_coef = C

    this.state.current_step = 0
    if(A==1)
      this.state.current_step = 1
    if(B==1)
      this.state.current_step = 2   
    if(C==1)
      this.state.current_step = 3       
  }

  update_step_count(step)
  {
    for( let i = 0; i < this.state.steps.length; i++ )
    {
      if(i == step)
        this.state.steps[i].update_count += 1
      else
        this.state.steps[i].update_count = 0
    } 
  }

  set_phase_resolution_control_0( res_coef, update_interaction = false)
  {
      for( let i = 0; i < this.bodies.geos.rectangles.length; i++ )
      this.bodies.geos.rectangles[i].c_axe.pos_override = res_coef

    for( let i = 0; i < this.bodies.geos.trapezoids.length; i++ )
      this.bodies.geos.trapezoids[i].c_axe.pos_override = res_coef

    if( update_interaction )   
    {
      this.bodies.inters.A.c_axe.pos_override = res_coef
    }
  }

  set_phase_resolution_control_2( res_coef, update_interaction = false)
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
  
      if( update_interaction )   
      {
        this.bodies.inters.B.rot_override = rad(res_coef*270)
      }
  }

  set_phase_resolution_control_4( res_coef, update_interaction = false)
  {  
    this.bodies.geos.rectangles[3].c_axe.pos_override = 1 - res_coef

        
    let rot_coef = 1.15
    var rot_tmp = (res_coef*rot_coef) 

    for( let i=0; i < this.bodies.geos.trapezoids.length; i++ )
    {
      let current_r = this.bodies.geos.trapezoids[i].rot
      let r = current_r+ rad(270)+rot_tmp*rad(45);
      this.bodies.geos.trapezoids[i].rot_override = r
    }

    if( update_interaction )   
    {
      this.bodies.inters.C.c_axe.pos_override = 1-res_coef
    }    
  } 

  switch_selection_transition( current_step, selected_body, obj_last, obj_next)
  {
    if( this.state.switch_selection_happened_step != current_step)
    {
      if(selected_body != null)
      {
        if(this.force_way == null)
        {
          let current_way = 1
          if(this.state.resolution_coef < this.state.resolution_coef_last)
            current_way = -1
          else
            current_way = 1
  
          if(current_way == 1)
          {
            if(selected_body != obj_next.body)
              switch_selection( mouseConstraint, obj_next)
          }
          else
          {
            if(selected_body != obj_last.body)
              switch_selection(mouseConstraint, obj_last)     
          }
        }
        else if(this.force_way == 1)
        {
          if(selected_body != obj_next.body)
            switch_selection( mouseConstraint, obj_next)
        }
        else if(this.force_way == -1)
        {
          if(selected_body != obj_last.body)
            switch_selection(mouseConstraint, obj_last) 
        }
      }
      this.state.switch_selection_happened_step = current_step  
    }
  }


  set_phase_resolution( resolution_coef, update_interaction = false)
  {
    // utils
    var selected_body = mouseConstraint.constraint.bodyB

    // clean
    this.enable_existing_axe(true)
    this.clean_axe_override()
    this.modif_existing_constraint(1.0)
    this.clean_rot_override()
    this.enable( 0, true, false )

    ////////////////////////////////////////////////////////////////////////////////////
    let step = 0
    let res_coef = this.state.steps[step].resoluton_coef
    let do_it = this.state.current_step == step
    if( do_it )
    {
      //_________________________________________________________________Clean Inter
      this.bodies.inters.A.enable(1) 
      this.bodies.inters.B.rot_override = 0
      this.bodies.inters.C.c_axe.pos_override = 1    
      //_________________________________________________________________Clean Other

      //_________________________________________________________________Control
      this.set_phase_resolution_control_0( res_coef, update_interaction)

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
  
      this.bodies.inters.A.c_axe.pos_override = 1
      this.bodies.inters.C.c_axe.pos_override = 1

      //_________________________________________________________________Clean Other
      for( let i = 0; i < this.bodies.geos.rectangles.length; i++ )
        this.bodies.geos.rectangles[i].c_axe.pos_override = 1

      //_________________________________________________________________Control
      this.set_phase_resolution_control_2( res_coef, update_interaction)
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

      this.bodies.inters.A.c_axe.pos_override = 1
      this.bodies.inters.B.rot_override = rad(270)

      //_________________________________________________________________Clean Other
      this.bodies.geos.rectangles[0].enable(0)
      this.bodies.geos.rectangles[1].enable(0)
      this.bodies.geos.rectangles[2].enable(0)

      //_________________________________________________________________Control
      this.set_phase_resolution_control_4( res_coef, update_interaction)
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
      this.bodies.inters.C.c_axe.pos_override = -1

      //_________________________________________________________________Clean Other
      this.bodies.geos.rectangles[0].enable(0)
      this.bodies.geos.rectangles[1].enable(0)
      this.bodies.geos.rectangles[2].enable(0)

      for( let i=0; i < this.bodies.geos.trapezoids.length; i++ )
        this.bodies.geos.trapezoids[i].rot_override = this.bodies.geos.trapezoids[i].rot+ rad(270)+rad(45);   

      //_________________________________________________________________Control
      //this.set_phase_resolution_control_4( res_coef, update_interaction)
      //_________________________________________________________________Mouse
      this.switch_selection_transition( step, selected_body, this.bodies.inters.B, this.bodies.inters.C) 
      //_________________________________________________________________Update
      //this.state.switch_selection_happened_step = step
      this.update_step_count(step) 

      //
      
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

    this.set_color(lerpColor( c1,c2,a),false, true)
   
  }

  do_explode(step)
  {
    this.modif_existing_constraint(0.0001, false, true)
    this.enable_existing_axe(false, false, true)
    
    // custom color
    this.set_color(null,false, true)


    //gravity
    Matter.Body.applyForce(
      this.bodies.geos.circle.body, 
      this.bodies.geos.circle.body.position, 
      {x:0,y:0.05*0.13})

    for( let i=0; i < this.bodies.geos.rectangles.length; i++ )
      Matter.Body.applyForce(
        this.bodies.geos.rectangles[i].body, 
        this.bodies.geos.rectangles[i].body.position,
        {x:0,y:0.05*0.03})

    for( let i=0; i < this.bodies.geos.trapezoids.length; i++ )
      Matter.Body.applyForce(
        this.bodies.geos.trapezoids[i].body, 
        this.bodies.geos.trapezoids[i].body.position,
        {x:0,y:0.05*0.03})


    if( this.state.steps[step].apply_force_happened == false )
    {
      
      //console.log('APPLY FORCE')
      let p_force = {x:c.x,y:c.y}

      let v_force = createVector(0.05,0)

      let _v = null

      Matter.Body.applyForce(this.bodies.geos.rectangles[3].body, p_force, v_force)

      _v = p5.Vector.sub(createVector(0,-0.01),p5.Vector.mult(v_force,2))
      Matter.Body.applyForce(this.bodies.geos.circle.body, p_force, _v,v_force)

      _v = p5.Vector.sub(createVector(0.05,-0.05),p5.Vector.mult(v_force,2))
      Matter.Body.applyForce(this.bodies.geos.trapezoids[0].body, p_force, _v )

      _v = p5.Vector.sub(createVector(0.05,0.05),p5.Vector.mult(v_force,2))
      Matter.Body.applyForce(this.bodies.geos.trapezoids[1].body, p_force, _v )

      _v = p5.Vector.sub(createVector(-0.05,0.05),p5.Vector.mult(v_force,2))
      Matter.Body.applyForce(this.bodies.geos.trapezoids[2].body, p_force, _v )

      _v = p5.Vector.sub(createVector(-0.05,-0.05),p5.Vector.mult(v_force,2))
      Matter.Body.applyForce(this.bodies.geos.trapezoids[3].body, p_force, _v )
      
      this.state.steps[step].apply_force_happened = true
    }
  }  


  update()
  {

    let a_inter2 = deg(this.bodies.inters.B.body.angle)
    let center_tmp = createVector(c.x,c.y)

    for( let i = 0; i < this.bodies.geos.rectangles.length; i++)
      this.bodies.geos.rectangles[i].c_axe.axe_rotation_center = center_tmp
    for( let i = 0; i < this.bodies.geos.trapezoids.length; i++)
      this.bodies.geos.trapezoids[i].c_axe.axe_rotation_center = center_tmp

    this.bodies.geos.rectangles[0].c_axe.axe_rotation = min( 270, a_inter2)
    this.bodies.geos.rectangles[1].c_axe.axe_rotation = min( 90 , a_inter2)
    this.bodies.geos.rectangles[2].c_axe.axe_rotation = min( 180, a_inter2)
    this.bodies.geos.rectangles[3].c_axe.axe_rotation = min( 0  , a_inter2)

    for( let i = 0; i < this.bodies.geos.trapezoids.length; i++)
      this.bodies.geos.trapezoids[i].c_axe.axe_rotation = a_inter2
  
    this.bodies.inters.A.c_axe.axe_rotation = min( 270, a_inter2) 
    this.bodies.inters.A.c_axe.axe_rotation_center = center_tmp
    this.bodies.inters.C.c_axe.axe_rotation = min( 0  , a_inter2)
    this.bodies.inters.C.c_axe.axe_rotation_center = center_tmp

  
    // resolution
    this.state.resolution_coef_last = this.state.resolution_coef

    //this.resolution_coef_override = abs(sin(this.state.update_count/100))*3

    this.get_resolution_coef_info( this.resolution_coef_override )
    this.set_phase_resolution( this.state.resolution_coef, this.resolution_coef_override != null)
  

    //=====================================================================================================
    this.update_bodies()



    this.state.update_count += 1
  }

 

  show()
  {
    
    let a = this.state.steps[3].update_count

    a -=30
    a = max(0,a)
    a *=15

    fill(50,40,50)
    if( 0 < this.state.steps[3].update_count-15)
      fill(50,140,50)
    rect(0,0,width/2-a,height)
    fill(50,50,40)
    if( 0 < this.state.steps[3].update_count-15)
      fill(50,140,50)
    rect(width/2+a,0,width,height)


    this.draw_bodies()


    //=================================================================
    let wait_count = 100

    let c2 = color(
      utils.color.yellow[0],
      utils.color.yellow[1],
      utils.color.yellow[2])

    for( let i = 0; i < this.bodies.geos.rectangles.length; i++)
      this.bodies.geos.rectangles[i].color = this.bodies.geos.rectangles[i].color_base

    let c = this.state.steps[0].update_count
    if( wait_count < c )
    {
      let a = abs(cos((c-wait_count)/20))
      let c1 = color(
        this.bodies.geos.rectangles[0].color_base[0],
        this.bodies.geos.rectangles[0].color_base[1],
        this.bodies.geos.rectangles[0].color_base[2])
      
      this.bodies.geos.rectangles[0].color = lerpColor( c1,c2,a)

      fill( lerpColor( c1,c2,a) )
      let p = p5.Vector.add( this.bodies.geos.rectangles[0].get_point(),createVector(0,50))
      arrowHeads(p,createVector(0,1),1.0)

    }
    
    c = this.state.steps[1].update_count
    if( wait_count < c )
    {
      let a = abs(sin((c-wait_count)/20))
      let c1 = color(
        this.bodies.geos.rectangles[0].color_base[0],
        this.bodies.geos.rectangles[0].color_base[1],
        this.bodies.geos.rectangles[0].color_base[2])
      
      this.bodies.geos.rectangles[0].color = lerpColor( c1,c2,a)
      this.bodies.geos.rectangles[1].color = lerpColor( c1,c2,a)
      this.bodies.geos.rectangles[2].color = lerpColor( c1,c2,a)


      fill( lerpColor( c1,c2,a) )
      let coef = (this.state.steps[2].resoluton_coef)*rad(270)
      let vA = createVector(cos(coef+rad(180)),sin(coef+rad(180)))
      let p = p5.Vector.add( this.bodies.geos.rectangles[0].get_point(),p5.Vector.mult(vA,20))
      arrowHeads(p,vA,1.0)
      
      vA = createVector(cos(coef+rad(0)),sin(coef+rad(0)))
      p = p5.Vector.add( this.bodies.geos.rectangles[1].get_point(),p5.Vector.mult(vA,20))
      arrowHeads(p,vA,1.0)
      
      vA = createVector(cos(coef-rad(90)),sin(coef-rad(90)))
      p = p5.Vector.add( this.bodies.geos.rectangles[2].get_point(),p5.Vector.mult(vA,20))
      arrowHeads(p,vA,1.0)

      

    }

    c = this.state.steps[2].update_count
    if( wait_count < c )
    {
      let a = abs(sin((c-wait_count)/20))
      let c1 = color(
        this.bodies.geos.rectangles[0].color_base[0],
        this.bodies.geos.rectangles[0].color_base[1],
        this.bodies.geos.rectangles[0].color_base[2])
      
      this.bodies.geos.rectangles[0].color = lerpColor( c1,c2,a)
      this.bodies.geos.rectangles[1].color = lerpColor( c1,c2,a)
      this.bodies.geos.rectangles[2].color = lerpColor( c1,c2,a)

      fill( lerpColor( c1,c2,a) )
      let coef = (this.state.steps[2].resoluton_coef)*rad(270)
      let vA = createVector(cos(coef+rad(180)),sin(coef+rad(180)))
      let p = p5.Vector.add( this.bodies.geos.rectangles[0].get_point(),p5.Vector.mult(vA,20))
      arrowHeads(p,vA,1.0)
      
      vA = createVector(cos(coef+rad(0)),sin(coef+rad(0)))
      p = p5.Vector.add( this.bodies.geos.rectangles[1].get_point(),p5.Vector.mult(vA,20))
      arrowHeads(p,vA,1.0)
      
      vA = createVector(cos(coef-rad(90)),sin(coef-rad(90)))
      p = p5.Vector.add( this.bodies.geos.rectangles[2].get_point(),p5.Vector.mult(vA,20))
      arrowHeads(p,vA,1.0)
      

    }

    c = this.state.steps[3].update_count
    if( wait_count < c )
    {
      let a = abs(sin((c-wait_count)/20))
      let c1 = color(
        this.bodies.geos.rectangles[0].color_base[0],
        this.bodies.geos.rectangles[0].color_base[1],
        this.bodies.geos.rectangles[0].color_base[2])

      this.bodies.geos.rectangles[3].color = lerpColor( c1,c2,a)

      fill( lerpColor( c1,c2,a) )
      let p = p5.Vector.add( this.bodies.geos.rectangles[3].get_point(),createVector(-50,0))
      arrowHeads(p,createVector(-1,0),1.0)

    }

    c = this.state.steps[4].update_count
    if( wait_count < c )
    {
      let a = abs(sin((c-wait_count)/20))
      let c1 = color(
        this.bodies.geos.rectangles[0].color_base[0],
        this.bodies.geos.rectangles[0].color_base[1],
        this.bodies.geos.rectangles[0].color_base[2])

      this.bodies.geos.rectangles[3].color = lerpColor( c1,c2,a)
    }
    
  }  



  //=======================================================================================================================
  //=======================================================================================================================
  //=======================================================================================================================
  //=======================================================================================================================
  //=======================================================================================================================
  //=======================================================================================================================
  //=======================================================================================================================
  //=======================================================================================================================

  update_bodies( inters = true, geos = true)
  {
    for( let b_type in this.bodies)
    {   
      if(( (b_type == 'inters')&&(inters==true) )
      || ( (b_type == 'geos'  )&&(geos  ==true) ) )
      {
        for( let key of this.bodies_draw_order[b_type])
        {      
          if( this.bodies[b_type][key].constructor === Array)
          {
            for( let i = 0; i < this.bodies[b_type][key].length; i++)
              this.bodies[b_type][key][i].update()
          }
          else
            this.bodies[b_type][key].update()
        }  
      } 
    }
  }

  draw_bodies( inters = true, geos = true )
  {
    for( let b_type in this.bodies)
    {   
      if(( (b_type == 'inters')&&(inters==true) )
      || ( (b_type == 'geos'  )&&(geos  ==true) ) )
      {
        for( let key of this.bodies_draw_order[b_type])
        {      
          if( this.bodies[b_type][key].constructor === Array)
          {
            for( let i = 0; i < this.bodies[b_type][key].length; i++)
              this.bodies[b_type][key][i].draw()
          }
          else
            this.bodies[b_type][key].draw()
        }  
      } 
    }
  }

  set_color(new_color = null,inters = true, geos = true)
  {
    for( let b_type in this.bodies)
    {   
      if(( (b_type == 'inters')&&(inters==true) )
      || ( (b_type == 'geos'  )&&(geos  ==true) ) )
      {
        for( let key of this.bodies_draw_order[b_type])
        {      
          if( this.bodies[b_type][key].constructor === Array)
          {
            for( let i = 0; i < this.bodies[b_type][key].length; i++)
              this.bodies[b_type][key][i].color = new_color || this.bodies[b_type][key][i].color_base
          }
          else
            this.bodies[b_type][key].color = new_color || this.bodies[b_type][key].color_base
        }  
      } 
    }
  }

  clean_axe_override(inters = true, geos = true)
  {
    for( let b_type in this.bodies)
    {   
      if(( (b_type == 'inters')&&(inters==true) )
      || ( (b_type == 'geos'  )&&(geos  ==true) ) )
      {
        for( let key of this.bodies_draw_order[b_type])
        {      
          if( this.bodies[b_type][key].constructor === Array)
          {
            for( let i = 0; i < this.bodies[b_type][key].length; i++)
              if(this.bodies[b_type][key][i].c_axe != null)
                this.bodies[b_type][key][i].c_axe.pos_override = null
          }
          else
            if(this.bodies[b_type][key].c_axe != null)
              this.bodies[b_type][key].c_axe.pos_override = null
        }  
      } 
    }  
  }

  enable_existing_axe(value, inters = true, geos = true)
  {
    for( let b_type in this.bodies)
    {   
      if(( (b_type == 'inters')&&(inters==true) )
      || ( (b_type == 'geos'  )&&(geos  ==true) ) )
      {
        for( let key of this.bodies_draw_order[b_type])
        {      
          if( this.bodies[b_type][key].constructor === Array)
          {
            for( let i = 0; i < this.bodies[b_type][key].length; i++)
              if(this.bodies[b_type][key][i].c_axe != null)
                this.bodies[b_type][key][i].c_axe.enable = value
          }
          else
            if(this.bodies[b_type][key].c_axe != null)
              this.bodies[b_type][key].c_axe.enable = value
        }  
      } 
    }     
  }

  modif_existing_constraint(value, inters = true, geos = true)
  {
    for( let b_type in this.bodies)
    {   
      if(( (b_type == 'inters')&&(inters==true) )
      || ( (b_type == 'geos'  )&&(geos  ==true) ) )
      {
        for( let key of this.bodies_draw_order[b_type])
        {      
          if( this.bodies[b_type][key].constructor === Array)
          {
            for( let i = 0; i < this.bodies[b_type][key].length; i++)
              for( let j = 0; j < this.bodies[b_type][key][i].constraints.length; j++)
                this.bodies[b_type][key][i].constraints[j].cns.stiffness = value
          }
          else      
            for( let j = 0; j < this.bodies[b_type][key].constraints.length; j++)
              this.bodies[b_type][key].constraints[j].cns.stiffness = value   
        }  
      } 
    }   
  }

  clean_rot_override(inters = true, geos = true)
  {
    for( let b_type in this.bodies)
    {   
      if(( (b_type == 'inters')&&(inters==true) )
      || ( (b_type == 'geos'  )&&(geos  ==true) ) )
      {
        for( let key of this.bodies_draw_order[b_type])
        {      
          if( this.bodies[b_type][key].constructor === Array)
          {
            for( let i = 0; i < this.bodies[b_type][key].length; i++)
              this.bodies[b_type][key][i].rot_override = null 
          }
          else
            this.bodies[b_type][key].rot_override = null 
        }  
      } 
    }  
  }

  set_debug( value, inters = true, geos = true)
  {
    for( let b_type in this.bodies)
    {   
      if(( (b_type == 'inters')&&(inters==true) )
      || ( (b_type == 'geos'  )&&(geos  ==true) ) )
      {
        for( let key of this.bodies_draw_order[b_type])
        {      
          if( this.bodies[b_type][key].constructor === Array)
          {
            for( let i = 0; i < this.bodies[b_type][key].length; i++)
              this.bodies[b_type][key][i].debug = value 
          }
          else
            this.bodies[b_type][key].debug = value 
        }  
      } 
    }       
  }

  enable( value, inters = true, geos = true )
  {
    for( let b_type in this.bodies)
    {   
      if(( (b_type == 'inters')&&(inters==true) )
      || ( (b_type == 'geos'  )&&(geos  ==true) ) )
      {
        for( let key of this.bodies_draw_order[b_type])
        {      
          if( this.bodies[b_type][key].constructor === Array)
          {
            for( let i = 0; i < this.bodies[b_type][key].length; i++)
              this.bodies[b_type][key][i].enable(value)
          }
          else
            this.bodies[b_type][key].enable(value)
        }  
      } 
    } 
   
  }

  mouse_select_highlight(mouse_cns, inters = true, geos = true )
  {
    if( mouse_cns.constraint.bodyB != null )
    {
      for( let b_type in this.bodies)
      {   
        if(( (b_type == 'inters')&&(inters==true) )
        || ( (b_type == 'geos'  )&&(geos  ==true) ) )
        {
          for( let key of this.bodies_draw_order[b_type])
          {      
            if( this.bodies[b_type][key].constructor === Array)
            {
              for( let i = 0; i < this.bodies[b_type][key].length; i++)
              {
                if( this.bodies[b_type][key][i].body == mouse_cns.constraint.bodyB )
                  this.bodies[b_type][key][i].color = utils.color.redLight
                else
                  this.bodies[b_type][key][i].color = this.bodies[b_type][key][i].color_base           
              }
            }
            else
            {
              if( this.bodies[b_type][key].body == mouse_cns.constraint.bodyB )
                this.bodies[b_type][key].color = utils.color.redLight
              else
              this.bodies[b_type][key].color = this.bodies[b_type][key].color_base 
            }

          }  
        } 
      } 
 
    }    
  }




}


