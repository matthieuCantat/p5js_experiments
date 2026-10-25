
import Matrix2d from '../utils/matrix2d.js';
import Vector2d from '../utils/vector2d.js';


import { windmill_idle } from '../animations/windmill_idle.js';
import { windmill_transformation } from '../animations/windmill_transformation.js';
import { body_jump_happy } from '../animations/body_jump_happy.js';


/*
// anim data
{
    "body_A" : {
        "translateY" : [
            { "t" : 0 , "v" : -200, "in_tan" : { "orient" : "neighbor", "length" : "auto4"}, "out_tan" : { "orient" : "neighbor", "length" : "auto4"} },
        ]
    }
}
// anim baked
{
    "body_A" : [
        { "translateY" : 10, "rotate" : 20 },
         { "translateY" : 15, "rotate" : 20 },
    ]
        
}
*/

async function load_animation() {

    var anim_to_keys = { 
        "body_jump_happy":body_jump_happy,
        "windmill_idle": windmill_idle,
        "windmill_transformation": windmill_transformation,
    }
    /*
    // USE FETCH TO LOAD ANIMATION DATA FROM JSON FILES
    for (const anim_name in anim_to_keys)
    {
        
        const url = `../../animations/${anim_name}.js`; // Replace with the path to your audio file
            
        const response = await fetch(url);
        const anim = await response.json();

        anim_to_keys[anim_name] = anim//await bake_animation(anim)
    }
    */

    return anim_to_keys
}



export class Animation_manager {

    constructor( Game_engine ) {
        this.played = {}
        this.Game_engine = Game_engine
        this.anim_to_keys = null
        this.anim_to_baked = null
    }

    async init() {
        this.anim_to_keys = await load_animation()
        this.anim_to_baked = await bake_animation_keys(this.anim_to_keys)
    }
    
    start( name,
           animation_name
            //fade_in_seconds = 0,
            //loop = false, }
        ){
            this.played[name] = new Animation( this.Game_engine, this.anim_to_baked[animation_name])
            
    }
    
    modif( )
    {
        
    }

    end( name, { fade_out_seconds = 0 } )
    {
        
        this.played[name].start_ending( fade_out_seconds )
    }

    update(  )
    {
        for( let name in this.played )
        {
            if( this.played[name].is_finish )
            {
                delete( this.played[name] )
                continue
            }

            this.played[name].update()
        }
        
    }


}


class Animation
{
    static tangeant_orient_modes = [ 
        'linear', // direction of the other key
        'flat', // flat 
        'neighbor', // direction between next - prev
        'step',//no intepolation
    ]

    static tangeant_length_modes = [
        'auto4',
        'auto2',
               
    ]

    constructor( Game_engine, anim_baked,
    )
    {
        this.is_finish = false

        this.Game_engine = Game_engine

        this.t = 0
        this.anim_data_baked = anim_baked
       
    }

  

    update( t_override = null )
    {
        let _t = this.t
        if( t_override !== null )
            _t = t_override
        
        _t = Math.min(this.anim_data_baked['range'][1], _t )
        _t =  Math.max(this.anim_data_baked['range'][0], _t ) 
        _t = _t- this.anim_data_baked['range'][0]
        
        

        for( let obj_name in this.anim_data_baked['values'] )
        {
            let raw_values = this.anim_data_baked['values'][obj_name][_t]

            if( raw_values === undefined )
                continue

            if( this.Game_engine.Objs[obj_name] === undefined )
                continue

            let m_local_init = this.Game_engine.Objs[obj_name].trsf.get_local_init()
            
            let m_animation = new Matrix2d()
            m_animation.setWithTransformAttr( raw_values  )
            
            let m_local = m_animation.getMult(m_local_init)
            this.Game_engine.Objs[obj_name].trsf.set_local(m_local)
            
            if( raw_values.visibility !== undefined)
            {
                this.Game_engine.Objs[obj_name].shapes_visibility =raw_values.visibility !== 0
            }

            if( raw_values.colorX !== undefined)
            {
                this.Game_engine.Objs[obj_name].shapes_dynamic_data[0].color[0] = raw_values.colorX               
            }
            
            if( raw_values.colorY !== undefined)
            {
                this.Game_engine.Objs[obj_name].shapes_dynamic_data[0].color[1] = raw_values.colorY              
            }
            
            if( raw_values.colorZ !== undefined)
            {
                this.Game_engine.Objs[obj_name].shapes_dynamic_data[0].color[2] = raw_values.colorZ              
            }

            if( raw_values.colorStrokeX !== undefined)
            {
                this.Game_engine.Objs[obj_name].shapes_dynamic_data[0].stroke_color[0] = raw_values.colorStrokeX               
            }
            
            if( raw_values.colorStrokeY !== undefined)
            {
                this.Game_engine.Objs[obj_name].shapes_dynamic_data[0].stroke_color[1] = raw_values.colorStrokeY              
            }
            
            if( raw_values.colorStrokeZ !== undefined)
            {
                this.Game_engine.Objs[obj_name].shapes_dynamic_data[0].stroke_color[2] = raw_values.colorStrokeZ           
            }            
        }
        
       
        this.t += 1
    }

}


