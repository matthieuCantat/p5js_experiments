import Vector2d from './vector2d.js';
import Matrix2d from './matrix2d.js';
import { body, COLORS_TO_RGB }from './draw.js'
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
            //particles_stars: particles_stars,
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
    