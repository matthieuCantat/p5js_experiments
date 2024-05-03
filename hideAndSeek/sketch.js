class Agent{

  constructor()
  {    
    //MOTION - ATTRIBUTE
    this.pos   = createVector(0.0,0.0)
    this.speed = createVector(0.0,0.0)
    this.accel = createVector(0.0,0.0)
    
    this.angular_pos   = 0.0
    this.angular_speed = 0.0
    this.angular_accel = 0.0
    
    //STATE - ATTRIBUTE
    this.excitement = 1.0
    
    //MOTION - SETTING
    this.pos_limit   = [ 0.0 , canvasSize[0], 0.0 , canvasSize[1]]
    this.speed_limit = [ 0.0 , 5.0]
    this.accel_limit = [ 0.0 , 5.0]

    this.angular_pos_limit   = [ -1000.0 ,1000.0]
    this.angular_speed_limit = [ -0.2 ,0.2]
    this.angular_accel_limit = [ -0.1 ,0.1]
      
    //PROPERTY - SETTING
    this.size            = 20.0
    
    this.vision          = 30
    this.slowDownDist    = [ 30.0 , 100.0]
    this.slowDownAngle   = [ 10.0 , 75.0]   
    
    //TARGET - ATTRIBUTE

    this.target                 = createVector(0.0, 0.0);
    
    this.target_mind_pos        = createVector(0.0, 0.0);
    this.target_mind_pos_last   = createVector(0.0, 0.0);    
    this.target_mind_speed      = createVector(0.0, 0.0);
    this.target_mind_speed_last = createVector(0.0, 0.0);    
    this.target_mind_accel      = createVector(0.0, 0.0);
    
    this.target_out_canvas     = false
    this.target_in_vision      = false
    this.target_mind_in_vision = true
    
    //COLLISION - ATTRIBUTE
    this.collision_agents = []
    
    //COLLISION - SETTING
    this.collision_others = 0.9
    
    //AVOID - ATTRIBUTE
    this.avoid_agents = []
    this.in_vision_agents = []
    
    //AVOID - SETTING
    this.avoid_others = 0.01
    this.avoid_dist   =  50.0    
    
    //VISUAL
    this.draw_helpers       = false
    this.draw_vision        = true
    this.draw_vision_target = true
    this.draw_target        = true
    this.draw_target_aim    = true
    this.draw_target_dist   = true
    this.draw_avoid         = true
    this.draw_collision     = true
    
    this.shape_type   = "circle"
    this.shape_color  = [170,170,170,250]
    
    this.vision_size  = 200.0
    this.vision_color  = [170,170,170,10]
    
    
    this.colorVisionStroke = [250,250,250,250]
    
    this.canvas      = canvas  
  }
  
  randomPosition()
  {
    this.pos = createVector( random(this.pos_limit[0] , this.pos_limit[1]) , random( this.pos_limit[2] , this.pos_limit[3])  )
    this.target_mind = createVector( random(this.pos_limit[0] , this.pos_limit[1]) , random( this.pos_limit[2] , this.pos_limit[3])  )
  }

  keepPositionInCanvas()
  {
    if( this.pos.x        < this.pos_limit[0] ) this.pos.x = ( this.pos.x        - this.pos_limit[0] ) + this.pos_limit[1]
    if( this.pos_limit[1] < this.pos.x        ) this.pos.x = ( this.pos_limit[1] -this.pos.x         ) + this.pos_limit[0]
    
    if( this.pos.y        < this.pos_limit[2] ) this.pos.y = ( this.pos.y        - this.pos_limit[2] ) + this.pos_limit[3]
    if( this.pos_limit[3] < this.pos.y        ) this.pos.y = ( this.pos_limit[3] - this.pos.y        ) + this.pos_limit[2]
  }  

  randomSpeed()
  {
    let randomSpeed = random(this.speed_limit[0] , this.speed_limit[1] )
    this.speed = p5.Vector.random2D();
    let v = createVector(1,0)
    this.angular_pos = v.angleBetween(this.speed);
    this.speed.mult(randomSpeed);
    
  }
  
  followTarget( )
  {  
      //________________________________________________________________________ORIENT
      this.angular_accel = 0
      
      //ORIENT - ADD STEERING   
      let vTargetA      = p5.Vector.sub( this.target_mind_pos , this.pos )
      let vOrientA      = createVector(  cos( this.angular_pos ) , sin( this.angular_pos )     ) 
      let desirRotation = degrees( vOrientA.angleBetween(vTargetA) )
      
      
      if( abs( desirRotation ) < this.slowDownAngle[1] )
        desirRotation *=  max( 0.0 , ( abs( desirRotation) - this.slowDownAngle[0] ) ) / this.slowDownAngle[1]   

      this.angular_accel += desirRotation
      
      //________________________________________________________________________POS
      this.accel = createVector(0,0)
      
      //POS - GET FRICTION 
      this.accel.add( this.speed *-1 * this.friction) 
      
      
      //POS - ADD STEERING
      let l_rays  = this.size 
      let vDesir  = p5.Vector.sub( this.target_mind_pos , this.pos )
      let l_delta = vDesir.mag() - l_rays
      
      
      if( 0 < l_delta )
        {

          let desirSpeed = this.speed_limit[1]
          
          if( l_delta < this.slowDownDist[1]   )
              desirSpeed *= max( 0.0 , ( ( l_delta - this.slowDownDist[0]) / this.slowDownDist[1] ) )
             
          
          
          vDesir.setMag(desirSpeed)
          
          
          let vSteer = p5.Vector.add( vDesir , this.speed * -1 )
          
          //DIR CONSTRAINT
          
          if( this.onlyFrontDriving )
            {
              let vOrient = createVector(  cos(this.angular_pos) , sin(this.angular_pos)     ) 
              vOrient.mult( vOrient.dot(vSteer) )
              vSteer = vOrient;              
            }
           
          
          this.accel.add( vSteer )
                            
        }  
        
  
  }  
  
  avoidOthers( Agents , iSelf )
  {
    
    let vDelta_cumulate = createVector();
    this.avoid_agents     = []
    this.in_vision_agents = []
    for( var i = 0 ; i < Agents.length ; i++ )
    {
      if( i == iSelf ) continue
      
      
      let vTarget       = p5.Vector.sub( Agents[i].pos , this.pos)
      let vOrient      = createVector(  cos(this.angular_pos)* this.size  , sin(this.angular_pos) * this.size    )  
      let angleTarget  = degrees( vOrient.angleBetween(vTarget    ) )
   
      let is_in_vision = false
      if( abs(angleTarget) < this.vision )
        is_in_vision = true
    
      if( is_in_vision == false )
        continue
        
        
      this.in_vision_agents.push( Agents[i] )
        
      
      
      let min_delta = this.size + Agents[i].size + this.avoid_dist
      let vDelta = p5.Vector.sub(this.pos, Agents[i].pos)
      let current_delta = vDelta.mag()
      
      
      if( current_delta < min_delta )
        {
          vDelta.setMag( min_delta - current_delta )
          vDelta_cumulate.add(vDelta) 
          this.avoid_agents.push( Agents[i] )
          
          this.excitement = this.excitement +0.001
        }
    }   
    
    vDelta_cumulate.mult(this.avoid_others)
    //this.target_mind_pos.add( vDelta_cumulate )
    this.accel.add( vDelta_cumulate )
      
  }
  
  
  followOthers( Agents , iSelf )
  {
    
    let vDelta_cumulate = createVector();
    let vPos_cumulate = createVector();
    
    this.in_vision_agents = []
    for( var i = 0 ; i < Agents.length ; i++ )
    {
      if( i == iSelf ) continue
      
      
      let vTarget       = p5.Vector.sub( Agents[i].pos , this.pos)
      let vOrient      = createVector(  cos(this.angular_pos)* this.size  , sin(this.angular_pos) * this.size    )  
      let angleTarget  = degrees( vOrient.angleBetween(vTarget    ) )
   
      let is_in_vision = false
      if( abs(angleTarget) < this.vision )
        is_in_vision = true
    
      if( is_in_vision == false )
        continue
        
        
      this.in_vision_agents.push( Agents[i] )
        
      
      vDelta_cumulate.add( Agents[i].accel )
      vPos_cumulate.add( Agents[i].pos)
    }   
    
    if( ( 0 < Agents.length  )&&( 1.0 < vDelta_cumulate.mag() ) )
    {
      vDelta_cumulate.mult(10.0)
      
      vPos_cumulate.div( Agents.length )
      
      //this.target_mind_pos = vPos_cumulate
      this.target_mind_pos.add( vDelta_cumulate )      
    }

      
  }
  
  
  collisionOthers( Agents , iSelf )
  {
    let vDelta_cumulate = createVector();
    this.collision_agents = []   
    for( var i = 0 ; i < Agents.length ; i++ )
    {
      if( i == iSelf ) continue
      
      let min_delta = this.size + Agents[i].size 
      let vDelta = p5.Vector.sub(this.pos, Agents[i].pos)
      let current_delta = vDelta.mag()
      
      if( current_delta < min_delta )
        {
          vDelta.setMag(min_delta - current_delta)
          vDelta_cumulate.add(vDelta) 
          this.collision_agents.push( Agents[i] )
          this.excitement = this.excitement +0.005
        }
    }   
    vDelta_cumulate.mult(this.collision_others)
    this.accel.add( vDelta_cumulate )
  }  
  
  
  update_mind_target()
  {
    

    
    let vTarget     = p5.Vector.sub( this.target , this.pos)
    let vTargetMind = p5.Vector.sub( this.target_mind_pos , this.pos)
    let vOrient     = createVector(  cos(this.angular_pos)* this.size  , sin(this.angular_pos) * this.size    )
    
    let angleTarget     = degrees( vOrient.angleBetween(vTarget    ) )
    let angleTargetMind = degrees( vOrient.angleBetween(vTargetMind) )
    
    
    this.target_mind_in_vision = true
    
    this.target_in_vision = false
    if( ( abs(angleTarget) < this.vision )&&( this.target_out_canvas == false ) )
      this.target_in_vision = true
    
    let target_mind_in_vision = false
    if( abs(angleTargetMind) < this.vision )
      target_mind_in_vision = true
    
    
    if( this.target_in_vision )
      {
        this.target_mind_pos_last   = this.target_mind_pos
        this.target_mind_pos        = this.target
        
        this.target_mind_speed_last = this.target_mind_speed
        this.target_mind_speed      = p5.Vector.sub( this.target_mind_pos , this.target_mind_pos_last )
        
        //this.target_mind_accel      = p5.Vector.sub( this.target_mind_speed , this.target_mind_speed_last ) 
        this.target_mind_in_vision = true
        
        this.excitement = 1.0
      }
    else
    {


      if( target_mind_in_vision )
        {
           let angle_tmp = abs( degrees(this.target_mind_speed.angleBetween(vOrient)) )
           
          if( ( 0.01 < this.target_mind_speed.mag() )&&( 20.0 < angle_tmp ) )
              this.target_mind_in_vision = false
            else
              this.target_mind_in_vision = true       
        }
      else
        {
          this.target_mind_in_vision = false          
        }


      if( this.target_mind_in_vision == false )
        {
          this.target_mind_pos.add( this.target_mind_speed )       
        }
      else
        {
          let vOrient     = createVector(  cos(this.angular_pos)  , sin(this.angular_pos) )
                                         
          this.target_mind_speed    = createVector(0.0,0.0)
          this.target_mind_pos      = createVector(this.pos.x+vOrient.x*this.slowDownDist[0] ,this.pos.y+vOrient.y*this.slowDownDist[0] )
          this.target_mind_pos_last = createVector(this.pos.x+vOrient.x*this.slowDownDist[0] ,this.pos.y+vOrient.y*this.slowDownDist[0] )
          
          if(( this.speed.mag() < 0.001 )&&( abs( degrees( this.angular_speed )  < 0.001 ) )&&( 0.01 < this.excitement ) )
            {
              this.target_mind_pos = createVector( random(this.pos_limit[0] , this.pos_limit[1]) , random( this.pos_limit[2] , this.pos_limit[3])  )
              this.target_mind_pos_last = this.target_mind_pos
            }      
      
      
      
        }
        

      
      
    }
    
    
  }
  
  
  
  
  applyAccel( friction )
  {
    
    this.angular_accel = min( max( this.angular_accel , this.angular_accel_limit[0] ) , this.angular_accel_limit[1]  )
    this.angular_speed += this.angular_accel
    this.angular_speed = min( max( this.angular_speed , this.angular_speed_limit[0] ) , this.angular_speed_limit[1]  )
    this.angular_pos   += this.angular_speed

    this.angular_speed *= ( 1.0 - friction )
    
    
    
    let accel_mag = this.accel.mag()
    accel_mag = min( max( accel_mag , this.accel_limit[0] ) , this.accel_limit[1]  )
    this.accel.setMag(accel_mag)
    
    this.speed.add(this.accel)

    let speed_mag = this.speed.mag()
    speed_mag = min( max( speed_mag , this.accel_limit[0] ) , this.accel_limit[1]  )
    this.speed.setMag(speed_mag)
    
    this.pos.add( this.speed )
    
    this.speed.mult( 1.0 - friction )
    
    
    this.excitement = this.excitement - 0.0035
    
  }

  draw()
  {
    let vOrient = createVector(  cos(this.angular_pos)* this.size  , sin(this.angular_pos) * this.size    ) 
    

    
    if( this.draw_helpers )
    {
      if( this.draw_vision )
      {
        let stroke_size = 1.0
        let stroke_color = [250,250,250,250]
        
        stroke(stroke_color[0], 
               stroke_color[1], 
               stroke_color[2],
               stroke_color[3]);
        strokeWeight(stroke_size);     
        fill(color(this.vision_color[0], 
                   this.vision_color[1], 
                   this.vision_color[2],
                   this.vision_color[3]));   
        
        
        let vOrientA = p5.Vector.mult( vOrient , this.vision_size  );
        
        let vVisionA = createVector( vOrientA.x , vOrientA.y );
        let vVisionB = createVector( vOrientA.x , vOrientA.y );
        
        vVisionA.rotate(radians(this.vision))
        vVisionB.rotate(radians(this.vision*-1))
        
        triangle( this.pos.x, this.pos.y , 
                  this.pos.x + vVisionA.x, this.pos.y + vVisionA.y,
                  this.pos.x + vVisionB.x, this.pos.y + vVisionB.y); 
        
        line( this.pos.x , this.pos.y , 
              this.pos.x + vVisionA.x , this.pos.y + vVisionA.y )
      }
 

     
      if( this.draw_target )
      {
        strokeWeight(0); 
        fill(color(255,0,0,255)) 
        
        //DRAW POINT
        circle(this.target_mind_pos.x, this.target_mind_pos.y, 3*2)  
        
        fill(color(0,255,0,50)) 
        circle(this.target.x, this.target.y, 10*2)  
   
        //DRAW AIM
        stroke(255,0,0,255);
        strokeWeight(1);         
        line( this.pos.x , this.pos.y , this.target_mind_pos.x , this.target_mind_pos.y )  
        
        //DRAW ORIENT ZONE

        fill(color(0,0,0,0)) 
        arc( this.pos.x , this.pos.y ,  this.size*3 , this.size*3 , 
            this.angular_pos + radians(this.slowDownAngle[0]) , this.angular_pos + radians(this.slowDownAngle[1]) )
        
        arc( this.pos.x , this.pos.y ,  this.size*3 , this.size*3 , 
            this.angular_pos - radians(this.slowDownAngle[1]) , this.angular_pos - radians(this.slowDownAngle[0]) )
           
        
        //DRAW TRANSLATE ZONE
        stroke(250,250,250,250*this.excitement);
        strokeWeight(1); 
        fill(color(0,0,0,0));
            
        circle( this.target_mind_pos.x , this.target_mind_pos.y , this.slowDownDist[1] * 2 )
        circle( this.target_mind_pos.x , this.target_mind_pos.y , this.slowDownDist[0] * 2 )   
        
      }

      if( this.draw_avoid )
      {

        stroke(0,170,0,250);
        strokeWeight(1); 
        fill(color(0,170,0,100));
        
        
        
        let vision_avoid_draw_size = ( this.size + this.avoid_dist ) *2
        if( 0 < this.avoid_agents.length )
          arc( this.pos.x , this.pos.y ,  vision_avoid_draw_size, vision_avoid_draw_size, 
            this.angular_pos - radians(this.vision) , this.angular_pos + radians(this.vision) )
                
        
        for( var i = 0 ; i < this.avoid_agents.length ; i++ )
          line( this.avoid_agents[i].pos.x , this.avoid_agents[i].pos.y , this.pos.x , this.pos.y )
        
        
        stroke(170,170,170,170);
        for(  i = 0 ; i < this.in_vision_agents.length ; i++ )
          line( this.in_vision_agents[i].pos.x , this.in_vision_agents[i].pos.y , this.pos.x , this.pos.y )        
        
        
        
      }
    }
    

 

    
    //DRAW SHAPE
    if( this.shape_type == "triangle" )
    {
      let override_shape_size = 1.5
      vOrient.mult(override_shape_size)

      let sizeBack    = 0.5
      let stroke_color = [0,0,0,250]
      let stroke_size = 1.0
      
      
      stroke(stroke_color[0], 
             stroke_color[1], 
             stroke_color[2],
             stroke_color[3]);
      strokeWeight(stroke_size); 
      fill(color(this.shape_color[0], 
                 this.shape_color[1], 
                 this.shape_color[2],
                 this.shape_color[3]));
      
      let shapeCoordsFront = p5.Vector.add( this.pos , vOrient);
      let cBack  = p5.Vector.add( this.pos , p5.Vector.mult( vOrient , -1.0  ) );
  
      let vOrientBack  = createVector( vOrient.y , vOrient.x * -1 )
      
      vOrientBack.mult(sizeBack)
      
      let shapeCoordsBackA = p5.Vector.add( cBack , vOrientBack )
      let shapeCoordsBackB = p5.Vector.add( cBack , p5.Vector.mult( vOrientBack , -1.0  ) );
    
      //circle( this.pos.x , this.pos.y , this.size * 2 )
      triangle( shapeCoordsFront.x, shapeCoordsFront.y , 
                shapeCoordsBackA.x, shapeCoordsBackA.y,
                shapeCoordsBackB.x, shapeCoordsBackB.y);  
      
      
    }
    else if( this.shape_type == "circle" )
    {
      let sizeBack    = 0.5
      let stroke_color = [0,0,0,250]
      let stroke_size = 1.0
      
      
      stroke(stroke_color[0], 
             stroke_color[1], 
             stroke_color[2],
             stroke_color[3]);
      strokeWeight(stroke_size); 
      fill(color(this.shape_color[0], 
                 this.shape_color[1], 
                 this.shape_color[2],
                 this.shape_color[3]));
      
      
      circle( this.pos.x , this.pos.y , this.size * 2 )
      let pOrient  = p5.Vector.add( this.pos , vOrient )
      line(this.pos.x,this.pos.y , pOrient.x , pOrient.y)
      
    }

  }
  
}

