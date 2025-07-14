import Vector2d from './vector2d.js';
import Matrix2d from './matrix2d.js';
import { body, COLORS_TO_RGB,getRandomColor }from './draw.js'
import { interpolateColors } from './math.js';


export class body_effect
{

    effect_types = [
        'disco_ripple',
        'water_ripple',
        'body_color_acid_rainbow',
        'explode',
        'shiny',
        'reflective',
        'shinning_stars',
        'explulse_objects',
        'collision_top',
        'collision_bottom',
        'collision_left',
        'collision_right',
        'explode'
    ]

	constructor( body , effect_bricks_info )
	{
		this.body_ref = body
        this.effect_bricks_info = effect_bricks_info

        //
		this.update_count = 0
        this.duration = 0
		//
        this.cleanning_done = false
        this.effect_bricks = []
		this.background_objs = []
        this.foreground_objs = []

        // GET INFO
        this.init_position = this.body_ref.m.get_row(2)
        this.init_rotation = this.body_ref.m.getRotation()
        this.init_scale = this.body_ref.m.getScale()
        this.init_color = this.body_ref.color
        this.init_color_stroke = this.body_ref.stroke_color

        // SETUP
        this.setup()


	}

    setup()
    {
        for( let effect_brick_info of this.effect_bricks_info )
            this.setup_effects(effect_brick_info)
    }

	update()
	{
		this.update_count += 1
		
		if( this.isFinished() )
        {
            if( this.cleanning_done == false)
            {
                this.body_ref.m.setRow(2,this.init_position)
                this.body_ref.m.setRotation(this.init_rotation)
                this.body_ref.m.setScale(this.init_scale)
                this.body_ref.color = this.init_color
                this.body_ref.stroke_color = this.init_color_stroke

                this.cleanning_done = true

            }            
            //this.body_ref.visibility = true
            return false
        }
        //this.body_ref.visibility = false
        
			
        
        this.update_effects()

      

		return true
	}



	isFinished()
	{
        for( let effect_brick of this.effect_bricks )
            if( effect_brick.isFinished() == false )
                return false
        
		return true
	} 



	draw_background()
	{
		if( this.isFinished() )
			return false

		for( let i = 0; i < this.background_objs.length; i++)
			this.background_objs[i].draw()
		
		return true
	}
	
	draw_foreground()
	{
		for( let i = 0; i < this.foreground_objs.length; i++)
			this.foreground_objs[i].draw()  
	}

	update_effects()
	{
        for( let effect_brick of this.effect_bricks )
            effect_brick.update()
	}
 


    //__________________________________setup_effects
    setup_effects(info)
    {
        const effectBrickFactory = {
            body_transform_bounce   : body_transform_bounce,
            body_transform_shake    : body_transform_shake,
            body_transform_occilate :  body_transform_occilate,
            body_color_acid_rainbow : body_color_acid_rainbow,
            body_color_explosion    : body_color_explosion,
            disco_ripple: disco_ripple,
            water_ripple: water_ripple,
            particles_escape: particles_escape,
            particles_radial_strokes: particles_radial_strokes,
            particles_shiny: particles_shiny,
            particles_new: particles_new,
        };
        
        const EffectBrickClass = effectBrickFactory[info.type];
        if (EffectBrickClass)
            this.effect_bricks.push(new EffectBrickClass(this, info));
    }

}

class effect_brick
{
    constructor( effect_inst, settings )
    {
        const defaultSettings= {}
        this.settings = { ...defaultSettings, ...settings };
        this.Effect = effect_inst
        this.update_count = 0
    }

    isNotStarted()
    {
        let update_count = this.Effect.update_count
        // INIT
        let start = this.settings.start

        if( update_count < start )
            return true

        return false
    }

    isFinished()
    {
        let update_count = this.Effect.update_count

        // INIT
        let duration = this.settings.duration
        let start = this.settings.start
        let end  = start+duration

        if(end < update_count)
            return true

        return false
    }
        
    update()
    {
        return false
    }    
}




