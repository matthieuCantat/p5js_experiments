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

		this.update_count = 0
		
		
		//
		this.counts = []
		this.background_objs = []
        this.foreground_objs = []


        this.setup()


	}

    setup()
    {
        if( this.effect_type === 'disco_ripple' )
        {
            this.setup_disco_ripple()
        }
        else if( this.effect_type === 'water_ripple' )
        {
            this.setup_water_ripple()
        }
        else if( this.effect_type === 'acid_rainbow' )
        {
            this.setup_acid_rainbow()
        }        
    }

    setup_disco_ripple()
    {
        
		this.duration = 50
		this.speed = 10

        this.front_body = this.body_ref.duplicate()
        this.init_scale = this.body_ref.m.getScale()

        this.foreground_objs.push( this.front_body )
    }
    setup_water_ripple()
    {
        
		this.duration = 50
		this.speed = 10

        this.front_body = this.body_ref.duplicate()
        this.back_body = this.body_ref.duplicate()
        this.back_body.color = null
        

        this.init_scale = this.body_ref.m.getScale()

        this.background_objs.push( this.back_body )
        this.foreground_objs.push( this.front_body )
    }

    setup_acid_rainbow()
    {
        
		this.duration = 50
		this.speed = 10
        this.front_body = this.body_ref.duplicate()
        this.init_scale = this.body_ref.m.getScale()

        this.foreground_objs.push( this.front_body )
    }

	isFinished()
	{
		if( this.duration < this.update_count )
			return true
		return false
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
			

        if( this.effect_type === 'disco_ripple' )
        {
            return this.update_disco_ripple()
        }
        else if( this.effect_type === 'water_ripple' )
        {
            return this.update_water_ripple()
        }
        else if( this.effect_type === 'shiny' )
        {
            return this.update_shiny()
        }
        else if( this.effect_type === 'acid_rainbow' )
        {
            return this.update_acid_rainbow()
        }
        else if( this.effect_type === 'reflective' )
        {
            return this.update_reflective()
        }
        else if( this.effect_type === 'shinning_stars' )
        {
            return this.update_shinning_stars()
        }

		return true
	}

    update_disco_ripple()
    {
        let grow_duration = 15
        if( this.update_count < grow_duration)
        {
            let anim = Math.sin( this.update_count/grow_duration*3 )*5
            let scale_offset = new Vector2d( 
                anim, 
                anim )
            let scale = this.init_scale.getAdd( scale_offset )
            this.front_body.m.setScale( scale)
        }
        else
        {
            let obj = this.body_ref.duplicate() 
            obj.color = null
            this.background_objs.push( obj ) 
            this.counts.push( 0 )
    
            for( let i = 0; i < this.background_objs.length; i++)
            {
                let anim = this.counts[i] *this.speed
                let animated_scale = new Vector2d(
                    this.init_scale.x + anim, 
                    this.init_scale.y + anim)	
                
                
                this.background_objs[i].m.setScale(animated_scale)
    
                this.counts[i] += 1
            }
    
        }
     

        return true
    }

    
    update_water_ripple()
    {
        let grow_duration = 15
        if( this.update_count < grow_duration)
        {
            let anim = Math.sin( this.update_count/grow_duration*3 )*5
            let scale_offset = new Vector2d( 
                anim, 
                anim )
            let scale = this.init_scale.getAdd( scale_offset )
            this.front_body.m.setScale( scale)
        }
        else
        {
        
            let anim = (this.update_count-grow_duration) *this.speed * 0.1
            let animated_scale = new Vector2d(
                this.init_scale.x + anim, 
                this.init_scale.y + anim)	
            
            
            this.back_body.m.setScale(animated_scale)

            this.back_body.stroke_width = Math.max(0.01,10 - this.update_count*0.25)

    
        }
     

        return true
    }


    
    update_acid_rainbow()
    {
        let grow_duration = 15
        if( this.update_count < grow_duration)
        {
            let anim = Math.sin( this.update_count/grow_duration*3 )*5
            let scale_offset = new Vector2d( 
                anim, 
                anim )
            let scale = this.init_scale.getAdd( scale_offset )
            this.front_body.m.setScale( scale)
        }
        else
        {
            let animR = (255/2)+Math.sin(this.update_count*0.2)*255/2
            let animG = (255/2)+Math.sin(this.update_count*0.4)*255/2
            let animB = (255/2)+Math.sin(this.update_count*0.3)*255/2

            let animStrokeR = (255/2)+Math.sin(this.update_count*0.4)*255/2
            let animStrokeG = (255/2)+Math.sin(this.update_count*0.3)*255/2
            let animStrokeB = (255/2)+Math.sin(this.update_count*0.2)*255/2

            this.front_body.color = "rgb("+animR+", "+animG+", "+animB+")"
            this.front_body.stroke_color = "rgb("+animStrokeR+", "+animStrokeG+", "+animStrokeB+")"
            
    
        }

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
}