/*
class AgentTarget{

  constructor( canvas )
  {
    this.pos     = createVector(0,0);
    this.size        = 20.0
    this.color       = [100,170,100,100]
    this.colorStroke = [170,170,170,250]
    this.canvas      = canvas  
  }
  
}
*/







class World{

  constructor()
  {
    this.objs         = [];    
    this.friction = 0.15;
    this.mouseOut = false
  }
  
  solve()
  {
    
    //BASE FORCES
    for( var i = 0 ; i < this.objs.length ; i++ )
    {
      this.objs[i].target = createVector( mouseX , mouseY ) 
      this.objs[i].target_out_canvas = this.mouseOut
      this.objs[i].keepPositionInCanvas()
      
      this.objs[i].update_mind_target()
      this.objs[i].followOthers( this.objs , i )
      this.objs[i].followTarget()
      this.objs[i].avoidOthers( this.objs , i )
      this.objs[i].collisionOthers(  this.objs , i )
      this.objs[i].applyAccel( this.friction )     
    }   

  }
  
  append( agent )
  {
    this.objs.push( agent )
  }
  
  draw()
  { 
     
    for( var i = 0 ; i < this.objs.length ; i++ )
      {

        
        this.objs[i].draw(); 
      }
        
  }
  
}


class user_control{
  
  
  constructor()
  {
    this.types             = []
    this.names             = []
    this.values            = []
    this.sections          = []

    this.names    = this.names.concat(    [ ' ==== WORLD ==== ' ,'agentNbr'            , 'friction'                    , 'debug_agent_num'    ]  )
    this.types    = this.types.concat(    [ 'text'              ,'slider'              , 'slider'                      , 'slider'             ]  )
    this.values   = this.values.concat(   [ ''                  , [ 1 , 0,  50 , 1 ]   , [ 0.15 , 0.0,  1.0 , 0.01 ]  , [ -1 , -1,  50 , 1 ] ]  )
    this.sections = this.sections.concat( [ ''                  , 'world'              , 'world'                       , ''                   ]  )

    this.names    = this.names.concat(    [ ' ==== AGENT ==== ' ,'shape'                , 'size'                         ]  )
    this.types    = this.types.concat(    [ 'text'              ,'enum'                 , 'slider'                       ]  )
    this.values   = this.values.concat(   [ ''                  , ['circle','triangle'] , [ 20.0 , 0.01,  100.0 , 0.1 ]  ]  )
    this.sections = this.sections.concat( [ ''                  , 'world'               , 'world'                        ]  )      
    
    this.names    = this.names.concat(    [  'speed_limit'                 , 'accel_limit'                ]  )
    this.types    = this.types.concat(    [  'slider'                      , 'slider'                     ]  )
    this.values   = this.values.concat(   [  [ 5.0 , 0.0,  100.0 , 0.01 ]  , [ 5.0 , 0.0,  100.0 , 0.01 ] ]  )
    this.sections = this.sections.concat( [  'world'                       , ''                           ]  )    
    
    this.names    = this.names.concat(    [ 'angular_speed_limit'         , 'angular_accel_limit'        ]  )
    this.types    = this.types.concat(    [ 'slider'                      , 'slider'                     ]  )
    this.values   = this.values.concat(   [ [ 0.2 , 0.0,  10.0 , 0.01 ]  , [ 0.1 , 0.0,  10.0 , 0.01   ] ]  )
    this.sections = this.sections.concat( [ 'world'                       , ''                           ]  ) 
    
    this.names    = this.names.concat(    [ 'vision'                       , 'slowDownDist_min'             , 'slowDownDist_max'              ]  )
    this.types    = this.types.concat(    [ 'slider'                       , 'slider'                       , 'slider'                        ]  )
    this.values   = this.values.concat(   [ [ 60.0 , 10.0 ,  180.0 , 1.0 ] , [ 30.0 , 10.0 ,  200.0 , 1.0 ] , [ 30.0 , 10.0 ,  200.0 , 1.0 ]  ]  )
    this.sections = this.sections.concat( [ 'world'                        , ''                             , ''                              ]   )     
    
    this.names    = this.names.concat(    [ 'slowDownAngle_min'            , 'slowDownAngle_max'              ]  )
    this.types    = this.types.concat(    [ 'slider'                       , 'slider'                        ]  )
    this.values   = this.values.concat(   [ [ 10.0 , 10.0 ,  200.0 , 1.0 ] , [ 10.0 , 10.0 ,  200.0 , 1.0 ]  ]  )
    this.sections = this.sections.concat( [ ''                             , ''                              ]   )   
    
    this.names    = this.names.concat(    [ 'collision_others'           , 'avoid_others'                  , 'avoid_dist'                     ]  )
    this.types    = this.types.concat(    [ 'slider'                     , 'slider'                        , 'slider'                         ]  )
    this.values   = this.values.concat(   [ [ 0.9 , 0.0 ,  1.0 , 0.01 ]  , [ 0.01 , 0.0 ,  1.0 , 0.01 ]    , [ 50.0 , 0.0 ,  100.0 , 0.1 ]    ]  )
    this.sections = this.sections.concat( [ ''                           , ''                              , ''                               ]   )      
    
    
    this.Objs       = []

  }