async function bake_animation_keys( anim_to_keys )
{
    
        var anim_to_baked = {}
        for (const anim_name in anim_to_keys)
        {
            let anim_data = anim_to_keys[anim_name]
            
            let baked_anim = await bake_animation(anim_data)
            anim_to_baked[anim_name] = baked_anim
        }
        return anim_to_baked
}



async function bake_animation( anim_data )
{
    
    let obj_attr_to_range = {}

    var anim_data_baked = {
        range : [ 999999, 0 ],
        values : {},
    }
    let default_settings = {
        "in_tan" : { 
            "orient" : anim_data.default_settings.in_tan.orient, 
            "length" : anim_data.default_settings.in_tan.length },
        "out_tan" : { 
            "orient" : anim_data.default_settings.out_tan.orient, 
            "length" : anim_data.default_settings.out_tan.length },
        "loop" : anim_data.default_settings.loop,
        "loop_mode" : anim_data.default_settings.loop_mode,
        "loop_range_mode" : anim_data.default_settings.loop_range_mode,
        "offset" : anim_data.default_settings.offset,
    }


    // add offset to every key

    if( default_settings.offset !== undefined )
    {
        for( let obj in anim_data )
        {
            if( obj === 'default_settings')
                continue
            for( let attr in anim_data[obj] )
            {
                for( let i = 0 ; i < anim_data[obj][attr].length ; i++ )
                {
                    anim_data[obj][attr][i].t += default_settings.offset
                }
            }
        }
    }



    // GET RANGE OF EACH ATTRIBUTE
    for( let obj in anim_data )
    {
        if( obj === 'default_settings')
            continue

        obj_attr_to_range[obj] = {}

        for( let attr in anim_data[obj] )
        {
            obj_attr_to_range[obj][attr] = [ 999999, -99990.0 ]
            for( let i = 0 ; i < anim_data[obj][attr].length ; i++ )
            {
                obj_attr_to_range[obj][attr][0] = Math.min(obj_attr_to_range[obj][attr][0], anim_data[obj][attr][i].t )
                obj_attr_to_range[obj][attr][1] = Math.max(obj_attr_to_range[obj][attr][1], anim_data[obj][attr][i].t )
            }
            //console.log(obj,attr,obj_attr_to_range[obj][attr])
            // RANGE
            anim_data_baked['range'][0] = Math.min(anim_data_baked['range'][0], obj_attr_to_range[obj][attr][0] )
            anim_data_baked['range'][1] = Math.max(anim_data_baked['range'][1], obj_attr_to_range[obj][attr][1] )            
        }
    }

    // total range must start at 0
    anim_data_baked['range'][0] = 0

            
    
    // GENERATE ANIM LOOP
    if( ( default_settings.loop !== undefined )&&( 0 < default_settings.loop ) )
    {
        let range_min = anim_data_baked['range'][0]
        let range_max = anim_data_baked['range'][1]
        let range_delta = range_max - range_min

        for( let obj in anim_data )
        {
            if( obj === 'default_settings')
                continue

            for( let attr in anim_data[obj] )
            {
                let range_min_attr = obj_attr_to_range[obj][attr][0]
                let range_max_attr = obj_attr_to_range[obj][attr][1]
                let range_delta_attr = range_max_attr - range_min_attr
                

                var range_current = range_delta_attr
                var range_min_current = range_min_attr
                if( default_settings.loop_range_mode === 'obj' )
                {
                    range_current = range_delta
                    range_min_current = range_min

                    
                    // ADD KEYS at obj boundaries
                    if( range_min != range_min_attr)
                    {
                        let first_value = anim_data[obj][attr][0].v

                        anim_data[obj][attr][0]["in_tan"] = { "orient" : "linear"}

                        anim_data[obj][attr].unshift( { 
                            "t" : range_min , 
                            "v" : first_value,
                            //"in_tan" : { "orient" : "linear"},
                            "out_tan" : { "orient" : "linear"},  
                        } ) 
                    }

                    if( range_max != range_max_attr)
                    {
                        let last_i = anim_data[obj][attr].length-1
                        let last_value = anim_data[obj][attr][last_i].v

                        anim_data[obj][attr][last_i]["out_tan"] = { "orient" : "linear"}

                        anim_data[obj][attr].push( { 
                            "t" : range_max , 
                            "v" : last_value,
                            "in_tan" : { "orient" : "linear"},
                            //"out_tan" : { "orient" : "linear"}, 
                        } ) 
                    }
                    

                }
                let size = anim_data[obj][attr].length
                    
                        
                for( let iter = 0 ; iter < default_settings.loop ; iter++)
                {
                    if(( default_settings.loop_mode === 'pingpong' )&&( iter % 2 === 0 ))
                    {
                        for( let i = size-1 ; -1 < i ; i-- )
                        {
                            let t_offset = range_current * (iter+1)
                            let t_inverse = range_current - ( anim_data[obj][attr][i].t - range_min_current ) + range_min_current
                            let t = t_inverse + t_offset
                            let v = anim_data[obj][attr][i].v
                            let in_tan = anim_data[obj][attr][i].out_tan
                            let out_tan = anim_data[obj][attr][i].in_tan

                            let key = { "t" : t , "v" : v }
                            if( in_tan !== undefined )
                                key.in_tan = in_tan
                            if( out_tan !== undefined )
                                key.out_tan = out_tan
                            anim_data[obj][attr].push( key )    
                        }
                    }
                    else
                    {
                        for( let i = 0 ; i < size ; i++ )
                        {
                            let t_offset = range_current * (iter+1)
                            let t = anim_data[obj][attr][i].t + t_offset
                            let v = anim_data[obj][attr][i].v
                            let in_tan = anim_data[obj][attr][i].in_tan
                            let out_tan = anim_data[obj][attr][i].out_tan

                            let key = { "t" : t , "v" : v }

                            if( in_tan !== undefined )
                                key.in_tan = in_tan

                            if( out_tan !== undefined )
                                key.out_tan = out_tan       
                                       
                            anim_data[obj][attr].push( key )    
                        }
                    }
                    
                }
                
            }

        }

        anim_data_baked['range'][1] = anim_data_baked['range'][1] + range_delta * default_settings.loop
    }


    // remove same time keys
    
    for( let obj in anim_data )
    {
        if( obj === 'default_settings')
            continue

        for( let attr in anim_data[obj] )
        {      
            let t_last = null
            let v_last = null
            var keys_cleaned = []
            for( let key of anim_data[obj][attr] )
            {
                if( ( key.t === t_last )&&( key.v === v_last ))
                    continue
                keys_cleaned.push(key)
                t_last = key.t
                v_last = key.v
            }
            anim_data[obj][attr] = keys_cleaned
        }
    }

    

    
    
    for( let obj in anim_data )
    {
        if( obj === 'default_settings')
            continue

        anim_data_baked['values'][obj] = []
        let attr_to_anim = {}
        for( let attr in anim_data[obj] )
        {
        
            let baked_anim = get_attr_baked_anim( anim_data[obj][attr], default_settings )
        

            attr_to_anim[attr] = []
            // fill from start
            //let delta_from_start = obj_attr_to_range[obj][attr][0] - anim_data_baked['range'][0]
            //for( let i = 0 ; i < delta_from_start ; i++ )
            //    attr_to_anim[attr].push( baked_anim[0] )
        
            // fill with anim
            for( let i = 0 ; i < baked_anim.length ; i++ )
                attr_to_anim[attr].push( baked_anim[i] )
            
            // fill to end
            let delta_from_end = anim_data_baked['range'][1] - obj_attr_to_range[obj][attr][obj_attr_to_range[obj][attr].length-1]
            for( let i = 0 ; i < delta_from_end ; i++ )
                attr_to_anim[attr].push( baked_anim[baked_anim.length-1] )            

        } 
    
        

        let delta = anim_data_baked['range'][1] - 0//anim_data_baked['range'][0]
        for( let i = 0 ; i < delta ; i++ )
        {
            let frame_values = {}
            for( let attr in attr_to_anim )
            {
                frame_values[attr] = attr_to_anim[attr][i]
            }
            anim_data_baked['values'][obj].push(frame_values)
        }
    }
    
    
    anim_data_baked['range'][0] = 0
    return anim_data_baked
}