/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////




class body_transform_bounce extends effect_brick
{
    constructor( effect_inst, settings )
    {
        super(effect_inst, settings)
        const defaultSettings= {
            start:0,
            duration: 15,
        }
        this.settings = { ...defaultSettings, ...settings };
    }

    update()
    {
        if((this.isNotStarted())||(this.isFinished()))
            return false

        // TIME
        this.update_count = this.Effect.update_count - this.settings.start 

        // BEHAVIOR
        let anim = Math.sin( this.update_count/this.settings.duration*3 )*5
        let scale_offset = new Vector2d( anim, anim )
        let scale = this.Effect.init_scale .getAdd( scale_offset )
        this.Effect.body_ref.m.setScale( scale)

        return true
    }
}


class body_transform_occilate extends effect_brick
{
    constructor( effect_inst, settings )
    {
        super(effect_inst, settings)
        const defaultSettings= {
            start:0,
            duration: 15,
        }
        this.settings = { ...defaultSettings, ...settings };
    }

    update()
    {
        if((this.isNotStarted())||(this.isFinished()))
            return false

        // TIME
        this.update_count = this.Effect.update_count - this.settings.start 

        // BEHAVIOR
        let anim = Math.sin( this.update_count*0.9 )*0.1
        this.Effect.body_ref.m.setRotation( this.Effect.init_rotation + anim)


        return true
    }
}


class body_transform_shake extends effect_brick
{
    constructor( effect_inst, settings )
    {
        super(effect_inst, settings)
        const defaultSettings= {
            start:0,
            duration: 15,
        }
        this.settings = { ...defaultSettings, ...settings };
    }

    update()
    {
        if((this.isNotStarted())||(this.isFinished()))
            return false

        // TIME
        this.update_count = this.Effect.update_count - this.settings.start 

        // BEHAVIOR
        let animX = Math.sin( this.update_count*1.9 )*2.1
        let animY = Math.sin( this.update_count*1.1 )*2.1
        let offset = new Vector2d( animX, animY )
        this.Effect.body_ref.m.setRow(2, this.Effect.init_position.getAdd(offset))

        return true
    }
}



class disco_ripple extends effect_brick
{
    constructor( effect_inst, settings )
    {
        super(effect_inst, settings)
        const defaultSettings= {
            start:0,
            duration: 140,
            speed:10,
            body_color: false,
            stroke_color: true,
        }
        this.settings = { ...defaultSettings, ...settings };



        this.ripples = []
        this.update_counts = []
    }

    update()
    {
        if((this.isNotStarted())||(this.isFinished()))
            return false

        // TIME
        this.update_count = this.Effect.update_count - this.settings.start 

        // BEHAVIOR
        let obj = this.Effect.body_ref.duplicate() 

        if( this.settings.body_color === true )
            obj.color = getRandomColor()
        else
            obj.color = null
        if( this.settings.stroke_color === true )
        {
            obj.stroke_color = getRandomColor()
            obj.stroke_width = 20
        }
            
        

        if( this.update_count < this.settings.duration/2 )
        {
            this.ripples.push( obj )
            this.Effect.background_objs.push( obj ) 
            this.update_counts.push( 0 )
        } 

        for( let i = 0; i < this.ripples.length; i++)
        {

            let anim = this.update_counts[i] *this.settings.speed
            let animated_scale = new Vector2d(
                this.Effect.init_scale.x + anim, 
                this.Effect.init_scale.y + anim)	
            
            
            this.ripples[i].m.setScale(animated_scale)

            this.update_counts[i] += 1
        }
    
        return true
    }
}



