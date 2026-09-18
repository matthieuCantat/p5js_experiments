
import Vector2d from '../utils/vector2d.js';


var anim_to_baked = { 
    "body_jump_happy":null,
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
            let values = this.anim_data_baked['values'][obj_name][_t]
            let m = this.Game_engine.Objs[obj_name].trsf.get()
            m.setWithTransformAttr( values  )
            this.Game_engine.Objs[obj_name].trsf.set(m)
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

    
    for( let obj in anim_data )
    {
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
    

    
    
    for( let obj in anim_data )
    {
        anim_data_baked['values'][obj] = []
        let attr_to_anim = {}
        for( let attr in anim_data[obj] )
        {
        

            let anim = []
            for( let i = 1 ; i < anim_data[obj][attr].length ; i++ )
            {

                // BEFORE
                let _range = anim_data[obj][attr][i].t - anim_data[obj][attr][i-1].t
                let pA = new Vector2d(anim_data[obj][attr][i-1].t, anim_data[obj][attr][i-1].v)
                let pB = new Vector2d(anim_data[obj][attr][i].t, anim_data[obj][attr][i].v)
                let pA_before = null
                if( 1 < i )
                    pA_before = new Vector2d(anim_data[obj][attr][i-2].t, anim_data[obj][attr][i-2].v)
                
                let pB_after = null
                if( i < anim_data[obj][attr].length -1 )
                    pB_after = new Vector2d(anim_data[obj][attr][i+1].t, anim_data[obj][attr][i+1].v)

                let tanA = build_tangeant( 
                    false,
                    pA, 
                    pB, 
                    pA_before, 
                    pB_after, 
                    anim_data[obj][attr][i-1].in_tan )

                let tanB  = build_tangeant( 
                    true,
                    pA, 
                    pB, 
                    pA_before, 
                    pB_after, 
                    anim_data[obj][attr][i].in_tan )

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
    is_out_tangeant,
    pA, 
    pB, 
    pA_before, 
    pB_after, 
    tan_info )
{
    let p = pA
    let v = pB.getSub( pA )
    
    let coef = 1
    let pOutside = pA_before
    if( is_out_tangeant)
    {
        p = pB
        v = pA.getSub( pB )
        coef = -1
        pOutside = pB_after
    }
        

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
            
            tanA = p.getSub(pOutside)
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

    return tanA
}