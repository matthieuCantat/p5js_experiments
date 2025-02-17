import Vector from '../utils/vector.js';
import Matrix from '../utils/matrix.js';
import { 
  utils , 
  rad, 
  getRandomInt, 
  Draw_text_debug,
  convert_coords_matter_to_three,
  strictObject} from '../utils/utils.js';
import { 
  build_body_physics_modifier} from './constraint.js';
import * as ut from '../utils/utils_three.js';
import { VerticalTiltShiftShader } from '../libraries/jsm/Addons.js';
import * as THREE from 'three';

var build_order = 0


class body_physics{
  
  constructor( in_options, body_main ){
  // Default options
    const defaultOptions = {
      name:'default name',
      highlight_bodies_when_selected:[],
      m: new Matrix(),
      m_offset: new Matrix(),
      m_transform: new Matrix(),
      m_shape: new Matrix(),
      parent:null,
      constraint_to_parent:false,
      z: 0,
      w: 1,
      h: 1,
      slop: 0,
      type: -1,
      dynamic:true,
      collision: true,
      collision_category: utils.collision_category.default,
      collision_mask: utils.collision_category.default,
      constraints:[],
      do_shape:true,
      do_line:false,
      bevel: 0,
      color:utils.color.white,
      color_line:utils.color.black,
      transparency_activate:false,
      transparency:255,
      transparency_line:255,
      bloom:false,
      castShadow:false,       
      receiveShadow:false,   
      shader:null,
      visibility:true,
      axe_constraint: null,
      density:0.001,
      frictionAir:0.01,
      mass:null,
      screen_dims:null,
      matter_engine:null,
      Mouse:null,
      fidget:null, 
      material_three:null,
      arc_limites:[0,3.14*2],
      debug_matrix_info: false,
      debug_matrix_axes: false,  
      debug_cns_axes: false,     
      debug_force_visibility: false, 
      selection_break_length: 60.,
       
                 
    };
    const args = { ...defaultOptions, ...in_options };
  
    this.name = args.name
    this.type = "body_physics"
    this.body_main = body_main
    

    this.properties = strictObject({
      m_offset : args.m_offset,//<<<<
      m_transform : args.m_transform,//<<<<
    })

    this.opts = strictObject({
      do_update : true,
      constraint_to_parent: args.constraint_to_parent,
    })

    this.relations = strictObject({
      parent: args.parent,//<<<<<
      constraints_args : [],  //<<<<<
      constraints : {},//<<<<<
      constraints_order : [],//<<<<<     
    })    

    this.ref = strictObject({
      matter_engine : args.matter_engine,
    })      

    this.state = strictObject({
      m : args.m,//<<<<<   
      rot_override : null,//<<<<<   
      scale : 1.0,//<<<<<  


      is_touch : false,
      is_selected : false,
      instance_is_selected : false,
      is_last_instance_selected : false,        
    })    
    
    this.dynamic = args.dynamic
    this.dynamic_default = args.dynamic 
    this.collision = args.collision
    this.collision_category = args.collision_category
    this.collision_mask = args.collision_mask
    this.density = args.density
    this.frictionAir = args.frictionAir
    this.mass = args.mass    
    this.arc_limites = args.arc_limites     
    this.selection_break_length = args.selection_break_length 
    this.body = null 




    //this.relations.constraints_args = []
    if(this.opts.constraint_to_parent)
      this.relations.constraints_args = [ { name: 'point' , type: 'kin_point' , target: this.relations.parent },
                                { name: 'orient', type: 'kin_orient', target: this.relations.parent }]
    for( let cns_args of args.constraints )
      this.relations.constraints_args.push(cns_args)
        
  }

      

