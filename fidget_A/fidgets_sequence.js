

class fidgets_sequence
{
    constructor( nbr, m, s, debug=false)
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


        this.chrono_end_time_show_start = 0
        this.chrono_end_time_show_end = 0       
        // setup
        this.chrono = new Chrono()

        for( let i = 0; i < this.fidgets_nbr; i++)
        {
            //var fidget = new fidget_windmill(new Matrix(this.m),this.s,this.debug_mode)
            //var fidget = new fidget_daft_i(new Matrix(this.m),this.s,this.debug_mode)
            var fidget = this.get_random_fidget(new Matrix(this.m),this.s,this.debug_mode)
            fidget.setup()
            fidget.force_way = this.force_way
            fidget.fidget_sequence_i = i + 1
            this.fidgets.push(fidget)

            
        
            if( this.draw_debug == null)
            {
                this.draw_debug = new Draw_debug()
                this.draw_debug.fidget = fidget
                this.draw_debug.mouse_cns = mouseConstraint
            }
        }
        

     
        
    }

    get_random_fidget(p,s,debug)
    {
      let r = Math.random()
      if(  0.5 < r)
        return new fidget_windmill(p,s,debug)
      else
        return new fidget_daft_i(p,s,debug)   
    }

    draw_background()
    {
      // too slow
      /*
        
        
        let c1 = color(10,10,10);
        let c2 = color(10,10,10);
        let c3 = color(80,80,100);
        let middle_height = height/2
        
        for(let y=0; y<middle_height; y++)
        {
            let n = map(y ,0,middle_height,0,1);
          let newc = lerpColor(c1,c2,n);
          stroke(newc);
          line(0,y,width, y);
        }
        for(let y=middle_height; y<height; y++)
        {
            let n = map(y,middle_height,height,0,1);
          let newc = lerpColor(c2,c3,n);
          stroke(newc);
          line(0,y,width, y);
        }      
        */  
    }

    draw_fidgets()
    {
      var rez = this.get_resolution_coef_info()
      var rez_step = rez*this.fidgets_nbr

      if( 0.9< rez)
      {
        fill(0)
        textSize(100);
        textAlign(CENTER);
        text( '?', width/2,height/2+cos(this.update_count/10)*20+30)        
      }

      var i_max = this.fidgets_nbr
      var coef = i_max-rez_step
      //console.log(round(coef,2))
      for( let i = 0; i < this.fidgets.length; i++ )
      {   
        if(this.anim_mode == false)
        {
          if((  i-1< coef  )&&(  coef <= i+1 ))
          {
            console.log(i)
          }
          else{
            continue
          }

        }


        this.fidgets[i].update()
        this.fidgets[i].draw()
        this.fidgets[i].mouse_select_highlight(mouseConstraint)


        

      }
      /*

        var _fidget_to_show_next = [this.fidgets_to_show[0],this.fidgets_to_show[1]]
        for( let i = 0; i < this.fidgets_to_show.length; i++ )
        {
          let iF = this.fidgets_to_show[i]
          if( iF == null )
            continue
          if( iF < 0 )
            continue      
          this.fidgets[iF].update()
          this.fidgets[iF].draw()
          this.fidgets[iF].mouse_select_highlight(mouseConstraint)
          
          
          if((i==0)&&( this.fidgets[iF].state.resolution_coef == this.fidgets[iF].end_step-1 ))
          {
            _fidget_to_show_next[1] = iF
            _fidget_to_show_next[0] = iF-1
            this.fidgets[iF].desactivate_touch()
          }
        }
        this.fidgets_to_show = _fidget_to_show_next
        */
      
    }
    draw_chrono()
    {

        var p_chrono = createVector(0, 0)
        var s_chrono = 0
        
      
        if(this.fidgets_to_show[0] < 0 )
        {
          var a = min(1,max(0,end_update_count / 100))
          this.chrono.stop()
          let blendA = (0.1*(1-a)+0.5*a)
          let blendB = (0.05*(1-a)+0.07*a)
          p_chrono = createVector(width * 0.5, height * blendA )
          s_chrono = width * blendB
      
          end_update_count += 1
        }
        else
        {
          p_chrono = createVector(width * 0.5, height * 0.1)
          s_chrono = width * 0.05
          end_update_count = 0
      
        }
        //this.chrono.p = p_chrono
        //this.chrono.s = s_chrono
        this.chrono.update()
        this.chrono.draw()
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
      var _count = max( 0, this.update_count-intro_reverse_anim_start)
      var _anim = smoothstep( 1 - _count/_delta )
      this.do_anim_override(_anim )  
      //////////////////////////////////////////////////// INTRO
      var chrono_appears_start = 250
      var chrono_appears_end   = 290  
      _delta = chrono_appears_end-chrono_appears_start
      _count = max( 0, this.update_count-chrono_appears_start)
      _anim = smoothstep( 1 - _count/_delta )
      
      let blendA = (0.1*(1-_anim)+0.5*_anim)
      let blendB = (0.05*(1-_anim)+0.07*_anim)

      if(_count==0)
        this.chrono.v = false
      else
        this.chrono.v = true

      this.chrono.p = createVector(width * 0.5, height * blendA )
      this.chrono.s = width * blendB
      
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
        _count = max( 0, this.update_count-this.chrono_end_time_show_start)
        _anim = smoothstep( _count/_delta )
        
        
        let blendA = (0.1*(1-_anim)+0.5*_anim)
        let blendB = (0.05*(1-_anim)+0.07*_anim)
  
        this.chrono.p = createVector(width * 0.5, height * blendA )
        this.chrono.s = width * blendB
      }


      this.update_count += 1
    }

    draw() {
        background(50);
        this.draw_fidgets()
        this.draw_chrono()

        if(this.debug_mode)
            this.draw_debug.draw()

      }
      
}



function smoothstep ( x,edge0=0, edge1=1) {
  // Scale, and clamp x to 0..1 range
  x = clamp((x - edge0) / (edge1 - edge0),0,1);

  return x * x * (3.0 - 2.0 * x);
}

