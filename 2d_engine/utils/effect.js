import Vector2d from './vector2d.js';


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

	constructor( body , effect_type )
	{
		this.body_ref = body
        this.effect_type = effect_type

        //
		this.update_count = 0
        this.duration = 0
		//
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
        for( let effect_type of this.effect_type )
            this.setup_effects(effect_type)
    }

	update()
	{
		this.update_count += 1
		
		if( this.isFinished() )
        {
            this.body_ref.visibility = true
            return false
        }
        this.body_ref.visibility = false
			
        for( let effect_type of this.effect_type )
            this.update_effects(effect_type)

      

		return true
	}



	isFinished()
	{
		if( this.duration < this.update_count )
			return true
		return false
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
    
    setup_effects(type)
    {
        if(      type === 'disco_ripple'     )this.setup_disco_ripple()
        else if( type === 'water_ripple'     )this.setup_water_ripple()
        else if( type === 'acid_rainbow'     )this.setup_acid_rainbow() 
        else if( type === 'body_anim_bounce' )this.setup_body_anim_bounce()      
        else if( type === 'body_anim_shake' )this.setup_body_anim_shake()   
        else if( type === 'body_anim_occilate' )this.setup_body_anim_occilate()    
    }

	update_effects(type)
	{
        if(      type === 'disco_ripple'   )return this.update_disco_ripple()
        else if( type === 'water_ripple'   )return this.update_water_ripple()
        else if( type === 'acid_rainbow'  )return this.update_acid_rainbow()
        else if( type === 'body_anim_bounce' )return this.update_body_anim_bounce()   
        else if( type === 'body_anim_shake' )return this.update_body_anim_shake()  
        else if( type === 'body_anim_occilate' )return this.update_body_anim_occilate()      
	}
    //__________________________________body anim bounce
    setup_body_anim_bounce()
    {
        // settings
		this.body_anim_bounce_duration = 15
        // memory
        this.body_anim_bounce_update_count = 0
        // build
        this.front_body = this.body_ref.duplicate()
        // auto
        this.body_anim_bounce_start = this.duration
        this.duration += this.body_anim_bounce_duration
        this.foreground_objs.push( this.front_body )
    }
    update_body_anim_bounce()
    {
        // INIT
        let duration = this.body_anim_bounce_duration
        let start = this.body_anim_bounce_start
        let end  = this.body_anim_bounce_start+duration

        if(( this.update_count < start )||(end < this.update_count))
            return false

        this.body_anim_bounce_update_count = this.update_count - start

        // BEHAVIOR
        let anim = Math.sin( this.update_count/duration*3 )*5
        let scale_offset = new Vector2d( anim, anim )
        let scale = this.init_scale.getAdd( scale_offset )
        this.front_body.m.setScale( scale)

        return true
    }
    //__________________________________body anim occilate
    setup_body_anim_occilate()
    {
        // settings
		this.body_anim_occilate_duration = 15
        // memory
        this.body_anim_occilate_update_count = 0
        // build
        this.front_body = this.body_ref.duplicate()
        // auto
        this.body_anim_occilate_start = this.duration
        this.duration += this.body_anim_occilate_duration
        this.foreground_objs.push( this.front_body )
    }
    update_body_anim_occilate()
    {
        // INIT
        let duration = this.body_anim_occilate_duration
        let start = this.body_anim_occilate_start
        let end  = this.body_anim_occilate_start+duration

        if(( this.update_count < start )||(end < this.update_count))
            return false

        this.body_anim_occilate_update_count = this.update_count - start

        // BEHAVIOR
        let anim = Math.sin( this.update_count*0.9 )*0.1
        this.front_body.m.setRotation( this.init_rotation + anim)

        return true
    }
    //__________________________________body anim shake
    setup_body_anim_shake()
    {
        // settings
		this.body_anim_shake_duration = 15
        // memory
        this.body_anim_shake_update_count = 0
        // build
        this.front_body = this.body_ref.duplicate()
        // auto
        this.body_anim_shake_start = this.duration
        this.duration += this.body_anim_shake_duration
        this.foreground_objs.push( this.front_body )
    }
    update_body_anim_shake()
    {
        // INIT
        let duration = this.body_anim_shake_duration
        let start = this.body_anim_shake_start
        let end  = this.body_anim_shake_start+duration

        if(( this.update_count < start )||(end < this.update_count))
            return false

        this.body_anim_shake_update_count = this.update_count - start

        // BEHAVIOR
        let animX = Math.sin( this.update_count*1.9 )*2.1
        let animY = Math.sin( this.update_count*1.1 )*2.1
        let offset = new Vector2d( animX, animY )
        this.front_body.m.set_row(2, this.init_position.getAdd(offset))

        return true
    }
    //__________________________________disco_ripple
    setup_disco_ripple()
    {
        // settings
        this.disco_ripple_duration = 50
		this.disco_ripple_speed = 10
        this.disco_ripple_counts = []
        
        // memory
        this.disco_ripple_update_count = 0

        // auto
        this.disco_ripple_start = this.duration
        this.duration += this.disco_ripple_duration
    }

    update_disco_ripple()
    {
        // INIT
        let duration = this.disco_ripple_duration
        let start = this.disco_ripple_start
        let end  = this.disco_ripple_start+duration

        if(( this.update_count < start )||(end < this.update_count))
            return false

        this.disco_ripple_update_count = this.update_count - start

        // BEHAVIOR
        let obj = this.body_ref.duplicate() 
        obj.color = null
        this.background_objs.push( obj ) 
        this.disco_ripple_counts.push( 0 )

        for( let i = 0; i < this.background_objs.length; i++)
        {
            let anim = this.disco_ripple_counts[i] *this.disco_ripple_speed
            let animated_scale = new Vector2d(
                this.init_scale.x + anim, 
                this.init_scale.y + anim)	
            
            
            this.background_objs[i].m.setScale(animated_scale)

            this.disco_ripple_counts[i] += 1
        }
    
        return true
    }

    //__________________________________water_ripple

    setup_water_ripple()
    {
        // settings
		this.water_ripple_duration = 50
		this.water_ripple_speed = 10

        // memory
        this.water_ripple_update_count = 0
  
        // build
        this.back_body = this.body_ref.duplicate()
        this.back_body.color = null
        
        // auto
        this.water_ripple_start = this.duration
        this.duration += this.water_ripple_duration
        this.background_objs.push( this.back_body )
    }

    update_water_ripple()
    {
        // INIT
        let duration = this.water_ripple_duration
        let start = this.water_ripple_start
        let end  = this.water_ripple_start+duration

        if(( this.update_count < start )||(end < this.update_count))
            return false

        this.water_ripple_update_count = this.update_count - start

        // BEHAVIOR
        let anim = this.water_ripple_update_count *this.water_ripple_speed * 0.1
        let animated_scale = new Vector2d(
            this.init_scale.x + anim, 
            this.init_scale.y + anim)	
        
        
        this.back_body.m.setScale(animated_scale)

        this.back_body.stroke_width = Math.max(0.01,10 - this.water_ripple_update_count*0.25)
    
        return true
    }    

    //__________________________________acid_rainbow
    setup_acid_rainbow()
    {
        // settings
		this.setup_acid_duration = 50
		this.setup_acid_speed = 10

        // memory
        this.setup_acid_update_count = 0
  
        // build
        this.front_body = this.body_ref.duplicate()    

        // auto
        this.setup_acid_start = this.duration
        this.duration += this.setup_acid_duration
        this.foreground_objs.push( this.front_body )

    }
    
    update_acid_rainbow()
    {
        // INIT
        let duration = this.update_acid_duration
        let start = this.update_acid_start
        let end  = this.update_acid_start+duration

        if(( this.update_count < start )||(end < this.update_count))
            return false

        this.update_acid_update_count = this.update_count - start

        // BEHAVIOR

        let animR = (255/2)+Math.sin(this.update_count*0.2)*255/2
        let animG = (255/2)+Math.sin(this.update_count*0.4)*255/2
        let animB = (255/2)+Math.sin(this.update_count*0.3)*255/2

        let animStrokeR = (255/2)+Math.sin(this.update_count*0.4)*255/2
        let animStrokeG = (255/2)+Math.sin(this.update_count*0.3)*255/2
        let animStrokeB = (255/2)+Math.sin(this.update_count*0.2)*255/2

        this.front_body.color = "rgb("+animR+", "+animG+", "+animB+")"
        this.front_body.stroke_color = "rgb("+animStrokeR+", "+animStrokeG+", "+animStrokeB+")"
        

        return true
    }    

}