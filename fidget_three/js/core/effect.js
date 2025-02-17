

import Vector from '../utils/vector.js';
import { utils, rad} from '../utils/utils.js';
import { body_build } from './body.js';
import Matrix from '../utils/matrix.js';



export class effect{

  constructor( in_options )
  {

    const defaultOptions = {
        scale_shape: 1,
        parent: null,
        type: 'sparcle_shock',
        name: '',
        trigger_body_min: null,
        trigger_value_min: 1.0,
        trigger_body_max: null,
        trigger_value_max: 1.0,        
        p:new Vector(0,0),
        r:0,
        body:null,  
    };

    const args = { ...defaultOptions, ...in_options };

    this.scale_shape = args.scale_shape
    this.parent = args.parent
    this.type = args.type
    this.name = args.name
    this.trigger_body_min  = args.trigger_body_min
    this.trigger_value_min = args.trigger_value_min
    this.trigger_body_max  = args.trigger_body_max
    this.trigger_value_max = args.trigger_value_max    
    this.p = args.p
    this.r = args.r
   
    this.bodies = []
    if(this.type == 'sparcle_shock')
    {
        this.bodies.push( build_effects_particles_sparcles(args) )
        this.bodies.push( build_effects_particles_shapes(args) )       
        this.bodies.push( [build_effects_wall(args)] )
    }
    else if(this.type == 'trail')
    {
      this.bodies.push( build_effects_trail( args, args.body )  )
    }

    this.count = 0
    this.z = 0
  }

  setup(group_three)
  {
    for( let bodies of this.bodies)
    {
      for( let body of bodies)
      {
        body.render.z = this.z
        body.render.setup_shapes_three(group_three)    
      }
    }
        
  }

  clean(group_three)
  {
    for( let bodies of this.bodies)
      for( let body of bodies)
        body.render.clean_shapes_three(group_three)    
  }


  bodies_update()  
  {
    for( let bodies of this.bodies)
      for( let body of bodies)
        body.physics.update()
  }

  animate_three()
  {
    for( let bodies of this.bodies)
    {
      for( let body of bodies)
      {
        let pos   = body.physics.get_out_position('world')
        let rot   = body.physics.get_out_rotation('world')
        let scale = body.physics.state.scale        
        body.render.animate_three( pos, rot, scale)  
      }
    }

          
  }

  init_physics()  
  {
    for( let bodies of this.bodies)
      for( let body of bodies)
        body.physics.init_physics()
  }


  init_constraints()  
  {
    for( let bodies of this.bodies)
    { 
      for( let body of bodies)
      {
        body.physics.set_out_matrix(body.physics.get_init_matrix())
        body.physics.init_constraints()
      }
    }
  }


  update()
  {     
    //console.log(this.type,this.name,this.count)
    if( this.type == 'sparcle_shock')
    {
        let sparcles = this.bodies[0]
        let shapes   = this.bodies[1]  
        let wall     = this.bodies[2][0]  

        if( wall != null)
            wall.enable(0)
        
        for( let i=0; i < sparcles.length; i++)
            sparcles[i].enable(0) 
        
        for( let i=0; i < shapes.length; i++)
            shapes[i].enable(0)

        if(this.count != 0)
        {
          this.bodies_update() 

            
            if(this.count == 1)  
            {    
              this.bodies_update()   
                for( let i=0; i < sparcles.length; i++)
                {
                    let force = new Vector(0.001, 0)
                    force = force.rotate(sparcles[i].physics.get_out_rotation('world'))
                    let pos = sparcles[i].physics.get_out_position('world')
                    
                    sparcles[i].physics.apply_force( pos, force )
                    shapes[i].physics.apply_force( pos, force.getMult(0.1) )
                }
            }
            
            if( this.count < 10) 
            {
              
                if( wall != null)
                {
                    wall.enable(1)
                    
                    let m = new Matrix(wall.properties.m_shape_init)
                    m = m.scale(0.01+this.count*0.1,1)
                    
                    wall.set_shape_matrix(m)
              
                }
            }
            
            
            if( this.count < 20) 
            {
                for( let i=0; i < sparcles.length; i++)
                    sparcles[i].enable(1)       
            }
            
            
            if( this.count < 40) 
            {
                for( let i=0; i < shapes.length; i++)
                    shapes[i].enable(1)           
            }  
        }  
    

    }
    else if( this.type == 'trail')
    {
      let trails = this.bodies[0]
     
      for( let i=0; i < trails.length; i++)
        trails[i].enable(0)
    
      if(this.count != 0)
      {  
        this.bodies_update() 
        for( let i=0; i < trails.length; i++)
          trails[i].enable(1)   
      }  
    }
  
    if(( this.trigger_body_min != null)&&( this.trigger_body_max != null))
    {
      let coef_min = this.trigger_body_min.get_resolution_coef()
      let coef_max = this.trigger_body_max.get_resolution_coef()
      if(( this.trigger_value_min < coef_min )&&( coef_max < this.trigger_value_max ))
        this.count += 1
      else
        this.count = 0
    }
    else if( this.trigger_body_min != null)
    {
      let coef_min = this.trigger_body_min.get_resolution_coef()
      if( this.trigger_value_min < coef_min )
        this.count += 1
    }
    else if( this.trigger_body_max != null)
    {
      let coef_max = this.trigger_body_max.get_resolution_coef()
      if( coef_max < this.trigger_value_max )
        this.count += 1
      else
        this.count = 0
    }    
    else
    {
      this.count +=1
    }


    
  }


  


  
}




