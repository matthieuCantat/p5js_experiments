class shader_build
{
  constructor()
  {
    this.iFrame = 0;
    this.iTime = 0;
    this.iResolution = {x:0.,y:0.};
    this.iResolution_main_canvas = {x:0.,y:0.};

    this.iMouse = {x:0.,y:0.};
    this.objCanvasRatio ={x:1.,y:1.};
    this.uvRotatePivot ={x:0.5,y:0.5};
    this.uvOffset ={x:0.,y:0.};
    this.uvOffsetRotate =0.;
   
    this.text =null; 
    this.text_glow = null; 
    this.blur_background =0.; 
    this.blur_background_samples = 35;
    this.blur_background_samples_LOD =2;  
  
    this.glow_background_size =0.; 
    this.glow_background =0.; 
  
    this.bg_transparency =0.; 
    this.boder_size =0.0;
    this.hatching_line =0.;
  
    this.bg_animation =0.0;
    this.bg_animation_offset =0.0;
    this.bg_grain =0.0;
    this.bg_grain_scale =2.0;
    this.bg_grid =0.0;
    this.bg_grid_scale = 4.;
    this.bg_grid_line_scale =1.0;
    this.bg_grid_point_scale =1.0; 
    this.bg_colorA =[255., 0., 114.];//vec3(.910, .510, .8,
    this.bg_colorB =[197., 255., 80.];//vec3(.957, .804, .623,
    this.bg_colorC =[48.96,97.92,237.915];//vec3(.192, .384, .933,
    this.bg_colorD =[89.25,181.05,243.015];//vec3(0.350, .71, .953,
    this.bg_typeA =0.0;
    this.bg_typeB =0.0;
    this.bg_typeC =0.0;
    this.bg_typeD =0.0;
    this.bg_type_discoTarget = 0.0;
  
    this.light_beam =0.;
    this.glow_power = 0.;
    this.debug =0;  

    this.glow_remove_white_original = 0.;

    this.shdr = null;
    this.canvas = null
  }

  preload()
  {
    this.shdr = loadShader('shader.vert', 'shdr_body.frag');
  }

  setup(resolution,canvas_resolution=null)
  {
    
    this.iResolution = resolution
    if( canvas_resolution != null )
    {
      this.iResolution_main_canvas = canvas_resolution;
      //this.objCanvasRatio.x = this.iResolution.x / this.iResolution_main_canvas.x
    }
    else
    {
      this.iResolution_main_canvas = {x:0.,y:0.};
    }
    this.canvas = createGraphics(this.iResolution.x, this.iResolution.y, WEBGL); // create renderer 
    //drawingContext.getExtension("OES_standard_derivatives");
    this.canvas.clear();
    this.canvas.noStroke();// turn off the cg layers stroke  
    
  }   

  update()
  {
    //this.canvas.clear()
    //this.canvas.background(0);
    this.canvas.shader(this.shdr) // Use as background
    
    
    this.shdr.setUniform("iFrame", this.iFrame);
    this.shdr.setUniform("iTime", this.iTime);

    this.shdr.setUniform("iResolution", [this.iResolution.x,this.iResolution.y]);
    this.shdr.setUniform("iMouse", [this.iMouse.x,this.iMouse.y]);
    this.shdr.setUniform('uvOffset',[this.uvOffset.x,this.uvOffset.y]) 
    this.shdr.setUniform('objCanvasRatio',[this.objCanvasRatio.x,this.objCanvasRatio.y]) 
    this.shdr.setUniform('uvRotatePivot',[this.uvRotatePivot.x,this.uvRotatePivot.y])   
    this.shdr.setUniform('uvOffsetRotate',this.uvOffsetRotate) 
    if( this.text != null)
      this.shdr.setUniform('text',this.text)  
    if( this.text_glow != null)
      this.shdr.setUniform('text_glow',this.text_glow)  
      
    this.shdr.setUniform('glow_power',this.glow_power)
    
  
    this.shdr.setUniform('blur_background',this.blur_background) 
    this.shdr.setUniform('blur_background_samples', this.blur_background_samples)
    this.shdr.setUniform('blur_background_samples_LOD',this.blur_background_samples_LOD)  
    this.shdr.setUniform('glow_background_size',this.glow_background_size) 
    this.shdr.setUniform('glow_background',this.glow_background) 
    this.shdr.setUniform('background_transparency',this.bg_transparency)//1.) 
    
    this.shdr.setUniform('boder_size',this.boder_size)//max(0.0,cos(draw_count/20)) )
    this.shdr.setUniform('hatching_line',this.hatching_line)
    
    this.shdr.setUniform('background_animation',this.bg_animation)
    this.shdr.setUniform('background_animation_offset',this.bg_animation_offset)
    this.shdr.setUniform('background_grain',this.bg_grain)
    this.shdr.setUniform('background_grain_scale',this.bg_grain_scale)
    this.shdr.setUniform('background_grid',this.bg_grid)
    this.shdr.setUniform('background_grid_scale', this.bg_grid_scale)
    this.shdr.setUniform('background_grid_line_scale',this.bg_grid_line_scale) 
    this.shdr.setUniform('background_grid_point_scale',this.bg_grid_point_scale) 
  
    this.shdr.setUniform('background_colorA',this.bg_colorA);//vec3(.910, .510, .8);
    this.shdr.setUniform('background_colorB',this.bg_colorB);//vec3(.957, .804, .623);
    this.shdr.setUniform('background_colorC',this.bg_colorC);//vec3(.192, .384, .933);
    this.shdr.setUniform('background_colorD',this.bg_colorD);//vec3(0.350, .71, .953);
  
    
    this.shdr.setUniform('background_typeA',this.bg_typeA);
    this.shdr.setUniform('background_typeB',this.bg_typeB);
    this.shdr.setUniform('background_typeC',this.bg_typeC);
    this.shdr.setUniform('background_typeD',this.bg_typeD);
    this.shdr.setUniform('background_type_discoTarget',this.bg_type_discoTarget);
    this.shdr.setUniform('light_beam',this.light_beam)

    this.shdr.setUniform('glow_remove_white_original',this.glow_remove_white_original)
  
    this.shdr.setUniform('debug',this.debug)   


    this.canvas.rect(0,0,this.iResolution.x, this.iResolution.y);// INIT     
    
  }



  as_texture( out_canvas = null)
  {
    
    this.update()
    
    if( out_canvas == null)
      texture(this.canvas);
    else
      out_canvas.texture(this.canvas);
      
    
  }
  as_image(out_canvas = null)
  {
    
    this.update()
    if( out_canvas == null)
      image(this.canvas,this.iResolution.x/2*-1,this.iResolution.y/2*-1,this.iResolution.x,this.iResolution.y) 
    else
      out_canvas.image(this.canvas,this.iResolution.x/2*-1,this.iResolution.y/2*-1,this.iResolution.x,this.iResolution.y)    
    
  }

}
