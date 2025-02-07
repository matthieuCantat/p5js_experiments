
import Vector from '../utils/vector.js';
import Matrix from '../utils/matrix.js';
import { Chrono, 
  Draw_text_debug, 
  clamp, 
} from '../utils/utils.js';
import {
  user_interaction_info
} from '../core/mouse.js'
  
import fidget_daft_i from '../assets/fidget_daft_i.js';
import fidget_windmill from '../assets/fidget_windmill.js';
import fidget_simple_slide from '../assets/fidget_simple_slide.js';


export default class fidgets_sequence
{
    constructor( args_in )
    {
        const args_default = {
          shaders : [],
          debug : false,
          fidget_choice : null };

        const args = {...args_default, ...args_in}
        console.log(args)
        // hard coded
        this.chrono_appears_start = 250
        this.chrono_appears_end   = 290  
        this.chrono_appears_range = this.chrono_appears_end-this.chrono_appears_start
        
        // init memory
        this.fidgets_nbr = args.nbr
        this.m = args.m
        this.s = args.s
        this.debug_mode = args.debug
        this.force_way = 1

        this.shaders = args.shaders
        this.screen_dims = args.screen_dims
     
        // instance memory
        this.anim_mode = false
        this.fidgets_to_show = [0,null]
        this.end_update_count = 0 
        this.update_count = 0        
        this.chrono_end_time_show_start = 0
        this.chrono_end_time_show_end = 0       

        this.fidgets_do_computation = []
        this.fidgets_do_computation_last = []
        this.resolution_coef = 0
        this.resolution_coefs = []

        this.chrono_stopped = false
  
        this.chrono = null
        this.fidgets = []
        this.draw_text_debug = null
        this.scene = null

        this.fidget_choice = args.fidget_choice
        this.dom_canvas = args.dom_canvas
    }


    setup(scene = null)
    {
      if(scene != null)
        this.scene = scene
      
      console.log('setup : fidgets_sequence')

      const e_test_title = document.getElementById('test_title')
      e_test_title.textContent = 'fidgets_sequence'

      //clean
      this.anim_mode = false
      this.fidgets_to_show = [0,null]
      this.end_update_count = 0 
      this.update_count = 0        
      this.chrono_end_time_show_start = 0
      this.chrono_end_time_show_end = 0       

      this.fidget_focus_id = 0
      this.fidgets_do_computation = []
      this.fidgets_do_computation_last = []
      this.resolution_coef = 0
      this.resolution_coefs = []

      this.chrono_stopped = false

      this.chrono = null
      this.fidgets = []
      this.draw_text_debug = null

      // build  
      this.chrono = new Chrono(this.screen_dims)  


        
      let z_depth = 0
      for( let i = 0; i < this.fidgets_nbr; i++)
      {
          let opts = 
          {
            m:new Matrix(this.m), 
            s:this.s, 
            screen_dims:this.screen_dims, 
            z_depth_start:z_depth,
            do_background: true, 
            is_dynamic:true,
            debug : this.debug_mode,  
            play_animation:null,   
            dom_canvas : this.dom_canvas 
          }
          var fidget = null
          if( this.fidget_choice == "fidget_windmill" )
            fidget = new fidget_windmill(opts)
          else if( this.fidget_choice == "fidget_daft_i" )
            fidget = new fidget_daft_i(opts)
          else if( this.fidget_choice == "fidget_simple_slide" )
            fidget = new fidget_simple_slide(opts);
          else
            fidget = this.get_random_fidget(opts)
          
          z_depth = fidget.z_depth_end
          
          fidget.force_way = this.force_way
          fidget.fidget_sequence_i = i + 1
          this.fidgets.push(fidget)
      }
  

         
      // setup
      for( let i = 0; i < this.fidgets_nbr; i++)
      {
        this.fidgets[i].setup(this.scene);
        this.fidgets_do_computation.push(null)
        this.fidgets_do_computation_last.push(null)
      }

      // add to scene
      this.setup_chrono_three(this.scene)
      
      this.set_debug(this.debug_mode)
    }

    reset()
    {
      console.log('fidgets_sequence - reset')
      this.clean_scene(this.scene)
      this.setup(this.scene)
    }

    clean_scene(scene)
    {
      for( let fidget of this.fidgets)
        fidget.clean_scene(scene)

      this.chrono.clean_scene(scene)
    }

    get_random_fidget(in_options)
    {
      
      let r = Math.random()
      if(  0.5 < r)
        return new fidget_windmill(in_options)
      else
        return new fidget_daft_i(in_options)   
    }

    setup_chrono_three(scene_three)
    {
      this.chrono.setup_three(scene_three)
    }
    