class particles_escape extends effect_brick
{
    constructor( effect_inst, settings )
    {
        super(effect_inst, settings)
        const defaultSettings= {
            start:0,
            duration: 100,
            body_color: false,
            stroke_color: true,
        }
        this.settings = { ...defaultSettings, ...settings };

        this.update_counts = []

        let particles_nbr = 20
        let possible_bodies_types = [  
            'rectangle', 
            'circle', 
            'triangle',
            'cross', 
            'star_classic' 
        ]
        
        let size_limits = [ 2.5 , 10.5 ]
        let t_speed_limits = [ 1.0 , 5. ]
        let r_speed_limits = [ 0.01 , 0.2 ]
        let angle_offset = [0.01,1]
        let life_time = [this.settings.duration*0.7, this.settings.duration]
        // build
 
        this.bodies_types = []
        for( let i = 0; i < particles_nbr; i++ )
        {
            let i_random = Math.floor( Math.random()* possible_bodies_types.length )
            this.bodies_types.push( possible_bodies_types[i_random] )
        }
    
        this.particles_settings = []
        for( let type of this.bodies_types )
        {
            let setting = {
                size: Math.random()*(size_limits[1]-size_limits[0]) + size_limits[0],
                t_speed : Math.random()*(t_speed_limits[1]-t_speed_limits[0]) + t_speed_limits[0],
                r_speed : Math.random()*(r_speed_limits[1]-r_speed_limits[0]) + r_speed_limits[0],
                angle_offset : Math.random()*(angle_offset[1]-angle_offset[0]) + angle_offset[0],
                life_time : Math.floor(Math.random()*(life_time[1]-life_time[0]) + life_time[0]),
                body_color: getRandomColor(),
            }
            this.particles_settings.push( setting )
        }   
        

        this.bodies = []
        for( let i = 0; i < this.bodies_types.length; i++ )
        {
            let type = this.bodies_types[i]
            let size_random = this.particles_settings[i].size
            let color = null
            if( this.settings.body_color === true )
                color = this.particles_settings[i].body_color
            let stroke_color = null
            if( this.settings.stroke_color === true )
                stroke_color = this.particles_settings[i].body_color

            console.log( i, color )
            let b = new body(
                { m : new Matrix2d(this.Effect.init_position, 0, size_random), 
                    color: color, 
                    stroke_color:stroke_color,
                    shape_type:type, })
            this.bodies.push( b )
            this.Effect.background_objs.push( b )
        }

        let vUp = new Vector2d(0,1)
        let angle_incr = 3.14*2 / this.bodies.length
        this.dirVectors = []
        this.start_positions = []
        for( let i = 0; i < this.bodies.length; i++ )
        {
            let angle = angle_incr*i + this.particles_settings[i].angle_offset
            let vDir = vUp.getRotated(angle)
            vDir.normalize()
            let p = vDir.getMult(this.Effect.body_ref.m)
            let v = p.getSub(this.Effect.init_position)
            v.normalize()
            this.dirVectors.push( v )
            this.start_positions.push(p)
        }
    }

  
    update()
    {
        if((this.isNotStarted())||(this.isFinished()))
            return false

        // TIME
        this.update_count = this.Effect.update_count - this.settings.start 

        let decrease = Math.max(0,this.settings.duration - this.update_count )/ this.settings.duration
    
        // BEHAVIOR
        for( let i = 0; i < this.bodies.length; i++ )
        {
            if( this.particles_settings[i].life_time< this.update_count )
            {
                this.bodies[i].visibility = false
                continue
            }

            let p = this.start_positions[i]
            let v = this.dirVectors[i]
            ////
            
            let t_anim = this.update_count *this.particles_settings[i].t_speed
            let r_anim = this.update_count *this.particles_settings[i].r_speed
            let pOut = p.getAdd(v.getMult(t_anim))
            this.bodies[i].m.setRow(2,pOut)
            this.bodies[i].m.setRotation(r_anim)
        }
        
	
        return true
    }
}
  


