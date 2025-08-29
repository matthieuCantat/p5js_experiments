import Vector2d from './vector2d.js';
import Matrix2d from './matrix2d.js';

export class Constraints_info
{
    constructor(User_interaction)
    {
        this.data = []
        this.User_interaction = User_interaction
        /*
        let axe_cns_settings_default = {
			'enable':false,
			'm_driver':new Matrix2d(),
			'v_axe':new Vector2d(1,0),
			'enable_limits':false,
			'limit_min':null,
			'limit_max':null,
			'rotation_constraint_coef':0.0,
			'rotation_constraint_axe':0,
			'dyn_bounce_coef':0,
		}
            */
    }

    setup(data)
    {
        this.data = data   
        // store offset
        for( let cns of this.data )
        {
            if( cns.mode === 'instance' )
            {
                cns.value_base = []
                for( let i = 0 ; i < cns.objs.length; i++)
                {
                    if(  cns.attrs[i] == 'r' )
                        cns.value_base.push(cns.objs[i].m.getRotation())
                    else if( cns.attrs[i] == 'tx')
                        cns.value_base.push(cns.objs[i].m.get_row(2).x)
                    else if( cns.attrs[i] == 'ty')
                        cns.value_base.push(cns.objs[i].m.get_row(2).y)
                }
            }
        }
    }

    
	// CONSTRAINT
	update()
    {
        for( let cns of this.data )
        {
            if( cns.mode === 'instance' )
            {
                // GET INDEX OF SELECTED OBJ
                let iMaster = -1
                if( (this.User_interaction.something_is_selected )&&(this.User_interaction.isInteracting))
                {
                    for( let i = 0; i < cns.objs.length; i++)
                    {
                        if( cns.objs[i] == this.User_interaction.selection_info.obj)
                        {
                            iMaster = i
                            break
                        }
                    }
                }

                if( iMaster == -1)
                    iMaster = 0

                // GET DRIVER VALUE
                let driver_value = 0
                
                if(      cns.attrs[iMaster] == 'r' )driver_value = cns.objs[iMaster].m.getRotation()
                else if( cns.attrs[iMaster] == 'tx')driver_value = cns.objs[iMaster].m.get_row(2).x
                else if( cns.attrs[iMaster] == 'ty')driver_value = cns.objs[iMaster].m.get_row(2).y
                driver_value -= cns.value_base[iMaster]
                driver_value *= cns.mult

                // SET DRIVER VALUE
                for( let i = 0; i < cns.objs.length; i++)
                {
                    if( i == iMaster)
                        continue

                    if( cns.attrs[i] == 'r')
                        cns.objs[i].m.setRotation(cns.value_base[i]+driver_value)
                    else if( cns.attrs[i] == 'tx')
                    {
                        let p = cns.objs[i].m.get_row(2)
                        p.x = cns.value_base[i]+driver_value
                        cns.objs[i].m.setRow(2,p)
                    }	
                    else if( cns.attrs[i] == 'ty')
                    {
                        let p = cns.objs[i].m.get_row(2)
                        p.y  = cns.value_base[i]+driver_value
                        cns.objs[i].m.setRow(2,p)		
                    }	
                }

            }

            if( cns.mode === 'axe' )
            {

                let out_info = {
                    'vCollisionLimit':null
                }
        
                let m_driver = null
                if( cns.driver_obj instanceof Matrix2d)
                    m_driver = cns.driver_obj                   
                else if( cns.driver_obj.m instanceof Matrix2d)
                    m_driver = cns.driver_obj.m             
                else
                    m_driver = new Matrix2d(cns.driver_obj) // if not a matrix, convert it to one
        
                let v_axe = null
                if( cns.v_axe instanceof Vector2d)
                    v_axe = cns.v_axe
                else
                    v_axe = new Vector2d(cns.v_axe) // if not a vector, convert it to one
        
        
        
                let p_driver = m_driver.get_row(2)
                let pAxeWorld = v_axe.getMult(m_driver)
                let vAxeWorld = pAxeWorld.getSub(p_driver)
        
                let vAxeCns = vAxeWorld
                vAxeCns.normalize()
                let pAxeCns = p_driver			
                // add axe constraint
                let pCurrent = cns.driven_obj.m.get_row(2)
        
                let _v = pCurrent.getSub(pAxeCns)
        
                let _v_n = _v.getNormalized()
                let vAxeCn_n = vAxeCns.getNormalized()
                let dot = _v_n.dot(vAxeCn_n)
        
                let pProj = vAxeCns.getMult(_v.mag()*dot).getAdd(pAxeCns)
                
                cns.driven_obj.m.setRow(2,pProj)
        
                if(cns.enable_limits)
                {
                    pCurrent = cns.driven_obj.m.get_row(2)
        
                    // add axe limit
                    let vAxeCenterToCurrent = pCurrent.getSub(pAxeCns)
                    let _dot = vAxeCenterToCurrent.dot(vAxeCns)
        
                    let current_length = vAxeCenterToCurrent.mag()
                    if( _dot < 0 )
                        current_length *= -1
        
                    let l_max = cns.limit_max
                    if((l_max!= null)&&( l_max < current_length ))
                    {
                        let _v = vAxeCns.getMult(l_max)
                        let pLimit = pAxeCns.getAdd(_v)
                        out_info.vCollisionLimit = pLimit.getSub(pCurrent)
                        pCurrent = pLimit
                    }
            
                    let l_min = cns.limit_min
                    if((l_min != null)&&( current_length < l_min ))
                    {
                        let _v = vAxeCns.getMult(l_min)
                        let pLimit = pAxeCns.getAdd(_v)
                        out_info.vCollisionLimit = pLimit.getSub(pCurrent)
                        pCurrent = pLimit
                    }				
                    
                    cns.driven_obj.m.setRow(2,pCurrent)
                }
        
                if( 0 < cns.rotation_constraint_coef )
                {
                    let vX = cns.driven_obj.m.get_row(cns.rotation_constraint_axe)
                    let aDelta = vX.getRotation(vAxeCns)
                    cns.driven_obj.m.rotate(aDelta*cns.rotation_constraint_coef)
                }
        
                //return out_info
                    
            }
            

    
        }
    }



}



