
import Vector2d from '../utils/vector2d.js';


var anim_to_baked = { 
    "body_jump_happy":null,
    "windmill_idle":null,
}

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

    for (const anim_name in anim_to_baked)
    {
        
        const url = `../../animations/${anim_name}.json`; // Replace with the path to your audio file
            
        const response = await fetch(url);
        const anim = await response.json();

        anim_to_baked[anim_name] = await bake_animation(anim)
    }
}

// Load animation at startup
load_animation();


export class Animation_manager {

    constructor( Game_engine ) {
        this.played = {}
        this.Game_engine = Game_engine
    }
    
    start( name,
           animation_name
            //fade_in_seconds = 0,
            //loop = false, }
        ){
            this.played[name] = new Animation( this.Game_engine, anim_to_baked[animation_name])
            
    }
    
    modif( )
    {
        
    }

    end( name, { fade_out_seconds = 0 } )
    {
        
        this.played[name].start_ending( fade_out_seconds )
    }

    update()
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

  

    update()
    {
        let _t = this.t
        _t = Math.min(this.anim_data_baked['range'][1], _t )
        _t =  Math.max(this.anim_data_baked['range'][0], _t ) 
        _t = _t- this.anim_data_baked['range'][0]
        
        

        for( let obj_name in this.anim_data_baked['values'] )
        {
            let raw_values = this.anim_data_baked['values'][obj_name][_t]

            if( raw_values === undefined )
                continue

            let m = this.Game_engine.Objs[obj_name].trsf.get_local()
            m.setWithTransformAttr( raw_values  )
            this.Game_engine.Objs[obj_name].trsf.set_local(m)
            
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



async function bake_animation( anim_data )
{
    
    let attr_to_range = {}

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
    }


    for( let obj in anim_data )
    {
        if( obj === 'default_settings')
            continue
        for( let attr in anim_data[obj] )
            {
                attr_to_range[attr] = [ 999999, 0 ]
                for( let i = 0 ; i < anim_data[obj][attr].length ; i++ )
                {
                    attr_to_range[attr][0] = Math.min(attr_to_range[attr][0], anim_data[obj][attr][i].t )
                    attr_to_range[attr][1] = Math.max(attr_to_range[attr][1], anim_data[obj][attr][i].t )
                }
        
                // RANGE
                anim_data_baked['range'][0] = Math.min(anim_data_baked['range'][0], attr_to_range[attr][0] )
                anim_data_baked['range'][1] = Math.max(anim_data_baked['range'][1], attr_to_range[attr][1] )            
            }
    }
            
    

    if( ( default_settings.loop !== undefined )&&( 0 < default_settings.loop ) )
    {
        let range_delta = anim_data_baked['range'][1] - anim_data_baked['range'][0]

        for( let iter = 0 ; iter < default_settings.loop ; iter++)
        {
            for( let obj in anim_data )
            {
                if( obj === 'default_settings')
                    continue
                for( let attr in anim_data[obj] )
                {
                    let range_delta_attr = attr_to_range[attr][1] - attr_to_range[attr][0]
                    let size = anim_data[obj][attr].length
                    for( let i = 1 ; i < size ; i++ )
                    {
                        let t = anim_data[obj][attr][i].t + range_delta_attr * (iter+1)
                        let v = anim_data[obj][attr][i].v
                        anim_data[obj][attr].push( { "t" : t , "v" : v } )    
                    }
                    
                }
            }
        }

        anim_data_baked['range'][1] = anim_data_baked['range'][1] + range_delta * default_settings.loop
    }

    

    
    
    for( let obj in anim_data )
    {
        if( obj === 'default_settings')
            continue

        anim_data_baked['values'][obj] = []
        let attr_to_anim = {}
        for( let attr in anim_data[obj] )
        {
        

            let anim = []
            for( let i = 1 ; i < anim_data[obj][attr].length ; i++ )
            {
                let _range = anim_data[obj][attr][i].t - anim_data[obj][attr][i-1].t
                
                let pA = new Vector2d(anim_data[obj][attr][i-1].t, anim_data[obj][attr][i-1].v)
                let pB = new Vector2d(anim_data[obj][attr][i].t, anim_data[obj][attr][i].v)
                
                let pA_before = null
                if( 1 < i )
                    pA_before = new Vector2d(anim_data[obj][attr][i-2].t, anim_data[obj][attr][i-2].v)
                
                let pB_after = null
                if( i < anim_data[obj][attr].length -1 )
                    pB_after = new Vector2d(anim_data[obj][attr][i+1].t, anim_data[obj][attr][i+1].v)


                // TANGEANT INFO

                let out_tan_info = anim_data[obj][attr][i-1].out_tan
                let out_tan = {}
                if( out_tan_info === undefined ){
                    out_tan = default_settings.out_tan
                }
                else{
                    for( let attr in out_tan_info)
                    {
                        if( out_tan_info.attr === undefined)
                            out_tan[attr] = default_settings.out_tan.attr
                        else
                            out_tan[attr] = out_tan_info.attr
                    }
                }

                let in_tan_info = anim_data[obj][attr][i].in_tan
                let in_tan = {}
                if( in_tan_info === undefined ){
                    in_tan = default_settings.in_tan
                }
                else{
                    for( let attr in in_tan_info)
                    {
                        if( in_tan_info.attr === undefined)
                            in_tan[attr] = default_settings.in_tan.attr
                        else
                        in_tan[attr] = in_tan_info.attr
                    }
                }                    
                if( (out_tan.orient === 'step')||(in_tan.orient === 'step') )
                {
                    for( let i = 0 ; i < _range; i++)
                    {
                        anim.push(pA.y)
                    }
                    continue
                }
                if( (out_tan.orient === 'linear')&&(in_tan.orient === 'linear') )
                    {
                        for( let i = 0 ; i < _range; i++)
                        {
                            let coef = i/(_range-1)
                            anim.push(pA.y * ( 1 - coef)  + pB.y * coef)
                        }
                        continue
                    }

                // BEFORE

                let tanA = build_tangeant( 
                    false,
                    pA, 
                    pB, 
                    pA_before, 
                    pB_after, 
                    out_tan )

                let tanB  = build_tangeant( 
                    true,
                    pA, 
                    pB, 
                    pA_before, 
                    pB_after, 
                    in_tan )

                let out_values = hermite_interpolation(
                    pA,
                    pB,
                    tanA,
                    tanB,
                    _range,
                )
                
                

                for( let value of out_values )
                    anim.push( value )

            }

            

            attr_to_anim[attr] = []
            // fill from start
            let delta_from_start = attr_to_range[attr][0] - anim_data_baked['range'][0]
            for( let i = 0 ; i < delta_from_start ; i++ )
                attr_to_anim[attr].push( anim[0] )
        
            // fill with anim
            for( let i = 0 ; i < anim.length ; i++ )
                attr_to_anim[attr].push( anim[i] )
            
            // fill to end
            let delta_from_end = anim_data_baked['range'][1] - attr_to_range[attr][attr_to_range[attr].length-1]
            for( let i = 0 ; i < delta_from_end ; i++ )
                attr_to_anim[attr].push( anim[anim.length-1] )            

        } 
    
        

        let delta = anim_data_baked['range'][1] - anim_data_baked['range'][0]
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
    

    let samples = []
    let _size = interpolation_range//Math.ceil(1/interpolation_range)
    for( let i = 0 ; i < _size; i++ )
    {
        let u = i/(_size-1)
        let p = hermite2D(pA, pB, tanA, tanB, u)
        samples.push(p)
    }


    let values = []
    //values.push(pA.y)
    for( let sample of samples )
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
        x: h00 * p0.x + h10 * m0.x
         + h01 * p1.x + h11 * m1.x,

        y: h00 * p0.y + h10 * m0.y
         + h01 * p1.y + h11 * m1.y
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
        tanA = new Vector2d(v.mag()*coef,0)
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
            tanA.mult(v.mag())
        }
        else
        {
            tanA = v
        }

    }
    else
    {
        tanA = new Vector2d(v.mag()*coef,0)
        tanA.rotateDeg(tan_info.orient*coef)
    }

    // LENGTH
    if (tan_info.length === 'auto4')
    {
        let l = tanA.mag()/4
        tanA.normalize()
        tanA.mult(l)
    }
    else if( tan_info.length === 'auto2' )
    {
        let l = tanA.mag()/2
        tanA.normalize()
        tanA.mult(l)
    }
    else
    {
        tanA.normalize()
        tanA.mult(tan_info.length)
    }

    if( is_inverse_tangeant )
        console.log(`start t:${p.x} v:${p.y} -> ${tanA.getRotationDeg()}`)
    else
        console.log(`end   t:${p.x} v:${p.y} -> ${tanA.getRotationDeg()}`)    

    return tanA
}