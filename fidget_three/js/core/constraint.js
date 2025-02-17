
import Vector from '../utils/vector.js';
import Matrix from '../utils/matrix.js';
import { 
  rad, 
  deg, 
  clamp, 
  snap_point_on_line, 
  proj_vector_on_line, 
} from '../utils/utils.js';
import { 
  user_interaction_info,
} from '../core/mouse.js';
//import { join } from 'path';




export function build_body_physics_modifier( body_physics, args)
{

  let cns = null
  if((args.type == 'dyn_point')&&(body_physics.dynamic))
  { 
    cns = new dyn_constraint_build({obj: body_physics, ...args})//build_constraint(this,args)          
  }

  if((args.type == 'dyn_orient')&&(body_physics.dynamic))
  {
    cns = new dyn_constraint_build_custom_orient({obj: body_physics, ...args, y_offset:300})//build_constraint(this,args,offset)                 
  }

  if(args.type == 'kin_point')
  { 
    cns = new constraint_build({obj: body_physics, ...args,do_position:true,do_orientation:false})//build_constraint(this,args)          
  }

  if(args.type == 'kin_orient')
  {
    cns = new constraint_build({obj: body_physics, ...args,do_position:false,do_orientation:true})//build_constraint(this,args,offset)                 
  }

  /////////////////// axe
  if((args.type == 'kin_axe')&&(body_physics.dynamic))
  {
    cns =  new cns_axe({ Follower: body_physics, ...args })   
  }

  if(args.type == 'kin_limit')
  {
    cns =  new limit({ Follower: body_physics, ...args, obj:body_physics })   
  }

  if(args.type == 'connect')
  {
    cns =  new connect({ ...args, obj:body_physics })   
  }

  if(args.type == 'connect_multi')
  {
    cns =  new connect_multi({ ...args, obj:body_physics })   
  }

  return cns

}



export class dyn_constraint_build_custom_orient{
  
  constructor( in_options ){
      

      // args
      const defaultOptions = {
          obj: null,
          target: null,
          stiffness: 0.001,
          stiffness_at_selection: null,
          stiffness_after_selection: null,
          damping: 0.05,
      };
      const args = { ...defaultOptions, ...in_options };

      this.matter_engine = args.obj.ref.matter_engine

      this.obj = args.obj
      this.target = args.target
      this.stiffness = args.stiffness
      this.stiffness_at_selection = args.stiffness_at_selection
      this.stiffness_after_selection = args.stiffness_after_selection
      this.damping = args.damping

      let m_target = null
      if(this.target != null)
        m_target = this.target.physics.get_init_matrix()
      else
        m_target = this.obj.state.m

      let m_obj = this.obj.get_init_matrix()
      //m_target.log()


      this.target_pos_offset = m_obj.getMult(m_target.getInverse())
      

      this.is_enable = true
      this.selection_change_do_rebind = false
      this.selection_occured = false
      
  
  }

  rebind()
  {
    let m_target = this.target.physics.get_out_matrix()
    let m_obj = this.obj.get_out_matrix()
    let m_delta = m_obj.getMult(m_target.getInverse())
    this.target_pos_offset = m_delta
    
  }

  apply()
  {
      if(this.is_enable == false)
          return false

      let m_target_out = null
      if(this.target != null)
        m_target_out = this.target.physics.get_out_matrix()
      else
        m_target_out = this.obj.state.m          
      
      let m_target  = this.target_pos_offset.getMult(m_target_out)
      let m_current = this.obj.get_out_matrix()
      let m_delta = m_target.getMult(m_current.getInverse())
      //let a_delta = m_delta.getRotation()

      let stiffness = this.stiffness
      if(this.stiffness_at_selection != null)
      {
        if((this.obj.state.is_selected)||(this.obj.state.instance_is_selected))
        {
          stiffness = this.stiffness_at_selection
          if( stiffness == 0 )
            this.selection_change_do_rebind = true

          this.selection_occured = true
        }
        else if(this.selection_change_do_rebind)
        {
          this.rebind()
          this.selection_change_do_rebind = false
        }

      
      }


      if(this.stiffness_after_selection != null)
      {
        if((!this.obj.state.is_selected)&&(!this.obj.state.instance_is_selected))
        {
          if(this.selection_occured)
            stiffness = this.stiffness_after_selection
        }
        
      }
      

      if( stiffness == 1.0)
      {
        this.obj.set_out_rotation(m_target.getRotation(),'world', 'override')
      }
      else if( 0.0 < stiffness )
      {
        this.obj.set_anglular_velocity(m_delta.getRotation()*stiffness)
      }
      else
      {
        let m_target = null
        if(this.target != null)
          m_target = this.target.physics.get_init_matrix()
        else
          m_target = this.obj.state.m
  
        let m_obj = this.obj.get_out_matrix()
        //m_target.log()
  
  
        this.target_pos_offset = m_obj.getMult(m_target.getInverse())        
      }

      return true
  }
  enable(value)
  {
      this.is_enable = value
  }

}