class particles_radial_strokes extends effect_brick
{
    constructor( effect_inst, settings )
    {
        super(effect_inst, settings)
        const defaultSettings= {
            start:0,
            duration: 100,
            body_color: false,
            stroke_color: true,
        }
        this.settings = { ...defaultSettings, ...settings };

        this.update_counts = []

        let particles_nbr = 8
        let possible_bodies_types = [  
            'rectangle', 
            'circle', 
            'triangle',
            'cross', 
            'star_classic' 
        ]
        
        let size_limits = [ 2.5 , 10.5 ]
        let t_speed_limits = [ 1.0 , 5. ]
        let r_speed_limits = [ 0.01 , 0.2 ]
        let angle_offset = [0.0,0]
        let life_time = [this.settings.duration*0.7, this.settings.duration]
        // build
 
        this.bodies_types = []
        for( let i = 0; i < particles_nbr; i++ )
            this.bodies_types.push( "rectangle" )
    
        this.particles_settings = []
        for( let type of this.bodies_types )
        {
            let setting = {
                size: Math.random()*(size_limits[1]-size_limits[0]) + size_limits[0],
                t_speed : Math.random()*(t_speed_limits[1]-t_speed_limits[0]) + t_speed_limits[0],
                r_speed : Math.random()*(r_speed_limits[1]-r_speed_limits[0]) + r_speed_limits[0],
                angle_offset : Math.random()*(angle_offset[1]-angle_offset[0]) + angle_offset[0],
                life_time : Math.floor(Math.random()*(life_time[1]-life_time[0]) + life_time[0]),
                body_color: 'black',//getRandomColor(),
            }
            this.particles_settings.push( setting )
        }   
        

        this.bodies = []
        for( let i = 0; i < this.bodies_types.length; i++ )
        {
            let type = this.bodies_types[i]
            let size_random = new Vector2d( 3,20)                          
            let color = null
            if( this.settings.body_color === true )
                color = this.particles_settings[i].body_color
            let stroke_color = null
            if( this.settings.stroke_color === true )
                stroke_color = this.particles_settings[i].body_color

            console.log( i, color )
            let b = new body(
                { m : new Matrix2d(this.Effect.init_position, 0, size_random), 
                    color: color, 
                    stroke_color:stroke_color,
                    shape_type:type, })
            this.bodies.push( b )
            this.Effect.background_objs.push( b )
        }

        let vUp = new Vector2d(0,1)
        let angle_incr = 3.14*2 / this.bodies.length
        this.dirVectors = []
        this.start_positions = []
        for( let i = 0; i < this.bodies.length; i++ )
        {
            let angle = angle_incr*i + this.particles_settings[i].angle_offset
            let vDir = vUp.getRotated(angle)
            vDir.normalize()
            let p = vDir.getMult(this.Effect.body_ref.m)
            let v = p.getSub(this.Effect.init_position)
            v.normalize()
            this.dirVectors.push( v )
            this.start_positions.push(p)
            this.bodies[i].m.setRotation(angle)
        }
    }

  
    update()
    {
        if((this.isNotStarted())||(this.isFinished()))
            return false

        // TIME
        this.update_count = this.Effect.update_count - this.settings.start 

        let decrease = Math.max(0,this.settings.duration - this.update_count )/ this.settings.duration
    
        // BEHAVIOR
        for( let i = 0; i < this.bodies.length; i++ )
        {
            if( this.particles_settings[i].life_time< this.update_count )
            {
                this.bodies[i].visibility = false
                continue
            }

            let p = this.start_positions[i]
            let v = this.dirVectors[i]
            ////
            
            let t_anim = this.update_count *3.//this.particles_settings[i].t_speed
            let r_anim = this.update_count *this.particles_settings[i].r_speed
            let pOut = p.getAdd(v.getMult(t_anim))
            this.bodies[i].m.setRow(2,pOut)

            let current_scale = this.bodies[i].m.getScale()
            current_scale.y = Math.max(0,current_scale.y - 0.9)
            this.bodies[i].m.setScale( current_scale     )
            if( current_scale.y == 0)
                this.bodies[i].visibility = false
            //this.bodies[i].m.setRotation(r_anim)
        }
        
	
        return true
    }
}
   


