import Vector from './vector.js';
import Matrix from './matrix.js';
import { utils , rad, deg, Draw_text_debug,convert_coords_matter_to_three} from './utils.js';
import { 
  dyn_constraint_build, 
  constraint_build, 
  cns_axe,limit,
  dyn_constraint_build_custom_orient,
  connect} from './constraint.js';
import * as ut from './utils_three.js';
import { VerticalTiltShiftShader } from './libraries/jsm/Addons.js';
import * as THREE from 'three';

export class body_build{
  
    constructor( in_options ){
    // Default options
      const defaultOptions = {
        type:'body',
        name:'default name',
        highlight_selection:[],
        m: new Matrix(),
        m_offset: new Matrix(),
        m_transform: new Matrix(),
        m_shape: new Matrix(),
        parent:null,
        z: 0,
        w: 1,
        h: 1,
        slop: 0,
        type: -1,
        collision: true,
        collision_category: utils.collision_category.default,
        collision_mask: utils.collision_category.default,
        constraints:[],
        do_shape:true,
        do_line:false,
        color:utils.color.grey,
        color_line:utils.color.black,
        transparency_activate:false,
        transparency:255,
        transparency_line:255,        
        shader:null,
        visibility:true,
        axe_constraint: null,
        density:0.001,
        frictionAir:0.01,
        mass:null,
        screen_dims:null,
        matter_engine:null,
        mouse_constraint:null,
        fidget:null, 
        texture_three:null,
        arc_limites:[0,3.14*2],
        debug_matrix_info: false,
        debug_matrix_axes: false,  
        debug_cns_axes: false,     
        debug_force_visibility: false, 
        selection_break_length: 60.,  
                   
      };
      const args = { ...defaultOptions, ...in_options };
      

      this.type = args.type
      this.name = args.name   
      this.highlight_selection = args.highlight_selection    
      this.m = args.m
      this.parent = args.parent
      this.m_offset = args.m_offset
      this.m_transform = args.m_transform
      this.z = args.z
      this.m_shape_init = args.m_shape
      this.m_shape = args.m_shape
      //this.w = args.w
      //this.h = args.h
      this.slop = args.slop
      //this.rot = 0
      this.extra_rotation = 0
      this.rot_override = null
      this.scale = 1.0
      this.constraints_args = args.constraints
      this.do_shape= args.do_shape
      this.do_line= args.do_line      
      this.color = args.color
      this.color_line = args.color_line
      this.color_base = args.color
      this.transparency_activate = args.transparency_activate,
      this.transparency = args.transparency,
      this.transparency_line = args.transparency_line,     
      this.shader = args.shader
      this.collision = args.collision
      this.collision_category = args.collision_category
      this.collision_mask = args.collision_mask
      this.visibility = args.visibility
      this.visibility_default = args.visibility
      this.visibility_secondary = true
      //this.visibility_override = true
      this.debug_force_visibility = args.debug_force_visibility
      this.do_update = true
      this.density = args.density
      this.frictionAir = args.frictionAir
      this.mass = args.mass
      this.screen_dims = args.screen_dims
      this.matter_engine = args.matter_engine
      this.mouse_constraint = args.mouse_constraint
      this.fidget = args.fidget
      this.texture_three = args.texture_three
      this.arc_limites = args.arc_limites
      this.debug_matrix_info = args.debug_matrix_info
      this.debug_matrix_axes = args.debug_matrix_axes
      this.debug_cns_axes = args.debug_cns_axes  
      this.selection_break_length = args.selection_break_length

      this.is_selected = false
      

      this.draw_text_debug = null
      if(this.debug_matrix_info)
        this.draw_text_debug = new Draw_text_debug(this.screen_dims)


      this.constraints = {}
      this.constraints_order = []
      //this.physics_constraints = []
      this.c_axe = null
      //if(args.axe_constraint != null)
      //  this.c_axe = new cns_axe({ Follower: this, ...args.axe_constraint })
  
      var max_choice = 10
      if(args.type != -1)
        this.type = args.type
      else
        this.type = min(max(Math.round(Matter.Common.random(-1, max_choice+1)),0),max_choice)
  
      /*
      this.shape_vertices = Matter.Vertices.create([], Matter.Body)
 
      
      switch(this.type) {    
        case 1:
          this.w = args.w/2
          break;
          
        case 2:
          this.w = args.w/2
          break; 
        case 3:
          this.w = args.w/2
          break;  
        case 4:
          this.w = args.w/2
          break;               
        case 5:
          this.w = args.w/2
          var points_scale = []
          for(let i = 0; i < arrow.length;i+=2)
            points_scale.push( { x:arrow[i]*this.w, y:arrow[i+1]*this.w})
          this.shape_vertices = Matter.Vertices.create(points_scale, Matter.Body)      
          break;     
        case 6:
          this.w = args.w/2
          var points_scale = []
          for(let i = 0; i < chevron.length;i+=2)
            points_scale.push( { x:chevron[i]*this.w, y:chevron[i+1]*this.w})
          this.shape_vertices = Matter.Vertices.create(points_scale, Matter.Body)      
          break;    
        case 7:
          this.w = args.w/2
          var points_scale = []
          for(let i = 0; i < star.length;i+=2)
            points_scale.push( { x:star[i]*this.w, y:star[i+1]*this.w})
          this.shape_vertices = Matter.Vertices.create(points_scale, Matter.Body)      
          break;   
        case 8:
          this.w = args.w/2
          var points_scale = []
          for(let i = 0; i < horseShoe.length;i+=2)
            points_scale.push( { x:horseShoe[i]*this.w, y:horseShoe[i+1]*this.w})
          this.shape_vertices = Matter.Vertices.create(points_scale, Matter.Body)      
          break;
        case 10:
          //this.w = args.w/2
          //this.h = args.h/2
          break;                                                       
        }
        */
        
      
        
  
  
      //this.color = [100,100,100]
      this.colorStroke = [0,0,0]

      // shader

      this.draw_count = 0
      this.geo = null
      this.shape_three = null
      this.mesh_three = null

      this.init_physics()
    }