export class dyn_constraint_build{
  
    constructor( in_options ){
        

        // args
        const defaultOptions = {
            obj: null,
            obj_pos_offset: new Vector(),
            target: null,
            //target_pos_offset: new Vector(),
            
            stiffness: 0.001,
            stiffness_at_selection: null,
            stiffness_after_selection: null,
            damping: 0.05,
            length: null,
            y_offset:0,
        };
        const args = { ...defaultOptions, ...in_options };

        this.matter_engine = args.obj.ref.matter_engine

        this.obj = args.obj
        this.obj_pos_offset = args.obj_pos_offset
        this.target = args.target
        //this.target_pos_offset = args.target_pos_offset
        
        this.stiffness = args.stiffness
        this.stiffness_at_selection = args.stiffness_at_selection
        this.stiffness_after_selection = args.stiffness_after_selection
        this.damping = args.damping
        this.length = args.length
        this.y_offset = args.y_offset
    
        //compute pos offset
        this.target_pos_offset = new Vector()
        if( this.target != null)
        {
          let m_target = this.target.physics.get_init_matrix()
          let m_obj = this.obj.get_init_matrix()
          let m_delta = m_obj.getMult(m_target.getInverse())
          this.target_pos_offset = m_delta.get_row(2)         
        }

        //build

        var opt = {
            bodyA: this.obj.body,
            pointA: this.obj_pos_offset.get_value(),
            bodyB: null,
            pointB: this.target_pos_offset.get_value(),
            stiffness : this.stiffness,
            damping : this.damping,
        };
        
        if(this.length!=null)
            opt.length = this.length

        if(this.target!=null)
            opt.bodyB = this.target.physics.body
        else
            opt.pointB = this.obj.state.m.get_row(2).get_value()

        opt.pointA.y += this.y_offset
        opt.pointB.y += this.y_offset
        
        if(opt.stiffness == 0)
        {
            opt.stiffness = 0.000001
            opt.damping = 0
        }

        this.cns = Matter.Constraint.create(opt);
        Matter.Composite.add( this.matter_engine.world, [ this.cns ])
 
        this.selection_change_do_rebind = false        
        this.selection_occured = false




    }

    rebind()
    {
      
      let m_target = this.target.physics.get_out_matrix()
      let m_obj = this.obj.get_out_matrix()
      let m_delta = m_obj.getMult(m_target.getInverse())
      this.cns.pointB = m_delta.get_row(2).get_value()
      
    }

    apply()
    {
      
      if(this.stiffness_at_selection != null)
      {
        if((this.obj.state.is_selected)||(this.obj.state.instance_is_selected))
        {
          
          this.cns.stiffness = this.stiffness_at_selection
          if(this.stiffness_at_selection == 0 )
          {
            this.enable(false)
            this.selection_change_do_rebind = true
          }

          this.selection_occured = true
            
        }
        else
        {
          
          this.cns.stiffness = this.stiffness
          if(this.stiffness_at_selection == 0 )
          {
            if( this.selection_change_do_rebind == true )
            {
              this.rebind()
            }

            this.selection_change_do_rebind = false
            
            this.enable(true) 
          }
                     
        }
      }


      if(this.stiffness_after_selection != null)
      {
        if((!this.obj.state.is_selected)&&(!this.obj.state.instance_is_selected))
        {
          if(this.selection_occured)
            this.cns.stiffness = this.stiffness_after_selection
        }
        
      }
        


        //this.cns.pointB = this.pB
    }