  matter_get_shape(m)
  {
    let p = m.get_row(2).get_value()
    let w = m.get_row(0).mag()
    let h = m.get_row(1).mag()
    let r = m.getRotation()

    let body = null
    switch(this.body_main.properties.shape_type) {
      case 0:
        body = Matter.Bodies.rectangle(p.x, p.y, w, h);
        Matter.Body.rotate(body, r)
        break;
      case 1:
        body = Matter.Bodies.circle(p.x, p.y, w/2.);
        Matter.Body.rotate(body, r)
        break;
      //
      //case 2:
      //  body = Matter.Bodies.polygon(p.x, p.y, 3, this.w);
      //  Matter.Body.rotate(body, this.rot)
      //  break;
      //case 3:
      //  body = Matter.Bodies.polygon(p.x, p.y, 5, this.w);
      //  Matter.Body.rotate(body, this.rot)
      //  break;     
      //case 4:
      //  body = Matter.Bodies.polygon(p.x, p.y, 6, this.w);
      //  Matter.Body.rotate(body, this.rot)
      //  break;  
      //case 5:    
      //  body = Matter.Bodies.fromVertices(p.x, p.y, this.shape_vertices)
      //  Matter.Body.rotate(body, this.rot)
      //  break;     
      //case 6: 
      //  body = Matter.Bodies.fromVertices(p.x, p.y, this.shape_vertices)
      //  Matter.Body.rotate(body, this.rot)
      //  break;    
      //case 7:     
      //  body = Matter.Bodies.fromVertices(p.x, p.y, this.shape_vertices)
      //  Matter.Body.rotate(body, this.rot)
      //  break;   
      //case 8:     
      //  body = Matter.Bodies.fromVertices(p.x, p.y, this.shape_vertices)
      //  Matter.Body.rotate(body, this.rot)
      //  break;      
      //case 9:  
      //  var bodyA = Matter.Bodies.rectangle(p.x, p.y, this.w, this.h/3);   
      //  var bodyB = Matter.Bodies.rectangle(p.x, p.y, this.w/3, this.h); 
      //  body = Matter.Body.create({parts: [bodyA, bodyB]});
      //  Matter.Body.rotate(body, this.rot)
      //  break; 
      //  
      case 10:  
        body = Matter.Bodies.trapezoid(p.x, p.y, w, h , rad(this.body_main.properties.trapezoid_slop*2))
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
    if(!this.dynamic)
      return false

    this.body = this.matter_get_shape(this.body_main.properties.m_shape)

    Matter.Body.setDensity(this.body, this.density)
    if( this.mass != null )
      Matter.Body.setMass(this.body, this.mass)

    this.body.frictionAir = this.frictionAir

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


    Matter.Composite.add( this.ref.matter_engine.world, this.body)    
    return true
  }

  init_constraints()
  {
    for(let i = 0; i < this.relations.constraints_args.length; i++)
    {
      let cns = build_body_physics_modifier(this, this.relations.constraints_args[i])
      if( cns != null)
      {
        this.relations.constraints_order.push(this.relations.constraints_args[i].name)
        this.relations.constraints[this.relations.constraints_args[i].name] = cns
      } 
    }

  }


  update_shape_matrix()
  {
    let new_body = this.matter_get_shape(this.body_main.properties.m_shape)
    Matter.Body.setVertices(this.body, new_body.vertices)

  }

  
  enable(value)
  {
    if(this.dynamic)
    {
      if(value)
        this.body.collisionFilter.category = this.collision_category
      else
        this.body.collisionFilter.category = utils.collision_category.none
    }
  }


  get_mass()
  {
    if(this.body != null)
      return this.body.mass
    return -1
  }

  get_velocity()
  {
    let v = new Vector() 
    if( this.dynamic )
    {
      v.v.x = this.body.velocity.x
      v.v.y = this.body.velocity.y
    }
          
    return v
  }  

  set_velocity(v,update_input = false)
  {
    if( this.dynamic )
      Matter.Body.setVelocity(this.body, v.get_value())
  }  

  apply_force(p,v)
  {   
    if( this.dynamic )       
      Matter.Body.applyForce(this.body, p.get_value(), v.get_value())
  }

  set_anglular_velocity(a)
  {
    if( this.dynamic )
      Matter.Body.setAngularVelocity(this.body, a)
  }

  clean_velocity()
  {
    if( this.dynamic )
    {
      Matter.Body.setVelocity(this.body, {x:0,y:0}) 
      Matter.Body.setAngularVelocity(this.body, 0) 
    }
 
  }
  get_parent_matrix()
  {
    
    // m_parent_world
    
    let m_parent = null
    if(this.relations.parent != null)
    {
      m_parent = this.relations.parent.physics.get_out_matrix()
    }
    else{
      m_parent = this.state.m
    }
    return m_parent
  }  

  get_parent_in_matrix()
  {
    
    //m_parent_world
    
    let m_parent = null
    if(this.relations.parent != null)
    {
      const body_parent = this.relations.parent.physics
      const m_transform = body_parent.properties.m_transform
      const m_offset = body_parent.properties.m_offset

      m_parent = m_transform.getMult(m_offset.getMult(body_parent.get_parent_in_matrix()))
    }
    else{
      m_parent = this.state.m
    }
    return m_parent
  } 
  get_init_matrix( )
  {
    let m = this.properties.m_transform.getMult(this.properties.m_offset.getMult(this.get_parent_in_matrix()))
    return m
  }


  //////////////////////////////////////////////////////////////////////////////// all

  get_matrix( matrix_layer = 'dyn', space = 'world')
  {
    let m = null
    if(matrix_layer == 'parent')
    {
      if(space =='world')
        m = this.get_parent_matrix()
    }
    else if(matrix_layer == 'base' )
    {
      if(space =='world')
        m = this.properties.m_offset.getMult(this.get_parent_matrix())
      else if(space=='parent')
        m = this.properties.m_offset       
    }
    else if(matrix_layer == 'anim')
    {
      if(space =='world')
        m = this.properties.m_transform.getMult(this.properties.m_offset.getMult(this.get_parent_matrix()))        
      if( space =='parent')
        m = this.properties.m_transform.getMult(this.properties.m_offset)
      else if(space =='base'  )
        m = this.properties.m_transform

    }
    else if(matrix_layer == 'dyn')
    {
      let m_dyn_world = new Matrix()
      m_dyn_world.setTranslation(new Vector( this.body.position.x, this.body.position.y))
      m_dyn_world.setRotation(this.body.angle)

      if(space =='world')
        m = m_dyn_world 
      if( space =='parent')
        m = m_dyn_world.getMult(this.get_parent_matrix().getInverse())
      else if(space =='base'  )
        m = m_dyn_world.getMult(this.properties.m_offset.getMult(this.get_parent_matrix()).getInverse())
      else if(space =='anim'  )
        m = m_dyn_world.getMult( this.properties.m_transform.getMult(this.properties.m_offset.getMult(this.get_parent_matrix())).getInverse()  )
    }
    
    return m
  }
  /*
  get_position( type = 'dyn', space = 'world')
  {
    return this.get_matrix( type, space).get_row(2)
  }
  get_rotation( type = 'dyn', space = 'world')
  {
    return this.get_matrix( type, space).getRotation()
  }
  */

  set_matrix(m_transform, matrix_layer = 'dyn', transform_space = 'world', add_mode = 'override')
  {

    if(transform_space == 'self')
      transform_space = matrix_layer

    if((matrix_layer == 'base' )&&(transform_space =='world'))
    {
      if(add_mode == 'override')
      {
        this.properties.m_offset = m_transform.getMult(this.get_parent_matrix().getInverse())
      }
      else if(add_mode == 'add')
      {
        // convert in transform space
        let m_current_in_transform_space = this.get_matrix('base','world')
        // transform
        let mt_pos = m_transform.extractPositionMatrix()// pos in transform_space space
        let mt_rot = m_transform.extractRotationMatrix()// rot in m_offset space
        let m_current_in_transform_space_transformed = mt_rot.getMult(m_current_in_transform_space.getMult(mt_pos)) 
        // convert from transform space
        let m_current_transformed =  m_current_in_transform_space_transformed.getMult(this.get_parent_matrix().getInverse())  
        // update class 
        this.properties.m_offset = m_current_transformed      
      }
    }
    else if((matrix_layer == 'base' )&&(transform_space =='parent'))
    {
      if(add_mode == 'override')
      {
        this.properties.m_offset = m_transform
      }
      else if(add_mode == 'add')
      {
        // convert in transform space
        let m_current_in_transform_space = this.properties.m_offset
        // transform
        let mt_pos = m_transform.extractPositionMatrix()// pos in transform_space space
        let mt_rot = m_transform.extractRotationMatrix()// rot in m_offset space
        let m_current_in_transform_space_transformed = mt_rot.getMult(m_current_in_transform_space.getMult(mt_pos)) 
        // convert from transform space
        let m_current_transformed =  m_current_in_transform_space_transformed
        // update class 
        this.properties.m_offset = m_current_transformed              
      }
    }
    else if((matrix_layer == 'base' )&&(transform_space =='base'))//self
    {
      this.properties.m_offset = m_transform.getMult(this.properties.m_offset)                     
    }



    if((matrix_layer == 'anim' )&&(transform_space =='world'))
    {
      if(add_mode == 'override')
      {
        this.properties.m_transform = m_transform.getMult(this.get_matrix('base','world').getInverse())
      }
      else if(add_mode == 'add')
      {
        // convert in transform space
        let m_current_in_transform_space = this.get_matrix('anim','world')
        // transform
        let mt_pos = m_transform.extractPositionMatrix()// pos in transform_space space
        let mt_rot = m_transform.extractRotationMatrix()// rot in m_transform space
        let m_current_in_transform_space_transformed = mt_rot.getMult(m_current_in_transform_space.getMult(mt_pos)) 
        // convert from transform space
        let m_current_transformed =  m_current_in_transform_space_transformed.getMult(this.get_matrix('base','world').getInverse())  
        // update class 
        this.properties.m_transform = m_current_transformed      
      }
    }
    else if((matrix_layer == 'anim' )&&(transform_space =='parent'))
    {
      if(add_mode == 'override')
      {
        this.properties.m_transform = m_transform.getMult(this.get_matrix('base','parent').getInverse())
      }
      else if(add_mode == 'add')
      {
        // convert in transform space
        let m_current_in_transform_space = this.get_matrix('anim','parent')
        // transform
        let mt_pos = m_transform.extractPositionMatrix()// pos in transform_space space
        let mt_rot = m_transform.extractRotationMatrix()// rot in m_transform space
        let m_current_in_transform_space_transformed = mt_rot.getMult(m_current_in_transform_space.getMult(mt_pos)) 
        // convert from transform space
        let m_current_transformed =  m_current_in_transform_space_transformed.getMult(this.get_matrix('base','parent').getInverse())  
        // update class 
        this.properties.m_transform = m_current_transformed      
      }
    }
    else if((matrix_layer == 'anim' )&&(transform_space =='base'))
    {
      if(add_mode == 'override')
      {
        this.properties.m_transform = m_transform
      }
      else if(add_mode == 'add')
      {
        // convert in transform space
        let m_current_in_transform_space = this.properties.m_transform
        // transform
        let mt_pos = m_transform.extractPositionMatrix()// pos in transform_space space
        let mt_rot = m_transform.extractRotationMatrix()// rot in m_transform space
        let m_current_in_transform_space_transformed = mt_rot.getMult(m_current_in_transform_space.getMult(mt_pos)) 
        // convert from transform space
        let m_current_transformed =  m_current_in_transform_space_transformed  
        // update class 
        this.properties.m_transform = m_current_transformed      
      }
    }
    else if((matrix_layer == 'anim' )&&(transform_space =='anim'))//self
    {
      this.properties.m_transform = m_transform.getMult(this.properties.m_transform)     
    }




    // dyn is special: it is save as world space
    if((matrix_layer == 'dyn' )&&(transform_space =='world'))
    {
      if(add_mode == 'override')
      {
        let m_dyn = m_transform

        Matter.Body.setPosition(this.body, m_dyn.get_row(2).get_value())
        Matter.Body.setAngle(this.body, m_dyn.getRotation())

      }
      else if(add_mode == 'add')
      {
        // convert in transform space
        let m_current_in_transform_space = this.get_matrix('dyn','world')
        // transform
        let mt_pos = m_transform.extractPositionMatrix()// pos in transform_space space
        let mt_rot = m_transform.extractRotationMatrix()// rot in m_transform space
        let m_current_in_transform_space_transformed = mt_rot.getMult(m_current_in_transform_space.getMult(mt_pos)) 
        // convert from transform space
        let m_current_transformed =  m_current_in_transform_space_transformed
        // update class 
        let m_dyn = m_current_transformed    
        
        Matter.Body.setPosition(this.body, m_dyn.get_row(2).get_value())
        Matter.Body.setAngle(this.body, m_dyn.getRotation())          
      }
    }
    else if((matrix_layer == 'dyn' )&&(transform_space =='parent'))
    {
      if(add_mode == 'override')
      {
        let m_dyn = m_transform.getMult(this.get_parent_matrix())

        Matter.Body.setPosition(this.body, m_dyn.get_row(2).get_value())
        Matter.Body.setAngle(this.body, m_dyn.getRotation())          
      }
      else if(add_mode == 'add')
      {
        // convert in transform space
        let m_current_in_transform_space = this.get_matrix('dyn','parent')
        // transform
        let mt_pos = m_transform.extractPositionMatrix()// pos in transform_space space
        let mt_rot = m_transform.extractRotationMatrix()// rot in m_transform space
        let m_current_in_transform_space_transformed = mt_rot.getMult(m_current_in_transform_space.getMult(mt_pos)) 
        // convert from transform space
        let m_current_transformed =  m_current_in_transform_space_transformed.getMult(this.get_parent_matrix())  
        // update class 
        let m_dyn = m_current_transformed 
        
        Matter.Body.setPosition(this.body, m_dyn.get_row(2).get_value())
        Matter.Body.setAngle(this.body, m_dyn.getRotation())          
      }
    }
    else if((matrix_layer == 'dyn' )&&(transform_space =='base'))
    {
      if(add_mode == 'override')
      {
        let m_dyn = m_transform.getMult(this.get_matrix('base','world'))

        Matter.Body.setPosition(this.body, m_dyn.get_row(2).get_value())
        Matter.Body.setAngle(this.body, m_dyn.getRotation())          
      }
      else if(add_mode == 'add')
      {
        // convert in transform space
        let m_current_in_transform_space = this.get_matrix('dyn','base')
        // transform
        let mt_pos = m_transform.extractPositionMatrix()// pos in transform_space space
        let mt_rot = m_transform.extractRotationMatrix()// rot in m_transform space
        let m_current_in_transform_space_transformed = mt_rot.getMult(m_current_in_transform_space.getMult(mt_pos)) 
        // convert from transform space
        let m_current_transformed =  m_current_in_transform_space_transformed.getMult(this.get_matrix('base','world'))  
        // update class 
        let m_dyn = m_current_transformed  
        
        Matter.Body.setPosition(this.body, m_dyn.get_row(2).get_value())
        Matter.Body.setAngle(this.body, m_dyn.getRotation())          
      }
    }
    else if((matrix_layer == 'dyn' )&&(transform_space =='anim'))
    {
      if(add_mode == 'override')
      {
        let m_dyn = m_transform.getMult(this.get_matrix('anim','world'))

        Matter.Body.setPosition(this.body, m_dyn.get_row(2).get_value())
        Matter.Body.setAngle(this.body, m_dyn.getRotation())          
      }
      else if(add_mode == 'add')
      {
        // convert in transform space
        let m_current_in_transform_space = this.get_matrix('dyn','anim')
        // transform
        let mt_pos = m_transform.extractPositionMatrix()// pos in transform_space space
        let mt_rot = m_transform.extractRotationMatrix()// rot in m_transform space
        let m_current_in_transform_space_transformed = mt_rot.getMult(m_current_in_transform_space.getMult(mt_pos)) 
        // convert from transform space
        let m_current_transformed =  m_current_in_transform_space_transformed.getMult(this.get_matrix('anim','world'))   
        // update class 
        let m_dyn = m_current_transformed   
        
        Matter.Body.setPosition(this.body, m_dyn.get_row(2).get_value())
        Matter.Body.setAngle(this.body, m_dyn.getRotation())          
      }
    }      
    else if((matrix_layer == 'dyn' )&&(transform_space =='dyn'))//self
    {
      let m_dyn = m_transform.getMult(this.get_matrix('dyn','world')) 
      
      Matter.Body.setPosition(this.body, m_dyn.get_row(2).get_value())
      Matter.Body.setAngle(this.body, m_dyn.getRotation())        
    }

  }

  set_position(p, matrix_layer = 'dyn', transform_space = 'world', add_mode = 'override')
  {
    let m_transform = new Matrix()
    if(add_mode == 'override')
      m_transform = this.get_matrix(matrix_layer,transform_space)
    m_transform.set_row(2,p)
    this.set_matrix(m_transform, matrix_layer, transform_space, add_mode)    
  }

  set_position_X(value, matrix_layer = 'dyn', transform_space = 'world', add_mode = 'override')
  {
    let m_transform = new Matrix()
    if(add_mode == 'override')
      m_transform = this.get_matrix(matrix_layer,transform_space)

    let p = m_transform.get_row(2)  
    p.v.x = value
    m_transform.set_row(2,p)

    this.set_matrix(m_transform, matrix_layer, transform_space, add_mode)    
  }

  set_position_Y(value, matrix_layer = 'dyn', transform_space = 'world', add_mode = 'override')
  {
    let m_transform = new Matrix()
    if(add_mode == 'override')
      m_transform = this.get_matrix(matrix_layer,transform_space)

    let p = m_transform.get_row(2)  
    p.v.y = value
    m_transform.set_row(2,p)

    this.set_matrix(m_transform, matrix_layer, transform_space, add_mode)    
  }

  set_rotation(r, matrix_layer = 'dyn', transform_space = 'world', add_mode = 'override')
  {
    let m_transform = new Matrix()
    if(add_mode == 'override')
      m_transform = this.get_matrix(matrix_layer,transform_space)      
    m_transform.setRotation(r)
    this.set_matrix(m_transform, matrix_layer, transform_space, add_mode)    
  } 
  /*
  set_scale(s, matrix_layer = 'dyn', transform_space = 'world', add_mode = 'override')
  {
    this.state.scale = s   
  }     
  */

  //////////////////////////////////////////////////////////////////////////////// out
  get_out_matrix( space = 'world')
  {
    let m = null
    if(this.dynamic)
      m = this.get_matrix('dyn',space)
    else
      m = this.get_matrix('anim',space)
    return m
  }
  get_out_position(space = 'world')
  {
    let m = this.get_out_matrix(space)
    return m.get_row(2)
  }
  get_out_rotation(space = 'world',clockwise=false)
  {
    let m = this.get_out_matrix(space)
    return m.getRotation(clockwise)
  }   
  /*
  get_out_scale(space = 'world')
  {
    return this.state.scale
  }      
  */
  
  set_out_matrix(m,transform_space = 'world', add_mode = 'override')
  {
    if(this.dynamic)
      this.set_matrix(m,'dyn', transform_space, add_mode )
    else
      this.set_matrix(m,'anim', transform_space, add_mode )
  }
  set_out_position(p,transform_space = 'world', add_mode = 'override')
  {
    if(this.dynamic)
      this.set_position(p,'dyn', transform_space, add_mode )
    else
      this.set_position(p,'anim', transform_space, add_mode )
  }
  set_out_position_X( value ,transform_space = 'world', add_mode = 'override')
  {
    if(this.dynamic)
      this.set_position_X(value,'dyn', transform_space, add_mode )
    else
      this.set_position_X(value,'anim', transform_space, add_mode )
  }
  set_out_position_Y( value ,transform_space = 'world', add_mode = 'override')
  {
    if(this.dynamic)
      this.set_position_Y(value,'dyn', transform_space, add_mode )
    else
      this.set_position_Y(value,'anim', transform_space, add_mode )
  }
  set_out_rotation(r,transform_space = 'world', add_mode = 'override')
  {
    if(this.dynamic)
      this.set_rotation(r,'dyn', transform_space, add_mode )
    else
      this.set_rotation(r,'anim', transform_space, add_mode )
  }      
  set_out_scale(s,transform_space = 'world', add_mode = 'override')
  {
    this.state.scale = s
  }   
  init_out_matrix()
  {
    let m_init = this.get_init_matrix()
    this.set_out_matrix(m_init)
  }     



  update()
  {
      
    if( !this.opts.do_update )
      return false

    
    for( let i = 0; i < this.relations.constraints_order.length; i++)
    {
      this.relations.constraints[this.relations.constraints_order[i]].apply()
    }

    if(this.state.rot_override!=null)
      this.set_out_rotation(this.state.rot_override, 'world', 'override')
    return true
   
  }  


  clean_physics()
  {
    if( this.body != null )
      Matter.Composite.remove( this.ref.matter_engine.world, this.body) 
  }

}

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////



export class body_render{
  