    matter_get_shape(m)
    {
      let p = m.get_row(2).get_value()
      let w = m.get_row(0).mag()
      let h = m.get_row(1).mag()
      let r = m.getRotation()

      let body = null
      switch(this.type) {
        case 0:
          body = Matter.Bodies.rectangle(p.x, p.y, w, h);
          Matter.Body.rotate(body, r)
          break;
        case 1:
          body = Matter.Bodies.circle(p.x, p.y, w/2.);
          Matter.Body.rotate(body, r)
          break;
          /*
        case 2:
          body = Matter.Bodies.polygon(p.x, p.y, 3, this.w);
          Matter.Body.rotate(body, this.rot)
          break;
        case 3:
          body = Matter.Bodies.polygon(p.x, p.y, 5, this.w);
          Matter.Body.rotate(body, this.rot)
          break;     
        case 4:
          body = Matter.Bodies.polygon(p.x, p.y, 6, this.w);
          Matter.Body.rotate(body, this.rot)
          break;  
        case 5:    
          body = Matter.Bodies.fromVertices(p.x, p.y, this.shape_vertices)
          Matter.Body.rotate(body, this.rot)
          break;     
        case 6: 
          body = Matter.Bodies.fromVertices(p.x, p.y, this.shape_vertices)
          Matter.Body.rotate(body, this.rot)
          break;    
        case 7:     
          body = Matter.Bodies.fromVertices(p.x, p.y, this.shape_vertices)
          Matter.Body.rotate(body, this.rot)
          break;   
        case 8:     
          body = Matter.Bodies.fromVertices(p.x, p.y, this.shape_vertices)
          Matter.Body.rotate(body, this.rot)
          break;      
        case 9:  
          var bodyA = Matter.Bodies.rectangle(p.x, p.y, this.w, this.h/3);   
          var bodyB = Matter.Bodies.rectangle(p.x, p.y, this.w/3, this.h); 
          body = Matter.Body.create({parts: [bodyA, bodyB]});
          Matter.Body.rotate(body, this.rot)
          break; 
          */
        case 10:  
          body = Matter.Bodies.trapezoid(p.x, p.y, w, h , rad(this.slop*2))
          Matter.Body.rotate(body, r)
          break;      
        case 11:  
          body = Matter.Bodies.circle(p.x, p.y, w);//tmp
          Matter.Body.rotate(body, r)
          break;             
        } 
        
        return body
    }