    enable(value)
    {
      if( value == false)
      {
        this.cns.stiffness = 0.000001
        this.cns.damping = 0
      }   
      else
      {
        this.cns.stiffness = this.stiffness
        this.cns.damping = this.damping
      }

    }
  
}

  
  
export class cns_axe{

    constructor(in_options)
    {
      const defaultOptions = {
        axe:null,
        Follower:null,
        target:null,
        enable:true,
        vLineBase : null,
        pLineBase : null,
        distPos:null, 
        distNeg:null, 
        fix_angle : true, 
        extra_rotation : 0, 
        pos_override : null, 
        extra_rotation: 0,
        extra_rotation_center:new Vector(0,0), 
        limit_lock: 0,    
        transfer_delta_as_parent_force: true,
      }   
      
      const args = { ...defaultOptions, ...in_options };
  
      this.Follower        = args.Follower
      this.target          = args.target
      this.is_enable       = args.enable
      this.vLineBase       = args.vLineBase 
      this.pLineBase       = args.pLineBase 
      this.distPos         = args.distPos
      this.distNeg         = args.distNeg
      this.fix_angle       = args.fix_angle
      this.extra_rotation  = args.extra_rotation
      this.pos_override    = args.pos_override 
      this.Follower_axe    = args.axe
      this.extra_rotation  = args.extra_rotation 
      this.extra_rotation_center = args.extra_rotation_center 
      this.debug = true  
      this.debug_pts = [null,null]
      this.current_pos = 0
      this.transfer_delta_as_parent_force = args.transfer_delta_as_parent_force

      this.limit_lock = args.limit_lock
      this.is_at_limit = 0
      
      if( ( this.vLine == null )&&( this.Follower_axe != null) )
      {
        this.vLineBase = null
        if( this.Follower_axe == 0 )
          this.vLineBase = new Vector(1,0)
        else
          this.vLineBase = new Vector(0,1)
  
        //if( this.Follower.rot != null)
        //  this.vLineBase.rotate(this.Follower.rot)
      }
  
      if( ( this.pLineBase == null )&&( this.Follower != null) )
        this.pLineBase = this.Follower.get_matrix('anim','world').get_row(2)
  
    }
  
    update_debug()
    {
      let rot = this.extra_rotation 
      let rot_center = this.extra_rotation_center 
      let vLine = new Vector(this.vLineBase)
      let pLine = new Vector(this.pLineBase)
  
      // Update axe postion rotation
      vLine.rotate(rad(rot))
      let vTmp = pLine.getSub(rot_center)
      vTmp.rotate(rad(rot))
      pLine = rot_center.getAdd(vTmp)
  
     // Set limit
     var pLimitPos = new Vector()
     if( this.distPos != null )
     {
       let vToLimit = new Vector(vLine)
       vToLimit.normalize().mult(this.distPos)
       pLimitPos = vToLimit.getAdd(pLine)
     }
  
     var pLimitNeg = new Vector()
     if( this.distNeg != null )
     {
       let vToLimit = new Vector(vLine)
       vToLimit.normalize().mult(this.distNeg*-1)
       pLimitNeg = vToLimit.getAdd(pLine)
     }
  
      // Debug
      if( this.distPos != null )this.debug_pts[0] = pLimitPos
      else                      this.debug_pts[0] = vLine.getMult(width*2).add(pLine)
  
      if( this.distNeg != null )this.debug_pts[1] = pLimitNeg
      else                      this.debug_pts[1] = vLine.getMult(width*-2).add(pLine)
    }
  
    enable(value)
    {
      this.is_enable = value
    }