  constructor( in_options , body_main, body_physics){
  // Default options
    const defaultOptions = {
      name:'default name',
      highlight_bodies_when_selected:[],
      m: new Matrix(),
      m_offset: new Matrix(),
      m_transform: new Matrix(),
      m_shape: new Matrix(),
      parent:null,
      constraint_to_parent:false,
      z: 0,
      w: 1,
      h: 1,
      slop: 0,
      type: -1,
      dynamic:true,
      collision: true,
      collision_category: utils.collision_category.default,
      collision_mask: utils.collision_category.default,
      constraints:[],
      do_shape:true,
      do_line:false,
      bevel: 0,
      color:utils.color.white,
      color_line:utils.color.black,
      transparency_activate:false,
      transparency:255,
      transparency_line:255,
      bloom:false,
      castShadow:false,       
      receiveShadow:false,   
      shader:null,
      visibility:true,
      axe_constraint: null,
      density:0.001,
      frictionAir:0.01,
      mass:null,
      screen_dims:null,
      matter_engine:null,
      Mouse:null,
      fidget:null, 
      material_three:null,
      arc_limites:[0,3.14*2],
      debug_matrix_info: false,
      debug_matrix_axes: false,  
      debug_cns_axes: false,     
      debug_force_visibility: false, 
      selection_break_length: 60.,
       
                 
    };
    const args = { ...defaultOptions, ...in_options };

    this.name = args.name
    this.type = "body_render"
    this.body_main = body_main
    this.body_physics = body_physics

    this.ref = strictObject({
      material_three : args.material_three,   //<<<<
    })

    this.properties = strictObject({
      visibility_default : args.visibility,
    })
    
    
    this.debug = strictObject({
        debug_matrix_info : args.debug_matrix_info,//<<<<<
        debug_matrix_axes : args.debug_matrix_axes,//<<<<<
        debug_cns_axes : args.debug_cns_axes, //<<<<<
        force_visibility : args.debug_force_visibility, 
        draw_text_debug : null
      })

    //this.debug.draw_text_debug = null
    if(this.debug.debug_matrix_info)
      this.debug.draw_text_debug = new Draw_text_debug(this.body_main.ref.screen_dims)


        
    this.state = {
      m : args.m,
      extra_rotation : 0,
      rot_override : null,
      scale : 1.0,
      visibility : args.visibility,
      visibility_secondary : false,

      draw_count: 0,      
    }

  
    this.z = args.z
    this.do_shape= args.do_shape
    this.do_line= args.do_line   
    this.bevel = args.bevel   
    this.color = args.color
    this.color_line = args.color_line
    this.color_base = args.color
    this.transparency_activate = args.transparency_activate,
    this.transparency = args.transparency,
    this.transparency_line = args.transparency_line,   
    this.bloom = args.bloom,  
    this.shader = args.shader
    this.castShadow = args.castShadow
    this.receiveShadow = args.receiveShadow
    this.three_material = null
    this.colorStroke = [0,0,0]
    this.geo = null
    this.shape_three = null
    this.mesh_three = null
  }


