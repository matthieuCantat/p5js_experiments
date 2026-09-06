import Vector2d from '../utils/vector2d.js';
import Matrix2d from '../utils/matrix2d.js';
import { project_point_on_line, round } from '../utils/math.js';
import { Logger } from './logger.js';
import { build_expression_function, execute_expression_function } from './constraint.js';


const logger = new Logger("constraints Manager");

export class EventActions
{
    constructor(Game_engine, Time)
    {
        logger.info("constructor")

        this.data = []
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
        if( raw_data === undefined )
            return false
        


        logger.info("setup")

        this.data = raw_data   
        // store offset
        for( let i = 0 ; i < this.data.length ; i++ )
        {
            this.data[i].action.start.nbr_eval = 0
            this.data[i].action.end.nbr_eval = 0

            
            /*
            // EVENT START FUNTION
            {
                var in_args = {}    
                for( let attr in cns.event.start )
                {
                    if( attr == 'expression' )
                        continue
                    if( attr == 'out' )
                        continue
                    in_args[attr] = cns.event.start[attr]
                }
                
                let out_attr = null
                if( cns.event.start.out instanceof Array )
                    out_attr = cns.event.start.out[1]
                
                let out_info = build_expression_function( cns.event.start.expression, 
                                                        in_args, 
                                                        out_attr )
                
                cns.event.start.expression_fn = out_info.function;
                cns.event.start.args_names = out_info.args_names   
            }    

            // EVENT END FUNTION
            if( cns.event.end !== null )
            {
                var in_args = {}    
                for( let attr in cns.event.end )
                {
                    if( attr == 'expression' )
                        continue
                    if( attr == 'out' )
                        continue
                    in_args[attr] = cns.event.end[attr]
                }
                
                let out_attr = null
                if( cns.event.end.out instanceof Array )
                    out_attr = cns.event.end.out[1]
                
                let out_info = build_expression_function( cns.event.end.expression, 
                                                        in_args, 
                                                        out_attr )
                
                cns.event.end.expression_fn = out_info.function;
                cns.event.end.args_names = out_info.args_names   
            }    
            
            // OUT FUNCTION
            {
                var in_args = {}    
                for( let attr in cns.action )
                {
                    if( attr == 'expression' )
                        continue
                    if( attr == 'out' )
                        continue
                    in_args[attr] = cns.action[attr]
                }
                
                let out_attr = null
                if( cns.action.out instanceof Array )
                    out_attr = cns.action.out[1]
                
                let out_info = build_expression_function( cns.action.expression, 
                                                        in_args, 
                                                        out_attr )
                
                cns.action.expression_fn = out_info.function;
                cns.action.args_names = out_info.args_names
                cns.action.nbr_eval = 0   
            }  
            */   
                                
        }
    }

   
   _extract_replace_with_obj_args( event_fn_info )
   {
       var extracted_args = []
       for( let obj_name of event_fn_info.in_args )
       {
           if( event_fn_info[obj_name] == 'fn' )
               continue
           extracted_args.push(this.Game_engine.Objs[obj_name])
       }
       return extracted_args
   }

	// CONSTRAINT
	update()
    {
        if( this.Time.one_update_debug_time_passed )
            logger.info("update");  

        
        for( let cns of this.data )
        {
            
            var event_start_out = cns.event.start.fn(...this._extract_replace_with_obj_args( cns.event.start ))
            
            var event_end_out = false
            if( cns.event.end !== null )
                event_end_out = cns.event.end.fn(...this._extract_replace_with_obj_args( cns.event.end ))   

            

            var event_conditions_are_valid = event_start_out && !event_end_out
            
            if( event_conditions_are_valid )
            {
                cns.action.start.nbr_eval += 1
                cns.action.end.nbr_eval = 0
            }
            else
            {
                cns.action.start.nbr_eval = 0
                cns.action.end.nbr_eval += 1
            }
                

            //if ( cns.name == 'toto' )
            //    console.log(cns.action.start.nbr_eval, cns.action.end.nbr_eval)

            var duration_end_out = 0 < cns.event.max_duration && cns.event.max_duration < cns.action.start.nbr_eval


            if( event_conditions_are_valid && !duration_end_out )
            {
                cns.action.start.fn(...this._extract_replace_with_obj_args(cns.action.start)) 
            }
            else if ( cns.action.end.nbr_eval === 1 )
            {
                //console.log("END ACTION",cns )
                if( cns.action.end.fn !== undefined )
                    cns.action.end.fn(...this._extract_replace_with_obj_args(cns.action.end)) 
            
                cns.action.end.nbr_eval += 1
            }
            else
            {
                if((cns.action.duration !== undefined )&&( cns.action.end.fn !== undefined ))
                    cns.action.duration.fn(...this._extract_replace_with_obj_args(cns.action.duration)) 

            }
                



        }
    }


    
    
    

}