function hermite_interpolation(
    pA,
    pB,
    tanA,
    tanB,
    interpolation_range,    
)
{
    let SAMPLE_RANGE = 1000// or SECTION TIME DELTA MAX

    let samples = []
    for( let i = 0 ; i < SAMPLE_RANGE; i++ )
    {
        let u = i/(SAMPLE_RANGE-1)
        let p = hermite2D(pA, pB, tanA, tanB, u)
        //let p = bezier2D(pA, pB, tanA, tanB, u)
        samples.push(p)
    }


    let x_range = pB.x - pA.x

    let select_samples = [samples[0]]
    for( let i = 1 ; i < interpolation_range; i++ )
    {
        let x_current = pA.x + x_range * i / (interpolation_range-1)

        for( let j = 0 ; j < samples.length; j++ )
        {
            if( x_current < samples[j].x )
            {
                select_samples.push(samples[j])
                break
            }
            
        }

    }
    select_samples.push(samples[samples.length-1])


    let values = []
    //values.push(pA.y)
    for( let sample of select_samples )
        values.push( sample.y )
    
    /*
    for( let i = 0 ; i < interpolation_range+2 ; i++ )
    {
        if(( i === 0)||(i===interpolation_range+1))
            continue

        

        for( let j = 1; j < samples.length ; j++)
        {
            let last_sample = samples[j-1]
        
            if( i < samples[j].x )
            {
                let samples_interval_range = samples[j].x - last_sample.x
                let coef = (i - last_sample.x) / samples_interval_range
                
                let value = (coef * samples[j].y + ( 1 - coef) * last_sample.y ) 
                values.push(Math.round(value))
                
                break
            }
        }
    }
        */
    //values.push(pB.y)
    
    values.pop()

    return values
}



