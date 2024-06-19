import Vector from './vector.js';
import Matrix from './matrix.js';
import { utils , rad, deg,constraint_build, Draw_text_debug, cns_axe,convert_coords_matter_to_three} from './utils.js';
import * as ut from './utils_three.js';
import { VerticalTiltShiftShader } from './libraries/jsm/Addons.js';
import * as THREE from 'three';

export default class body_build{
  
    constructor( in_options ){
    // Default options
      const defaultOptions = {
        type:'body',
        name:'default name',
        m: new Matrix(),
        m_offset: new Matrix(),
        parent:null,
        compute_physics_in_local:false,
        z: 0,
        w: 1,
        h: 1,
        slop: 0,
        box: null,
        type: -1,
        rot: 0,
        limit_rot: null,
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
        axe_constraint: null,
        density:0.001,
        frictionAir:0.01,
        mass:null,
        screen_dims:null,
        matter_engine:null,
        texture_three:null,
        arc_limites:[0,3.14*2],
        debug_matrix_info: false,
        debug_matrix_axes: false,  
        debug_cns_axes: false,            
      };
      const args = { ...defaultOptions, ...in_options };
      

      this.type = args.type
      this.name = args.name    
      this.m = args.m
      this.m_offset = args.m_offset
      this.parent = args.parent
      this.compute_physics_in_local = args.compute_physics_in_local
      this.z = args.z
      this.w = args.w
      this.h = args.h
      this.slop = args.slop
      this.rot = rad(args.rot)
      this.extra_rotation = 0
      this.rot_override = null
      this.limit_rot = args.limit_rot
      this.scale = 1.0
      this.constraints = args.constraints
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
      this.visibility = 1
      this.visibility_override = true
      this.do_update = true
      this.density = args.density
      this.frictionAir = args.frictionAir
      this.mass = args.mass
      this.screen_dims = args.screen_dims
      this.matter_engine = args.matter_engine
      this.texture_three = args.texture_three
      this.arc_limites = args.arc_limites
      this.debug_matrix_info = args.debug_matrix_info
      this.debug_matrix_axes = args.debug_matrix_axes
      this.debug_cns_axes = args.debug_cns_axes  
      

      this.draw_text_debug = null
      if(this.debug_matrix_info)
        this.draw_text_debug = new Draw_text_debug(this.screen_dims)


      this.physics_constraints = []
      this.c_axe = null
      //if(args.axe_constraint != null)
      //  this.c_axe = new cns_axe({ Follower: this, ...args.axe_constraint })
  
      var max_choice = 10
      if(args.type != -1)
        this.type = args.type
      else
        this.type = min(max(Math.round(Matter.Common.random(-1, max_choice+1)),0),max_choice)
  
      this.shape_vertices = Matter.Vertices.create([], Matter.Body)
  
      if( args.box != null )
      {
        this.w = args.box.w
        this.h = args.box.h
        this.type = args.box.type
        this.shape_vertices = args.box.shape_vertices
      }
      else
      {
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
      }
  
  
      //this.color = [100,100,100]
      this.colorStroke = [0,0,0]

      // shader

      this.draw_count = 0
      this.geo = null
      this.shape_three = null
      this.mesh_three = null

      this.init_physics()
    }