function build_effects_particles_sparcles(opts)
{ 
  let opts_global = {
    screen_dims: opts.screen_dims,
    matter_engine: opts.matter_engine, 
    Mouse: opts.Mouse,
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

    density:0.001, 
                    
  } 

  let om_EA1 = new Matrix()
  om_EA1.setTranslation(opts.p.x(),opts.p.y())
  om_EA1.setRotation(rad(opts.r)+rad(90)) 

  bodies.push(new body_build({ ...oEffectsA,          
                                name: opts.name + 'effects_sparcles1',
                                m_offset:om_EA1,                                                        
                              }))                                            

  om_EA1 = new Matrix()
  om_EA1.setTranslation(opts.p.x(),opts.p.y())
  om_EA1.setRotation(rad(opts.r)+rad(45))

  bodies.push(new body_build({ ...oEffectsA,   
                                name: opts.name + 'effects_sparcles2',
                                m_offset:om_EA1,                                                     
                              })) 
                                        
  om_EA1 = new Matrix()
  om_EA1.setTranslation(opts.p.x(),opts.p.y())
  om_EA1.setRotation(rad(opts.r)+rad(135))

  bodies.push(new body_build({ ...oEffectsA,     
                                name: opts.name + 'effects_sparcles3',
                                m_offset:om_EA1,                                                       
                              })) 

  return bodies                              
}



function build_effects_particles_shapes(opts)
{
  let opts_global = {
    screen_dims: opts.screen_dims,
    matter_engine: opts.matter_engine, 
    Mouse: opts.Mouse,
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
    
    density:0.001,               
  } 

  let om_EA1 = new Matrix()
  om_EA1.setTranslation(opts.p.x(),opts.p.y())
  om_EA1.setRotation(rad(opts.r)+rad(90))                                       

  bodies.push(new body_build({ ...oEffectsA, 
                                name: opts.name + 'effects_particle_shape1',
                                m_offset:om_EA1,                                                
                              }))                                             

  om_EA1 = new Matrix()
  om_EA1.setTranslation(opts.p.x(),opts.p.y())
  om_EA1.setRotation(rad(opts.r)+rad(45))                                       

  bodies.push(new body_build({ ...oEffectsA, 
                                name: opts.name + 'effects_particle_shape2',
                                m_offset:om_EA1,                                                     
                              }))                                             

  om_EA1 = new Matrix()
  om_EA1.setTranslation(opts.p.x(),opts.p.y())
  om_EA1.setRotation(rad(opts.r)+rad(135))                                         

  bodies.push(new body_build({ ...oEffectsA, 
                                name: opts.name + 'effects_particle_shape3',
                                m_offset:om_EA1,                                                   
                              }))                                             


  return bodies                              
}



function build_effects_wall(opts)
{
  let opts_global = {
    screen_dims: opts.screen_dims,
    matter_engine: opts.matter_engine, 
    Mouse: opts.Mouse,
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

                                name: opts.name+'effects_wall',     

                                parent:opts.parent,                                    
                                m_offset:om_EA1,
                                m_shape:m_shape,
                                z:opts.z_depth,
                                type : utils.shape.rectangle,

                                do_shape: true,
                                do_line:false,                                       
                                color:utils.color.white,
                                color_line: utils.color.black,

                                density:0.01,                                                                                
                              }) 
                              

  return body                              
}


function build_effects_trail(opts, body_target)
{
  let opts_global = {
    screen_dims: opts.screen_dims,
    matter_engine: opts.matter_engine, 
    Mouse: opts.Mouse,
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
                    type: body_target.type                                             
  }

  ////////////////////////////////////////////////////////////////////////////////
  let bodies = []

  bodies.push(new body_build({  ...opts_trail, 
                                name: body_target.name + 'effects_trails1',                                       
                                color:utils.color.red,
                                constraints:[
                                  {  name:'point' ,type:'kin_point',target:body_target,  stiffness: 0.15},
                                  {  name:'orient',type:'kin_orient',target:body_target, stiffness: 0.15}, 
                                ],                                                   
                              })) 
                                 
  bodies.push(new body_build({  ...opts_trail,                                 
                                name: body_target.name + 'effects_trails2',        
                                color:utils.color.blue,              
                                constraints:[
                                  {  name:'point' ,type:'kin_point',target:body_target,  stiffness: 0.2},
                                  {  name:'orient',type:'kin_orient',target:body_target, stiffness: 0.2}, 
                                ],                                                          
                              }))  
                                                                                    
  bodies.push(new body_build({  ...opts_trail, 
                                name: body_target.name + 'effects_trails3',    
                                color:utils.color.green,          
                                constraints:[
                                  {  name:'point' ,type:'kin_point',target:body_target,  stiffness: 0.3},
                                  {  name:'orient',type:'kin_orient',target:body_target, stiffness: 0.3}, 
                                ],                                                       
                              }))   
                                            
  return bodies
}
