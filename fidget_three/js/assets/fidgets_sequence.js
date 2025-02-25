
import Vector from '../utils/vector.js';
import Matrix from '../utils/matrix.js';
import { Chrono, 
  Draw_text_debug, 
  clamp, 
  strictObject,
} from '../utils/utils.js';
import {
  user_interaction_info
} from '../core/mouse.js'
  
import fidget_daft_i from '../assets/fidget_daft_i.js';
import fidget_windmill from '../assets/fidget_windmill.js';
import fidget_simple_slide from '../assets/fidget_simple_slide.js';



class fidgets_sequence_physics
{
    constructor( args_in, main )
    {
        const args_default = {};
        const args = {...args_default, ...args_in}
        
        this.main = main
        //
        this.resolution_coefs = []
        this.resolution_coef = 0
        this.fidgets_do_computation = []
        this.fidgets_do_computation_last = []
    }

    get_resolution_coef_info()
    {   
      this.resolution_coefs = []
      for( let F of this.main.fidgets)
        this.resolution_coefs.push(F.physics.get_completion_coef())      
      
      let coef = 0
      for( let i = 0; i < this.main.fidgets_nbr; i++ )
        coef += this.resolution_coefs[i]
      
      this.resolution_coef = coef / this.main.fidgets_nbr
    }

    is_fidget_in_focus(i)
    {
      const rez = this.resolution_coef
      const rez_step = rez*this.main.fidgets_nbr
      const coef = this.main.fidgets_nbr-rez_step

      let coef_cleaned = coef
      coef_cleaned = Math.round(coef_cleaned*100)/100
      coef_cleaned = Math.ceil(coef_cleaned) 
      
      const result = ((  i-1< coef_cleaned )&&(  coef_cleaned <= i+1 ))
     
      return result
    }   
    
    get_fidget_to_compute()
    {
      let fidgets_to_compute = []
      for( let i = 0; i < this.main.fidgets.length; i++ )
        fidgets_to_compute.push( this.is_fidget_in_focus(i) )

      return fidgets_to_compute
    }

    get_fidget_in_focus()
    {
      let fidget_focus_id = 0
      for( let i = 0; i < this.main.fidgets.length; i++ )
        if( this.fidgets_do_computation[i] )
        {
          fidget_focus_id = i
          break
        }  
      return fidget_focus_id    
    }

    enable_fidgets_in_focus()
    {
      for( let i = 0; i < this.main.fidgets.length; i++ )
      {   
        let do_computation = this.fidgets_do_computation[i]

        if( this.fidgets_do_computation_last[i] != do_computation )
            this.main.fidgets[i].enable(do_computation)
    
        this.fidgets_do_computation_last[i] = do_computation
      }
    }

    update()
    { 
      this.get_resolution_coef_info()
      this.fidgets_do_computation = this.get_fidget_to_compute()
      this.fidget_focus_id = this.get_fidget_in_focus()
      
      this.enable_fidgets_in_focus()
  
      for( let i = 0; i < this.main.fidgets.length; i++ )
      {   
        if(this.fidgets_do_computation[i] == false)
          continue  
        this.main.fidgets[i].physics.update()
        
        if( user_interaction_info.userInteractionChange )
        {
          this.main.fidgets[i].physics.update_bodies_select_state()
          this.main.fidgets[i].render.mouse_select_highlight() // !!!!!
        }  
      }

    }

  setup()
  {
    this.fidget_focus_id = 0
    this.resolution_coef = 0
    this.resolution_coefs = []    
    // setup
    this.fidgets_do_computation = []
    this.fidgets_do_computation_last = []  
    for( let i = 0; i < this.main.fidgets.length; i++)
    {
      this.fidgets_do_computation.push(null)
      this.fidgets_do_computation_last.push(null)
    }
  }



}

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////


class fidgets_sequence_render
{
    constructor( args_in,  main, physics  )
    {
        const args_default = {
          debug : false};

        const args = {...args_default, ...args_in}
        
        this.main = main
        this.physics = physics

        // init memory
        this.debug_mode = args.debug
        this.draw_text_debug = null
    }
    

    set_debug( debug )
    {
      this.debug_mode = debug

      
      this.main.fidgets[this.physics.fidget_focus_id].render.set_debug(this.debug_mode)

      if(this.debug_mode.fidget_steps_info)
          this.draw_text_debug = new Draw_text_debug(this.main.screen_dims)
      else
      {
        if( this.draw_text_debug != null )
        {
          this.draw_text_debug.clean()
          this.draw_text_debug = null
        }
          
      } 
      this.setup_debug_three(this.main.Game_engine.render_scene)      
    }

    setup_debug_three(scene_three)
    {
      if(this.debug_mode.fidget_steps_info)
        this.draw_text_debug.setup_three(scene_three)
    }