    init_physics()
    {
      let p = {x:0,y:0}
      if(this.compute_physics_in_local == false)
      {
        let m_world = this.get_in_matrix()
        p = m_world.get_row(2).get_value()
      }

      switch(this.type) {
        case 0:
          this.body = Matter.Bodies.rectangle(p.x, p.y, this.w, this.h);
          Matter.Body.rotate(this.body, this.rot)
          break;
        case 1:
          this.body = Matter.Bodies.circle(p.x, p.y, this.w);
          Matter.Body.rotate(this.body, this.rot)
          break;
        case 2:
          this.body = Matter.Bodies.polygon(p.x, p.y, 3, this.w);
          Matter.Body.rotate(this.body, this.rot)
          break;
        case 3:
          this.body = Matter.Bodies.polygon(p.x, p.y, 5, this.w);
          Matter.Body.rotate(this.body, this.rot)
          break;     
        case 4:
          this.body = Matter.Bodies.polygon(p.x, p.y, 6, this.w);
          Matter.Body.rotate(this.body, this.rot)
          break;  
        case 5:    
          this.body = Matter.Bodies.fromVertices(p.x, p.y, this.shape_vertices)
          Matter.Body.rotate(this.body, this.rot)
          break;     
        case 6: 
          this.body = Matter.Bodies.fromVertices(p.x, p.y, this.shape_vertices)
          Matter.Body.rotate(this.body, this.rot)
          break;    
        case 7:     
          this.body = Matter.Bodies.fromVertices(p.x, p.y, this.shape_vertices)
          Matter.Body.rotate(this.body, this.rot)
          break;   
        case 8:     
          this.body = Matter.Bodies.fromVertices(p.x, p.y, this.shape_vertices)
          Matter.Body.rotate(this.body, this.rot)
          break;      
        case 9:  
          var bodyA = Matter.Bodies.rectangle(p.x, p.y, this.w, this.h/3);   
          var bodyB = Matter.Bodies.rectangle(p.x, p.y, this.w/3, this.h); 
          this.body = Matter.Body.create({parts: [bodyA, bodyB]});
          Matter.Body.rotate(this.body, this.rot)
          break; 
        case 10:  
          this.body = Matter.Bodies.trapezoid(p.x, p.y, this.w, this.h , rad(this.slop*2))
          Matter.Body.rotate(this.body, this.rot)
          break;      
        case 11:  
          this.body = Matter.Bodies.circle(p.x, p.y, this.w);//tmp
          Matter.Body.rotate(this.body, this.rot)
          break;             
        }
  
      Matter.Body.setDensity(this.body, this.density)
      if( this.mass != null )
        Matter.Body.setMass(this.body, this.mass)

      this.body.frictionAir = this.frictionAir
  
      for( let i = 0; i < this.constraints.length; i++)
      {
        if((this.constraints[i].type == 'point')||(this.constraints[i].type == 'parent'))
        { /*
          var options = {
            bodyA: this.body,
            pA: { x: 0, y: 0 },
            pB: { x: 0, y: 0 },
            stiffness: this.constraints[i].stiffness,
            damping : this.constraints[i].damping,
            length : this.constraints[i].length,
            matter_engine: this.matter_engine,
          }
          if(this.constraints[i].p_offset!= null)
            options.pA = this.constraints[i].p_offset

          if(this.constraints[i].target != null)
            options.bodyB = this.constraints[i].target.body
          else
            options.pB = this.m.get_row(2).get_value()

          if(this.constraints[i].p_target_offset != null)  
            options.pB = this.constraints[i].p_target_offset


          if(options.stiffness == 0)
          {
            options.stiffness = 0.000001
            options.damping = 0
          }
          */
          
          this.physics_constraints.push( build_constraint(this,this.constraints[i]) )          
        }

        if(this.constraints[i].type == 'parent')
        {
          let offset = 300
          /*
          var options = {
            bodyA: this.body,
            pA: { x: offset, y: offset },
            pB: { x: offset, y: offset },
            stiffness: this.constraints[i].stiffness,
            damping : this.constraints[i].damping,
            length : this.constraints[i].length,
            matter_engine: this.matter_engine,
          }
          if(this.constraints[i].p_offset!= null)
            options.pA = this.constraints[i].p_offset

          if(this.constraints[i].target != null)
            options.bodyB = this.constraints[i].target.body
          else
          {
            options.pB = this.m.get_row(2).get_value()
            options.pB.x +=offset
            options.pB.y +=offset

          }

          if(this.constraints[i].p_target_offset != null)  
            options.pB = this.constraints[i].p_target_offset


          if(options.stiffness == 0)
          {
            options.stiffness = 0.000001
            options.damping = 0
          }
          */
          this.physics_constraints.push( build_constraint(this,this.constraints[i],offset) )                  
        }

        /////////////////// axe
        if(this.constraints[i].type == 'axe')
        {
          //let offset = 300
          //let parent_cns = [ build_constraint(this,this.constraints[i]), build_constraint(this,this.constraints[i],offset) ]
          this.c_axe = new cns_axe({ Follower: this, ...this.constraints[i] })   
          
          //this.physics_constraints.push(parent_cns[0])
          //this.physics_constraints.push(parent_cns[1])
        }


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
    }
    
    apply_scale( value )
    {
      this.scale = this.scale*value
      Matter.Body.scale( this.body, value, value, { x : this.body.position.x, y : this.body.position.y })
  
    }
  
    enable(value)
    {
      this.visibility = value
      //this.do_update = value
      if(this.visibility)
        this.body.collisionFilter.category = this.collision_category
      else
        this.body.collisionFilter.category = utils.collision_category.other
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

    get_in_matrix( )
    {
      let m = this.m_offset.getMult(this.get_parent_matrix())
      return m
    }

    get_out_matrix()
    {
      /*        
      m_out_world = m_dyn_local*(m_offset_local*m_parent_world)
      */
     
      let pos = new Vector( this.body.position.x, this.body.position.y)
      let rot = this.body.angle
      let m = new Matrix()
      m.setTranslation(pos)
      m.setRotation(rot)

      if( this.compute_physics_in_local )
      {
        m = m.getMult(this.get_in_matrix())
      }


      return m
    }

    get_position()
    {
      let m = this.get_out_matrix()
      let p = m.get_row(2)
      return p
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
      if( this.compute_physics_in_local )
      {
        v = v.getMult(this.get_in_matrix())
      }      
      return v
    }  

    get_visibility()
    {
      if( (this.visibility)&&(this.visibility_override)) 
        return 1
      return 0
    }
    
    set_position(v)
    {
      if( this.compute_physics_in_local )
      {
        v = v.getMult(this.get_in_matrix().getInverse())
      }
      Matter.Body.setPosition(this.body, v.get_value())
    }
  
    set_velocity(v)
    {
      if( this.compute_physics_in_local )
      {
        v = v.getMult(this.get_in_matrix().getInverse())
      }      
      Matter.Body.setVelocity(this.body, v.get_value())
    }  

    apply_force(p,v)
    {
      if( this.compute_physics_in_local )
      {
        v = v.getMult(this.get_in_matrix().getInverse())
        p = p.getMult(this.get_in_matrix().getInverse())
      }           
      Matter.Body.applyForce(this.body, p.get_value(), v.get_value())
    }
    
    set_angle(a, override = false)
    {
      let angle = this.rot+a
      if(override)
        angle = a

      if( this.compute_physics_in_local )
      {
        let m_current = new Matrix()
        m_current.setRotation(angle)
        m_current = m_current.getMult(this.get_in_matrix().getInverse())
        angle = m_current.getRotation()
      }        
      Matter.Body.setAngle(this.body, angle)
    }
  
    set_anglular_velocity(a)
    {
      Matter.Body.setAngularVelocity(this.body, a)
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
      //let p = this.get_in_matrix().get_row(2)
      
  
      if(this.limit_rot!=null)
      {
        if( this.body.angle < this.limit_rot[0] )
        {
          Matter.Body.setAngle(this.body, this.limit_rot[0])
          Matter.Body.setAngularVelocity(this.body, 0)    
      
        }    
        if( this.limit_rot[1] < this.body.angle )
        {
          Matter.Body.setAngle(this.body, this.limit_rot[1])
          Matter.Body.setAngularVelocity(this.body, 0)      
        }    
      }
  
      if( this.c_axe != null )
        this.c_axe.apply()
   
  
      if(this.rot_override!=null)
        this.set_angle(this.rot_override,true)
        
  
      for( let i = 0; i < this.physics_constraints.length; i++)
      {
        //let p = this.get_in_matrix().get_row(2).get_value()
        //this.physics_constraints[i].pB = p
        this.physics_constraints[i].update()
      }
      

      return true
     
    }
    
  

  
    setup_shapes_three(group_fidget){
      this.mesh_three = { group : null, shape : null, line : null}

      switch(this.type) {
        case 0:
          this.shape_three = ut.rect( this.w, this.h );
          break;
        case 1:
          this.shape_three = ut.circle(this.w);
          break;
        case 10:  
          this.shape_three = ut.roundedTrap( this.w, this.h, this.slop, 0 )
          break; 
        case 11: 
          this.shape_three = ut.arc( this.w, this.arc_limites[0], this.arc_limites[1])
          break;      
        }

      this.mesh_three.group = new THREE.Group();
      group_fidget.add(this.mesh_three.group)

      if(this.do_shape)
      {
          this.mesh_three.shape = ut.addShape_polygon( 
              this.mesh_three.group, 
              this.shape_three, 
              this.texture_three, 
              this.color, 
              this.transparency_activate, 
              this.transparency)        
      }   
  
      if(this.do_line)
      {
          this.mesh_three.line = ut.addShape_line( 
              this.mesh_three.group, 
              this.shape_three, 
              this.color_line, 
              this.transparency_activate, 
              this.transparency_line)       
      }

      if(this.debug_cns_axes)
      {

     
        
        if(( this.c_axe != null)&&(this.c_axe.enable == true ))
        {
          this.c_axe.update_debug()
          let shape = ut.line( 
            convert_coords_matter_to_three(this.c_axe.debug_pts[0],this.screen_dims), 
            convert_coords_matter_to_three(this.c_axe.debug_pts[1],this.screen_dims) );
            
          //let axes_grp = new THREE.Group();
          //group_fidget.add(axes_grp)

          ut.addShape_line(  
            group_fidget, 
            shape, 
            [255,0,255])
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
          this.mesh_three.group, 
          shape, 
          null,
          [255,0,0])
        mesh.position.x =  len/2.0

        mesh = ut.addShape_line(  
          this.mesh_three.group, 
          shape, 
          [0,0,0])
        mesh.position.x =  len/2.0

        shape = ut.rect( wid, len )
        mesh = ut.addShape_polygon(  
          this.mesh_three.group, 
          shape, 
          null,
          [0,255,0])
        mesh.position.y =  len/2.0

        mesh = ut.addShape_line(  
          this.mesh_three.group, 
          shape, 
          [0,0,0])
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
      //this.mesh_three.group.position.z = this.z
      this.mesh_three.group.rotation.z = rot*-1
      this.mesh_three.group.visible = this.get_visibility() == 1   
      this.mesh_three.group.scale.x = scale  
      this.mesh_three.group.scale.y = scale  
      this.mesh_three.group.scale.z = scale  
  

      if(this.debug_matrix_info)
      {
        console.log('debug_matrix_info')
        let local_mode = this.compute_physics_in_local
        let parent_name = 'null'
        if(this.parent != null)
          parent_name = this.parent.name
        let m_parent = this.get_parent_matrix()
        let m_offset = this.m_offset
        let m_in = this.get_in_matrix( )
        let m_out = this.get_out_matrix()    
        let p_out = this.get_position()
        let r_out = this.get_rotation()    
        let vel_out = this.get_velocity()


        let texts_to_draw = [
          'physics in local : ' + local_mode,
          'parent name : ' + parent_name,
          'm_parent: '+Math.round(m_parent.a)+' '+Math.round(m_parent.b)+' | '+Math.round(m_parent.c)+' '+Math.round(m_parent.d)+' | '+Math.round(m_parent.e)+' '+Math.round(m_parent.f)+'' ,
          'm_offset: '+Math.round(m_offset.a)+' '+Math.round(m_offset.b)+' | '+Math.round(m_offset.c)+' '+Math.round(m_offset.d)+' | '+Math.round(m_offset.e)+' '+Math.round(m_offset.f)+'' ,
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