    set_debug( debug )
    {
      this.debug_mode = debug

      
      this.fidgets[this.fidget_focus_id].set_debug(this.debug_mode)

      if(this.debug_mode.fidget_steps_info)
          this.draw_text_debug = new Draw_text_debug(this.screen_dims)
      else
      {
        if( this.draw_text_debug != null )
        {
          this.draw_text_debug.clean()
          this.draw_text_debug = null
        }
          
      } 
      this.setup_debug_three(this.scene)      
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
        {/*
          var a = Math.min(1,Math.max(0,this.end_update_count / 100))
          
          let blendA = 0.5 *a + 0.1 *(1-a)
          let blendB = 0.07*a + 0.05*(1-a)
          p_chrono = new Vector(this.screen_dims.x * 0.5, this.screen_dims.y * blendA )
          s_chrono = this.screen_dims.x * blendB
          */
          //this.chrono.stop()
          //this.end_update_count += 1
          
        }
        else
        {
          /*
          p_chrono = new Vector(this.screen_dims.x * 0.5, this.screen_dims.y * 0.1)
          s_chrono = this.screen_dims.x * 0.05
          */
          //this.end_update_count = 0
      
        }
        //this.chrono.p = p_chrono
        //this.chrono.s = s_chrono
        //this.chrono.update()
        //this.chrono.update_three()
    }
    