    init_physics()
    {
      this.body = this.matter_get_shape(this.m_shape)
  
      Matter.Body.setDensity(this.body, this.density)
      if( this.mass != null )
        Matter.Body.setMass(this.body, this.mass)

      this.body.frictionAir = this.frictionAir
  

      for( let i = 0; i < this.constraints_args.length; i++)
      {
        this.constraints_order.push(this.constraints_args[i].name)

        let cns = null
        if(this.constraints_args[i].type == 'dyn_point')
        { 
          cns = new dyn_constraint_build({obj: this, ...this.constraints_args[i]})//build_constraint(this,this.constraints_args[i])          
        }

        if(this.constraints_args[i].type == 'dyn_orient')
        {
          cns = new dyn_constraint_build_custom_orient({obj: this, ...this.constraints_args[i], y_offset:300})//build_constraint(this,this.constraints_args[i],offset)                 
        }

        if(this.constraints_args[i].type == 'kin_point')
        { 
          cns = new constraint_build({obj: this, ...this.constraints_args[i],do_position:true,do_orientation:false})//build_constraint(this,this.constraints_args[i])          
        }

        if(this.constraints_args[i].type == 'kin_orient')
        {
          cns = new constraint_build({obj: this, ...this.constraints_args[i],do_position:false,do_orientation:true})//build_constraint(this,this.constraints_args[i],offset)                 
        }

        /////////////////// axe
        if(this.constraints_args[i].type == 'kin_axe')
        {
          cns =  new cns_axe({ Follower: this, ...this.constraints_args[i] })   
        }

        if(this.constraints_args[i].type == 'kin_limit')
        {
          cns =  new limit({ Follower: this, ...this.constraints_args[i], obj:this })   
        }

        if(this.constraints_args[i].type == 'connect')
        {
          cns =  new connect({ ...this.constraints_args[i], obj:this })   
        }

        this.constraints[this.constraints_args[i].name] = cns

      }

  
      if( this.collision )
      {
        this.body.collisionFilter = {
          category:this.collision_category,
          group:0,
          mask:this.collision_mask ,
        }
      }
      else
      {
        this.body.collisionFilter = {
          category:0,
          group:-1,
          mask:-1,     
        }      
      }
  
  
      Matter.Composite.add( this.matter_engine.world, this.body)    
      
      this.set_out_matrix(this.get_init_matrix())
    }

    matter_update_shape_coords(m)
    {
      let new_body = this.matter_get_shape(m)
      this.m_shape = m
      Matter.Body.setVertices(this.body, new_body.vertices)

    }

    apply_scale( value )
    {
      this.scale = this.scale*value
      Matter.Body.scale( this.body, value, value, { x : this.body.position.x, y : this.body.position.y })
  
    }
  
    enable(value)
    {
      if(value)
        this.visibility = this.visibility_default
      else
        this.visibility = false
      //this.do_update = value
      //Matter.Sleeping.set(this.body, value==false)
      if(value)
        this.body.collisionFilter.category = this.collision_category
      else
        this.body.collisionFilter.category = utils.collision_category.none
    }

    get_parent_matrix()
    {
      /*
      m_parent_world
      */
      let m_parent = null
      if(this.parent != null)
      {
        m_parent = this.parent.get_out_matrix()
      }
      else{
        m_parent = this.m
      }
      return m_parent
    }  

    get_parent_in_matrix()
    {
      /*
      m_parent_world
      */
      let m_parent = null
      if(this.parent != null)
      {
        m_parent = this.parent.get_in_matrix()
      }
      else{
        m_parent = this.m
      }
      return m_parent
    } 
    get_init_matrix( )
    {
      let m = this.m_transform.getMult(this.m_offset.getMult(this.get_parent_in_matrix()))
      return m
    }

    get_in_matrix( )
    {
      let m = this.m_transform.getMult(this.m_offset.getMult(this.get_parent_matrix()))
      return m
    }

    init_out_matrix()
    {
      let m_init = this.get_init_matrix()
      this.set_out_matrix(m_init)
    }

    get_out_matrix()
    {
      let pos = new Vector( this.body.position.x, this.body.position.y)
      let rot = this.body.angle
      let m = new Matrix()
      m.setTranslation(pos)
      m.setRotation(rot)
      return m
    }

    get_position()
    {
      let m = this.get_out_matrix()
      let p = m.get_row(2)
      return p
    }

    get_local_rotation()
    {
      let m = this.get_out_matrix()
      let m_in = this.get_in_matrix()
      let m_local = m.getMult(m_in.getInverse())
      let r = m_local.getRotation()
      return r
    }

    get_rotation()
    {
      let m = this.get_out_matrix()
      let r = m.getRotation()
      return r
    }

    get_velocity()
    {
      let v = new Vector( this.body.velocity.x, this.body.velocity.y)     
      return v
    }  

    get_visibility()
    {
      if(this.debug_force_visibility)
        return 1
      if( this.visibility && this.visibility_secondary ) 
        return 1
      return 0
    }
   
    set_position_input(v)
    {
      let m_in = this.m_offset.getMult(this.get_parent_matrix())
      let p_transform_target = v.mult(m_in.getInverse())
      this.m_transform.set_row(2,p_transform_target)
    }