class particles_shiny extends effect_brick
{
    constructor( effect_inst, settings )
    {
        super(effect_inst, settings)
        const defaultSettings= {
            start:0,
            duration: 100,
            body_color: true,
            stroke_color: false,
        }
        this.settings = { ...defaultSettings, ...settings };

        this.update_counts = []

        let particles_nbr = 6
        let possible_bodies_types = [  
            'rectangle', 
            'circle', 
            'triangle',
            'cross', 
            'star_classic' 
        ]
        
        let size_limits = [ 2.5 , 10.5 ]
        let t_speed_limits = [ .01 , 0.1 ]
        let r_speed_limits = [ 0.01 , 0.1 ]
        let angle_offset = [0.0,0]
        let life_time = [this.settings.duration*0.7, this.settings.duration]
        // build
 
        this.bodies_types = []
        for( let i = 0; i < particles_nbr; i++ )
            this.bodies_types.push( "star_realistic" )
    
        this.particles_settings = []
        for( let type of this.bodies_types )
        {
            let setting = {
                size: Math.random()*(size_limits[1]-size_limits[0]) + size_limits[0],
                t_speed : Math.random()*(t_speed_limits[1]-t_speed_limits[0]) + t_speed_limits[0],
                r_speed : Math.random()*(r_speed_limits[1]-r_speed_limits[0]) + r_speed_limits[0],
                angle_offset : Math.random()*(angle_offset[1]-angle_offset[0]) + angle_offset[0],
                life_time : Math.floor(Math.random()*(life_time[1]-life_time[0]) + life_time[0]),
                body_color: 'white',//getRandomColor(),
            }
            this.particles_settings.push( setting )
        }   
        

        this.bodies = []
        for( let i = 0; i < this.bodies_types.length; i++ )
        {
            let type = this.bodies_types[i]
            let size_random = 20                        
            let color = null
            if( this.settings.body_color === true )
                color = this.particles_settings[i].body_color
            let stroke_color = null
            if( this.settings.stroke_color === true )
                stroke_color = this.particles_settings[i].body_color

            console.log( i, color )
            let b = new body(
                { m : new Matrix2d(this.Effect.init_position, 0, size_random), 
                    color: color, 
                    stroke_color:stroke_color,
                    shape_type:type, })
            this.bodies.push( b )
            this.Effect.foreground_objs.push( b )
        }

        let vUp = new Vector2d(0,1)
        let angle_incr = 3.14*2 / this.bodies.length
        this.dirVectors = []
        this.start_positions = []
        for( let i = 0; i < this.bodies.length; i++ )
        {
            let angle = angle_incr*i + this.particles_settings[i].angle_offset
            let vDir = vUp.getRotated(angle)
            vDir.normalize()
            let p = vDir.getMult(this.Effect.body_ref.m)
            let v = p.getSub(this.Effect.init_position)
            v.normalize()
            this.dirVectors.push( v )
            this.start_positions.push(p)
            this.bodies[i].m.setRotation(angle)
        }
    }

  
    update()
    {
        if((this.isNotStarted())||(this.isFinished()))
            return false

        // TIME
        this.update_count = this.Effect.update_count - this.settings.start 

        let decrease = Math.max(0,this.settings.duration - this.update_count )/ this.settings.duration
    
        // BEHAVIOR
        for( let i = 0; i < this.bodies.length; i++ )
        {
            if( this.particles_settings[i].life_time< this.update_count )
            {
                this.bodies[i].visibility = false
                continue
            }

            let p = this.start_positions[i]
            let v = this.dirVectors[i]
            ////
            
            let t_anim = this.update_count *3.//this.particles_settings[i].t_speed
            let r_anim = this.update_count *this.particles_settings[i].r_speed
            let pOut = p//.getAdd(v.getMult(t_anim))
            this.bodies[i].m.setRow(2,pOut)
            this.bodies[i].m.setRotation(r_anim)
            let s_anim = Math.max(0,Math.sin(this.update_count*this.particles_settings[i].t_speed))
            this.bodies[i].m.setScale(this.Effect.init_scale.getMult(s_anim))

        }
        
	
        return true
    }
}
   


