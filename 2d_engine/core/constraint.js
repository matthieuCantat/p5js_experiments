import Vector2d from '../utils/vector2d.js';
import Matrix2d from '../utils/matrix2d.js';
import { project_point_on_line, multiply_vector_with_matrix } from '../utils/math.js';

export class Constraints_info
{
    constructor(User_interaction, Game_engine)
    {
        this.data = []
        this.User_interaction = User_interaction
        this.Game_engine = Game_engine
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
            step_incr: null,
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
                        if( this.User_interaction.selection_info.obj == cns.objs[i])
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
                    {
                        cns.objs[i].m.setRotation(cns.value_base[i]+driver_value);
                    }
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
        
                let v_axe_local = null
                if( cns.v_axe instanceof Vector2d )
                    v_axe_local = cns.v_axe
                else
                    v_axe_local = new Vector2d(cns.v_axe) // if not a vector, convert it to one
        
                let vAxe = multiply_vector_with_matrix( v_axe_local, m_driver, true )
                let pAxe = m_driver.get_row(2)		
                
                // add axe constraint
                let pDriven = cns.driven_objs[0].m.get_row(2)
                let pDriven_on_axe = project_point_on_line( pDriven, vAxe, pAxe )
                
                cns.driven_objs[0].m.setRow(2,pDriven_on_axe)

                if(cns.enable_limits)
                {
                    
                    // add axe limit
                    let vAxeCenterToCurrent = pDriven_on_axe.getSub(pAxe)
                    let _dot = vAxeCenterToCurrent.dot(vAxe)
        
                    let current_length = vAxeCenterToCurrent.mag()
                    if( _dot < 0 )
                        current_length *= -1
        
                    let l_max = cns.limit_max
                    if((l_max!= null)&&( l_max < current_length ))
                    {
                        let v_to_limit = vAxe.getMult(l_max)
                        let pLimit = v_to_limit.getAdd(_v)

                        out_info.vCollisionLimit = pLimit.getSub(pDriven_on_axe)
                        pDriven_on_axe = pLimit
                    }
            
                    let l_min = cns.limit_min
                    if((l_min != null)&&( current_length < l_min ))
                    {
                        let v_to_limit = vAxe.getMult(l_min)
                        let pLimit = pAxe.getAdd(v_to_limit)

                        out_info.vCollisionLimit = pLimit.getSub(pDriven_on_axe)
                        pDriven_on_axe = pLimit
                    }				
                    
                    cns.driven_objs[0].m.setRow(2,pDriven_on_axe)    
                }

                


                if( 0 < cns.rotation_constraint_coef )
                {
                    let vX = cns.driven_objs[0].m.get_row(cns.rotation_constraint_axe)
                    let aDelta = vX.getRotation(vAxe)
                    cns.driven_objs[0].m.rotate(aDelta*cns.rotation_constraint_coef)
                }

                let user_is_modifying_driven = false;
                if( (this.User_interaction.something_is_selected )&&(this.User_interaction.isInteracting))
                    if( this.User_interaction.selection_info.obj == cns.driven_objs[0])
                        user_is_modifying_driven = true;


                
                if( cns.hasOwnProperty('step_incr') )
                {
                    // CTRL
                    let anim_speed = 0.05;


                    // PREPARE

                    let step_incr = cns.step_incr;
                    let l_min = cns.limit_min
                    let l_max = cns.limit_max
                    let l_range = l_max - l_min ;

                    let p_min = pAxe.getAdd(vAxe.getMult(l_min))

                    //>>>>>> pCurrent
                    let vAxeCenterToCurrent = pDriven.getSub(p_min)
                    let l_current = vAxeCenterToCurrent.mag();
                    
                    
                    // ADD SPEED 
                    if( 1 <= Math.abs(anim_speed) )
                        l_current += anim_speed*step_incr;
                    else if( Math.abs(anim_speed) < 1 )
                        if( this.Game_engine.update_nbr % (1/Math.abs(anim_speed)) == 0 )
                            l_current += step_incr * Math.sign(anim_speed);
                    
                    // LOOP IT
                    if ( l_current < 0 ) 
                        l_current += l_range;
                    l_current = l_current % l_range;

                    // SNAP
                    l_current = Math.floor(l_current/step_incr) * step_incr;

                    // UDPATE
                    if( user_is_modifying_driven == false)
                        vAxeCenterToCurrent.x = l_current
                        pDriven = vAxeCenterToCurrent.getAdd(p_min); // UPDATE
                        //<<<<<< pCurrent


                    cns.driven_objs[0].m.setRow(2,pDriven);

                    this.Game_engine.game_time = l_current/step_incr;
                    
                }
                
        
                //return out_info
                    
            }
            

    
        }
    }



}