  build_ui()
  {  
    var y_step = 20.0;
    var x_col = 150;

    for( var i = 0 ; i < this.names.length ; i++ )
      {
        
        if( this.types[i] == 'slider')
          {
            let t = createP( this.names[i] );
            t.style('color', '#FFF');
            t.position( 0 , canvasSize[1] + y_step * i );  
            
            let s = createSlider(this.values[i][1], this.values[i][2], this.values[i][0], this.values[i][3] )
            s.position( x_col , canvasSize[1] + 15 + y_step * i ); 
            
            let v = createP( s.value() );
            v.style('color', '#FFF');
            v.position( x_col + 200 , canvasSize[1] + y_step * i  ); 
            
            //let r = createButton( 'reset' );
            //r.position( x_col + 250 , canvasSize[1] + 15 + y_step * i  );
            //r.mousePressed( toto , this , i )
            
            this.Objs.push( [t ,s , v ] )
          }
        else if( this.types[i] == 'text')
          {
            let t = createP( this.names[i] );
            t.style('color', '#FFF');
            t.position( 0 , canvasSize[1] + y_step * i );    
            this.Objs.push( [t] )
          }
        else if( this.types[i] == 'enum')
          {
            let t = createP( this.names[i] );
            t.style('color', '#FFF');
            t.position( 0 , canvasSize[1] + y_step * i );  
            
            let radio = createSelect( );
            for( var j =0 ; j < this.values[i].length ; j++ )
              {
                radio.option(  this.values[i][j]);                
              }
            radio.selected(this.values[i][0]) 
                 
            radio.position( x_col , canvasSize[1] + 15 + y_step * i );  
            
            this.Objs.push( [t,radio] )
          }
        
      }    
  }
  