function hermite2D(p0, p1, m0, m1, t) {
    const t2 = t * t;
    const t3 = t2 * t;


    // Cubic Hermite basis functions
    const h00 =  2 * t3 - 3 * t2 + 1;
    const h10 =      t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 =      t3 -     t2;

    return {
        x: h00 * p0.x 
         + h10 * m0.x
         + h01 * p1.x 
         + h11 * m1.x,

        y: h00 * p0.y 
         + h10 * m0.y
         + h01 * p1.y
         + h11 * m1.y
    };
}

function bezier2D(p0, p1, m0, m1, t) {
    const c0 = p0.getAdd(m0)
    const c1 = p1.getAdd(m1)
    


    const u = 1 - t;
    const u2 = u * u;
    const t2 = t * t;

    const a = u2 * u;
    const b = 3 * u2 * t;
    const c = 3 * u * t2;
    const d = t2 * t;

    return {
        x: a * p0.x + b * c0.x + c * c1.x + d * p1.x,
        y: a * p0.y + b * c0.y + c * c1.y + d * p1.y
    };
}


function build_tangeant( 
    is_inverse_tangeant,
    pA, 
    pB, 
    pA_before, 
    pB_after, 
    tan_info )
{
    var MULT_TAN_LENGTH = 2
    var p = null
    var pTarget = null    
    var pOutside = null
    var coef = null


    if( is_inverse_tangeant)
    {
        p = pB
        pTarget = pA
        pOutside = pB_after
        coef = -1   
    }else{
        p = pA
        pTarget = pB    
        pOutside = pA_before
        coef = 1        
    }

    let v = pTarget.getSub( p )
        

    // ORIENT
    var tanA = null
    
    if (tan_info.orient === 'flat')
    {
        tanA = new Vector2d( v.mag() * MULT_TAN_LENGTH , 0 )
    }
    else if( tan_info.orient === 'linear' )
    {
        tanA = v
    }
    else if( tan_info.orient === 'neighbor' )
    {
        if( pOutside !== null )
        {
            
            tanA = pTarget.getSub(pOutside)
            tanA.normalize()
            tanA.mult( v.mag() * coef * MULT_TAN_LENGTH )
        }
        else
        {
            tanA = v
        }

    }
    else
    {
        tanA = new Vector2d(v.mag()*coef*MULT_TAN_LENGTH,0)
        tanA.rotateDeg(tan_info.orient*coef)
    }
    
    
    // LENGTH
    if( (typeof(tan_info.length) === 'string')&&( tan_info.length.startsWith('auto') ) )
    {
        let l = tanA.mag()/ parseInt( tan_info.length.substring(4) )
        tanA.normalize()
        tanA.mult(l)
    }
    else if( tan_info.length !== undefined )
    {
        tanA.normalize()
        tanA.mult(tan_info.length)
    }
        
        

    return tanA
}

