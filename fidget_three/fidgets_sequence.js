
import Vector from './vector.js';
import Matrix from './matrix.js';
import { Chrono, Draw_debug, clamp } from './utils.js';
import fidget_daft_i from './fidget_daft_i.js';
import fidget_windmill from './fidget_windmill.js';


export default class fidgets_sequence
{
    constructor( nbr, m, s, screen_dims, matter_engine,mouseConstraint, shaders = [], debug=false, use_webgl = false)
    {
        //option
        this.fidgets_nbr = nbr
        this.m = m
        this.s = s
        this.debug_mode = debug
        this.force_way = 1

        //utils    
        this.fidgets = []
        this.draw_debug = null
        this.fidgets_to_show = [0,null]
        this.end_update_count = 0 

        this.update_count = 0

        this.anim_mode = false

        this.chrono = new Chrono()  
        this.chrono_end_time_show_start = 0
        this.chrono_end_time_show_end = 0       

        this.shaders = shaders
        this.screen_dims = screen_dims
        this.use_webgl = use_webgl
        this.matter_engine = matter_engine
        this.mouseConstraint = mouseConstraint
        
        for( let i = 0; i < this.fidgets_nbr; i++)
        {
            //var fidget = new fidget_windmill(new Matrix(this.m),this.s,this.screen_dims,this.matter_engine,this.mouseConstraint,this.shaders,this.debug_mode,this.use_webgl)
            //var fidget = new fidget_daft_i(new Matrix(this.m),this.s,this.screen_dims,this.matter_engine,this.mouseConstraint,this.shaders,this.debug_mode,this.use_webgl)
            var fidget = this.get_random_fidget(new Matrix(this.m),this.s,this.screen_dims,this.matter_engine,this.mouseConstraint,this.shaders,this.debug_mode,this.use_webgl)
            fidget.force_way = this.force_way
            fidget.fidget_sequence_i = i + 1
            this.fidgets.push(fidget)

            
        
            if( this.draw_debug == null)
            {
                this.draw_debug = new Draw_debug()
                this.draw_debug.fidget = fidget
                this.draw_debug.mouse_cns = this.mouseConstraint
            }
        }
      
    }

    preload()
    {
      console.log('preload : fidgets_sequence')
      for( let i = 0; i < this.fidgets_nbr; i++)
        this.fidgets[i].preload();
    }

    setup()
    {
      console.log('setup : fidgets_sequence')
      // setup
          
      for( let i = 0; i < this.fidgets_nbr; i++)
        this.fidgets[i].setup();
    }




    get_random_fidget(p,s,sceen_dims,matter_engine,mouseConstraint,shaders,debug,use_webgl)
    {
      
      let r = Math.random()
      if(  0.5 < r)
        return new fidget_windmill(p,s,sceen_dims,matter_engine,mouseConstraint,shaders,debug,use_webgl)
      else
        return new fidget_daft_i(p,s,sceen_dims,matter_engine,mouseConstraint,shaders,debug,use_webgl)   
    }

    draw_background()
    {
      // too slow
      /*
        
        
        let c1 = color(10,10,10);
        let c2 = color(10,10,10);
        let c3 = color(80,80,100);
        let middle_height = this.screen_dims.y/2
        
        for(let y=0; y<middle_height; y++)
        {
            let n = map(y ,0,middle_height,0,1);
          let newc = lerpColor(c1,c2,n);
          stroke(newc);
          line(0,y,this.screen_dims.x, y);
        }
        for(let y=middle_height; y<this.screen_dims.y; y++)
        {
            let n = map(y,middle_height,this.screen_dims.y,0,1);
          let newc = lerpColor(c2,c3,n);
          stroke(newc);
          line(0,y,this.screen_dims.x, y);
        }      
        */  
    }