    set_position( in_position, position_space = null, orient_space = null)
    {

      let in_vector_processed = null
      if( orient_space== 'parent' )
      {
        let m_parent_orient = this.parent.get_out_matrix()
        m_parent_orient.set_row(2,new Vector())
        in_vector_processed = in_position.mult(m_parent_orient)        
      }
      if( orient_space == 'in' )
      {
        let m_in_orient = this.get_in_matrix()
        m_in_orient.set_row(2,new Vector())
        in_vector_processed = in_position.mult(m_in_orient)        
      }

      if( orient_space == 'out' )
      {
        let m_out_orient = this.get_in_matrix()
        m_out_orient.set_row(2,new Vector())
        in_vector_processed = in_position.mult(m_out_orient)        
      }

      ///////////////
      let in_position_processed = in_position
      if( position_space == 'parent' )
      {
        let m_parent = this.parent.get_out_matrix()
        if(in_vector_processed != null)
        {
          in_position_processed = m_parent.get_row(2).getAdd(in_vector_processed)
        }
        else
        {
          in_position_processed = in_position.mult(m_parent)  
        }

      }
      if( position_space == 'in' )
      {
        let m_in = this.get_in_matrix()
        if(in_vector_processed != null)
        {
          in_position_processed = m_in.get_row(2).getAdd(in_vector_processed)
        }
        else
        {
          in_position_processed = in_position.mult(m_in)      
        }   
      }
      if( position_space == 'out' )
      {
        let m_out = this.get_out_matrix()
        if(in_vector_processed != null)
        {
          in_position_processed = m_out.get_row(2).getAdd(in_vector_processed)
        }
        else
        {
          in_position_processed = in_position.mult(m_out)    
        }     
      }


      Matter.Body.setPosition(this.body, in_position_processed.get_value())
    }

  
    set_velocity(v,update_input = false)
    {
      Matter.Body.setVelocity(this.body, v.get_value())
    }  

    apply_force(p,v)
    {          
      Matter.Body.applyForce(this.body, p.get_value(), v.get_value())
    }

 
    apply_vector_transform( piv, v_move, rot_friction = 0.)
    {          
      if(v_move.mag()<0.001)
        return false

      let m = this.get_out_matrix()
      let p = m.get_row(2)

      let v_rot_start_axe = piv.getSub(p)
      let start_axe_length = v_rot_start_axe.mag()
      v_rot_start_axe.normalize()
      let v_rot_start_axe_normal = v_rot_start_axe.getNormal()
      v_rot_start_axe_normal.normalize()

      // get translate start
      let v_translate_start = v_rot_start_axe.getMult(v_move.dot(v_rot_start_axe))
    
      // get rotation
      let v_rotate_start = v_rot_start_axe_normal.getMult(v_move.dot(v_rot_start_axe_normal))
      let rot = Math.tan(v_rotate_start.mag()/start_axe_length)

      // get translate end
      let v_axe_after_rotate = v_rotate_start.getAdd(piv).getSub(p)
      let v_axe_after_rotate_length = v_axe_after_rotate.length
      let v_translate_end = v_axe_after_rotate.getNormalized()
      v_translate_end.mult(v_axe_after_rotate_length-start_axe_length)

      // get translate
      let v_translate = v_translate_end.getAdd(v_translate_start)

      // apply to matrix
      m.setTranslation(p.getAdd(v_translate) )
      m.setRotation(m.getRotation()+rot)

      // apply to body
      this.set_out_matrix(m)

      return true

    }   

    set_angle(a, override = true)
    {
    
      let angle = null
      if(override)
        angle = a
      else
      {
        angle = this.get_in_matrix().getRotation()+a
      }
           

      Matter.Body.setAngle(this.body, angle)
    }

    set_angle_input(a)
    {
      let m_in = this.m_offset.getMult(this.get_parent_matrix())
      let m_current = new Matrix()
      m_current.setRotation(a)
      let m_delta = m_current.getMult(m_in.getInverse())
      this.m_transform.setRotation(m_delta.getRotation())
    }

    set_anglular_velocity(a)
    {
      Matter.Body.setAngularVelocity(this.body, a)
    }

    set_out_matrix(m)
    {
      this.set_position(m.get_row(2))
      this.set_angle(m.getRotation())
    }
  

  
    clean_velocity()
    {
      Matter.Body.setVelocity(this.body, {x:0,y:0}) 
      Matter.Body.setAngularVelocity(this.body, 0)    
    }
  
    update()
    {
        
      if( !this.do_update )
        return false

      for( let i = 0; i < this.constraints_order.length; i++)
      {
        this.constraints[this.constraints_order[i]].apply()
      }

      if(this.rot_override!=null)
        this.set_angle(this.rot_override,true)

      return true
     
    }
    
  


    three_get_shape_points(m)
    {
      this.m_shape = m
      let p = this.m_shape.get_row(2).get_value()
      let w = this.m_shape.get_row(0).mag()
      let h = this.m_shape.get_row(1).mag()
      let r = this.m_shape.getRotation() 


      // Three
      let shape_three = null
      switch(this.type) {
        case 0:
          shape_three = ut.rect( w, h );
          break;
        case 1:
          shape_three = ut.circle(w/2);
          break;
        case 10:  
          shape_three = ut.roundedTrap( w, h, this.slop, 0 )
          break; 
        case 11: 
          shape_three = ut.arc( w, this.arc_limites[0], this.arc_limites[1])
          break;      
        }  
      return shape_three
    }

