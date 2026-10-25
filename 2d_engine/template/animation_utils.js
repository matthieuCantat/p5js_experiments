
export function keys_generate_loop( 
    t_step, 
    values_loop, 
    t_length = 20, 
    t_offset = 0, 
    v_offset = 0 )
{
    //return Array.from({length: t_length}, (_,i) => ({ t : t_start+t_offset*i , v : 255*(i%2) }))

    let keys = []
    for( let i = 0; i < t_length; i++ )
    {
        let t = i*t_step + t_offset;
        let v = values_loop[i%values_loop.length] + v_offset;
        keys.push( { t : t , v : v } );
    }

    return keys
}


export function keys_blend_with_value( keys, value_ref , t_length = 20, mode = 0 )
{
    //return Array.from({length: t_length}, (_,i) => ({ t : t_start+t_offset*i , v : 255*(i%2) }))

    let keys_blended = []
    for( let i = 0; i < t_length; i++ )
    {
        let coef = i/(t_length-1);
        let v = keys[i].v*(1-coef) + value_ref*coef;
        keys_blended.push( { t : keys[i].t , v : v } );
    }

    return keys_blended
}