  reset_ui( button_pressed_i  )
  {
    print( button_pressed_i)
    if( button_pressed_i != -1 )
      {
        this.Sliders[button_pressed_i].value( this.sliders_default_v[button_pressed_i]  )      
      }
  }

  update_ui( button_pressed_i = -1 )
  {    
    for( var i = 0 ; i < this.Objs.length ; i++ )
    {
      if( this.types[i] == 'slider' )
        this.Objs[i][2].html( this.Objs[i][1].value()  )//Sliders[i].value() )
    }

    
  }
  
  get_value( attr_name )
  {
    let i = this.names.indexOf(attr_name)
    if( this.types[i] == 'slider')
      return this.Objs[i][1].value()
    else if( this.types[i] == 'enum')
      return this.Objs[i][1].value()
    
  }
   
}




/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

//LAYOUT
var canvasSize        = [500, 500]
var canvasSizeDefault = [500, 500]

//INDIVIDUAL PARAM
var agentNbr = 1;



/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

var world;
var debug = true;

var uc       = null;
var buildUc = false


function setup() {
  //LAYOUT
  
  
  world = new World(); 
  
  let Canvas = createCanvas(canvasSize[0], canvasSize[1]);
  Canvas.mouseOut( utils_mouseOut )
  Canvas.mouseOver( utils_mouseIn )
  
  
  for( var i = 0 ; i < agentNbr ; i++ )
  {
    let newAgent = new Agent();  
    newAgent.randomPosition()
    newAgent.randomSpeed()
    
    world.append(newAgent) 
  }
  
  
  uc = new user_control()
  if( buildUc )
    uc.build_ui()
  
  
  
  

     
  //noLoop();
}