    three_fill_with_shapes( group, m )
    {
      let shape_points = this.three_get_shape_points(m)

      let out = {
        shape:null,
        line:null,
      }

      if(this.do_shape)
      {
        out.shape = ut.addShape_polygon( 
          shape_points, 
          this.texture_three, 
          this.color, 
          this.transparency_activate, 
          this.transparency)  

        group.add( out.shape ) 
      }
      if(this.do_line)
      {
        out.line = ut.addShape_line( 
          shape_points, 
          this.texture_three, 
          this.color, 
          this.transparency_activate, 
          this.transparency)  

        group.add( out.line ) 
      }
      return out
    }

    update_shape_coords(m)
    {
      this.matter_update_shape_coords(m)
      this.three_update_shape_coords(m)

    }

    three_update_shape_coords(m)
    {
      this.m_shape = m
      let shape_points = this.three_get_shape_points(m)
      if(this.do_shape)
      {
        this.mesh_three.shape.geometry.setFromPoints(shape_points.getPoints());
      }
      if(this.do_line)
      {
        this.mesh_three.line.geometry.setFromPoints(shape_points.getPoints());
      }     
    }


    setup_shapes_three(group_fidget){
      this.mesh_three = { group : null, shape : null, line : null}

      this.mesh_three.group = new THREE.Group();
      this.mesh_three.group.visible = false
      let _out = this.three_fill_with_shapes( this.mesh_three.group, this.m_shape )
      this.mesh_three.shape = _out.shape
      this.mesh_three.line  = _out.line

      group_fidget.add(this.mesh_three.group)
      


      if(this.debug_cns_axes)
      {

        if(( this.constraints.axe != null)&&(this.constraints.axe.enable == true ))
        {
          this.constraints.axe.update_debug()
          let shape = ut.line( 
            convert_coords_matter_to_three(this.constraints.axe.debug_pts[0],this.screen_dims), 
            convert_coords_matter_to_three(this.constraints.axe.debug_pts[1],this.screen_dims) );
            
          //let axes_grp = new THREE.Group();
          //group_fidget.add(axes_grp)

          let mesh = ut.addShape_line(  
            shape, 
            [255,0,255])

            group_fidget.add( mesh ) 
        }
      }

      if(this.debug_matrix_axes)
      {        
        let len = 10
        let wid = 2
  
        let shape = null
        let mesh = null        
        shape = ut.rect( len, wid )
        mesh = ut.addShape_polygon(  
          shape, 
          null,
          [255,0,0])
        this.mesh_three.group.add( mesh ) 
        mesh.position.x =  len/2.0

        mesh = ut.addShape_line(  
          shape, 
          [0,0,0])
        this.mesh_three.group.add( mesh ) 
        mesh.position.x =  len/2.0

        shape = ut.rect( wid, len )
        mesh = ut.addShape_polygon(   
          shape, 
          null,
          [0,255,0])
        this.mesh_three.group.add( mesh ) 
        mesh.position.y =  len/2.0

        mesh = ut.addShape_line(  
          shape, 
          [0,0,0])
        this.mesh_three.group.add( mesh ) 
        mesh.position.y =  len/2.0
        
      }

      if(this.debug_matrix_info)
        this.draw_text_debug.setup_three(this.mesh_three.group)

    }  

    