    draw_fidgets_updates_only()
    {
      var rez = this.get_resolution_coef_info()
      
      var rez_step = rez*this.fidgets_nbr
      var i_max = this.fidgets_nbr
      var coef = i_max-rez_step

      for( let i = 0; i < this.fidgets.length; i++ )
      {   
        if(this.anim_mode == false)
        {
          if((  i-1< coef  )&&(  coef <= i+1 ))
            this.fidgets[i].bodies_set_visibility(true)
          else
            this.fidgets[i].bodies_set_visibility(false)
        }
      }

      for( let i = 0; i < this.fidgets.length; i++ )
      {   
        if(this.anim_mode == false)
        {
          if((  i-1< coef  )&&(  coef <= i+1 ))
          {
          }
          else{
            continue
          }
        }
        this.fidgets[i].update()
        this.fidgets[i].mouse_select_highlight(this.mouseConstraint)
      }
    }

    draw_fidgets(p5)
    {
      var rez = this.get_resolution_coef_info()
      
      if( 0.9< rez)
      {
        p5.fill(0)
        p5.textSize(100);
        p5.textAlign(p5.CENTER);
        if(this.use_webgl == false )
          p5.text( '?', this.screen_dims.x/2,this.screen_dims.y/2+Math.cos(this.update_count/10)*20+30)        
      }

      var rez_step = rez*this.fidgets_nbr
      var i_max = this.fidgets_nbr
      var coef = i_max-rez_step

      for( let i = 0; i < this.fidgets.length; i++ )
      {   
        if(this.anim_mode == false)
        {
          if((  i-1< coef  )&&(  coef <= i+1 ))
          {
          }
          else{
            continue
          }
        }
        //this.fidgets[i].update(p5)
        this.fidgets[i].draw(p5)
        //this.fidgets[i].mouse_select_highlight(this.mouseConstraint)
      }
    }

    setup_shapes_fidgets_three(scene_three)
    {
      var rez = this.get_resolution_coef_info()
      var rez_step = rez*this.fidgets_nbr
      var i_max = this.fidgets_nbr
      var coef = i_max-rez_step
      
      for( let i = 0; i < this.fidgets.length; i++ )
      {   

        //this.fidgets[i].update(p5)
        this.fidgets[i].setup_shapes_three()
        
        scene_three.add( this.fidgets[i].group_three )
        //this.fidgets[i].mouse_select_highlight(this.mouseConstraint)
      }
    }

    animate_three()
    {
      for( let i = 0; i < this.fidgets.length; i++ )
        this.fidgets[i].animate_three()

      this.update_chrono_three()

    }


    setup_chrono_three(scene_three)
    {
      this.chrono.setup_three(scene_three)

    }

    update_chrono_three()
    {

        var p_chrono = new Vector(0, 0)
        var s_chrono = 0
        
      
        if(this.fidgets_to_show[0] < 0 )
        {
          var a = Math.min(1,Math.max(0,this.end_update_count / 100))
          this.chrono.stop()
          let blendA = (0.1*(1-a)+0.5*a)
          let blendB = (0.05*(1-a)+0.07*a)
          p_chrono = new Vector(this.screen_dims.x * 0.5, this.screen_dims.y * blendA )
          s_chrono = this.screen_dims.x * blendB
      
          this.end_update_count += 1
        }
        else
        {
          p_chrono = new Vector(this.screen_dims.x * 0.5, this.screen_dims.y * 0.1)
          s_chrono = this.screen_dims.x * 0.05
          this.end_update_count = 0
      
        }
        //this.chrono.p = p_chrono
        //this.chrono.s = s_chrono
        this.chrono.update()
        this.chrono.update_three()
    }

    draw_chrono(p5)
    {

        var p_chrono = new Vector(0, 0)
        var s_chrono = 0
        
      
        if(this.fidgets_to_show[0] < 0 )
        {
          var a = Math.min(1,Math.max(0,this.end_update_count / 100))
          this.chrono.stop()
          let blendA = (0.1*(1-a)+0.5*a)
          let blendB = (0.05*(1-a)+0.07*a)
          p_chrono = new Vector(this.screen_dims.x * 0.5, this.screen_dims.y * blendA )
          s_chrono = this.screen_dims.x * blendB
      
          this.end_update_count += 1
        }
        else
        {
          p_chrono = new Vector(this.screen_dims.x * 0.5, this.screen_dims.y * 0.1)
          s_chrono = this.screen_dims.x * 0.05
          this.end_update_count = 0
      
        }
        //this.chrono.p = p_chrono
        //this.chrono.s = s_chrono
        this.chrono.update()
        if(this.use_webgl == false )
          this.chrono.draw(p5)
    }