  reset_material()
  {
    if( this.mesh_three.shape != null)
      this.mesh_three.shape.material = this.three_material
  }



  update_shape_matrix()
  {
    let shape_points = this.three_get_shape_points()
    if(this.do_shape)
    {
      this.mesh_three.shape.geometry.setFromPoints(shape_points.getPoints());
    }
    if(this.do_line)
    {
      this.mesh_three.line.geometry.setFromPoints(shape_points.getPoints());
    }     
  }
  

  clean_shapes_three(group_fidget)
  {
    if(this.do_shape)
    {
      this.mesh_three.group.remove(this.mesh_three.shape);
      this.mesh_three.shape.geometry.dispose()
      this.mesh_three.shape.material.dispose()
      this.mesh_three.shape = null
    }

    if(this.do_line)
    {
      this.mesh_three.group.remove(this.mesh_three.line); 
      this.mesh_three.line.geometry.dispose()
      //this.mesh_three.line.material.dispose()
      this.mesh_three.line = null            
    }
 
    group_fidget.remove(this.mesh_three.group);
    this.mesh_three.group = null
    
    
    //var children_to_remove = [];
    //three_scene.traverse(function(child){
    //    if(child.name == "inscriptArc"){
    //      children_to_remove.push(child);
    //    }
    //});
    //children_to_remove.forEach(function(child){
    //    scene.remove(child);
    //});
    
  }

  
  three_get_shape_points()
  {
    //this.body_main.properties.m_shape = m
    let p = this.body_main.properties.m_shape.get_row(2).get_value()
    let w = this.body_main.properties.m_shape.get_row(0).mag()
    let h = this.body_main.properties.m_shape.get_row(1).mag()
    let r = this.body_main.properties.m_shape.getRotation() 


    // Three
    let shape_three = null
    switch(this.body_main.properties.shape_type) {
      case 0:
        shape_three = ut.rect( w, h );
        break;
      case 1:
        shape_three = ut.circle(w/2);
        break;
      case 10:  
        shape_three = ut.roundedTrap( w, h, this.body_main.properties.trapezoid_slop, 0 )
        break; 
      case 11: 
        shape_three = ut.arc( w, this.physics.arc_limites[0], this.physics.arc_limites[1])
        break;      
      }  
    return shape_three
  }

  three_fill_with_shapes( group )
  {
    let shape_points = this.three_get_shape_points()


    let out = {
      shape:null,
      line:null,
    }

    if(this.do_shape)
    {
      out.shape = ut.addShape_polygon( 
        shape_points,
        this.body_main.properties.shape_type,
        this.body_main.properties.m_shape,
        this.state.scale, 
        this.ref.material_three,
        this.color, 
        this.transparency_activate, 
        this.transparency,
        this.castShadow,
        this.receiveShadow,
        this.bevel,)  

      this.three_material = out.shape.material

      group.add( out.shape ) 
    }
    if(this.do_line)
    {
      out.line = ut.addShape_line( 
        shape_points, 
        this.color_line, 
        this.transparency_activate, 
        this.transparency,
        this.castShadow,)  

      group.add( out.line ) 
    }
    return out
  }

  setup_shapes_three(group_fidget){
    this.mesh_three = { group : null, shape : null, line : null}

    this.mesh_three.group = new THREE.Group();
    this.mesh_three.group.visible = false
    let _out = this.three_fill_with_shapes( this.mesh_three.group, this.body_main.properties.m_shape )
    this.mesh_three.shape = _out.shape
    this.mesh_three.line  = _out.line


    group_fidget.add(this.mesh_three.group)
    

    
    if(this.debug.debug_cns_axes)
    {

      const cns_axe = this.body_physics.relations.constraints.axe
      if(( cns_axe != null)&&(cns_axe.enable == true ))
      {
        cns_axe.update_debug()
        let shape = ut.line( 
          convert_coords_matter_to_three(cns_axe.debug_pts[0],this.body_main.ref.screen_dims), 
          convert_coords_matter_to_three(cns_axe.debug_pts[1],this.body_main.ref.screen_dims) );
          
        //let axes_grp = new THREE.Group();
        //group_fidget.add(axes_grp)

        let mesh = ut.addShape_line(  
          shape, 
          [255,0,255])

          group_fidget.add( mesh ) 
      }
    }

    if(this.debug.debug_matrix_axes)
    {        
      let len = 10
      let wid = 2

      let shape = null
      let mesh = null  
      
      // X
      shape = ut.rect( len, wid )
      mesh = ut.addShape_polygon(  
        shape, 
        null,
        null,
        null,
        null,
        null,
        [255,0,0],
        0,
        false,
        false,
        0)

      this.mesh_three.group.add( mesh ) 
      mesh.position.x =  len/2.0

      mesh = ut.addShape_line(  
        shape, 
        [0,0,0])
      this.mesh_three.group.add( mesh ) 
      mesh.position.x =  len/2.0

      // Y
      shape = ut.rect( wid, len )
      mesh = ut.addShape_polygon(   
        shape, 
        null,
        null,
        null,          
        null,
        null,
        [0,255,0],
        0,
        false,
        false,
        0)

      this.mesh_three.group.add( mesh ) 
      mesh.position.y =  len/2.0

      mesh = ut.addShape_line(  
        shape, 
        [0,0,0])
      this.mesh_three.group.add( mesh ) 
      mesh.position.y =  len/2.0
      
    }

    if(this.debug.debug_matrix_info)
      this.debug.draw_text_debug.setup_three(this.mesh_three.group)
    
  }  

  