    animate_three()
    {

      let pos = this.get_position()
      let rot = this.get_rotation()
      let scale = this.scale
      
      let converted_pos = convert_coords_matter_to_three(pos,this.screen_dims)
      this.mesh_three.group.position.x = converted_pos.x()
      this.mesh_three.group.position.y = converted_pos.y()
      this.mesh_three.group.position.z = this.z
      this.mesh_three.group.rotation.z = rot*-1
      this.mesh_three.group.visible = this.get_visibility() == 1   
      this.mesh_three.group.scale.x = scale  
      this.mesh_three.group.scale.y = scale  
      this.mesh_three.group.scale.z = scale  
  

      if(this.debug_matrix_info)
      {
        console.log('debug_matrix_info')
        let parent_name = 'null'
        if(this.parent != null)
          parent_name = this.parent.name
        let m_parent = this.get_parent_matrix()
        let m_offset = this.m_offset
        let m_transform = this.m_transform
        let m_in = this.get_in_matrix( )
        let m_out = this.get_out_matrix()    
        let p_out = this.get_position()
        let r_out = this.get_rotation()    
        let vel_out = this.get_velocity()


        let texts_to_draw = [
          'parent name : ' + parent_name,
          'm_parent: '+Math.round(m_parent.a)+' '+Math.round(m_parent.b)+' | '+Math.round(m_parent.c)+' '+Math.round(m_parent.d)+' | '+Math.round(m_parent.e)+' '+Math.round(m_parent.f)+'' ,
          'm_offset: '+Math.round(m_offset.a)+' '+Math.round(m_offset.b)+' | '+Math.round(m_offset.c)+' '+Math.round(m_offset.d)+' | '+Math.round(m_offset.e)+' '+Math.round(m_offset.f)+'' ,
          'm_transform: '+Math.round(m_transform.a)+' '+Math.round(m_transform.b)+' | '+Math.round(m_transform.c)+' '+Math.round(m_transform.d)+' | '+Math.round(m_transform.e)+' '+Math.round(m_transform.f)+'' ,
          'm_in    : '+Math.round(m_in.a)+' '+Math.round(m_in.b)+' | '+Math.round(m_in.c)+' '+Math.round(m_in.d)+' | '+Math.round(m_in.e)+' '+Math.round(m_in.f)+'' ,
          'm_out   : '+Math.round(m_out.a)+' '+Math.round(m_out.b)+' | '+Math.round(m_out.c)+' '+Math.round(m_out.d)+' | '+Math.round(m_out.e)+' '+Math.round(m_out.f)+'' ,
          'p_out   : '+Math.round(p_out.x())+' '+Math.round(p_out.y()) ,
          'r_out   : '+Math.round(deg(r_out)),
          'vel_out : '+Math.round(vel_out.x())+' '+Math.round(vel_out.y()) ,
          //'0 - res: ' + Math.round( this.fidgets[0].state.steps[0].resoluton_coef, 2) + ' / 1',
          //'1 - count: ' + this.fidgets[0].state.steps[1].update_count,
          //'1 - res Coef: ' + Math.round( this.fidgets[0].state.steps[1].resoluton_coef, 2) + ' / 1',
          //'2 - count: ' + this.fidgets[0].state.steps[2].update_count ,
          //'2 - res Coef: ' + Math.round( this.fidgets[0].state.steps[2].resoluton_coef, 2) + ' / 1',
          //'3 - count: ' + this.fidgets[0].state.steps[3].update_count ,
          //'3 - res Coef: ' + Math.round( this.fidgets[0].state.steps[3].resoluton_coef, 2) + ' / 1' ,
          //'4 - count: ' + this.fidgets[0].state.steps[4].update_count,
          //'4 - res Coef: ' + Math.round( this.fidgets[0].state.steps[4].resoluton_coef, 2) + ' / 1',
          //'5 - count: ' + this.fidgets[0].state.steps[5].update_count,
          //'5 - res Coef: ' + Math.round( this.fidgets[0].state.steps[5].resoluton_coef, 2) + ' / 1',
        ]
        this.draw_text_debug.update_three(texts_to_draw)
      }  
      
      
      // mouse cns
      
    }

    update_color_three()
    {
      if(this.mesh_three.shape != null)
      {
        this.mesh_three.shape.material.color = ut.convert_to_three_color(this.color)
        if(this.transparency_activate)
          this.mesh_three.shape.material.opacity = 1. - this.transparency
      }
        
      
      if(this.mesh_three.line != null)
      {
        this.mesh_three.line.material.color = ut.convert_to_three_color(this.color_line)
        if(this.transparency_activate)
          this.mesh_three.line.material.opacity = 1. - this.transparency_line  
          
        
      }

    }
  }
  

/*
function build_constraint(body,cns_opts,offset = 0)
{
  var options = {
    bodyA: body.body,
    pA: { x: 0, y: offset },
    pB: { x: 0, y: offset },
    stiffness: cns_opts.stiffness,
    damping : cns_opts.damping,
    length : cns_opts.length,
    matter_engine: body.matter_engine,
  }
  if(cns_opts.p_offset!= null)
    options.pA = cns_opts.p_offset.get_value()

  if(cns_opts.target != null)
    options.bodyB = cns_opts.target.body
  else
  {
    options.pB = body.m.get_row(2).get_value()
    options.pB.y +=offset

  }

  if(cns_opts.p_target_offset != null)  
    options.pB = cns_opts.p_target_offset.get_value()


  if(options.stiffness == 0)
  {
    options.stiffness = 0.000001
    options.damping = 0
  }

  return new constraint_build(options)  
}
*/






