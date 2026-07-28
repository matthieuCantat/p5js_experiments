import Vector2d from '../utils/vector2d.js';
import Matrix2d from '../utils/matrix2d.js';
import { project_point_on_line, round } from '../utils/math.js';
import { Logger } from './logger.js';


const logger = new Logger("constraints Manager");

export class Constraints_info
{
    constructor(User, Game_engine, Time)
    {
        logger.info("constructor")

        this.data = []
        this.User = User
        this.Game_engine = Game_engine
        this.Time = Time
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

    setup(raw_data)
    {
        let cns_args = []
        for( let cns_arg of raw_data )
        {
            // Convert to obj 
            if(cns_arg.mode === 'instance')
            {
                for( let i = 0 ; i < cns_arg.objs.length; i++ )
                    cns_arg.objs[i] = this.Objs[cns_arg.objs[i]]
            }
            else if(cns_arg.mode === 'axe')
            {
                if( typeof cns_arg.driver_obj === 'string' ){
                    cns_arg.driver_obj = this.Objs[cns_arg.driver_obj]
                }
                
                for ( let i = 0 ; i < cns_arg.driven_objs.length; i++ )
                    if( typeof cns_arg.driven_objs[i] === 'string' )
                        cns_arg.driven_objs[i] = this.Objs[cns_arg.driven_objs[i]]
            }
            
            cns_args.push( cns_arg )
        }


        logger.info("setup")

        this.data = cns_args   
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

            if( cns.mode === 'connection' )
            {
                let src_attr = cns.src[1]
                let dst_attr = cns.dst[1]

                let expr_txt = ''
                if( dst_attr.slice(-2) == '()' )
                {
                    let dst_attr_modified = dst_attr.slice(0,-2);
                    expr_txt = `dst_obj.${dst_attr_modified}( src_obj.${src_attr} );`;
                }
                else 
                    expr_txt = `dst_obj.${dst_attr} = src_obj.${src_attr} ;`;

                cns.connection_fn = Function("src_obj", "dst_obj", expr_txt);
                
            }  

            if( cns.mode === 'expression' )
            {
                let in_expr_txt = cns.expression

                var in_args = {}    
                for( let attr in cns )
                {
                    if( attr == 'expression' )
                        continue
                    if( attr == 'mode' )
                        continue
                    if( attr == 'out' )
                        continue
                    in_args[attr] = cns[attr]
                }
                
                let out_attr = null
                if( cns.out instanceof Array )
                    out_attr = cns.out[1]
                
                
                let out_info = build_expression_function( in_expr_txt, in_args, out_attr )
                
                cns.expression_fn = out_info.function;
                cns.args_names = out_info.args_names
                
            }                       
        }
    }

    
	// CONSTRAINT
	update()
    {
        if( this.Time.one_update_debug_time_passed )
            logger.info("update");  

        
        for( let cns of this.data )
        {
            if( cns.mode === 'connection' )
            {
                let src_obj = this.Game_engine.Objs[cns.src[0]]
                let dst_obj = this.Game_engine.Objs[cns.dst[0]]

                cns.connection_fn(src_obj, dst_obj)
            }

            if( cns.mode === 'expression' )
            {
                let objs = []
                for( let arg_name of cns.args_names)
                {
                    if( cns[arg_name] == undefined )
                        continue
                    let obj_name = cns[arg_name][0]
                    objs.push(this.Game_engine.Objs[obj_name])
                }
              
                execute_expression_function( cns.expression_fn, objs )

                

            }

            if( cns.mode === 'instance' )
            {
                // GET INDEX OF SELECTED OBJ
                let iMaster = -1
                if( (this.User.Selection.active )&&(this.User.State.isInteracting))
                {
                    for( let i = 0; i < cns.objs.length; i++)
                    {
                        if( this.User.selection_info.obj == cns.objs[i])
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
        

                let vOffsetPos_local = null
                if( cns.v_axe instanceof Vector2d )
                    vOffsetPos_local = cns.p_axe
                else
                    vOffsetPos_local = new Vector2d(cns.p_axe) // if not a vector, convert it to one

                let v_axe_local = null
                if( cns.v_axe instanceof Vector2d )
                    v_axe_local = cns.v_axe
                else
                    v_axe_local = new Vector2d(cns.v_axe) // if not a vector, convert it to one
        
                let vAxe = v_axe_local.getMult( m_driver, true )
                let vOffset = vOffsetPos_local.getMult( m_driver, true )
                let pAxe = vOffset.getAdd( m_driver.get_row(2) )		
                
                // add axe constraint
                let m = cns.driven_objs[0].trsf.get()
                let pDriven = m.get_row(2)
                let pDriven_on_axe = project_point_on_line( pDriven, vAxe, pAxe )
                
                m.setRow(2,pDriven_on_axe)
                

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
                        let pLimit = v_to_limit.getAdd(pAxe)

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
                    

                    m.setRow(2,pDriven_on_axe)    
                }

                


                if( 0 < cns.rotation_constraint_coef )
                {
                    let vX = m.get_row(cns.rotation_constraint_axe)
                    let aDelta = vX.getRotation(vAxe)
                    m.rotate(aDelta*cns.rotation_constraint_coef)
                }

                let user_is_modifying_driven = false;
                if( (this.User.Selection.active )&&(this.User.isInteracting))
                    if( this.User.Selection.obj == cns.driven_objs[0])
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


                    m.setRow(2,pDriven);

                    this.Game_engine.game_time = l_current/step_incr;
                    
                }
                
                cns.driven_objs[0].trsf.set(m)
        
                //return out_info
                    
            }
            

    
        }
    }



}




export function build_expression_function( in_expr_txt, in_args, out_attr)
{
                    
    let expr_elements = in_expr_txt.split(' ')
    let args_names = []
    for( let i = 0 ; i < expr_elements.length; i++ )
    {
        let el = expr_elements[i]
        if( el == '+' || el == '-' || el == '*' || el == '/' || el == '(' || el == ')' )
            continue

        let found = false
        for( let attr in in_args )
        {
            if( attr === el )
            {
                found = true
                break
            }
        }

        if( found )
        {
            
            if( typeof in_args[el] === 'number' )
                expr_elements[i] = `${in_args[el]}`
            else
            {
                expr_elements[i] = `${el}.${in_args[el][1]}`  
                args_names.push(el)
            }
                  
        }

    }
    if( out_attr !== null )
        args_names.push('out')
    
    let in_expr_txt_modified = expr_elements.join(' ')
    

    let expr_txt = ''
    if( out_attr == null )
    {
        expr_txt = `${in_expr_txt_modified} ;`;
    }
    else if( out_attr.slice(-2) == '()' )
    {
        let out_attr_modified = out_attr.slice(0,-2);
        expr_txt = `out.${out_attr_modified}( ${in_expr_txt_modified} );`;
    }
    else
    {
        expr_txt = `out.${out_attr} = ${in_expr_txt_modified} ;`;
    } 
    
    // add math function to args_names
    args_names.push('ctx')

    //console.log(args_names,expr_txt)
    var expression_fn = Function(...args_names, expr_txt);
    return { function : expression_fn, args_names : args_names }
}



export function execute_expression_function( fn, in_values)
{
    var ctx = { round: round }
    in_values.push(ctx)
    
    return fn(...in_values);
}