    update_and_get_current_pos()
    {
      if( this.Follower == null)
        return 0

      let m_parent = this.Follower.get_parent_matrix()

      let m_out = this.Follower.get_out_matrix()
      let p_out = m_out.get_row(2)
      

      let m_init = this.Follower.get_matrix('base','world')
      let p_init = m_init.get_row(2)

  
      let p_rotCenter  = this.extra_rotation_center.getMult(m_parent)

      let pLine = p_init;
      let vTmp = pLine.getSub(p_rotCenter)
      vTmp.rotate(rad(this.extra_rotation))
      pLine = p_rotCenter.getAdd(vTmp)

      let vLine = m_init.get_row(0)
      if( this.Follower_axe == 1 )
        vLine = m_init.get_row(1)
      vLine.rotate(rad(this.extra_rotation))      
      
      var pLimitPos = new Vector()
      if( this.distPos != null )
      {
        let vToLimit = new Vector(vLine)
        vToLimit.normalize().mult(this.distPos)
        pLimitPos = vToLimit.getAdd(pLine)
      }
  
      var pLimitNeg = new Vector()
      if( this.distNeg != null )
      {
        let vToLimit = new Vector(vLine)
        vToLimit.normalize().mult(this.distNeg*-1)
        pLimitNeg = vToLimit.getAdd(pLine)
      }
  
      if((this.limit_lock == 1)&&(this.is_at_limit == 1))
      {
        this.current_pos = 1
        return this.current_pos
      }
      if((this.limit_lock == -1)&&(this.is_at_limit == 1))
      {
        this.current_pos = -1
        return this.current_pos
      }
    
      

      let vDelta_from_line = p_out.getSub(pLine);
      let dot = vDelta_from_line.getNormalized().dot(vLine.getNormalized())

      if(0<dot)
      {
        let vRef = pLimitPos.getSub(pLine)
        if( 0 < vRef.mag() )
        {
          let vCurrent = p_out.getSub(pLine)
          this.current_pos = vCurrent.mag() / vRef.mag() 

        }
        else
          this.current_pos = 0
      
      }
      else
      {
        let vRef = pLimitNeg.getSub(pLine)
        if( 0 < vRef.mag() )
        {
          let vCurrent = p_out.getSub(pLine)
          this.current_pos = vCurrent.mag() / vRef.mag() *-1

        }
        else
          this.current_pos = 0
      }  



      return this.current_pos

    }
  
