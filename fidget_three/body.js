import Vector from './vector.js';
import Matrix from './matrix.js';
import { utils , rad, deg, Draw_text_debug,convert_coords_matter_to_three} from './utils.js';
import { 
  dyn_constraint_build, 
  constraint_build, 
  cns_axe,limit,
  dyn_constraint_build_custom_orient,
  connect,
  connect_multi} from './constraint.js';
import * as ut from './utils_three.js';
import { VerticalTiltShiftShader } from './libraries/jsm/Addons.js';
import * as THREE from 'three';

var build_order = 0
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
        mouse_constraint:null,
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
      this.bevel = args.bevel   
      this.color = args.color
      this.color_line = args.color_line
      this.color_base = args.color
      this.transparency_activate = args.transparency_activate,
      this.transparency = args.transparency,
      this.transparency_line = args.transparency_line,   
      this.bloom = args.bloom,  
      this.bloom_default = args.bloom,  
      this.shader = args.shader
      this.castShadow = args.castShadow
      this.receiveShadow = args.receiveShadow
      this.dynamic = args.dynamic
      this.dynamic_default = args.dynamic
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
      this.material_three = args.material_three
      this.arc_limites = args.arc_limites
      this.debug_matrix_info = args.debug_matrix_info
      this.debug_matrix_axes = args.debug_matrix_axes
      this.debug_cns_axes = args.debug_cns_axes  
      this.selection_break_length = args.selection_break_length

      this.is_touch = false
      this.is_selected = false
      this.instance_is_selected = false
      this.is_last_instance_selected = false
      this.instances = []
      this.three_material = null
      this.build_order = build_order
      build_order += 1
      

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
      /*
      if(this.dynamic)
        this.init_physics()
      this.set_out_matrix(this.get_init_matrix())
      this.init_constraints()
      */
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
      if(!this.dynamic)
        return false

      this.body = this.matter_get_shape(this.m_shape)
  
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
  
  
      Matter.Composite.add( this.matter_engine.world, this.body)    
      return true
    }

    init_constraints()
    {
      for(let i = 0; i < this.constraints_args.length; i++)
      {
        let cns = this.build_constraint(this.constraints_args[i])
        if( cns != null)
        {
          this.constraints_order.push(this.constraints_args[i].name)
          this.constraints[this.constraints_args[i].name] = cns
        } 
      }
 
    }

    build_constraint(args)
    {
      let cns = null
      if((args.type == 'dyn_point')&&(this.dynamic))
      { 
        cns = new dyn_constraint_build({obj: this, ...args})//build_constraint(this,args)          
      }

      if((args.type == 'dyn_orient')&&(this.dynamic))
      {
        cns = new dyn_constraint_build_custom_orient({obj: this, ...args, y_offset:300})//build_constraint(this,args,offset)                 
      }

      if(args.type == 'kin_point')
      { 
        cns = new constraint_build({obj: this, ...args,do_position:true,do_orientation:false})//build_constraint(this,args)          
      }

      if(args.type == 'kin_orient')
      {
        cns = new constraint_build({obj: this, ...args,do_position:false,do_orientation:true})//build_constraint(this,args,offset)                 
      }

      /////////////////// axe
      if((args.type == 'kin_axe')&&(this.dynamic))
      {
        cns =  new cns_axe({ Follower: this, ...args })   
      }

      if(args.type == 'kin_limit')
      {
        cns =  new limit({ Follower: this, ...args, obj:this })   
      }

      if(args.type == 'connect')
      {
        cns =  new connect({ ...args, obj:this })   
      }


      if(args.type == 'connect_multi')
      {
        cns =  new connect_multi({ ...args, obj:this })   
      }

      return cns
    }

    matter_update_shape_coords(m)
    {
      let new_body = this.matter_get_shape(m)
      this.m_shape = m
      Matter.Body.setVertices(this.body, new_body.vertices)

    }
    /*
    apply_scale( value )
    {
      this.scale = this.scale*value
      if(this.dynamic)
        Matter.Body.scale( this.body, value, value, { x : this.body.position.x, y : this.body.position.y })
  
    }
    */
  
    enable(value)
    {
      if(value)
        this.visibility = this.visibility_default
      else
        this.visibility = false
      //this.do_update = value
      //Matter.Sleeping.set(this.body, value==false)
      if(this.dynamic)
      {
        if(value)
          this.body.collisionFilter.category = this.collision_category
        else
          this.body.collisionFilter.category = utils.collision_category.none
      }

    }
    //////////////////////////////////////////////////////////////////////////////// m_transform parent
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
        m_parent = this.parent.m_transform.getMult(this.parent.m_offset.getMult(this.parent.get_parent_in_matrix()))
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
          m = this.m_offset.getMult(this.get_parent_matrix())
        else if(space=='parent')
          m = this.m_offset       
      }
      else if(matrix_layer == 'anim')
      {
        if(space =='world')
          m = this.m_transform.getMult(this.m_offset.getMult(this.get_parent_matrix()))        
        if( space =='parent')
          m = this.m_transform.getMult(this.m_offset)
        else if(space =='base'  )
          m = this.m_transform

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
          m = m_dyn_world.getMult(this.m_offset.getMult(this.get_parent_matrix()).getInverse())
        else if(space =='anim'  )
          m = m_dyn_world.getMult( this.m_transform.getMult(this.m_offset.getMult(this.get_parent_matrix())).getInverse()  )
      }
      
      return m
    }

    get_position( type = 'dyn', space = 'world')
    {
      return this.get_matrix( type, space).get_row(2)
    }
    get_rotation( type = 'dyn', space = 'world')
    {
      return this.get_matrix( type, space).getRotation()
    }

    set_matrix(m_transform, matrix_layer = 'dyn', transform_space = 'world', add_mode = 'override')
    {

      if(transform_space == 'self')
        transform_space = matrix_layer

      if((matrix_layer == 'base' )&&(transform_space =='world'))
      {
        if(add_mode == 'override')
        {
          this.m_offset = m_transform.getMult(this.get_parent_matrix().getInverse())
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
          this.m_offset = m_current_transformed      
        }
      }
      else if((matrix_layer == 'base' )&&(transform_space =='parent'))
      {
        if(add_mode == 'override')
        {
          this.m_offset = m_transform
        }
        else if(add_mode == 'add')
        {
          // convert in transform space
          let m_current_in_transform_space = this.m_offset
          // transform
          let mt_pos = m_transform.extractPositionMatrix()// pos in transform_space space
          let mt_rot = m_transform.extractRotationMatrix()// rot in m_offset space
          let m_current_in_transform_space_transformed = mt_rot.getMult(m_current_in_transform_space.getMult(mt_pos)) 
          // convert from transform space
          let m_current_transformed =  m_current_in_transform_space_transformed
          // update class 
          this.m_offset = m_current_transformed              
        }
      }
      else if((matrix_layer == 'base' )&&(transform_space =='base'))//self
      {
        this.m_offset = m_transform.getMult(this.m_offset)                     
      }



      if((matrix_layer == 'anim' )&&(transform_space =='world'))
      {
        if(add_mode == 'override')
        {
          this.m_transform = m_transform.getMult(this.get_matrix('base','world').getInverse())
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
          this.m_transform = m_current_transformed      
        }
      }
      else if((matrix_layer == 'anim' )&&(transform_space =='parent'))
      {
        if(add_mode == 'override')
        {
          this.m_transform = m_transform.getMult(this.get_matrix('base','parent').getInverse())
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
          this.m_transform = m_current_transformed      
        }
      }
      else if((matrix_layer == 'anim' )&&(transform_space =='base'))
      {
        if(add_mode == 'override')
        {
          this.m_transform = m_transform
        }
        else if(add_mode == 'add')
        {
          // convert in transform space
          let m_current_in_transform_space = this.m_transform
          // transform
          let mt_pos = m_transform.extractPositionMatrix()// pos in transform_space space
          let mt_rot = m_transform.extractRotationMatrix()// rot in m_transform space
          let m_current_in_transform_space_transformed = mt_rot.getMult(m_current_in_transform_space.getMult(mt_pos)) 
          // convert from transform space
          let m_current_transformed =  m_current_in_transform_space_transformed  
          // update class 
          this.m_transform = m_current_transformed      
        }
      }
      else if((matrix_layer == 'anim' )&&(transform_space =='anim'))//self
      {
        this.m_transform = m_transform.getMult(this.m_transform)     
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

    set_scale(s, matrix_layer = 'dyn', transform_space = 'world', add_mode = 'override')
    {
      this.scale = s   
    }     

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
    get_out_rotation(space = 'world')
    {
      let m = this.get_out_matrix(space)
      return m.getRotation()
    }   
    get_out_scale(space = 'world')
    {
      return this.scale
    }      
    
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
      this.scale = s
    }   
    init_out_matrix()
    {
      let m_init = this.get_init_matrix()
      this.set_out_matrix(m_init)
    }    

    ////////////////////////////////////////////////////////////////////////////////// dyn specific
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

    get_visibility()
    {
      if(this.debug_force_visibility)
        return 1
      if( this.visibility && this.visibility_secondary ) 
        return 1
      return 0
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

    /*
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
    */

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
  



    update()
    {
        
      if( !this.do_update )
        return false

      for( let i = 0; i < this.constraints_order.length; i++)
      {
        this.constraints[this.constraints_order[i]].apply()
      }

      if(this.rot_override!=null)
        this.set_out_rotation(this.rot_override, 'world', 'override')
      return true
     
    }
    
    reset_material()
    {
      if( this.mesh_three.shape != null)
        this.mesh_three.shape.material = this.three_material
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
          this.type,
          m,
          this.scale, 
          this.material_three,
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
          this.shadow,)  

        group.add( out.line ) 
      }
      return out
    }

    get_mass()
    {
      if(this.body != null)
        return this.body.mass
      return -1
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
      
      /*
      var children_to_remove = [];
      three_scene.traverse(function(child){
          if(child.name == "inscriptArc"){
            children_to_remove.push(child);
          }
      });
      children_to_remove.forEach(function(child){
          scene.remove(child);
      });
      */
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

      if(this.debug_matrix_info)
        this.draw_text_debug.setup_three(this.mesh_three.group)

    }  

    

    animate_three()
    {

      let pos = this.get_out_position('world')
      let rot = this.get_out_rotation('world')
      let scale = this.scale
      
      let converted_pos = convert_coords_matter_to_three(pos,this.screen_dims)
      this.mesh_three.group.position.x = converted_pos.x()
      this.mesh_three.group.position.y = converted_pos.y()
      this.mesh_three.group.position.z = this.z
      this.mesh_three.group.rotation.z = rot*-1
      this.mesh_three.group.visible = this.get_visibility() == 1   
      this.mesh_three.group.scale.x = scale  
      this.mesh_three.group.scale.y = scale  
      //this.mesh_three.group.scale.z = scale 
      
      
      if(this.material_three!=null)
        this.material_three.update(this.mesh_three.shape,this.draw_count)
  

      if(this.debug_matrix_info)
      {
        console.log('debug_matrix_info')
        let parent_name = 'null'
        if(this.parent != null)
          parent_name = this.parent.name
        let m_parent = this.get_parent_matrix()
        let m_offset = this.m_offset
        let m_transform = this.m_transform
        let m_in = this.get_matrix('anim','world')
        let m_out = this.get_out_matrix()    
        let p_out = this.get_out_position('world')
        let r_out = this.get_out_rotation('world')    
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

      this.draw_count += 1
      
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


    get_args()
    {
      let args = {

        type:this.type,
        name:this.name,
        highlight_selection:this.highlight_selection,    
        m:this.m,
        parent:this.parent,
        m_offset:this.m_offset,
        z:this.z,
        m_shape:this.m_shape,
     
        slop:this.slop,
        extra_rotation:this.extra_rotation,
        rot_override:this.rot_override,
        scale:this.scale,
        constraints_args:this.constraints_args,
        do_shape:this.do_shape,
        do_line:this.do_line,
        bevel:this.bevel,
        color:this.color,
        color_line:this.color_line,
        color_base:this.color_base,
        transparency_activate:this.transparency_activate,
        transparency:this.transparency,
        transparency_line:this.transparency_line,   
        bloom:this.bloom,  
        shader:this.shader,
        castShadow:this.castShadow,
        receiveShadow:this.receiveShadow,
        dynamic:this.dynamic,
        collision:this.collision,
        collision_category:this.collision_category,
        collision_mask:this.collision_mask,
        visibility:this.visibility,
   
        debug_force_visibility:this.debug_force_visibility,
        density:this.density,
        frictionAir:this.frictionAir,
        mass:this.mass,
        screen_dims:this.screen_dims,
        matter_engine:this.matter_engine,
        mouse_constraint:this.mouse_constraint,
        fidget:this.fidget,
        material_three:this.material_three,
        arc_limites:this.arc_limites,
        debug_matrix_info:this.debug_matrix_info,
        debug_matrix_axes:this.debug_matrix_axes,
        debug_cns_axes:this.debug_cns_axes,
        selection_break_length:this.selection_break_length,
      }
      return args

    }

      
    update_instance_is_selected_attr()
    {
      if( 0 < this.instances.length)
      {
        if(this.is_selected)
        {
          this.is_last_instance_selected = true
          for(let inst of this.instances)
            inst.is_last_instance_selected = false
        }
      }
    }



    get_mirror(  axe_x = false, axe_y = true)
    {
      let args = this.get_args()

      let name = args.name
      let parent = args.parent
      let parent_name = parent.name
      let m_offset = args.m_offset
      let m_shape = args.m_shape

      let slop = args.slop
      let extra_rotation = args.extra_rotation
      let rot_override = args.rot_override

      let highlight_selection = args.highlight_selection  
      let highlight_selection_names = []
      for( let i = 0 ; i < highlight_selection.length; i++)
      {
        highlight_selection_names.push( highlight_selection[i].name )   
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

          let bodies_found = this.fidget.bodies_search_by_name( parent_name )
          if( 0 < bodies_found.length )
          {
            let mirrored_body = bodies_found[0]
            parent = mirrored_body
            parent_is_sided = true
          }
        }

        //highlight_selection
        let highlight_selection_mirrored = []
        for( let i = 0 ; i < highlight_selection.length; i++)
        {
          if( highlight_selection_names[i].includes(suffix_axeY[0]) )
          {
            highlight_selection_names[i] = highlight_selection_names[i].replace(suffix_axeY[0],suffix_axeY[1])
            let bodies_found = this.fidget.bodies_search_by_name( highlight_selection_names[i] )
            if( 0 < bodies_found.length )
            {
              let mirrored_body = bodies_found[0]
              highlight_selection_mirrored.push(mirrored_body)
            }  
            else
              highlight_selection_mirrored.push(highlight_selection[i])
          }  
          else
            highlight_selection_mirrored.push(highlight_selection[i])                
        }
        highlight_selection = highlight_selection_mirrored

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
            let bodies_found = this.fidget.bodies_search_by_name( target_names[i] )
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

          let bodies_found = this.fidget.bodies_search_by_name( parent_name )
          if( 0 < bodies_found.length )
          {
            let mirrored_body = bodies_found[0]
            parent = mirrored_body
            parent_is_sided = true
          }
        }
        //highlight_selection
        let highlight_selection_mirrored = []
        for( let i = 0 ; i < highlight_selection.length; i++)
        {
          if( highlight_selection_names[i].includes(suffix_axeX[0]) )
          {
            highlight_selection_names[i] = highlight_selection_names[i].replace(suffix_axeX[0],suffix_axeX[1])
            let bodies_found = this.fidget.bodies_search_by_name( highlight_selection_names[i] )
            if( 0 < bodies_found.length )
            {
              let mirrored_body = bodies_found[0]
              highlight_selection_mirrored.push(mirrored_body)
            }  
            else
              highlight_selection_mirrored.push(highlight_selection[i])
          }  
          else
            highlight_selection_mirrored.push(highlight_selection[i])                
        }
        highlight_selection = highlight_selection_mirrored


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
            let bodies_found = this.fidget.bodies_search_by_name( target_names[i] )
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
        m_offset = m_offset.get_mirror(axe_x,axe_y)

      // m_shape mirrored
      // constraint 


      





      // update args
      args.name = name
      args.parent = parent
      args.m_offset = m_offset
      args.m_shape = m_shape

      args.slop = slop
      args.extra_rotation = extra_rotation
      args.rot_override = rot_override

      args.highlight_selection = highlight_selection
      args.constraints = constraints_args
 
      args.arc_limites = arc_limites


      let body_duplicated = new body_build(args)
      

      
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

        //this.constraints_args.push(connect_to_orig_tx)
        this.constraints_args.push(connect_to_orig_ty)
        //this.constraints_args.push(connect_to_orig_r)

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