export function build_effects_trail(opts,body_target)
{
  let opts_global = {
    screen_dims: opts.screen_dims,
    matter_engine: opts.matter_engine, 
    mouse_constraint: opts.mouse_constraint,
  }
  let opts_collision_no_interaction = {
    collision_category: utils.collision_category.none,
    collision_mask: utils.collision_category.none
  } 
  let opts_debug = {
    debug_matrix_info: false,
    debug_matrix_axes: opts.debug_matrix_axes,  
    debug_cns_axes: opts.debug_cns_axes,   
    debug_force_visibility: opts.debug_force_visibility,             
  }  
  let opts_trail = {
                    ...opts, 
                    ...opts_global,
                    ...opts_collision_no_interaction,
                    ...opts_debug,
                    do_shape: true,
                    do_line:false,                                             
  }

  ////////////////////////////////////////////////////////////////////////////////
  let bodies = []

  bodies.push(new body_build({  ...opts_trail, 
                                name: opts.name + 'effect_trails1',                                       
                                color:utils.color.red,
                                constraints:[
                                  {  name:'point' ,type:'kin_point',target:body_target,  stiffness: 0.15},
                                  {  name:'orient',type:'kin_orient',target:body_target, stiffness: 0.15}, 
                                ],                                                   
                              })) 
                                 
  bodies.push(new body_build({  ...opts_trail,                                 
                                name: opts.name + 'effect_trails2',        
                                color:utils.color.blue,              
                                constraints:[
                                  {  name:'point' ,type:'kin_point',target:body_target,  stiffness: 0.2},
                                  {  name:'orient',type:'kin_orient',target:body_target, stiffness: 0.2}, 
                                ],                                                          
                              }))  
                                                                                    
  bodies.push(new body_build({  ...opts_trail, 
                                name: opts.name + 'effect_trails3',    
                                color:utils.color.green,          
                                constraints:[
                                  {  name:'point' ,type:'kin_point',target:body_target,  stiffness: 0.3},
                                  {  name:'orient',type:'kin_orient',target:body_target, stiffness: 0.3}, 
                                ],                                                       
                              }))   
                                            
  return bodies
}

export function build_effects_particles_sparcles(opts)
{ 
  let opts_global = {
    screen_dims: opts.screen_dims,
    matter_engine: opts.matter_engine, 
    mouse_constraint: opts.mouse_constraint,
  }

  let opts_collision_no_interaction = {
    collision_category: utils.collision_category.none,
    collision_mask: utils.collision_category.none
  }   
  let opts_debug = {
    debug_matrix_info: false,
    debug_matrix_axes: opts.debug_matrix_axes,  
    debug_cns_axes: opts.debug_cns_axes,   
    debug_force_visibility: opts.debug_force_visibility,             
  }  
  ////////////////////////////////////////////////////////////////////////////////

  let bodies = []

  let m_shape = new Matrix()
  m_shape.set_row(0,m_shape.get_row(0).getMult(8*opts.scale_shape))
  m_shape.set_row(1,m_shape.get_row(1).getMult(2*opts.scale_shape))

  let oEffectsA = { 
    ...opts_global,
    ...opts_collision_no_interaction,
    ...opts_debug,

    parent:opts.parent,
    m_shape: m_shape,
    z:opts.z_depth, 
    type: utils.shape.rectangle,

    do_shape: true,
    do_line:false,           
    color: utils.color.white,
    color_line: utils.color.white,
    //texture_three: text_checker_three,,         

    density:0.001, 
                    
  } 

  let om_EA1 = new Matrix()
  om_EA1.setTranslation(opts.p.x(),opts.p.y())
  om_EA1.setRotation(rad(opts.r)+rad(90)) 

  bodies.push(new body_build({ ...oEffectsA,          
                                name: opts.name + 'effect_sparcles1',
                                m_offset:om_EA1,                                                        
                              }))                                            

  om_EA1 = new Matrix()
  om_EA1.setTranslation(opts.p.x(),opts.p.y())
  om_EA1.setRotation(rad(opts.r)+rad(45))

  bodies.push(new body_build({ ...oEffectsA,   
                                name: opts.name + 'effect_sparcles2',
                                m_offset:om_EA1,                                                     
                              })) 
                                        
  om_EA1 = new Matrix()
  om_EA1.setTranslation(opts.p.x(),opts.p.y())
  om_EA1.setRotation(rad(opts.r)+rad(135))

  bodies.push(new body_build({ ...oEffectsA,     
                                name: opts.name + 'effect_sparcles3',
                                m_offset:om_EA1,                                                       
                              })) 

  return bodies                              
}