    apply()
    {
  
      if(( this.Follower == null)||( this.is_enable == false))
        return false


      let m_parent       = this.Follower.get_parent_matrix()

      let m_init       = this.Follower.get_matrix('base','world')
      let p_init       = m_init.get_row(2)
  
      let m_out        = this.Follower.get_out_matrix()
      let p_out_before = m_out.get_row(2)
      let p_out = new Vector(p_out_before)
  
      
      let p_rotCenter  = this.extra_rotation_center.getMult(m_parent)
  
      // local
      let pLine = p_init;
      let vTmp = pLine.getSub(p_rotCenter)
      vTmp.rotate(rad(this.extra_rotation))
      pLine = p_rotCenter.getAdd(vTmp)
  
      let vLine = m_init.get_row(0)
      if( this.Follower_axe == 1 )
        vLine = m_init.get_row(1)
      vLine.rotate(rad(this.extra_rotation))
      
      // get limit
      var pLimitPos = new Vector()
      if( this.distPos != null )
      {
        let vToLimit = new Vector(vLine)
        vToLimit.normalize().mult(this.distPos)
        pLimitPos = vToLimit.getAdd(pLine)
      }
  
      var pLimitNeg = new Vector()
      if( this.distNeg != null )
      {
        let vToLimit = new Vector(vLine)
        vToLimit.normalize().mult(this.distNeg*-1)
        pLimitNeg = vToLimit.getAdd(pLine)
      }

      if((this.limit_lock == 1)&&(this.is_at_limit == 1))
      {
        this.current_pos = 1
        this.Follower.set_out_position(pLimitPos,'world', 'override')
 
        if((this.transfer_delta_as_parent_force)&&(this.Follower.state.is_touch))
        {
          let v_delta = p_out_before.getSub(pLimitPos)
          this.Follower.relations.parent.physics.apply_force(pLimitPos,v_delta)
        }
                
        return true

      }
      
      if((this.limit_lock == -1)&&(this.is_at_limit == -1))
      {
        this.current_pos = 1
        this.Follower.set_out_position(pLimitNeg,'world', 'override')

 
        if((this.transfer_delta_as_parent_force)&&(this.Follower.state.is_touch))
        {
          let v_delta = p_out_before.getSub(pLimitNeg)
          this.Follower.relations.parent.physics.apply_force(pLimitNeg,v_delta)
        }
                
        return true
      }  
      
  
    
      // Set Follower on the line
      let p_out_clst = snap_point_on_line(pLine, vLine, p_out)
  
      if( p_out_clst.is_equal_to( p_out) == false )
      {


        this.Follower.set_out_position(p_out_clst,'world', 'override')

        p_out = p_out_clst
      }
      
      let vel_current  = this.Follower.get_velocity();
      if( ( 0 < vel_current.length )&&( Math.abs(vel_current.dot(vLine)) < 1 ))
        this.Follower.set_velocity(proj_vector_on_line(vLine, vel_current))
  
      
      // Angle
      if( this.fix_angle == true )
      {
        this.Follower.set_out_rotation(rad(this.extra_rotation)+m_init.getRotation(), 'world', 'override')
        this.Follower.set_anglular_velocity((this.Follower.body.angle)*0.01)
      }
      

  
      // apply limit
      let vDelta_from_line = p_out.getSub(pLine);
      let dot = vDelta_from_line.getNormalized().dot(vLine.getNormalized())

      this.is_at_limit = 0
      if(0<dot)
      {
        if( ( this.distPos != null )&&(this.distPos<= vDelta_from_line.mag()) )
        {
          this.Follower.set_out_position(pLimitPos,'world', 'override')
          p_out = pLimitPos
          if(this.limit_lock == 1)
            this.is_at_limit = 1
        }
      }
      else
      {
        if( ( this.distNeg != null )&&(this.distNeg<= vDelta_from_line.mag()) )
        {
          this.Follower.set_out_position(pLimitNeg,'world', 'override')
          p_out = pLimitNeg
          if(this.limit_lock == -1)
            this.is_at_limit = -1
        }
      }
      
      
  
      // Position override
      
      if( this.pos_override != null )
      {
        this.current_pos = this.pos_override
        
        let p_override = pLine;
        if( 0 < this.pos_override )
        {
          let v_tmp = pLimitPos.getSub(pLine).mult(this.pos_override)
          p_override.add(v_tmp)
        }
        else
        {
          let v_tmp = pLimitNeg.getSub(pLine).mult(this.pos_override*-1)
          p_override.add(v_tmp)
        }
        this.Follower.set_out_position(p_override,'world', 'override')
        this.Follower.set_velocity(new Vector())
      }
      else{
  
        if(0<dot)
        {
          let vRef = pLimitPos.getSub(pLine)
          if( 0 < vRef.mag() )
          {
            let vCurrent = p_out.getSub(pLine)
            this.current_pos = vCurrent.mag() / vRef.mag() 
          }
          else
            this.current_pos = 0
        
        }
        else
        {
          let vRef = pLimitNeg.getSub(pLine)
          if( 0 < vRef.mag() )
          {
            let vCurrent = p_out.getSub(pLine)
            this.current_pos = vCurrent.mag() / vRef.mag() *-1
          }
          else
            this.current_pos = 0
        } 
        
      }

    
      if((this.transfer_delta_as_parent_force)&&(this.Follower.stats.is_touch))
      {
        let v_delta = p_out_before.getSub(p_out)
        this.Follower.relations.parent.physics.apply_force(p_out,v_delta)
      }
      
      
      return true
    }
  
  
  
}


export class limit{
  
    constructor( in_options ){
    // Default options
      const defaultOptions = {
        obj:null,
        x_min: null,
        x_max: null, 
        y_min: null,
        y_max: null,                 
        rot_min: null,
        rot_max: null,
        transfer_delta_as_parent_force: true,
        limit_lock: false,
        clockwize_mode: false,
      };
      const args = { ...defaultOptions, ...in_options };
      
      this.obj = args.obj
      this.x_min   = args.x_min
      this.x_max   = args.x_max
      this.y_min   = args.y_min
      this.y_max   = args.y_max      
      this.rot_min = args.rot_min
      this.rot_max = args.rot_max
      this.clockwize_mode = args.clockwize_mode


      this.limit_lock = args.limit_lock
      this.is_at_limit = 0
      this.transfer_delta_as_parent_force = args.transfer_delta_as_parent_force

      this.p_touch_local = null

  
    }

