import Vector2d from './vector2d.js';
import Matrix2d from './matrix2d.js';
import { body }from './draw.js'

export class body_effect
{

    effect_types = [
        'disco_ripple',
        'water_ripple',
        'acid_rainbow',
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
        this.effect_bricks = []
		this.background_objs = []
        this.foreground_objs = []

        // GET INFO
        this.init_position = this.body_ref.m.get_row(2)
        this.init_rotation = this.body_ref.m.getRotation()
        this.init_scale = this.body_ref.m.getScale()

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



    //__________________________________setup_effects
    
    setup_effects(info)
    {
    
        if     ( info.type === 'body_anim_bounce' )
            this.effect_bricks.push( new body_anim_bounce(this, info) )    
        else if( info.type === 'body_anim_shake' )
            this.effect_bricks.push( new body_anim_shake(this, info) )  
        else if( info.type === 'body_anim_occilate' )
            this.effect_bricks.push( new body_anim_occilate(this, info) )
        else if( info.type === 'disco_ripple' )
            this.effect_bricks.push( new disco_ripple(this, info) )
        else if( info.type === 'water_ripple' )
            this.effect_bricks.push( new water_ripple(this, info) )
        else if( info.type === 'acid_rainbow' )
            this.effect_bricks.push( new acid_rainbow(this, info) )
        else if( info.type === 'particles_escape' )
            this.effect_bricks.push( new particles_escape(this, info) )                                
   
    }

	update_effects()
	{
        for( let effect_brick of this.effect_bricks )
            effect_brick.update()
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


class body_anim_bounce extends effect_brick
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


class body_anim_occilate extends effect_brick
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


class body_anim_shake extends effect_brick
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
            duration: 15,
            speed:10,
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
        obj.color = null
        this.ripples.push( obj )
        this.Effect.background_objs.push( obj ) 
        this.update_counts.push( 0 )

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
            duration: 50,
            speed:15,
        }
        this.settings = { ...defaultSettings, ...settings };

        this.update_counts = []

        // build

        this.bodyA = new body(
            { m : new Matrix2d(this.Effect.init_position, 0, 5.5), 
            color: null, 
            shape_type:'rectangle', })

        this.bodyB = new body(
            { m : new Matrix2d(this.Effect.init_position, 0, 5.5), 
            color: null, 
            shape_type:'circle', })

        this.bodyC = new body(
            { m : new Matrix2d(this.Effect.init_position, 0, 5.5), 
            color: null, 
            shape_type:'triangle', })            

        // auto
        this.Effect.background_objs.push( this.bodyA )
        this.Effect.background_objs.push( this.bodyB )
        this.Effect.background_objs.push( this.bodyC )        
    }

  
    update()
    {
        if((this.isNotStarted())||(this.isFinished()))
            return false

        // TIME
        this.update_count = this.Effect.update_count - this.settings.start 

        // BEHAVIOR
        let anim = this.update_count *this.settings.speed * 0.1
	
        let vA = new Vector2d(
            this.Effect.init_scale.x*0.5 + anim, 
            this.Effect.init_scale.y*0.5 + anim)	
        let pA = this.Effect.init_position.getAdd(vA)
        this.bodyA.m.setRow(2,pA)
        this.bodyA.m.setRotation(anim*-0.1)

        let vB = new Vector2d(
            this.Effect.init_scale.x*0.5 + anim, 
            this.Effect.init_scale.y*0.5*-1 + anim*-1)	
        let pB = this.Effect.init_position.getAdd(vB)
        this.bodyB.m.setRow(2,pB)
        this.bodyB.m.setRotation(anim*-0.1)

        let vC = new Vector2d(
            this.Effect.init_scale.x*0.5*-1 + anim*-1, 
            this.Effect.init_scale.y*0.5 + anim)	
        let pC = this.Effect.init_position.getAdd(vC)
        this.bodyC.m.setRow(2,pC)
        this.bodyC.m.setRotation(anim*-0.1) 
    
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
   


class acid_rainbow extends effect_brick
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

    