export function build_effects_particles_shapes(opts)
{
  let opts_global = {
    screen_dims: opts.screen_dims,
    matter_engine: opts.matter_engine, 
    mouse_constraint: opts.mouse_constraint,
  }

  let opts_collision_no_interaction = {
    collision_category: utils.collision_category.none,
    collision_mask: utils.collision_category.none
  }   
  let opts_debug = {
    debug_matrix_info: false,
    debug_matrix_axes: opts.debug_matrix_axes,  
    debug_cns_axes: opts.debug_cns_axes,   
    debug_force_visibility: opts.debug_force_visibility,             
  }  
  ////////////////////////////////////////////////////////////////////////////////

  let bodies = []

  let m_shape = new Matrix()
  m_shape.set_row(0,m_shape.get_row(0).getMult(2*opts.scale_shape))
  m_shape.set_row(1,m_shape.get_row(1).getMult(2*opts.scale_shape))

  let oEffectsA = {
    ...opts_global,
    ...opts_collision_no_interaction,
    ...opts_debug,

    parent:opts.parent,
    m_shape: m_shape,
    z:opts.z_depth, 
    type: utils.shape.rectangle,

    do_shape: false,
    do_line:true,           
    color: utils.color.white,
    color_line: utils.color.white,
    //texture_three: text_checker_three,
    
    density:0.001,               
  } 

  let om_EA1 = new Matrix()
  om_EA1.setTranslation(opts.p.x(),opts.p.y())
  om_EA1.setRotation(rad(opts.r)+rad(90))                                       

  bodies.push(new body_build({ ...oEffectsA, 
                                name: opts.name + 'effect_particle_shape1',
                                m_offset:om_EA1,                                                
                              }))                                             

  om_EA1 = new Matrix()
  om_EA1.setTranslation(opts.p.x(),opts.p.y())
  om_EA1.setRotation(rad(opts.r)+rad(45))                                       

  bodies.push(new body_build({ ...oEffectsA, 
                                name: opts.name + 'effect_particle_shape2',
                                m_offset:om_EA1,                                                     
                              }))                                             

  om_EA1 = new Matrix()
  om_EA1.setTranslation(opts.p.x(),opts.p.y())
  om_EA1.setRotation(rad(opts.r)+rad(135))                                         

  bodies.push(new body_build({ ...oEffectsA, 
                                name: opts.name + 'effect_particle_shape3',
                                m_offset:om_EA1,                                                   
                              }))                                             


  return bodies                              
}



export function build_effects_wall(opts)
{
  let opts_global = {
    screen_dims: opts.screen_dims,
    matter_engine: opts.matter_engine, 
    mouse_constraint: opts.mouse_constraint,
  }

  let opts_collision_no_interaction = {
    collision_category: utils.collision_category.none,
    collision_mask: utils.collision_category.none
  }   
  let opts_debug = {
    debug_matrix_info: false,
    debug_matrix_axes: opts.debug_matrix_axes,  
    debug_cns_axes: opts.debug_cns_axes,   
    debug_force_visibility: opts.debug_force_visibility,             
  }    

  ////////////////////////////////////////////////////////////////////////////////
                                      
  let m_shape = new Matrix()
  m_shape.set_row(0,m_shape.get_row(0).getMult(55*opts.scale_shape))
  m_shape.set_row(1,m_shape.get_row(1).getMult(1.*opts.scale_shape))

  let om_EA1 = new Matrix()
  om_EA1.setTranslation(opts.p.x(),opts.p.y()-1)
  om_EA1.setRotation(rad(opts.r)+rad(0))                                       
  let body = new body_build({   ...opts_global,
                                ...opts_collision_no_interaction,    
                                ...opts_debug,

                                name: opts.name+'effect_wall',     

                                parent:opts.parent,                                    
                                m_offset:om_EA1,
                                m_shape:m_shape,
                                z:opts.z_depth,
                                type : utils.shape.rectangle,

                                do_shape: true,
                                do_line:false,                                       
                                color:utils.color.white,
                                color_line: utils.color.black,
                                //texture_three: text_checker_three_grey, 

                                density:0.01,                                                                                
                              }) 
                              

  return body                              
}

/*
anim_effect({
  count:this.state.steps[step].update_count,
  sparcles:this.bodies.effects.colA_sparcles,
  shapes:this.bodies.effects.colA_shapes,
  wall:this.bodies.effects.colA_wall,
  trails:this.bodies.effects.movA_trails,
})
*/



export function anim_effect(opts)
{
  if( opts.wall != null)
    opts.wall.enable(0)

  for( let i=0; i < opts.sparcles.length; i++)
    opts.sparcles[i].enable(0) 

  for( let i=0; i < opts.shapes.length; i++)
    opts.shapes[i].enable(0)
  for( let i=0; i < opts.trails.length; i++)
    opts.trails[i].enable(0)

  if(opts.count == 0)  
  {      
    for( let i=0; i < opts.sparcles.length; i++)
    {
      let force = new Vector(0.001, 0)
      force = force.rotate(opts.sparcles[i].get_rotation())
      let pos = opts.sparcles[i].get_position()

      opts.sparcles[i].apply_force( pos, force )
      opts.shapes[i].apply_force( pos, force.getMult(0.1) )
    }
  }

  if( opts.count < 10) 
  {
    if( opts.wall != null)
    {
      opts.wall.enable(1)

      let m = new Matrix(opts.wall.m_shape_init)
      m = m.scale(0.01+opts.count*0.1,1)
      opts.wall.update_shape_coords(m)
    }
  }


  if( opts.count < 20) 
  {
    for( let i=0; i < opts.sparcles.length; i++)
      opts.sparcles[i].enable(1)       
  }


  if( opts.count < 40) 
  {

    for( let i=0; i < opts.shapes.length; i++)
      opts.shapes[i].enable(1)   
      
    for( let i=0; i < opts.trails.length; i++)
      opts.trails[i].enable(1)    
              
  }    
}