    apply()
    {
        if(this.is_enable == false)
            return false
        
        let m_parent = this.obj.get_parent_matrix()
        let m        = this.obj.get_out_matrix()
        let m_local = m.getMult(m_parent.getInverse())        
        let p = m_local.get_row(2)
        let v = this.obj.get_velocity()
        let a = m_local.getRotation(this.clockwize_mode)
        

        
        if( user_interaction_info.userIsInteracting == false )
          this.p_touch_local = null

        let p_out = null
        let p_out_before = null
        if( this.obj.state.is_touch )
        {
          if(this.p_touch_local==null)
          {
            let p_touch = new Vector(
              user_interaction_info.mouseX,
              user_interaction_info.mouseY)
            this.p_touch_local = p_touch.getMult(m.getInverse())
            p_out = p_touch
            p_out_before = p_touch            
          }
          else
          {
            p_out = this.p_touch_local.getMult(m)
            p_out_before = this.p_touch_local.getMult(m)
          }
        }
  
        let m_limit = m
        if((this.limit_lock)&&(this.is_at_limit == 1))
        {
          a = this.rot_max
          let m_limit_local = new Matrix()
          m_limit_local.setRotation(a)
          m_limit = m_limit_local.getMult(m_parent)            
          this.obj.set_out_rotation(m_limit.getRotation(), 'world', 'override')
          this.obj.set_anglular_velocity(0) 
          
          if((this.transfer_delta_as_parent_force)&&(this.obj.state.is_touch)&&(this.p_touch_local!=null) )
          {
            p_out = this.p_touch_local.getMult(m_limit)
            let v_delta = p_out_before.getSub(p_out)
            this.obj.relations.parent.physics.apply_force(p_out,v_delta)
          }                

          return true           
        }



        if((this.rot_min!=null)&&(this.rot_max!=null)&&(this.clockwize_mode))
        {
          let middle_value = ( (this.rot_min + this.rot_max)/2 + Math.PI %(2*Math.PI) )

          if( middle_value < this.rot_min )
          {
            if( ( middle_value <= a )&&( a <= this.rot_min ))
              a = this.rot_min // found
          }
          else if( this.rot_min < middle_value )
          {
            if( (Math.round(a*100)/100 == Math.round(2*Math.PI*100)/100)||(Math.round(a*100)/100==0))
              a = this.rot_min

            if( ( middle_value <= a )&&( a < 2*Math.PI ))
              a = this.rot_min // found

            if( ( 0 < a )&&( a <= this.rot_min ))
              a = this.rot_min // found              
          }

          if( this.rot_max < middle_value  )
          {
            if( ( this.rot_max <= a )&&( a < middle_value ))
              a = this.rot_max // found
          }
          else if( middle_value < this.rot_max )
          {
            if( (Math.round(a*100)/100 == Math.round(2*Math.PI*100)/100)||(Math.round(a*100)/100==0))
              a = this.rot_max            

            if( ( this.rot_max <= a )&&( a < 2*Math.PI ))
              a = this.rot_max // found

            if( ( 0 < a )&&( a < middle_value ))
              a = this.rot_max // found              
          }

        }
        else
        {
          if(this.rot_min!=null)
            if( a < this.rot_min )
              a = this.rot_min
          
          if(this.rot_max!=null)
            if( this.rot_max < a )
              a = this.rot_max
          
        }

        
        if(a === this.rot_min)
        {
          let m_limit_local = new Matrix()
          m_limit_local.setRotation(a)
          m_limit = m_limit_local.getMult(m_parent)            
          this.obj.set_out_rotation(m_limit.getRotation(), 'world', 'override')
          this.obj.set_anglular_velocity(0)  
          this.is_at_limit = -1   
        }
        else if(a === this.rot_max)
        {
          let m_limit_local = new Matrix()
          m_limit_local.setRotation(a)
          m_limit = m_limit_local.getMult(m_parent)            
          this.obj.set_out_rotation(m_limit.getRotation(), 'world', 'override')
          this.obj.set_anglular_velocity(0)  
          this.is_at_limit = 1   
        }


        if((this.transfer_delta_as_parent_force)&&(this.obj.state.is_touch)&&(this.p_touch_local!=null))
        {
          p_out = this.p_touch_local.getMult(m_limit)
          let v_delta = p_out_before.getSub(p_out)
          this.obj.relations.parent.physics.apply_force(p_out,v_delta)
        }                
      
    
        return true
    }
    enable(value)
    {
        this.is_enable = value
    }
  
}




export class constraint_build{
  