    update()
    {

      for( let i = 0; i < this.main.fidgets.length; i++ )
      {   
        if(this.physics.fidgets_do_computation[i] == false)
          continue  
        this.main.fidgets[i].render.update()
      }


      if(this.debug_mode.fidget_steps_info)
      {
        let F = this.main.fidgets[this.physics.fidget_focus_id].physics.state;
        const time = this.main.fidgets[this.physics.fidget_focus_id].Game_engine.time
        let texts_to_draw = [
          
          'count : ' + time,
          'res : ' + Math.round( F.resolution_coef*100, 2 )/100 + ' / 4',
          'last selection switch step : ' + F.switch_selection_happened_step,
          '0 - count: ' + Math.max( 0, time - F.steps[0].time_start ),
          '0 - res: ' + Math.round( F.steps[0].resoluton_coef*100, 2)/100 + ' / 1',
          '1 - count: ' + Math.max( 0, time - F.steps[1].time_start ),
          '1 - res Coef: ' + Math.round( F.steps[1].resoluton_coef*100, 2)/100 + ' / 1',
          '2 - count: ' + Math.max( 0, time - F.steps[2].time_start ) ,
          '2 - res Coef: ' + Math.round( F.steps[2].resoluton_coef*100, 2)/100 + ' / 1',
          '3 - count: ' + Math.max( 0, time - F.steps[3].time_start ) ,
          '3 - res Coef: ' + Math.round( F.steps[3].resoluton_coef*100, 2)/100 + ' / 1' ,
          '4 - count: ' + Math.max( 0, time - F.steps[4].time_start ),
          '4 - res Coef: ' + Math.round( F.steps[4].resoluton_coef*100, 2)/100 + ' / 1',
          '5 - count: ' + Math.max( 0, time - F.steps[5].time_start ),
          '5 - res Coef: ' + Math.round( F.steps[5].resoluton_coef*100, 2)/100 + ' / 1',
          
          
        ]
        this.draw_text_debug.update_three(texts_to_draw)
      }
    }  
    
  setup()
  {
    this.set_debug(this.debug_mode)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

export default class fidgets_sequence
{
    constructor( args_in )
    {
        const args_default = {
          shaders : [],
          debug : false,
          fidget_choice : null };

        const args = {...args_default, ...args_in}
        

        this.physics = new fidgets_sequence_physics(args, this)
        this.render = new fidgets_sequence_render(args, this, this.physics)
        this.Game_engine = null
        this.fidgets = []

        // init memory
        this.fidgets_nbr = args.nbr
        this.m = args.m
        this.s = args.s
        this.debug_mode = args.debug
        this.force_way = 1
        this.screen_dims = args.screen_dims
        this.fidget_choice = args.fidget_choice
        this.dom_canvas = args.dom_canvas


    }


    get_random_fidget(in_options)
    {
      
      let r = Math.random()
      if(  0.5 < r)
        return new fidget_windmill(in_options)
      else
        return new fidget_daft_i(in_options)   
    }

    setup( Game_engine = null )
    {
      if( Game_engine != null )
        this.Game_engine = Game_engine

      const e_test_title = document.getElementById('test_title')
      e_test_title.textContent = 'fidgets_sequence'

      //clean
      this.fidgets = []

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
            dom_canvas : this.dom_canvas ,
            Game_engine : this.Game_engine,
            fidget_sequence_index : i +1,
            force_way : this.force_way,
          }
          var fidget = null
          if( this.fidget_choice == "fidget_windmill" )
            fidget = strictObject( new fidget_windmill(opts) )
          else if( this.fidget_choice == "fidget_daft_i" )
            fidget = strictObject ( new fidget_daft_i(opts) )
          else if( this.fidget_choice == "fidget_simple_slide" )
            fidget = strictObject( new fidget_simple_slide(opts) )
          else
            fidget = strictObject( this.get_random_fidget(opts) )
          
          z_depth = fidget.z_depth_end
          
          this.fidgets.push(fidget)
      }
      // setup
      for( let i = 0; i < this.fidgets_nbr; i++)
        this.fidgets[i].setup();


      this.physics.setup()
      this.render.setup()
    }

    clean()
    {
      for( let F of this.fidgets)
        F.clean()
    }

    reset()
    {
      this.clean()
      this.setup()
    }

    set_game_engine_ref(Game_engine)
    {
      this.Game_engine = Game_engine
    }


      
}



function smoothstep ( x,edge0=0, edge1=1) {
  // Scale, and clamp x to 0..1 range
  x = clamp((x - edge0) / (edge1 - edge0),0,1);

  return x * x * (3.0 - 2.0 * x);
}