    do_anim_override( anim = null )
    {
      if( anim != null )
      {
        for( let i = 0; i < this.fidgets_nbr; i++ )
          this.fidgets[i].enable(true)

        let anim_global = anim * this.fidgets_nbr
      
        let i_max = this.fidgets_nbr-1
        for( let i = 0; i < this.fidgets_nbr; i++ )
        {
          let anim_local = clamp(anim_global-i,0,1)
          
          this.fidgets[i_max-i].do_anim_override(anim_local)

          
          if( anim_local <=1)
          {
            this.fidgets[i_max-i].enable(true)
            if( i_max-i+1 < this.fidgets.length)
              this.fidgets[i_max-i+1].enable(true)
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

    get_fidgets_resolution_coefs_normalized()
    {   
      let fidgets_resolution_coef = []
      for( let i = 0; i < this.fidgets_nbr; i++ )
      {
        let coef_normalized = this.fidgets[i].state.resolution_coef / (this.fidgets[i].end_step-1)
        fidgets_resolution_coef.push(coef_normalized)
      }

      return fidgets_resolution_coef
    }

    get_resolution_coef_info()
    {   
      var coef = 0

      this.resolution_coefs = this.get_fidgets_resolution_coefs_normalized()
      for( let i = 0; i < this.fidgets_nbr; i++ )
        coef += this.resolution_coefs[i]
      
      this.resolution_coef = coef / this.fidgets_nbr

    }

    update()
    {
      console.log('update')
      
      this.get_resolution_coef_info()

      for( let i = 0; i < this.fidgets.length; i++ )
        this.fidgets_do_computation[i] = this.do_fidget_computation(i)
      
      for( let i = 0; i < this.fidgets.length; i++ )
        if( this.fidgets_do_computation[i] )
        {
          this.fidget_focus_id = i
          break
        }
          

      var user_interaction_start = 290
      if(this.debug_mode.disable_animation)
      {
        //this.do_anim_override(0)
        if(this.update_count < user_interaction_start)
        {
          this.update_count = user_interaction_start
        }
      }
      else
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


      _count = Math.max( 0, this.update_count-this.chrono_appears_start)
      _anim = smoothstep( 1 - _count/this.chrono_appears_range )
      
      let blendA = (0.1*(1-_anim)+0.5*_anim)
      let blendB = (0.05*(1-_anim)+0.07*_anim)

      if(_count==0)
        this.chrono.v = false
      else
        this.chrono.v = true

      this.chrono.p = new Vector(this.screen_dims.x * 0.5, this.screen_dims.y * blendA )
      this.chrono.s = this.screen_dims.x * blendB
      
      //////////////////////////////////////////////////// INTRO
      
      let chrono_start = ( (user_interaction_start < this.update_count )&&( this.chrono.is_at_start() ) )
      if( chrono_start )
      {
        //if((this.chrono.is_at_start())&&(this.get_resolution_coef_info() < 0.99 ))
        this.chrono.start()
        this.do_anim_override(null) 
      }

     
      let fidget_sequence_ends = 0.99 < this.resolution_coef
      if(  fidget_sequence_ends )
      {
        if((this.chrono_stopped == false)&&(this.chrono.is_at_start() == false))
        {
          this.chrono_end_time_show_start = this.update_count
          this.chrono_end_time_show_end   = this.update_count+40  

          this.chrono.update()
          this.chrono.update_three()
          this.chrono.stop()  
          this.chrono_stopped = true        
        }

        

        _delta = this.chrono_end_time_show_end-this.chrono_end_time_show_start
        _count = Math.max( 0, this.update_count-this.chrono_end_time_show_start)
        _anim = smoothstep( _count/_delta )
        
        
        let blendA = (0.1*(1-_anim)+0.5*_anim)
        let blendB = (0.05*(1-_anim)+0.07*_anim)
  
        this.chrono.p = new Vector(this.screen_dims.x * 0.5, this.screen_dims.y * blendA )
        this.chrono.s = this.screen_dims.x * blendB

        
        let reset_after_end_count = 100
        if( reset_after_end_count < _count )
        {
          this.reset()
        }

      }
      
      this.draw_fidgets_updates_only()
      this.update_count += 1
    }


    do_fidget_computation(i)
    {
      var rez = this.resolution_coef
      
      // 
      
      var rez_step = rez*this.fidgets_nbr
      var coef = this.fidgets_nbr-rez_step
      var coef_cleaned = coef
      coef_cleaned = Math.round(coef_cleaned*100)/100
      coef_cleaned = Math.ceil(coef_cleaned) 
      

      var result = ((  i-1< coef_cleaned )&&(  coef_cleaned <= i+1 ))
      /*
      result = true
      if( (0 < i)&&
      {
        if((this.resolution_coefs[i] != 1)&&( this.resolution_coefs[i-1] == 1))
          result = true
        else if((this.resolution_coefs[i+1] != 1)&&( this.resolution_coefs[i] == 1)) 
          result = true
        else
          result = false
      }

      */

      


      return result
    }

    draw_fidgets_updates_only()
    {
      for( let i = 0; i < this.fidgets.length; i++ )
      {   
        if(this.anim_mode == false)
        {
          
          let do_computation = this.fidgets_do_computation[i]
          if( this.fidgets_do_computation_last[i] != do_computation )
          {
            if(do_computation == true)
            {
              this.fidgets[i].enable(true)
              
            }
            else
            {
              this.fidgets[i].enable(false)
            }
              
          }
          this.fidgets_do_computation_last[i] = do_computation

        }

      }
      
      //console.log(userInteractionChange)
      for( let i = 0; i < this.fidgets.length; i++ )
      {   
        if((this.anim_mode == false)&&(this.fidgets_do_computation[i] == false))
          continue  
        this.fidgets[i].update()
        

        if(user_interaction_info.userInteractionChange)
        {
          this.fidgets[i].mouse_select_highlight()
        }
        
          
        
      }


    }


    animate_three()
    {

      for( let i = 0; i < this.fidgets.length; i++ )
      {   
        if((this.anim_mode == false)&&(this.fidgets_do_computation[i] == false))
          continue  
        this.fidgets[i].animate_three()
      }

      this.update_chrono_three()

      if(this.debug_mode.fidget_steps_info)
      {
        let F = this.fidgets[this.fidget_focus_id].state;
        let texts_to_draw = [
          
          'count : ' + F.update_count,
          'res : ' + Math.round( F.resolution_coef*100, 2 )/100 + ' / 4',
          'last selection switch step : ' + F.switch_selection_happened_step,
          '0 - count: ' + F.steps[0].update_count,
          '0 - res: ' + Math.round( F.steps[0].resoluton_coef*100, 2)/100 + ' / 1',
          '1 - count: ' + F.steps[1].update_count,
          '1 - res Coef: ' + Math.round( F.steps[1].resoluton_coef*100, 2)/100 + ' / 1',
          '2 - count: ' + F.steps[2].update_count ,
          '2 - res Coef: ' + Math.round( F.steps[2].resoluton_coef*100, 2)/100 + ' / 1',
          '3 - count: ' + F.steps[3].update_count ,
          '3 - res Coef: ' + Math.round( F.steps[3].resoluton_coef*100, 2)/100 + ' / 1' ,
          '4 - count: ' + F.steps[4].update_count,
          '4 - res Coef: ' + Math.round( F.steps[4].resoluton_coef*100, 2)/100 + ' / 1',
          '5 - count: ' + F.steps[5].update_count,
          '5 - res Coef: ' + Math.round( F.steps[5].resoluton_coef*100, 2)/100 + ' / 1',
          
          
        ]
        this.draw_text_debug.update_three(texts_to_draw)
      }
        
      

    }
      
}



function smoothstep ( x,edge0=0, edge1=1) {
  // Scale, and clamp x to 0..1 range
  x = clamp((x - edge0) / (edge1 - edge0),0,1);

  return x * x * (3.0 - 2.0 * x);
}