function get_attr_baked_anim( attr_keys, default_settings )
{
    
    let baked_anim = []
    for( let i = 1 ; i < attr_keys.length ; i++ )
    {
        var info = {
            range : null,
            pStart : null,
            pEnd : null,
            pStart_before : null,
            pEnd_after : null,
            tStart : null,
            tEnd : null,
            linear_anim : [],
            
        }

        // INFO - GET BEFORE & AFTER POINTS
        info['range'] = attr_keys[i].t - attr_keys[i-1].t
        
        
        info['pStart'] = new Vector2d(attr_keys[i-1].t, attr_keys[i-1].v)
        info['pEnd'] = new Vector2d(attr_keys[i].t, attr_keys[i].v)
        
        if( 1 < i )
            info['pStart_before'] = new Vector2d(attr_keys[i-2].t, attr_keys[i-2].v)
        
        if( i < attr_keys.length -1 )
            info['pEnd_after'] = new Vector2d(attr_keys[i+1].t, attr_keys[i+1].v)

        
        // INFO - TANGEANT IN OUT INFO

        let out_tan_info = attr_keys[i-1].out_tan
        if( out_tan_info === undefined )
        {
            info['tStart'] = default_settings.out_tan
        }
        else{
            info['tStart'] = {}
            for( let _attr in out_tan_info)
            {
                
                if( out_tan_info[_attr] === undefined)
                    info['tStart'][_attr] = default_settings.out_tan[_attr]
                else
                    info['tStart'][_attr] = out_tan_info[_attr]
            }
        }
        
        let in_tan_info = attr_keys[i].in_tan
        if( in_tan_info === undefined )
        {
            info['tEnd'] = default_settings.in_tan
        }
        else{
            info['tEnd'] = {}
            for( let _attr in in_tan_info)
            {
                if( in_tan_info[_attr] === undefined)
                    info['tEnd'][_attr] = default_settings.in_tan[_attr]
                else
                    info['tEnd'][_attr] = in_tan_info[_attr]
            }
        }  
        
        // INFO - LINEAR ANIMATION
        for( let j = 0 ; j < info['range']; j++)
        {
            let coef = j / (info['range']-1)
            info['linear_anim'].push(info['pStart'].y * ( 1 - coef)  + info['pEnd'].y * coef)
        }

        // COMPUTE BAKED ANIMATION

        let is_step = (info['tStart'].orient === 'step')||(info['tEnd'].orient === 'step')
        let is_linear = (info['tStart'].orient === 'linear')&&(info['tEnd'].orient === 'linear')
        let is_hermite = (info['tStart'].orient === 'neighbor')&&(info['tEnd'].orient === 'neighbor')
        
        if( is_step )
        {
            for( let j = 0 ; j < info['range']; j++)
                baked_anim.push(info['pStart'].y)
    
        }
        else if( is_linear)
        {
            for( let v of info['linear_anim'])
                baked_anim.push( v )
        }
        else
        {
            // IS HERMITE INTERPOLATION or a MIX

            let tanA = build_tangeant( 
                false,
                info['pStart'], 
                info['pEnd'], 
                info['pStart_before'], 
                info['pEnd_after'],
                info['tStart'] )
            
            
            //tanA.log(`${i}`)

            let tanB  = build_tangeant( 
                true,
                info['pStart'], 
                info['pEnd'], 
                info['pStart_before'], 
                info['pEnd_after'],
                info['tEnd'] )

            let hermite_values = hermite_interpolation(
                info['pStart'],
                info['pEnd'],
                tanA,
                tanB,
                info['range']+1,
            )
            
            if( is_hermite )
            {
                for( let v of hermite_values)
                    baked_anim.push( v )
            }
            else
            {

                //linear_anim blend
                for( let j = 0 ; j < info['range']; j++)
                {
                    let value = hermite_values[j]

                    let coef = j/(info['range']-1)
                    if (info['tStart'].orient === 'linear')
                    {
                        value = info['linear_anim'][j] * ( 1 - coef )  + value * coef
                    }
                    
                    if(info['tEnd'].orient === 'linear')
                    {
                        value = info['linear_anim'][j] * coef  + value * ( 1 - coef )
                    }
                    
                    baked_anim.push( value )
                }
            }
            
        }
            

    }  
    
    // bake anim always strart from 0
    for( let i = 0; i < attr_keys[0].t; i++ )
    {
        baked_anim.unshift(attr_keys[0].v)
    }

    
    return baked_anim   
}