  animate_three( pos, rot, scale )
  {

    let converted_pos = convert_coords_matter_to_three(pos,this.body_main.ref.screen_dims)
    this.mesh_three.group.position.x = converted_pos.x()
    this.mesh_three.group.position.y = converted_pos.y()
    this.mesh_three.group.position.z = this.z
    this.mesh_three.group.rotation.z = rot*-1
    this.mesh_three.group.visible = this.get_visibility() === 1  //<<< 
    this.mesh_three.group.scale.x = scale  
    this.mesh_three.group.scale.y = scale  
    //this.mesh_three.group.scale.z = scale 
    
    
    if(this.ref.material_three!=null)
      this.ref.material_three.update(this.mesh_three.shape,this.state.draw_count)

    
    if(this.debug.debug_matrix_info)
    {
      console.log('debug_matrix_info')
      let parent_name = 'null'
      
      if(this.body_physics.relations.parent != null)
        parent_name = this.body_physics.relations.parent.name

      let m_parent = this.body_physics.get_parent_matrix()
      let m_offset = this.body_physics.properties.m_offset
      let m_transform = this.body_physics.properties.m_transform
      let m_in = this.body_physics.get_matrix('anim','world')
      let m_out = this.body_physics.get_out_matrix()    
      let p_out = this.body_physics.get_out_position('world')
      let r_out = this.body_physics.get_out_rotation('world')    
      let vel_out = this.body_physics.get_velocity()


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
      this.debug.draw_text_debug.update_three(texts_to_draw)
    }  
      
    
    

    this.state.draw_count += 1
    
  }

  update_color_three_shape()
  {
    if(this.mesh_three.shape != null)
    {
      this.mesh_three.shape.material.color = ut.convert_to_three_color(this.color)
      if(this.transparency_activate)
        this.mesh_three.shape.material.opacity = 1. - this.transparency
    }
  }
      
  update_color_three_line()
  {      
    if(this.mesh_three.line != null)
    {
      this.mesh_three.line.material.color = ut.convert_to_three_color(this.color_line)
      if(this.transparency_activate)
        this.mesh_three.line.material.opacity = 1. - this.transparency_line  
        
      
    }

  }

  enable(value)
  {
    if(value)
      this.state.visibility = this.properties.visibility_default
    else
      this.state.visibility = false    
  }

  get_visibility()
  {
    if(this.debug.force_visibility)
      return 1
    if( this.state.visibility || this.state.visibility_secondary ) 
      return 1
    return 0
  }


}


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////



export class body_build{
  
    constructor( in_options ){
    // Default options
      const defaultOptions = {
        name:'default name',
        highlight_bodies_when_selected:[],
        m: new Matrix(),
        m_offset: new Matrix(),
        m_transform: new Matrix(),
        m_shape: new Matrix(),
        parent:null,
        constraint_to_parent:false,
        z: 0,
        w: 1,
        h: 1,
        slop: 0,
        type: -1,
        dynamic:true,
        collision: true,
        collision_category: utils.collision_category.default,
        collision_mask: utils.collision_category.default,
        constraints:[],
        do_shape:true,
        do_line:false,
        bevel: 0,
        color:utils.color.white,
        color_line:utils.color.black,
        transparency_activate:false,
        transparency:255,
        transparency_line:255,
        bloom:false,
        castShadow:false,       
        receiveShadow:false,   
        shader:null,
        visibility:true,
        axe_constraint: null,
        density:0.001,
        frictionAir:0.01,
        mass:null,
        screen_dims:null,
        matter_engine:null,
        Mouse:null,
        fidget:null, 
        material_three:null,
        arc_limites:[0,3.14*2],
        debug_matrix_info: false,
        debug_matrix_axes: false,  
        debug_cns_axes: false,     
        debug_force_visibility: false, 
        selection_break_length: 60.,
         
                   
      };
      const args = { ...defaultOptions, ...in_options };
      

      this.name = args.name
      this.type = "body"      
      
      this.physics = strictObject( new body_physics(args, this) )
      this.render = strictObject( new body_render(args, this, this.physics))

      this.ref = strictObject({
        screen_dims : args.screen_dims,
      })

      this.properties = strictObject({
        shape_type : args.type,
        m_shape_init : args.m_shape,
        m_shape : args.m_shape,   
        trapezoid_slop : args.slop, 
      })
        
      var max_choice = 10
      if(this.properties.shape_type == -1)
        this.properties.shape_type = min(max(Math.round(Matter.Common.random(-1, max_choice+1)),0),max_choice)
          
          

      this.relations = strictObject({
        instances: [],
        highlight_bodies_when_selected: args.highlight_bodies_when_selected,
        build_order: build_order,
        fidget : args.fidget,          
      })

      build_order += 1

     
    }

    

    set_shape_matrix(m)
    {
      this.properties.m_shape = m
      this.physics.update_shape_matrix()
      this.render.update_shape_matrix()
    }
    
   
    enable(value)
    {
      this.render.enable(value)
      this.physics.enable(value)
    }

    set_is_selected(value)
    {
      //this.physics.state.is_selected = value
      this.physics.state.is_selected = value
    }


    ////////////////////////////////////////////////////////////////////////////////// dyn specific

  
    get_args()
    {
      let args = {

        type:this.properties.shape_type,
        name:this.name,
        m_shape:this.properties.m_shape,
        slop:this.properties.trapezoid_slop,

        highlight_bodies_when_selected:this.relations.highlight_bodies_when_selected,    
        screen_dims:this.ref.screen_dims,
        fidget:this.relations.fidget,
          

   
        debug_force_visibility:this.render.debug.force_visibility,    
        debug_matrix_info:this.render.debug.debug_matrix_info,
        debug_matrix_axes:this.render.debug.debug_matrix_axes,
        debug_cns_axes:this.render.debug.debug_cns_axes,
        
        m_offset:this.physics.properties.m_offset,
        m_transform:this.physics.properties.m_transform,
        parent:this.physics.relations.parent,
        m:this.physics.state.m,
        rot_override:this.physics.state.rot_override,
        scale:this.physics.state.scale,
        dynamic:this.physics.dynamic,
        collision:this.physics.collision,
        collision_category:this.physics.collision_category,
        collision_mask:this.physics.collision_mask,        
        density:this.physics.density,
        frictionAir:this.physics.frictionAir,
        mass:this.physics.mass,
        matter_engine:this.physics.ref.matter_engine,
        //Mouse:this.physics.ref.Mouse,
        arc_limites:this.physics.arc_limites,
        selection_break_length:this.physics.selection_break_length,
        constraints_args:this.physics.relations.constraints_args,

        material_three:this.render.ref.material_three,    
        z:this.render.z,
        do_shape:this.render.do_shape,
        do_line:this.render.do_line,
        bevel:this.render.bevel,
        color:this.render.color,
        color_line:this.render.color_line,
        color_base:this.render.color_base,
        transparency_activate:this.render.transparency_activate,
        transparency:this.render.transparency,
        transparency_line:this.render.transparency_line,   
        bloom:this.render.bloom,  
        shader:this.render.shader,
        castShadow:this.render.castShadow,
        receiveShadow:this.render.receiveShadow,
        visibility:this.render.state.visibility,

      }
      return args

    }

      
    update_instance_is_selected_attr()
    {
      if( 0 < this.relations.instances.length)
      {
        if(this.physics.state.is_selected)
        {
          this.physics.state.is_last_instance_selected = true
          for(let inst of this.relations.instances)
            inst.physics.state.is_last_instance_selected = false
        }
      }
    }

    get_resolution_coef(){return 0}
    set_resolution_coef(){}