    constructor( in_options ){
        

        // args
        const defaultOptions = {
            obj: null,
            target: null,
            do_position: true,
            do_orientation: true,
            apply_on_input: false,
            stiffness: 1,
            name:'null',
            out_multiplier:1.0,
        };
        const args = { ...defaultOptions, ...in_options };

        
        this.matter_engine = args.obj.ref.matter_engine

        this.obj = args.obj
        this.target = args.target
        let m_target = this.target.physics.get_init_matrix()
        let m_obj = this.obj.get_init_matrix()
        //m_target.log()


        this.target_pos_offset = m_obj.getMult(m_target.getInverse())
        
        this.do_position = args.do_position
        this.do_orientation = args.do_orientation
        this.apply_on_input = args.apply_on_input

        this.is_enable = true
        this.stiffness = args.stiffness
        this.name = args.name
        this.out_multiplier = args.out_multiplier
        
    
    }

    apply()
    {
        if(this.is_enable == false)
            return false


        
        let m_target = this.target.physics.get_out_matrix()
        let m = this.target_pos_offset.getMult(m_target)


        if(this.apply_on_input)
        {
          if(this.do_position)
            this.obj.set_position(m.get_row(2), 'anim', 'world','override')
          if(this.do_orientation)
            this.obj.set_rotation(m.getRotation(),'anim', 'world','override')
        }
        else
        {
          if(this.do_position)
          {
            if( this.stiffness == 1.0 )
            {
              this.obj.set_out_position(m.get_row(2),'world', 'override')
            }
            else
            {
              let p_current = this.obj.get_out_matrix().get_row(2)
              let p_target = m.get_row(2)
              let p_mix = p_target.getMult(this.stiffness ).getAdd( p_current.getMult(1.0-this.stiffness ) )
              this.obj.set_out_position(p_mix,'world', 'override')
            }

          }

          if(this.do_orientation)
          {
            if( this.stiffness == 1.0 )
            {       
              let angle = m.getRotation()
              if(this.obj.name == 'inter_rectangle_T__R_')
              {
                //console.log(this.obj.name, m_target.get_row(0).get_value(),deg(m_target.getRotation()),deg(this.target_pos_offset.getRotation()), m.get_row(0).get_value(),deg(angle)) 
              }
              if(this.obj.name == 'inter_rectangle_T__R_')
              {
                //m_target.log('m_target '+this.target.name )
                //this.target_pos_offset.log('target_pos_offset')
                //m.log('m')
              }
              this.obj.set_out_rotation(angle  ,'world', 'override')   
               
            }
            else{
              let r_current = this.obj.get_out_matrix().getRotation()
              let r_target = m.getRotation()    
              let r_mix = r_target * this.stiffness + r_current * (1.0-this.stiffness )     
              this.obj.set_out_rotation(r_mix,'world', 'override')   
            }

          }

        }


        return true
    }
    enable(value)
    {
        this.is_enable = value
    }
  
}



export class connect{
  
  constructor( in_options ){
  // Default options
    const defaultOptions = {
      obj:null,
      attr:'scale',
      space:'base',
      target:null, 
      target_attr:'ty', 
      target_space:'base',
      target_remap:null, 
      activate_when_target_is_selected:false, 
      instance_mode:false, 
      out_multiplier:1,
      clockwize_mode:false,
    };
    const args = { ...defaultOptions, ...in_options };
    
    this.obj          = args.obj
    this.attr         = args.attr
    this.target       = args.target
    this.space        = args.space
    this.target_attr  = args.target_attr
    this.target_space = args.target_space      
    this.target_remap = args.target_remap
    this.out_multiplier = args.out_multiplier
    this.activate_when_target_is_selected = args.activate_when_target_is_selected
    this.instance_mode = args.instance_mode
    this.clockwize_mode = args.clockwize_mode

    this.value_old = null
 
  }