    do_anim_override( anim = null )
    {
      if( anim != null )
      {
        let anim_global = anim * this.fidgets_nbr
      
        let i_max = this.fidgets_nbr-1
        for( let i = 0; i < this.fidgets_nbr; i++ )
        {
          let anim_local = clamp(anim_global-i,0,1)
          this.fidgets[i_max-i].do_anim_override(anim_local*0.999)
  
        }
        this.anim_mode = true
      }
      else
      {
        this.anim_mode = false
        for( let i = 0; i < this.fidgets_nbr; i++ )
          this.fidgets[i].do_anim_override(null)

      }

    }
    get_resolution_coef_info()
    {   
      var coef = 0
      for( let i = 0; i < this.fidgets_nbr; i++ )
      {
        coef += this.fidgets[i].state.resolution_coef / (this.fidgets[i].end_step-1)
      }

      return coef / this.fidgets_nbr
            
    }

    update()
    {
      //////////////////////////////////////////////////// INTRO
      var intro_reverse_anim_start = 50
      var intro_reverse_anim_end   = 300
      var _delta = intro_reverse_anim_end-intro_reverse_anim_start
      var _count = Math.max( 0, this.update_count-intro_reverse_anim_start)
      var _anim = smoothstep( 1 - _count/_delta )
      this.do_anim_override(_anim )  
      //////////////////////////////////////////////////// INTRO
      var chrono_appears_start = 250
      var chrono_appears_end   = 290  
      _delta = chrono_appears_end-chrono_appears_start
      _count = Math.max( 0, this.update_count-chrono_appears_start)
      _anim = smoothstep( 1 - _count/_delta )
      
      let blendA = (0.1*(1-_anim)+0.5*_anim)
      let blendB = (0.05*(1-_anim)+0.07*_anim)

      if(_count==0)
        this.chrono.v = false
      else
        this.chrono.v = true

      this.chrono.p = new Vector(this.screen_dims.x * 0.5, this.screen_dims.y * blendA )
      this.chrono.s = this.screen_dims.x * blendB
      
      //////////////////////////////////////////////////// INTRO
      var user_interaction_start = 290
      if( 0 < this.update_count-user_interaction_start )
      {
        if((this.chrono.is_at_start())&&(this.get_resolution_coef_info() < 0.99 ))
          this.chrono.start()
        this.do_anim_override(null ) 
      }

     
      if(  0.99 < this.get_resolution_coef_info())
      {
        if(this.chrono.is_at_start() == false)
        {
          this.chrono_end_time_show_start = this.update_count
          this.chrono_end_time_show_end   = this.update_count+40  
        }
        this.chrono.stop()

        _delta = this.chrono_end_time_show_end-this.chrono_end_time_show_start
        _count = Math.max( 0, this.update_count-this.chrono_end_time_show_start)
        _anim = smoothstep( _count/_delta )
        
        
        let blendA = (0.1*(1-_anim)+0.5*_anim)
        let blendB = (0.05*(1-_anim)+0.07*_anim)
  
        this.chrono.p = new Vector(this.screen_dims.x * 0.5, this.screen_dims.y * blendA )
        this.chrono.s = this.screen_dims.x * blendB
      }

      this.draw_fidgets_updates_only()
      this.update_count += 1
    }

    draw(p5) {
        p5.background(50);
        this.draw_fidgets(p5)
        this.draw_chrono(p5)

        if(this.debug_mode)
            this.draw_debug.draw(p5)
      }


      
}



function smoothstep ( x,edge0=0, edge1=1) {
  // Scale, and clamp x to 0..1 range
  x = clamp((x - edge0) / (edge1 - edge0),0,1);

  return x * x * (3.0 - 2.0 * x);
}