    get_duplicate( m_transform_start, m_transform_end, name_search, name_replace )
    {
      let args = this.get_args()

      let name = args.name
      let parent = args.parent
      let parent_name = parent.name
      let m_offset = args.m_offset
      let m_transform = args.m_transform
      let m_shape = args.m_shape

      let slop = args.slop
      let extra_rotation = args.extra_rotation
      let rot_override = args.rot_override

      let highlight_bodies_when_selected = args.highlight_bodies_when_selected  
      let highlight_selection_names = []
      for( let i = 0 ; i < highlight_bodies_when_selected.length; i++)
        highlight_selection_names.push( highlight_bodies_when_selected[i].name )         

      let constraints_args = args.constraints_args
      let target_names = []
      for( let i = 0 ; i < constraints_args.length; i++)
      {
        if( constraints_args[i]['target'] != null )
          target_names.push( constraints_args[i]['target'].name )   
        else
          target_names.push( null )   
      }
         
 
      let arc_limites = args.arc_limites
    
      let suffix_axeY = [name_search, name_replace]

      let parent_is_sided = false
      if(true)
      {
        // name
        if( name.includes(suffix_axeY[0]) )
          name = name.replace(suffix_axeY[0],suffix_axeY[1])
        else
          console.error('no '+suffix_axeY[0]+' in name, cannot mirror')

        // parent
        if( parent_name.includes(suffix_axeY[0]) )
        {
          parent_name = parent_name.replace(suffix_axeY[0],suffix_axeY[1])

          let bodies_found = this.relations.fidget.bodies.search_by_name( parent_name )
          if( 0 < bodies_found.length )
          {
            let mirrored_body = bodies_found[0]
            parent = mirrored_body
            parent_is_sided = true
          }
        }

        //highlight_bodies_when_selected
        let highlight_selection_mirrored = []
        for( let i = 0 ; i < highlight_bodies_when_selected.length; i++)
        {
          if( highlight_selection_names[i].includes(suffix_axeY[0]) )
          {
            highlight_selection_names[i] = highlight_selection_names[i].replace(suffix_axeY[0],suffix_axeY[1])
            let bodies_found = this.relations.fidget.bodies.search_by_name( highlight_selection_names[i] )
            if( 0 < bodies_found.length )
            {
              let mirrored_body = bodies_found[0]
              highlight_selection_mirrored.push(mirrored_body)
            }  
            else
              highlight_selection_mirrored.push(highlight_bodies_when_selected[i])
          }  
          else
            highlight_selection_mirrored.push(highlight_bodies_when_selected[i])                
        }
        highlight_bodies_when_selected = highlight_selection_mirrored

        // constraint 
        const constraints_args_mirrored = []
        for( let i = 0 ; i < constraints_args.length; i++)
        {
          let constraints_arg_mirrored = {}
          for( let attr in constraints_args[i] )
            constraints_arg_mirrored[attr] = constraints_args[i][attr]

          if( (target_names[i] != null)&&( target_names[i].includes(suffix_axeY[0]) ) )
          {
            target_names[i] = target_names[i].replace(suffix_axeY[0],suffix_axeY[1])
            let bodies_found = this.relations.fidget.bodies.search_by_name( target_names[i] )
            if( 0 < bodies_found.length )
            {
              let mirrored_body = bodies_found[0]
              constraints_arg_mirrored['target'] = mirrored_body 
            } 
          }     
          
          if(constraints_arg_mirrored.type == 'kin_axe')
          {       
            /*
            let distPos = constraints_arg_mirrored.distPos
            let distNeg = constraints_arg_mirrored.distNeg
            constraints_arg_mirrored.distPos = distNeg
            constraints_arg_mirrored.distNeg = distPos

            constraints_arg_mirrored.limit_lock *= -1
            */
          }
          


           /*
          if(constraints_arg_mirrored.type == 'connect')
          {
            if( constraints_arg_mirrored.attr == 'tx' )
              constraints_arg_mirrored['out_multiplier'] = 1     
            else if( constraints_arg_mirrored.attr == 'ty' )
              constraints_arg_mirrored['out_multiplier'] = -1
            else if( constraints_arg_mirrored.attr == 'r' )
              constraints_arg_mirrored['out_multiplier'] = -1
            else if( constraints_arg_mirrored.attr == 's' )
              constraints_arg_mirrored['out_multiplier'] = -1  
              
            
            
            if(constraints_arg_mirrored['target_remap'] != null )
            {
              let r = constraints_arg_mirrored['target_remap']
              
              if( constraints_arg_mirrored.attr == 'tx' )
                r = [ r[0], r[1], r[2], r[3] ]   
              else if( constraints_arg_mirrored.attr == 'ty' )
                r = [ r[0], r[1], r[2]*-1, r[3]*-1 ]   
              else if( constraints_arg_mirrored.attr == 'r' )
                r = [ r[0], r[1], r[3], r[2]  ]    
              else if( constraints_arg_mirrored.attr == 's' )
                r = [ r[0], r[1], r[2]*-1, r[3]*-1 ]    
              
              if( constraints_arg_mirrored.target_attr == 'tx' )
                r = [ r[0]*-1, r[1]*-1, r[2], r[3] ]                 
              else if( constraints_arg_mirrored.target_attr == 'ty' )
                r = [ r[0]*-1, r[1]*-1, r[2], r[3] ]               
              else if( constraints_arg_mirrored.target_attr == 'r' )
                r = [ r[0], r[1], r[2], r[3] ]                  
              else if( constraints_arg_mirrored.target_attr == 's' )
                r = [ r[0]*-1, r[1]*-1, r[2], r[3] ]     
                
                constraints_arg_mirrored['target_remap'] = r
            }              
            
          }
          else if(constraints_arg_mirrored.type == 'kin_orient')
            constraints_arg_mirrored['out_multiplier'] = -1
          else if(constraints_arg_mirrored.type == 'dyn_orient')
            constraints_arg_mirrored['out_multiplier'] = -1
          */

          constraints_args_mirrored.push(constraints_arg_mirrored)          
   
        }
        constraints_args = constraints_args_mirrored
        


      }
      
      
      if( parent_is_sided == false)
      {
        let m_parent = parent.physics.get_init_matrix()
        let m_offset_world = m_offset.getMult(m_parent)
        let m_transform_offset_world = m_transform.getMult(m_offset_world)

        let m_offset_world_transformed = m_offset_world.getMult(m_transform_start.getInverse()).getMult(m_transform_end)
        let m_transform_offset_world_transformed = m_transform_offset_world.getMult(m_transform_start.getInverse()).getMult(m_transform_end)

        m_offset = m_offset_world_transformed.getMult(m_parent.getInverse())

        m_transform = m_transform_offset_world_transformed.getMult(m_offset_world_transformed.getInverse())


      }
        

      // m_shape mirrored
      // constraint 


      





      // update args
      args.name = name
      args.parent = parent
      args.m_offset = m_offset
      args.m_transform = m_transform
      args.m_shape = m_shape

      args.slop = slop
      args.extra_rotation = extra_rotation
      args.rot_override = rot_override

      args.highlight_bodies_when_selected = highlight_bodies_when_selected
      args.constraints = constraints_args
 
      args.arc_limites = arc_limites

      let body_duplicated = strictObject(new body_build(args))
      

      
      /*
      if(instance)
      {
        let connect_to_dupli_tx ={
          name:'instance_A_to_B_tx', 
          type:'connect', 
          target:this, 
          attr:'tx',
          target_attr:'tx', 
          target_space:'local',
          target_remap:[-1000,1000,-1000,1000],
          activate_when_target_is_selected: true }

        let connect_to_orig_tx ={
          name:'instance_B_to_A_tx', 
          type:'connect', 
          target:body_duplicated, 
          attr:'tx',
          target_attr:'tx', 
          target_space:'local',
          target_remap:[-1000,1000,-1000,1000],
          activate_when_target_is_selected: true }

        let connect_to_dupli_ty ={
          name:'instance_A_to_B_ty', 
          type:'connect', 
          target:this, 
          attr:'ty',
          target_attr:'ty', 
          target_space:'local',
          target_remap:[-1000,1000,-1000,1000],
          activate_when_target_is_selected: true }

        let connect_to_orig_ty ={
          name:'instance_B_to_A_ty', 
          type:'connect', 
          target:body_duplicated, 
          attr:'ty',
          target_attr:'ty', 
          target_space:'local',
          target_remap:[-1000,1000,-1000,1000],
          activate_when_target_is_selected: true }

        let connect_to_dupli_r ={
          name:'instance_A_to_B_r', 
          type:'connect', 
          target:this, 
          attr:'r',
          target_attr:'tx', 
          target_space:'local',
          target_remap:[-1000,1000,-1000,1000],
          activate_when_target_is_selected: true }

        let connect_to_orig_r ={
          name:'instance_B_to_A_r', 
          type:'connect', 
          target:body_duplicated, 
          attr:'r',
          target_attr:'tx', 
          target_space:'local',
          target_remap:[-1000,1000,-1000,1000],
          activate_when_target_is_selected: true }

        if((!axe_x)&&axe_y)
        {
          //connect_to_dupli_tx.target_remap = [-1000,1000,-1000,1000]
          //connect_to_orig_tx.target_remap = [-1000,1000,-1000,1000]
          connect_to_dupli_ty.target_remap = [-1000,1000,-1000*-1,1000*-1]
          connect_to_orig_ty.target_remap = [-1000*-1,1000*-1,-1000,1000]          
          //connect_to_dupli_r.target_remap = [-1000,1000,-1000*-1,1000*-1]
          //connect_to_orig_r.target_remap = [-1000,1000,-1000*-1,1000*-1]  
        }        
        if(axe_x&&(!axe_y))
        {
          //connect_to_dupli_tx.target_remap = [-1000,1000,-1000,1000]
          //connect_to_orig_tx.target_remap = [-1000,1000,-1000,1000]
          connect_to_dupli_ty.target_remap = [-1000,1000,-1000*-1,1000*-1]
          connect_to_orig_ty.target_remap = [-1000*-1,1000*-1,-1000,1000]          
          //connect_to_dupli_r.target_remap = [-1000,1000,-1000*-1,1000*-1]
          //connect_to_orig_r.target_remap = [-1000,1000,-1000*-1,1000*-1]  
        }

        //this.relations.constraints_args.push(connect_to_orig_tx)
        this.relations.constraints_args.push(connect_to_orig_ty)
        //this.relations.constraints_args.push(connect_to_orig_r)

        //body_duplicated.constraints_args.push(connect_to_dupli_tx)
        body_duplicated.constraints_args.push(connect_to_dupli_ty)
        //body_duplicated.constraints_args.push(connect_to_dupli_r)        
      }
      */

      return body_duplicated      
    }


