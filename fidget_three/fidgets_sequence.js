
import Vector from './vector.js';
import Matrix from './matrix.js';
import { Chrono, Draw_text_debug, clamp,isMousePressed, isScreenTouched, mouseX } from './utils.js';
import fidget_daft_i from './fidget_daft_i.js';
import fidget_windmill from './fidget_windmill.js';


export default class fidgets_sequence
{
    constructor( nbr, m, s, screen_dims, matter_engine,mouse_constraint, shaders = [], debug=false)
    {
        //option
        this.fidgets_nbr = nbr
        this.m = m
        this.s = s
        this.debug_mode = debug
        this.force_way = 1

        //utils    
        this.fidgets = []
        
        this.fidgets_to_show = [0,null]
        this.end_update_count = 0 

        this.update_count = 0

        this.anim_mode = false

        this.chrono = new Chrono(screen_dims)  
        this.chrono_end_time_show_start = 0
        this.chrono_end_time_show_end = 0       

        this.shaders = shaders
        this.screen_dims = screen_dims
        this.matter_engine = matter_engine
        this.mouse_constraint = mouse_constraint
        
        for( let i = 0; i < this.fidgets_nbr; i++)
        {
            //var fidget = new fidget_windmill(new Matrix(this.m),this.s,this.screen_dims,this.matter_engine,this.mouse_constraint,this.shaders,this.debug_mode)
            var fidget = new fidget_daft_i(new Matrix(this.m),this.s,this.screen_dims,this.matter_engine,this.mouse_constraint,this.shaders,this.debug_mode)
            //var fidget = this.get_random_fidget(new Matrix(this.m),this.s,this.screen_dims,this.matter_engine,this.mouse_constraint,this.shaders,this.debug_mode)
            fidget.force_way = this.force_way
            fidget.fidget_sequence_i = i + 1
            this.fidgets.push(fidget)
        }
    
        this.draw_text_debug = null
        if(this.debug_mode.fidget_steps_info)
        {
            this.draw_text_debug = new Draw_text_debug(this.screen_dims)
            this.draw_text_debug.mouse_cns = this.mouse_constraint
        }        

    }


    setup()
    {
      console.log('setup : fidgets_sequence')
      // setup
          
      for( let i = 0; i < this.fidgets_nbr; i++)
      {
        this.fidgets[i].setup();
      }

    }




    get_random_fidget(p,s,sceen_dims,matter_engine,mouse_constraint,shaders,debug)
    {
      
      let r = Math.random()
      if(  0.5 < r)
        return new fidget_windmill(p,s,sceen_dims,matter_engine,mouse_constraint,shaders,debug)
      else
        return new fidget_daft_i(p,s,sceen_dims,matter_engine,mouse_constraint,shaders,debug)   
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
            this.fidgets[i].bodies_enable(true)
          else
            this.fidgets[i].bodies_enable(false)
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
        this.fidgets[i].mouse_select_highlight(this.mouse_constraint)
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
        //this.fidgets[i].mouse_select_highlight(this.mouse_constraint)
      }
    }

    animate_three()
    {
      for( let i = 0; i < this.fidgets.length; i++ )
        this.fidgets[i].animate_three()

      this.update_chrono_three()
      if(this.debug_mode.fidget_steps_info)
      {
        let texts_to_draw = [
          'mouse is pressed : ' + isMousePressed + ' screen is touch : '+isScreenTouched + ' !',
          'mouse position : ' + mouseX + ' : '+mouseY ,
          /*
          'count : ' + this.fidgets[0].state.update_count,
          'res : ' + Math.round( this.fidgets[0].state.resolution_coef, 2 ) + ' / 4',
          'last selection switch step : ' + this.fidgets[0].state.switch_selection_happened_step,
          '0 - count: ' + this.fidgets[0].state.steps[0].update_count,
          '0 - res: ' + Math.round( this.fidgets[0].state.steps[0].resoluton_coef, 2) + ' / 1',
          '1 - count: ' + this.fidgets[0].state.steps[1].update_count,
          '1 - res Coef: ' + Math.round( this.fidgets[0].state.steps[1].resoluton_coef, 2) + ' / 1',
          '2 - count: ' + this.fidgets[0].state.steps[2].update_count ,
          '2 - res Coef: ' + Math.round( this.fidgets[0].state.steps[2].resoluton_coef, 2) + ' / 1',
          '3 - count: ' + this.fidgets[0].state.steps[3].update_count ,
          '3 - res Coef: ' + Math.round( this.fidgets[0].state.steps[3].resoluton_coef, 2) + ' / 1' ,
          '4 - count: ' + this.fidgets[0].state.steps[4].update_count,
          '4 - res Coef: ' + Math.round( this.fidgets[0].state.steps[4].resoluton_coef, 2) + ' / 1',
          '5 - count: ' + this.fidgets[0].state.steps[5].update_count,
          '5 - res Coef: ' + Math.round( this.fidgets[0].state.steps[5].resoluton_coef, 2) + ' / 1',
          */
        ]
        this.draw_text_debug.update_three(texts_to_draw)
      }
        
      

    }


    setup_chrono_three(scene_three)
    {
      this.chrono.setup_three(scene_three)
    }
    
    setup_debug_three(scene_three)
    {
      if(this.debug_mode.fidget_steps_info)
        this.draw_text_debug.setup_three(scene_three)
    }

    

    update_chrono_three()
    {

        var p_chrono = new Vector(0, 0)
        var s_chrono = 0
        
      
        if(this.fidgets_to_show[0] < 0 )
        {
          var a = Math.min(1,Math.max(0,this.end_update_count / 100))
          this.chrono.stop()
          let blendA = 0.5 *a + 0.1 *(1-a)
          let blendB = 0.07*a + 0.05*(1-a)
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
    

    do_anim_override( anim = null )
    {
      if( anim != null )
      {
        for( let i = 0; i < this.fidgets_nbr; i++ )
          this.fidgets[i].bodies_enable(true)

        let anim_global = anim * this.fidgets_nbr
      
        let i_max = this.fidgets_nbr-1
        for( let i = 0; i < this.fidgets_nbr; i++ )
        {
          let anim_local = clamp(anim_global-i,0,1)
          
          this.fidgets[i_max-i].do_anim_override(anim_local)

          
          if( anim_local <=1)
          {
            this.fidgets[i_max-i].bodies_enable(true)
            if( i_max-i+1 < this.fidgets.length)
              this.fidgets[i_max-i+1].bodies_enable(true)
          }
            
  
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
      var user_interaction_start = 290
      if(this.debug_mode.disable_animation==false)
      {
        //////////////////////////////////////////////////// INTRO
        var intro_reverse_anim_start = 50
        var intro_reverse_anim_end   = 300
        var _delta = intro_reverse_anim_end-intro_reverse_anim_start
        var _count = Math.max( 0, this.update_count-intro_reverse_anim_start)
        var _anim = smoothstep( 1 - _count/_delta )
        this.do_anim_override(_anim )  
        //////////////////////////////////////////////////// INTRO
      }
      else
      {
        this.do_anim_override(0 )
        if(this.update_count < user_interaction_start)
        {
          this.update_count = user_interaction_start
        }
      }

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



      
}



function smoothstep ( x,edge0=0, edge1=1) {
  // Scale, and clamp x to 0..1 range
  x = clamp((x - edge0) / (edge1 - edge0),0,1);

  return x * x * (3.0 - 2.0 * x);
}