function draw() {
  
  background(100);
  world.solve();
  world.draw();
  
  for( i = 0 ; i < world.objs.length ; i++ )
  {
      world.objs[i].draw_helpers = debug
  }
  
  
  if( buildUc )
  {
  uc.update_ui()
  
  nbrAgents      = uc.get_value( 'agentNbr' )
  world.friction = uc.get_value( 'friction' )
  

  for( i = 0 ; i < world.objs.length ; i++ )
    {
      world.objs[i].shape_type     = uc.get_value( 'shape' )
      world.objs[i].size           = uc.get_value( 'size' )

      //world.objs[i].speed_limit          = uc.get_value( 'speed_limit' )
      //world.objs[i].accel_limit          = uc.get_value( 'accel_limit' )
      //world.objs[i].angular_speed_limit  = uc.get_value( 'angular_speed_limit' )
      //world.objs[i].angular_accel_limit  = uc.get_value( 'angular_accel_limit' )
          
      world.objs[i].vision           = uc.get_value( 'vision' )
      world.objs[i].slowDownDist[0]  = uc.get_value( 'slowDownDist_min' )
      world.objs[i].slowDownDist[1]  = uc.get_value( 'slowDownDist_max' )
      world.objs[i].slowDownAngle[0] = uc.get_value( 'slowDownAngle_min' )
      world.objs[i].slowDownAngle[1] = uc.get_value( 'slowDownAngle_max' )
      
      world.objs[i].collision_others  = uc.get_value( 'collision_others' )
      world.objs[i].avoid_others      = uc.get_value( 'avoid_others' )
      world.objs[i].avoid_dist        = uc.get_value( 'avoid_dist' )
      
      
      let debug_num = uc.get_value( 'debug_agent_num' )
      
      if( debug_num == -1 )
        {
          world.objs[i].draw_helpers = debug           
        }
      else
        {
            
          if( debug_num == i)
            world.objs[i].draw_helpers = debug 
        }

        
    }  
        
  }

}



