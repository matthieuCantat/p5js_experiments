
import Vector from './vector.js';
import Matrix from './matrix.js';
import { rad, deg, clamp, snap_point_on_line, proj_vector_on_line, userIsInteracting} from './utils.js';
//import { join } from 'path';




export class dyn_constraint_build_custom_orient{
  
  constructor( in_options ){
      

      // args
      const defaultOptions = {
          obj: null,
          target: null,
          stiffness: 0.001,
          stiffness_at_selection: null,
          damping: 0.05,
      };
      const args = { ...defaultOptions, ...in_options };

      this.matter_engine = args.obj.matter_engine

      this.obj = args.obj
      this.target = args.target
      this.stiffness = args.stiffness
      this.stiffness_at_selection = args.stiffness_at_selection
      this.damping = args.damping

      let m_target = null
      if(this.target != null)
        m_target = this.target.get_init_matrix()
      else
        m_target = this.obj.m

      let m_obj = this.obj.get_init_matrix()
      //m_target.log()


      this.target_pos_offset = m_obj.getMult(m_target.getInverse())
      

      this.is_enable = true
      this.selection_change_do_rebind = false
      
  
  }

  rebind()
  {
    let m_target = this.target.get_out_matrix()
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
        m_target_out = this.target.get_out_matrix()
      else
        m_target_out = this.obj.m          
      
      let m_target  = this.target_pos_offset.getMult(m_target_out)
      let m_current = this.obj.get_out_matrix()
      let m_delta = m_target.getMult(m_current.getInverse())
      //let a_delta = m_delta.getRotation()

      let stiffness = this.stiffness
      if(this.stiffness_at_selection != null)
      {
        if(this.obj.is_selected)
        {
          stiffness = this.stiffness_at_selection
          if( stiffness == 0 )
            this.selection_change_do_rebind = true
        }
        else if(this.selection_change_do_rebind)
        {
          this.rebind()
          this.selection_change_do_rebind = false
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
          m_target = this.target.get_init_matrix()
        else
          m_target = this.obj.m
  
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
            damping: 0.05,
            length: null,
            y_offset:0,
        };
        const args = { ...defaultOptions, ...in_options };

        this.matter_engine = args.obj.matter_engine

        this.obj = args.obj
        this.obj_pos_offset = args.obj_pos_offset
        this.target = args.target
        //this.target_pos_offset = args.target_pos_offset
        
        this.stiffness = args.stiffness
        this.stiffness_at_selection = args.stiffness_at_selection
        this.damping = args.damping
        this.length = args.length
        this.y_offset = args.y_offset
    
        //compute pos offset
        this.target_pos_offset = new Vector()
        if( this.target != null)
        {
          let m_target = this.target.get_init_matrix()
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
            opt.bodyB = this.target.body
        else
            opt.pointB = this.obj.m.get_row(2).get_value()

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




    }

    rebind()
    {
      let m_target = this.target.get_out_matrix()
      let m_obj = this.obj.get_out_matrix()
      let m_delta = m_obj.getMult(m_target.getInverse())
      this.cns.pointB = m_delta.get_row(2).get_value()
    }

    apply()
    {
      if(this.stiffness_at_selection != null)
      {
        if(this.obj.is_selected)
        {
          //console.log(this.obj.name, 'is selected')
          this.cns.stiffness = this.stiffness_at_selection
          if(this.stiffness_at_selection == 0 )
          {
            this.enable(false)
            this.selection_change_do_rebind = true
          }
            
        }
        else
        {
          //console.log(this.obj.name, 'is not selected')
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
      this.transfer_delta_as_parent_force = true
      
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
  
    apply()
    {
  
      if(( this.Follower == null)||( this.is_enable == false))
        return false
  
  
      let m_parent       = this.Follower.get_parent_matrix()
  
      let m_init       = this.Follower.get_matrix('anim','world')
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
        //this.Follower.set_anglular_velocity((this.Follower.body.angle - this.Follower.rot)*0.01)
        this.Follower.set_anglular_velocity((this.Follower.body.angle)*0.01)
      }
      
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
  
      // apply limit
      let vDelta_from_line = p_out.getSub(pLine);
      let dot = vDelta_from_line.getNormalized().dot(vLine.getNormalized())
      if(0<dot)
      {
        if( ( this.distPos != null )&&(this.distPos<= vDelta_from_line.mag()) )
        {
          this.Follower.set_out_position(pLimitPos,'world', 'override')
          p_out = pLimitPos
        }
      }
      else
      {
        if( ( this.distNeg != null )&&(this.distNeg<= vDelta_from_line.mag()) )
        {
          this.Follower.set_out_position(pLimitNeg,'world', 'override')
          p_out = pLimitNeg
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

    
      if((this.transfer_delta_as_parent_force)&&(this.Follower.is_selected))
      {
        let v_delta = p_out_before.getSub(p_out)

        //let m = this.Follower.get_out_matrix()
        //let m_parent = this.Follower.parent.get_out_matrix()
        //let m_delta = m.getMult(m_parent.getInverse())

        this.Follower.parent.apply_force(p_out,v_delta)
        /*
        m_parent = this.Follower.parent.get_out_matrix()
        m = m_delta.getMult(m_parent)

        this.Follower.set_out_matrix(m)
        */


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
      };
      const args = { ...defaultOptions, ...in_options };
      
      this.obj = args.obj
      this.x_min   = args.x_min
      this.x_max   = args.x_max
      this.y_min   = args.y_min
      this.y_max   = args.y_max      
      this.rot_min = args.rot_min
      this.rot_max = args.rot_max
  

  
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
        let a = m_local.getRotation()
        /*
        if((this.x_min!=null)&&( p.x() < p_parent.x()+this.x_min ))
        {
            p.v.x = p_parent.x()+this.x_min
            v.v.x = 0
            this.obj.set_out_position(p,'dyn', 'world', 'override')
            this.obj.set_velocity(v) 
        }  
        if((this.x_max!=null)&&( p_parent.x()+this.x_max < p.x() ))
        {
            p.v.x = p_parent.x()+this.x_max
            v.v.x = 0
            this.obj.set_out_position(p,'world', 'override')
            this.obj.set_velocity(v) 
        }  
        if((this.y_min!=null)&&( p.y() < p_parent.y()+this.y_min ))
        {
            p.v.y = p_parent.y()+this.y_min
            v.v.y = 0
            this.obj.set_out_position(p,'world', 'override')
            this.obj.set_velocity(v) 
        } 
        if((this.y_max!=null)&&( p_parent.y()+this.y_max < p.y() ))
        {
            p.v.y = p_parent.y()+this.y_max
            v.v.y = 0
            this.obj.set_out_position(p,'world', 'override')
            this.obj.set_velocity(v) 
        } 
        */

        if((this.rot_min!=null)&&( a < this.rot_min ))
        {
            a = this.rot_min
            let m_limit_local = new Matrix()
            m_limit_local.setRotation(a)
            let m_limit = m_limit_local.getMult(m_parent)
            this.obj.set_out_rotation(m_limit.getRotation(), 'world', 'override')
            this.obj.set_anglular_velocity(0)

        }    
        if((this.rot_max!=null)&&( this.rot_max < a ))
        {
            a = this.rot_max
            let m_limit_local = new Matrix()
            m_limit_local.setRotation(a)
            let m_limit = m_limit_local.getMult(m_parent)            
            this.obj.set_out_rotation(m_limit.getRotation(), 'world', 'override')
            this.obj.set_anglular_velocity(0)     
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
        };
        const args = { ...defaultOptions, ...in_options };

        this.matter_engine = args.obj.matter_engine

        this.obj = args.obj
        this.target = args.target
        let m_target = this.target.get_init_matrix()
        let m_obj = this.obj.get_init_matrix()
        //m_target.log()


        this.target_pos_offset = m_obj.getMult(m_target.getInverse())
        
        this.do_position = args.do_position
        this.do_orientation = args.do_orientation
        this.apply_on_input = args.apply_on_input

        this.is_enable = true
        this.stiffness = args.stiffness
        
    
    }

    apply()
    {
        if(this.is_enable == false)
            return false

        
        let m_target = this.target.get_out_matrix()
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
              this.obj.set_out_rotation(m.getRotation(),'world', 'override')    
            }
            else{
              let r_current = this.obj.get_out_matrix().getRotation()
              let r_target = m.getRotation()    
              let r_mix = r_target * this.stiffness +r_current * (1.0-this.stiffness )        
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
      target:null, 
      target_attr:'ty', 
      target_space:'local',
      target_remap:null,   
    };
    const args = { ...defaultOptions, ...in_options };
    
    this.obj          = args.obj
    this.attr         = args.attr
    this.target       = args.target
    this.target_attr  = args.target_attr
    this.target_space = args.target_space      
    this.target_remap = args.target_remap

  }

  apply()
  {
      if(this.is_enable == false)
          return false

      let m_parent = this.target.parent.get_out_matrix()
      let m_world = this.target.get_out_matrix().getMult(m_parent.getInverse())
      

      let m = null
      if(this.target_space == 'local')
      {
        let m_init_parent = this.target.parent.get_init_matrix()
        let m_init = this.target.get_init_matrix().getMult(m_init_parent.getInverse())
        m = m_world.getMult(m_init.getInverse())
      }
      else{
        m = m_world
      }

      
 
      let value = null
      if( this.target_attr == 'tx' )
        value = m.get_row(2).x()      
      if( this.target_attr == 'ty' )
        value = m.get_row(2).y()
      if( this.target_attr == 'r' )
        value = deg(m.getRotation())
      if( this.target_attr == 's' )
        value = this.target.scale


      //console.log(value)
      
      if( this.target_remap != null )
      {
        value = clamp( value, this.target_remap[0], this.target_remap[1] ) 
        value = value/(this.target_remap[1]-this.target_remap[0])
        value = value*(this.target_remap[3]-this.target_remap[2])+this.target_remap[2]
      }
      
      

      if( this.attr == 's' )
        this.obj.scale = value 
      if( this.attr == 'r' )
        this.obj.set_out_rotation(rad(value),'world', 'add')  
      if( this.attr == 'tx' )
        this.obj.set_out_position(new Vector(value,0) ,'self', 'add')  
      if( this.attr == 'ty' )
        this.obj.set_out_position(new Vector(0,value) ,'self', 'add')  


      return true

  }

  enable(value)
  {
      this.is_enable = value
  }

}