class particles_new extends effect_brick
{
    constructor( effect_inst, settings )
    {
        super(effect_inst, settings)
        const defaultSettings= {
            start:0,
            duration: 100,
            body_color: true,
            stroke_color: false,
        }
        this.settings = { ...defaultSettings, ...settings };

        this.update_counts = []

        let particles_nbr = 6
        let possible_bodies_types = [  
            'rectangle', 
            'circle', 
            'triangle',
            'cross', 
            'star_classic' 
        ]
        
        let size_limits = [ 2.5 , 10.5 ]
        let t_speed_limits = [ .05 , 0.1 ]
        let r_speed_limits = [ 0.01 , 0.1 ]
        let angle_offset = [-0.5,0.5]
        let life_time = [this.settings.duration*0.7, this.settings.duration]
        // build
 
        this.bodies_types = []
        for( let i = 0; i < particles_nbr; i++ )
            this.bodies_types.push( "star_ai" )
    
        this.particles_settings = []
        for( let type of this.bodies_types )
        {
            let setting = {
                size: Math.random()*(size_limits[1]-size_limits[0]) + size_limits[0],
                t_speed : Math.random()*(t_speed_limits[1]-t_speed_limits[0]) + t_speed_limits[0],
                r_speed : Math.random()*(r_speed_limits[1]-r_speed_limits[0]) + r_speed_limits[0],
                angle_offset : Math.random()*(angle_offset[1]-angle_offset[0]) + angle_offset[0],
                life_time : Math.floor(Math.random()*(life_time[1]-life_time[0]) + life_time[0]),
                body_color: 'white',//getRandomColor(),
            }
            this.particles_settings.push( setting )
        }   
        

        this.bodies = []
        for( let i = 0; i < this.bodies_types.length; i++ )
        {
            let type = this.bodies_types[i]
            let size_random = 20                        
            let color = null
            if( this.settings.body_color === true )
                color = this.particles_settings[i].body_color
            let stroke_color = null
            if( this.settings.stroke_color === true )
                stroke_color = this.particles_settings[i].body_color

            console.log( i, color )
            let b = new body(
                { m : new Matrix2d(this.Effect.init_position, 0, size_random), 
                    color: color, 
                    stroke_color:stroke_color,
                    shape_type:type, })
            this.bodies.push( b )
            this.Effect.foreground_objs.push( b )
        }

        let vUp = new Vector2d(0,1)
        let angle_incr = 3.14*2 / this.bodies.length
        this.dirVectors = []
        this.start_positions = []
        for( let i = 0; i < this.bodies.length; i++ )
        {
            let angle = angle_incr*i + this.particles_settings[i].angle_offset
            let vDir = vUp.getRotated(angle)
            vDir.normalize()
            let p = vDir.getMult(this.Effect.body_ref.m)
            let v = p.getSub(this.Effect.init_position)
            v.normalize()
            this.dirVectors.push( v )
            this.start_positions.push(p)
            //this.bodies[i].m.setRotation(angle)
        }
    }

  
    update()
    {
        if((this.isNotStarted())||(this.isFinished()))
            return false

        // TIME
        this.update_count = this.Effect.update_count - this.settings.start 

        let decrease = Math.max(0,this.settings.duration - this.update_count )/ this.settings.duration
    
        // BEHAVIOR
        for( let i = 0; i < this.bodies.length; i++ )
        {
            if( this.particles_settings[i].life_time< this.update_count )
            {
                this.bodies[i].visibility = false
                continue
            }

            let p = this.start_positions[i]
            let v = this.dirVectors[i]
            ////
            
            let t_anim = this.update_count *3.//this.particles_settings[i].t_speed
            let r_anim = this.update_count *this.particles_settings[i].r_speed
            let pOut = p//.getAdd(v.getMult(t_anim))
            this.bodies[i].m.setRow(2,pOut)
            //this.bodies[i].m.setRotation(r_anim)
            let s_anim = Math.max(0,Math.sin(this.update_count*this.particles_settings[i].t_speed)*0.5)
            this.bodies[i].m.setScale(this.Effect.init_scale.getMult(s_anim))

        }
        
	
        return true
    }
}
   