function keyPressed() {
  
  //32 space bar
  //13 enter
  //72 h
  
  if (keyCode == 72)
  {
    if( debug == true ) debug = false
    else debug = true
  }

  if (keyCode == 32)
    {
      let add_agents = 1
      for( var i = 0 ; i < add_agents ; i++ )
      {
        let newAgent = new Agent(); 
        newAgent.randomPosition()
        newAgent.randomSpeed()
        
        world.append(newAgent) 
      }        
    }

  
}


function mousePressed() {
  print( 'mousePressed');
  touchStarted();
}


function utils_mouseOut()
{
  world.mouseOut = true 
}

function utils_mouseIn()
{
  world.mouseOut = false 
}




//FOR MOBILE PHONE

/* fullscreen() must be called in a touch or
 * mouse event to work!
 */
function touchStarted () {
  
  var fs = fullscreen();
  if (!fs) {
    fullscreen(true);
  }
}

/* full screening will change the size of the canvas */
function windowResized() {
  
  if( ( canvasSize[0] != windowWidth )&&( canvasSize[1] != windowHeight ))
  {
    canvasSize[0] = windowWidth;
    canvasSize[1] = windowHeight;
    
    resizeCanvas(windowWidth, windowHeight);
    for( i = 0 ; i < world.objs.length ; i++ )
      world.objs[i].pos_limit = [0,windowWidth,0,windowHeight]
  }
  else
  {
    canvasSize[0] = canvasSizeDefault[0];
    canvasSize[1] = canvasSizeDefault[1];
    
    resizeCanvas(canvasSizeDefault[0] , canvasSizeDefault[1] );
    for( i = 0 ; i < world.objs.length ; i++ )
      world.objs[i].pos_limit = [0,canvasSizeDefault[0],0,canvasSizeDefault[1] ]    
  }

  
}

/* prevents the mobile browser from processing some default
 * touch events, like swiping left for "back" or scrolling
 * the page.
 */
document.ontouchmove = function(event) {
    event.preventDefault();
};