    get_mirror(  axe_x = false, axe_y = true)
    {
      let args = this.get_args()

      let name = args.name
      let parent = args.parent
      let parent_name = parent.name
      let m_offset = args.m_offset
      let m_transform = args.m_transform
      let m_shape = args.m_shape

      let slop = args.slop
      let extra_rotation = args.extra_rotation
      let rot_override = args.rot_override

      let highlight_bodies_when_selected = args.highlight_bodies_when_selected  
      let highlight_selection_names = []
      for( let i = 0 ; i < highlight_bodies_when_selected.length; i++)
      {
        highlight_selection_names.push( highlight_bodies_when_selected[i].name )   
      }      

      let constraints_args = args.constraints_args
      let target_names = []
      for( let i = 0 ; i < constraints_args.length; i++)
      {
        if( constraints_args[i]['target'] != null )
          target_names.push( constraints_args[i]['target'].name )   
        else
          target_names.push( null )   
      }
         
 
      let arc_limites = args.arc_limites
    
      let suffix_axeY = ['_L_','_R_']
      let suffix_axeX = ['_T_','_B_']

      let parent_is_sided = false
      if(axe_y)
      {
        // name
        if( name.includes(suffix_axeY[0]) )
          name = name.replace(suffix_axeY[0],suffix_axeY[1])
        else
          console.error('no '+suffix_axeY[0]+' in name, cannot mirror')

        // parent
        if( parent_name.includes(suffix_axeY[0]) )
        {
          parent_name = parent_name.replace(suffix_axeY[0],suffix_axeY[1])

          let bodies_found = this.relations.fidget.bodies.search_by_name( parent_name )
          if( 0 < bodies_found.length )
          {
            let mirrored_body = bodies_found[0]
            parent = mirrored_body
            parent_is_sided = true
          }
        }

        //highlight_bodies_when_selected
        let highlight_selection_mirrored = []
        for( let i = 0 ; i < highlight_bodies_when_selected.length; i++)
        {
          if( highlight_selection_names[i].includes(suffix_axeY[0]) )
          {
            highlight_selection_names[i] = highlight_selection_names[i].replace(suffix_axeY[0],suffix_axeY[1])
            let bodies_found = this.relations.fidget.bodies.search_by_name( highlight_selection_names[i] )
            if( 0 < bodies_found.length )
            {
              let mirrored_body = bodies_found[0]
              highlight_selection_mirrored.push(mirrored_body)
            }  
            else
              highlight_selection_mirrored.push(highlight_bodies_when_selected[i])
          }  
          else
            highlight_selection_mirrored.push(highlight_bodies_when_selected[i])                
        }
        highlight_bodies_when_selected = highlight_selection_mirrored

        // constraint 
        const constraints_args_mirrored = []
        for( let i = 0 ; i < constraints_args.length; i++)
        {
          let constraints_arg_mirrored = {}
          for( let attr in constraints_args[i] )
            constraints_arg_mirrored[attr] = constraints_args[i][attr]

          if( (target_names[i] != null)&&( target_names[i].includes(suffix_axeY[0]) ) )
          {
            target_names[i] = target_names[i].replace(suffix_axeY[0],suffix_axeY[1])
            let bodies_found = this.relations.fidget.bodies.search_by_name( target_names[i] )
            if( 0 < bodies_found.length )
            {
              let mirrored_body = bodies_found[0]
              constraints_arg_mirrored['target'] = mirrored_body 
            } 
          }     
          
          if(constraints_arg_mirrored.type == 'kin_axe')
          {       
            let distPos = constraints_arg_mirrored.distPos
            let distNeg = constraints_arg_mirrored.distNeg
            constraints_arg_mirrored.distPos = distNeg
            constraints_arg_mirrored.distNeg = distPos

            constraints_arg_mirrored.limit_lock *= -1
          }
          


          
          if(constraints_arg_mirrored.type == 'connect')
          {
            if( constraints_arg_mirrored.attr == 'tx' )
              constraints_arg_mirrored['out_multiplier'] = 1     
            else if( constraints_arg_mirrored.attr == 'ty' )
              constraints_arg_mirrored['out_multiplier'] = -1
            else if( constraints_arg_mirrored.attr == 'r' )
              constraints_arg_mirrored['out_multiplier'] = -1
            else if( constraints_arg_mirrored.attr == 's' )
              constraints_arg_mirrored['out_multiplier'] = -1  
              
            
            
            if(constraints_arg_mirrored['target_remap'] != null )
            {
              let r = constraints_arg_mirrored['target_remap']
              
              if( constraints_arg_mirrored.attr == 'tx' )
                r = [ r[0], r[1], r[2], r[3] ]   
              else if( constraints_arg_mirrored.attr == 'ty' )
                r = [ r[0], r[1], r[2]*-1, r[3]*-1 ]   
              else if( constraints_arg_mirrored.attr == 'r' )
                r = [ r[0], r[1], r[3], r[2]  ]    
              else if( constraints_arg_mirrored.attr == 's' )
                r = [ r[0], r[1], r[2]*-1, r[3]*-1 ]    
              
              if( constraints_arg_mirrored.target_attr == 'tx' )
                r = [ r[0]*-1, r[1]*-1, r[2], r[3] ]                 
              else if( constraints_arg_mirrored.target_attr == 'ty' )
                r = [ r[0]*-1, r[1]*-1, r[2], r[3] ]               
              else if( constraints_arg_mirrored.target_attr == 'r' )
                r = [ r[0], r[1], r[2], r[3] ]                  
              else if( constraints_arg_mirrored.target_attr == 's' )
                r = [ r[0]*-1, r[1]*-1, r[2], r[3] ]     
                
                constraints_arg_mirrored['target_remap'] = r
            }              
          }
          else if(constraints_arg_mirrored.type == 'kin_orient')
            constraints_arg_mirrored['out_multiplier'] = -1
          else if(constraints_arg_mirrored.type == 'dyn_orient')
            constraints_arg_mirrored['out_multiplier'] = -1
          
          constraints_args_mirrored.push(constraints_arg_mirrored)          
   
        }
        constraints_args = constraints_args_mirrored
        


      }
      
      //axe_x = false
      if(axe_x)
      {
        // name
        if( name.includes(suffix_axeX[0]) )
          name = name.replace(suffix_axeX[0],suffix_axeX[1])
        else
          console.error('no '+suffix_axeX[0]+' in name, cannot mirror')

        // parent
        if( parent_name.includes(suffix_axeX[0]) )
        {
          parent_name = parent_name.replace(suffix_axeX[0],suffix_axeX[1])

          let bodies_found = this.relations.fidget.bodies.search_by_name( parent_name )
          if( 0 < bodies_found.length )
          {
            let mirrored_body = bodies_found[0]
            parent = mirrored_body
            parent_is_sided = true
          }
        }
        //highlight_bodies_when_selected
        let highlight_selection_mirrored = []
        for( let i = 0 ; i < highlight_bodies_when_selected.length; i++)
        {
          if( highlight_selection_names[i].includes(suffix_axeX[0]) )
          {
            highlight_selection_names[i] = highlight_selection_names[i].replace(suffix_axeX[0],suffix_axeX[1])
            let bodies_found = this.relations.fidget.bodies.search_by_name( highlight_selection_names[i] )
            if( 0 < bodies_found.length )
            {
              let mirrored_body = bodies_found[0]
              highlight_selection_mirrored.push(mirrored_body)
            }  
            else
              highlight_selection_mirrored.push(highlight_bodies_when_selected[i])
          }  
          else
            highlight_selection_mirrored.push(highlight_bodies_when_selected[i])                
        }
        highlight_bodies_when_selected = highlight_selection_mirrored


        // constraint 
        const constraints_args_mirrored = []
        for( let i = 0 ; i < constraints_args.length; i++)
        {
          let constraints_arg_mirrored = {}
          for( let attr in constraints_args[i] )
            constraints_arg_mirrored[attr] = constraints_args[i][attr]

          if( (target_names[i] != null)&&( target_names[i].includes(suffix_axeX[0]) ) )
          {
            target_names[i] = target_names[i].replace(suffix_axeX[0],suffix_axeX[1])
            let bodies_found = this.relations.fidget.bodies.search_by_name( target_names[i] )
            if( 0 < bodies_found.length )
            {
              let mirrored_body = bodies_found[0]
              constraints_arg_mirrored['target'] = mirrored_body 
            } 
          }       

          
          if(constraints_arg_mirrored.type == 'kin_axe')
          {       
            let distPos = constraints_arg_mirrored.distPos
            let distNeg = constraints_arg_mirrored.distNeg
            constraints_arg_mirrored.distPos = distNeg
            constraints_arg_mirrored.distNeg = distPos

            constraints_arg_mirrored.limit_lock *= -1
          }
          
          

          
          if(constraints_arg_mirrored.type == 'connect')
          {
            if( constraints_arg_mirrored.attr == 'tx' )
              constraints_arg_mirrored['out_multiplier'] = 1     
            else if( constraints_arg_mirrored.attr == 'ty' )
              constraints_arg_mirrored['out_multiplier'] = -1
            else if( constraints_arg_mirrored.attr == 'r' )
              constraints_arg_mirrored['out_multiplier'] = -1
            else if( constraints_arg_mirrored.attr == 's' )
              constraints_arg_mirrored['out_multiplier'] = -1    



            if(constraints_arg_mirrored['target_remap'] != null )
            {
              let r = constraints_arg_mirrored['target_remap']

              if( constraints_arg_mirrored.attr == 'tx' )
                r = [ r[0], r[1], r[2], r[3] ]   
              else if( constraints_arg_mirrored.attr == 'ty' )
                r = [ r[0], r[1], r[2]*-1, r[3]*-1 ]   
              else if( constraints_arg_mirrored.attr == 'r' )
                r = [ r[0], r[1], r[3], r[2]  ]   
              else if( constraints_arg_mirrored.attr == 's' )
                r = [ r[0], r[1], r[2]*-1, r[3]*-1 ]    

              if( constraints_arg_mirrored.target_attr == 'tx' )
                r = [ r[0]*-1, r[1]*-1, r[2], r[3] ]                 
              else if( constraints_arg_mirrored.target_attr == 'ty' )
                r = [ r[0]*-1, r[1]*-1, r[2], r[3] ]               
              else if( constraints_arg_mirrored.target_attr == 'r' )
                r = [ r[0], r[1], r[2], r[3] ]                  
              else if( constraints_arg_mirrored.target_attr == 's' )
                r = [ r[0]*-1, r[1]*-1, r[2], r[3] ]    

                
                constraints_arg_mirrored['target_remap'] = r
            }      

          }

          else if(constraints_arg_mirrored.type == 'kin_orient')
            constraints_arg_mirrored['out_multiplier'] = -1
          else if(constraints_arg_mirrored.type == 'dyn_orient')
            constraints_arg_mirrored['out_multiplier'] = -1   

          if(axe_y)
            constraints_arg_mirrored['out_multiplier'] = 1

          constraints_args_mirrored.push(constraints_arg_mirrored)          
       


        }
        constraints_args = constraints_args_mirrored

      }
      
      if( parent_is_sided == false)
      {
        let m_transform_offset_mirrored = m_transform.getMult(m_offset).get_mirror(axe_x,axe_y)

        m_offset = m_offset.get_mirror(axe_x,axe_y)

        let angleA = m_transform.getRotation()
        m_transform = m_transform_offset_mirrored.getMult(m_offset.getInverse())
        let angleB = m_transform.getRotation()

      }
        

      // m_shape mirrored
      // constraint 


      





      // update args
      args.name = name
      args.parent = parent
      args.m_offset = m_offset
      args.m_transform = m_transform
      args.m_shape = m_shape

      args.slop = slop
      args.extra_rotation = extra_rotation
      args.rot_override = rot_override

      args.highlight_bodies_when_selected = highlight_bodies_when_selected
      args.constraints = constraints_args
 
      args.arc_limites = arc_limites


      let body_duplicated = strictObject(new body_build(args))
      

      
      /*
      if(instance)
      {
        let connect_to_dupli_tx ={
          name:'instance_A_to_B_tx', 
          type:'connect', 
          target:this, 
          attr:'tx',
          target_attr:'tx', 
          target_space:'local',
          target_remap:[-1000,1000,-1000,1000],
          activate_when_target_is_selected: true }

        let connect_to_orig_tx ={
          name:'instance_B_to_A_tx', 
          type:'connect', 
          target:body_duplicated, 
          attr:'tx',
          target_attr:'tx', 
          target_space:'local',
          target_remap:[-1000,1000,-1000,1000],
          activate_when_target_is_selected: true }

        let connect_to_dupli_ty ={
          name:'instance_A_to_B_ty', 
          type:'connect', 
          target:this, 
          attr:'ty',
          target_attr:'ty', 
          target_space:'local',
          target_remap:[-1000,1000,-1000,1000],
          activate_when_target_is_selected: true }

        let connect_to_orig_ty ={
          name:'instance_B_to_A_ty', 
          type:'connect', 
          target:body_duplicated, 
          attr:'ty',
          target_attr:'ty', 
          target_space:'local',
          target_remap:[-1000,1000,-1000,1000],
          activate_when_target_is_selected: true }

        let connect_to_dupli_r ={
          name:'instance_A_to_B_r', 
          type:'connect', 
          target:this, 
          attr:'r',
          target_attr:'tx', 
          target_space:'local',
          target_remap:[-1000,1000,-1000,1000],
          activate_when_target_is_selected: true }

        let connect_to_orig_r ={
          name:'instance_B_to_A_r', 
          type:'connect', 
          target:body_duplicated, 
          attr:'r',
          target_attr:'tx', 
          target_space:'local',
          target_remap:[-1000,1000,-1000,1000],
          activate_when_target_is_selected: true }

        if((!axe_x)&&axe_y)
        {
          //connect_to_dupli_tx.target_remap = [-1000,1000,-1000,1000]
          //connect_to_orig_tx.target_remap = [-1000,1000,-1000,1000]
          connect_to_dupli_ty.target_remap = [-1000,1000,-1000*-1,1000*-1]
          connect_to_orig_ty.target_remap = [-1000*-1,1000*-1,-1000,1000]          
          //connect_to_dupli_r.target_remap = [-1000,1000,-1000*-1,1000*-1]
          //connect_to_orig_r.target_remap = [-1000,1000,-1000*-1,1000*-1]  
        }        
        if(axe_x&&(!axe_y))
        {
          //connect_to_dupli_tx.target_remap = [-1000,1000,-1000,1000]
          //connect_to_orig_tx.target_remap = [-1000,1000,-1000,1000]
          connect_to_dupli_ty.target_remap = [-1000,1000,-1000*-1,1000*-1]
          connect_to_orig_ty.target_remap = [-1000*-1,1000*-1,-1000,1000]          
          //connect_to_dupli_r.target_remap = [-1000,1000,-1000*-1,1000*-1]
          //connect_to_orig_r.target_remap = [-1000,1000,-1000*-1,1000*-1]  
        }

        //this.relations.constraints_args.push(connect_to_orig_tx)
        this.relations.constraints_args.push(connect_to_orig_ty)
        //this.relations.constraints_args.push(connect_to_orig_r)

        //body_duplicated.constraints_args.push(connect_to_dupli_tx)
        body_duplicated.constraints_args.push(connect_to_dupli_ty)
        //body_duplicated.constraints_args.push(connect_to_dupli_r)        
      }
      */

      return body_duplicated

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