class water_ripple extends effect_brick
{
    constructor( effect_inst, settings )
    {
        super(effect_inst, settings)
        const defaultSettings= {
            start:0,
            duration: 50,
            speed:10,
        }
        this.settings = { ...defaultSettings, ...settings };

        this.update_counts = []

        // build
        this.back_body = this.Effect.body_ref.duplicate()
        this.back_body.color = null
        this.Effect.background_objs.push( this.back_body )       
    }

  
    update()
    {
        if((this.isNotStarted())||(this.isFinished()))
            return false

        // TIME
        this.update_count = this.Effect.update_count - this.settings.start 

        // BEHAVIOR
        let anim = this.update_count *this.settings.speed * 0.1
        let animated_scale = new Vector2d(
            this.Effect.init_scale.x + anim, 
            this.Effect.init_scale.y + anim)	
        
        this.back_body.m.setScale(animated_scale)
        this.back_body.stroke_width = Math.max(0.01,10 - this.update_count*0.25)
    
        return true
    }
}
   


class body_color_acid_rainbow extends effect_brick
{
    constructor( effect_inst, settings )
    {
        super(effect_inst, settings)
        const defaultSettings= {
            start:0,
            duration: 50,
            speed:10,
        }
        this.settings = { ...defaultSettings, ...settings };
    }

    update()
    {
        if((this.isNotStarted())||(this.isFinished()))
            return false

        // TIME
        this.update_count = this.Effect.update_count - this.settings.start 

        // BEHAVIOR

        let animR = (255/2)+Math.sin(this.update_count*0.2)*255/2
        let animG = (255/2)+Math.sin(this.update_count*0.4)*255/2
        let animB = (255/2)+Math.sin(this.update_count*0.3)*255/2

        let animStrokeR = (255/2)+Math.sin(this.update_count*0.4)*255/2
        let animStrokeG = (255/2)+Math.sin(this.update_count*0.3)*255/2
        let animStrokeB = (255/2)+Math.sin(this.update_count*0.2)*255/2

        this.Effect.body_ref.color = "rgb("+animR+", "+animG+", "+animB+")"
        this.Effect.body_ref.stroke_color = "rgb("+animStrokeR+", "+animStrokeG+", "+animStrokeB+")"
        

        return true
    }
}



class body_color_explosion extends effect_brick
{
    constructor( effect_inst, settings )
    {
        super(effect_inst, settings)
        const defaultSettings= {
            start:0,
            duration: 100,
            speed:10,
        }
        this.settings = { ...defaultSettings, ...settings };
    }

    update()
    {
        if((this.isNotStarted())||(this.isFinished()))
            return false

        // TIME
        this.update_count = this.Effect.update_count - this.settings.start 

        // BEHAVIOR
        let color_base = null
        if( this.Effect.init_color.startsWith('rgb('))
            color_base = this.Effect.init_color.match(/\d+/g).map(Number);
        else
            color_base = COLORS_TO_RGB[this.Effect.init_color]
        let color_yellow = [255, 255, 0]
        let color_white = [255, 255, 255]

        let body_color_anim = interpolateColors( 
            this.update_count, 
            [0,10,20,30,40], 
            [color_base, color_yellow,color_white,color_yellow,color_base] )

        this.Effect.body_ref.color = "rgb("+body_color_anim[0]+", "+body_color_anim[1]+", "+body_color_anim[2]+")"
   
        let stroke_color_anim = interpolateColors( 
            this.update_count-10, 
            [0,10,20,30,40],  
            [[0,0,0], color_yellow,color_white,color_yellow,[0,0,0]] )

        this.Effect.body_ref.stroke_color = "rgb("+stroke_color_anim[0]+", "+stroke_color_anim[1]+", "+stroke_color_anim[2]+")"
        

        return true
    }
}
    