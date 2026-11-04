
export function keys_generate_loop( 
    step_duration, 
    values_loop, 
    steps_nbr = 20, 
    t_offset = 0, 
    v_offset = 0 )
{
    let keys = []
    let t = 0;
    for( let i = 0; i < steps_nbr; i++ )
    {
        t = i * step_duration + t_offset;
        let v = values_loop[i%values_loop.length] + v_offset;
        keys.push( { t : t , v : v } );
    }


    return keys
}


export function keys_generate_fix_size_loop( 
    total_duration, 
    values_loop,
    mult_loop = 1, 
    t_offset = 0, 
    v_offset = 0,
    merge_first_key = true )
{


    let keys = []
    let t = 0;
    let t_step = total_duration / ( values_loop.length * mult_loop + ( mult_loop - 1) ) ;
    
    for( let iter = 0 ; iter < mult_loop; iter++ )
    {
        for( let i = 0; i < values_loop.length; i++ )
        {
            if( ( merge_first_key )&&( iter !== 0 )&&( i === 0 ) )
                continue
            
            let i_current = iter * values_loop.length + i;
            let v = values_loop[i] + v_offset;
    
            keys.push( { t : i_current*t_step + t_offset , v : v } );
        }
    }
    


    return keys
}



export function keys_blend_with_value( 
    keys, 
    start_value = null,
    start_time = 0,
    start_duration = 20,
    end_value = null,
    end_time = null,
    end_duration = 20 )
{
   
    let keys_blended = keys
    

    //__________________________________________ START OVERRIDE
    if( start_value !== null)
    {
        
        // Remove all keys before start_time
        for( let i = 0; i < keys_blended.length; i++ )
        {
            //console.log( start_value, start_time, start_duration, keys_blended.length )

            if( keys_blended[i].t < start_time )
            {
                keys_blended[i] = { t : keys_blended[i].t , v : start_value }
            }
            else if( ( start_time < keys_blended[i].t )&&( keys_blended[i].t < start_time + start_duration) )
            {
                
                let coef = (keys_blended[i].t - start_time) /start_duration;
                
                let v = start_value*(1-coef) +  keys_blended[i].t*coef;
            
                keys_blended[i] = { t : keys_blended[i].t , v : v }
            }
           
        }
        /*
        // get first value after start_time
        let vFirst = null
        for( let i = 0; i < keys_blended.length; i++ )
        {
            if( keys_blended[i] !== null )
            {
                vFirst = keys_blended[i].v
                break
            }
        }

        // add transition keys
        let key_start_A = { t : start_time , v : start_value }
        let key_start_B = { t : start_time + start_duration , v : vFirst }
           
        keys_blended.unshift( key_start_B )
        keys_blended.unshift( key_start_A )
        
        // Remove null keys
        keys_blended = keys_blended.filter( k => k !== null )
        */
    
    }
    
    //__________________________________________ END OVERRIDE
    if( end_value !== null)
    {
        if( end_time === null )
        {
            end_time = keys_blended[keys_blended.length - 1].t
        }
        
        // Remove all keys before start_time
        for( let i = keys_blended.length - 1; -1 < i; i-- )
        {
            console.log( keys_blended[i].t, end_time,end_duration)
            if( end_time < keys_blended[i].t  )
            {
                keys_blended[i] = { t : keys_blended[i].t , v : end_value }
            }
            else if( ( keys_blended[i].t <= end_time )&&(   end_time - end_duration <= keys_blended[i].t) )
            {
                
                let coef = (end_time - keys_blended[i].t) /end_duration;
                
                
                let v = end_value*(1-coef) +  keys_blended[i].t*coef;
            
                keys_blended[i] = { t : keys_blended[i].t , v : v }
            }
        }
               
    }
    


    return keys_blended
}