  get_out_value()
  {

      // GET VALUE
      let m = null
      if( ['tx','ty','r'].includes(this.target_attr) )
      {
        m = this.target.physics.get_out_matrix( this.target_space )
      }

      let value = null
      if( this.target_attr == 'tx'          )value = m.get_row(2).x()      
      if( this.target_attr == 'ty'          )value = m.get_row(2).y()
      if( this.target_attr == 'r'           )value = deg(m.getRotation(this.clockwize_mode))
      if( this.target_attr == 's'           )value = this.target.physics.state.scale
      if( this.target_attr == 'is_selected' )value = this.target.physics.state.is_selected


      //REMAP
      if( this.target_remap != null )
      {
        if(this.target_remap[0] < this.target_remap[1])
        {
          value = clamp( value, this.target_remap[0], this.target_remap[1] ) 
          value = (value-this.target_remap[0])/(this.target_remap[1]-this.target_remap[0])
        }
        else
        {
          value = clamp( value, this.target_remap[1], this.target_remap[0] ) 
          value = (value-this.target_remap[1])/(this.target_remap[0]-this.target_remap[1])          
        }

        value = value*(this.target_remap[3]-this.target_remap[2])+this.target_remap[2]
      }

      if( this.out_multiplier != 1.0)
        value = value*this.out_multiplier
      

      ///////////////////////////////////////////////////////////////
      
      return value
  }

  apply()
  {

      if(this.is_enable == false)
          return false

      let value = this.get_out_value()   

      //SET VALUE
      if( (this.activate_when_target_is_selected)&&(this.target.physics.state.is_selected == false))
        return false
      
      if((this.instance_mode)&&(this.target.physics.state.is_last_instance_selected == false))
        return false


      if( this.attr == 's' )
        this.obj.state.scale = value 
      if( this.attr == 'r' )
        this.obj.set_out_rotation(rad(value),this.space, 'override')  
      if( this.attr == 'tx' )
        this.obj.set_out_position_X(value ,this.space, 'override')  
      if( this.attr == 'ty' )
        this.obj.set_out_position_Y(value ,this.space, 'override')  
      if( this.attr == 'is_selected' )
        this.obj.state.instance_is_selected = value

      return true

  }

  enable(value)
  {
      this.is_enable = value
  }

}




export class connect_multi{
  
  constructor( in_options ){
  // Default options
    const defaultOptions = {
      obj:null,
      attr:'scale',
      space:'base',
      targets:[], 
      targets_attr:[], 
      targets_space:[],
      targets_remap:[], 
      activate_when_target_is_selected:false, 
      instance_mode:false, 
      out_multipliers:[],
    };
    const args = { ...defaultOptions, ...in_options };
    
    this.obj          = args.obj
    this.attr         = args.attr
    this.targets       = args.targets
    this.space        = args.space
    this.targets_attr  = args.targets_attr
    this.targets_space = args.targets_space      
    this.targets_remap = args.targets_remap
    this.out_multipliers = args.out_multipliers
    this.activate_when_target_is_selected = args.activate_when_target_is_selected
    this.instance_mode = args.instance_mode

    this.value_old = null

    this.cns_list = []
    for( let i = 0 ; i < this.targets.length; i++)
    {

      let args_cns = {
        obj:this.obj,
        attr:this.attr,
        space:this.space,
        target:this.targets[i], 
        target_attr:this.targets_attr[i], 
        target_space:this.targets_space[i],
        target_remap:this.targets_remap[i], 
        activate_when_target_is_selected:this.activate_when_target_is_selected, 
        instance_mode:this.instance_mode, 
        //out_multipliers:this.out_multipliers[],        
      }
      this.cns_list.push(new connect(args_cns) )
    }
 
  }

  get_out_value()
  {
    let value = 0
    for( let i = 0 ; i < this.cns_list.length; i++)
    {
      
      //SET VALUE
      if( (this.activate_when_target_is_selected)&&(this.targets[i].physics.state.is_selected == false))
        continue

      if((this.instance_mode)&&(this.targets[i].physics.state.is_last_instance_selected == false))
        continue

      value += this.cns_list[i].get_out_value()

    }
      
    return value
  }

  apply()
  {

      if(this.is_enable == false)
          return false

      let value = this.get_out_value()   


      if( this.attr == 's' )
        this.obj.state.scale = value 
      if( this.attr == 'r' )
        this.obj.set_out_rotation(rad(value),this.space, 'override')  
      if( this.attr == 'tx' )
        this.obj.set_out_position_X(value ,this.space, 'override')  
      if( this.attr == 'ty' )
        this.obj.set_out_position_Y(value ,this.space, 'override')  
      if( this.attr == 'is_selected' )
        this.obj.state.instance_is_selected = value
      
      return true

  }

  enable(value)
  {
      this.is_enable = value
  }

}