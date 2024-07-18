
import * as THREE from 'three';
import {
  get_texture,
  get_background,
  convert_to_three_color,
} from './utils_three.js';

import {
  utils,
  mouseX,
  mouseY,
  mix_value_function,
  map_range,
} from './utils.js';

var materials = {
    black: new THREE.MeshBasicMaterial( { color: 'black' } ),
    white: new THREE.MeshBasicMaterial( { color: 'white' } ),

    raw_shader_exemple: new THREE.RawShaderMaterial( {

        uniforms: {
            time: { value: 1.0 }
        },
        vertexShader: document.getElementById( 'raw_shader_exemple_vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'raw_shader_exemple_fragmentShader' ).textContent,
        side: THREE.DoubleSide,
        transparent: true

    } ),

    background_test : new THREE.ShaderMaterial( {
        uniforms: {
            time: { value: 1.0 }
        },
        vertexShader: document.getElementById( 'background_test_vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'background_test_fragmentShader' ).textContent

    } ),

    phong_yellow: new THREE.MeshPhongMaterial(  { 
                                        side: THREE.DoubleSide, 
                                        color: convert_to_three_color('yellow'), 
                                        map: null, 
                                        transparent:0, 
                                        opacity: 1,
                                        shininess: 2030,//30
                                        specular:utils.color.white,
                                    } ),

    simple : {
        uv_grid_opengl_grey: new THREE.MeshBasicMaterial( { map: get_texture('uv_grid_opengl_grey') } ),
        uv_grid_opengl: new THREE.MeshBasicMaterial( { map: get_texture('uv_grid_opengl') } ),
        cyan_grid: new THREE.MeshBasicMaterial( { map: get_texture('texture_cyan_grid') } ),
        gradient_blue_cyan_A: new THREE.MeshBasicMaterial( { map: get_texture('texture_gradient_blue_cyan_A') } ),
        gradient_blue_pink_A: new THREE.MeshBasicMaterial( { map: get_texture('texture_gradient_blue_pink_A') } ),
        gradient_blue_pink_B: new THREE.MeshBasicMaterial( { map: get_texture('texture_gradient_blue_pink_B') } ),
        gradient_blue_pink_C: new THREE.MeshBasicMaterial( { map: get_texture('texture_gradient_blue_pink_C') } ),
        gradient_blue_pink_D: new THREE.MeshBasicMaterial( { map: get_texture('texture_gradient_blue_pink_D') } ),
        gradient_gold_red_A: new THREE.MeshBasicMaterial( { map: get_texture('texture_gradient_gold_red_A') } ),
        gradient_yellow_green_oblique_line_A: new THREE.MeshBasicMaterial( { map: get_texture('texture_gradient_yellow_green_oblique_line_A') } ),
        grainy_gradient_blue_cyan_A: new THREE.MeshBasicMaterial( { map: get_texture('texture_grainy_gradient_blue_cyan_A') } ),
        grainy_gradient_blue_cyan_B: new THREE.MeshBasicMaterial( { map: get_texture('texture_grainy_gradient_blue_cyan_B') } ),
    },
    background:{
        uv_grid_opengl_grey: new THREE.MeshBasicMaterial( { map: get_texture('uv_grid_opengl_grey') } ),
        uv_grid_opengl: new THREE.MeshBasicMaterial( { map: get_texture('uv_grid_opengl') } ),
        abstract_shape_grid : new THREE.MeshBasicMaterial( { map: get_background('background_abstract_shape_grid') } ),
        big_spheres_grid    : new THREE.MeshBasicMaterial( { map: get_background('background_big_spheres_grid') } ),
        coherence_the_set_generation: new THREE.MeshBasicMaterial( { map: get_background('background_coherence_the_set_generation') } ),
        football_field     : new THREE.MeshBasicMaterial( { map: get_background('background_football_field') } ),
        purple_sphere_grid : new THREE.MeshBasicMaterial( { map: get_background('background_purple_sphere_grid') } ),
        space_grid         : new THREE.MeshBasicMaterial( { map: get_background('background_space_grid') } ),
        squares_grey_blur  : new THREE.MeshBasicMaterial( { map: get_background('background_squares_grey_blur') } ),            
    },

}
  


class three_material
{
  constructor( material = null)
  {
    this.material = material
  }

  prepare_geometry(geometry)
  {
  }  

  set(mesh)
  {
    this.prepare_geometry(mesh.geometry)
    mesh.material = this.material
  }

  update(mesh,count)
  {
  }

}

class material_raw_shader_exemple extends three_material
{
  constructor()
  {
    super(null)
    this.material = new THREE.RawShaderMaterial( {

        uniforms: {
            time: { value: 1.0 }
        },
        vertexShader: document.getElementById( 'raw_shader_exemple_vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'raw_shader_exemple_fragmentShader' ).textContent,
        side: THREE.DoubleSide,
        transparent: true

    } )
  }

  prepare_geometry(geometry)
  {
    // add random color to geometry
    let colors = []
    for ( let i = 0; i < geometry.getAttribute('position').count; i ++ ) {
        // adding r,g,b,a
        colors.push( Math.random() * 255 );
        colors.push( Math.random() * 255 );
        colors.push( Math.random() * 255 );
        colors.push( Math.random() * 255 );

    }
    //const positionAttribute = new THREE.Float32BufferAttribute( positions, 3 );
    const colorAttribute = new THREE.Uint8BufferAttribute( colors, 4 );
    colorAttribute.normalized = true; // this will map the buffer values to 0.0f - +1.0f in the shader
    //geometry.setAttribute( 'position', positionAttribute ); // arleady in
    geometry.setAttribute( 'color', colorAttribute );
  }  

  set(mesh)
  {
    this.prepare_geometry(mesh.geometry)
    mesh.material = this.material
  }

  update(mesh,count)
  {
    mesh.material.uniforms.time.value = count*0.01;
  }

}


class material_background_test extends three_material
{
  constructor()
  {
    super(null)
    this.material = new THREE.ShaderMaterial( {
        uniforms: {
            time: { value: 1.0 }
        },
        vertexShader: document.getElementById( 'background_test_vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'background_test_fragmentShader' ).textContent

    } )
  }

  prepare_geometry(geometry)
  {
  }  

  set(mesh)
  {
    this.prepare_geometry(mesh.geometry)
    mesh.material = this.material
  }

  update(mesh,count)
  {
    mesh.material.uniforms.time.value = count*0.01;
  }

}


class material_old_custom_exemple extends three_material
{
  constructor()
  {
    super(null)

    this.iFrame = 0;
    this.iTime = 0;
    this.iResolution = {x:window.innerWidth,y:window.innerHeight};

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

    this.material = new THREE.RawShaderMaterial( {

        uniforms: {
          iFrame: { value: this.iFrame },
          iTime: { value: this.iTime },
          iResolution: { value: [this.iResolution.x,this.iResolution.y]},
          iMouse: { value: [this.iMouse.x,this.iMouse.y] },
          uvOffset: { value: [this.uvOffset.x,this.uvOffset.y] },
          objCanvasRatio: { value: [this.objCanvasRatio.x,this.objCanvasRatio.y] },
          uvRotatePivot: { value: [this.uvRotatePivot.x,this.uvRotatePivot.y] },
          uvOffsetRotate: { value: this.uvOffsetRotate },
          text: { value: this.text },
          text_glow: { value: this.text_glow },
          glow_power: { value: this.glow_power },
          blur_background: { value: this.blur_background },
          blur_background_samples: { value: this.blur_background_samples },
          blur_background_samples_LOD: { value: this.blur_background_samples_LOD },
          glow_background_size: { value: this.glow_background_size },
          glow_background: { value: this.glow_background },
          background_transparency: { value: this.bg_transparency },

          boder_size: { value: this.boder_size },
          hatching_line: { value: this.hatching_line },

          background_animation: { value: this.bg_animation },
          background_animation_offset: { value: this.bg_animation_offset },
          background_grain: { value: this.bg_grain },
          background_grain_scale: { value: this.bg_grain_scale },
          background_grid: { value: this.bg_grid },
          background_grid_scale: { value: this.bg_grid_scale },
          background_grid_line_scale: { value: this.bg_grid_line_scale },
          background_grid_point_scale: { value: this.bg_grid_point_scale },

          background_colorA: { value: this.bg_colorA },
          background_colorB: { value: this.bg_colorB },
          background_colorC: { value: this.bg_colorC },
          background_colorD: { value: this.bg_colorD },

          background_typeA: { value: this.bg_typeA },
          background_typeB: { value: this.bg_typeB },
          background_typeC: { value: this.bg_typeC },
          background_typeD: { value: this.bg_typeD },
          background_type_discoTarget: { value: this.bg_type_discoTarget },
          light_beam: { value: this.light_beam },

          glow_remove_white_original: { value: this.glow_remove_white_original },

          debug: { value: this.debug },

        },

        vertexShader: document.getElementById( 'old_custom_exemple_vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'old_custom_exemple_fragmentShader' ).textContent,
        side: THREE.DoubleSide,
        transparent: true,
        glslVersion: THREE.GLSL3,

    } )
  }

  prepare_geometry(geometry)
  {
    //this.material.objCanvasRatio.value = [this.objCanvasRatio.x,this.objCanvasRatio.y]
    //this.material.text.value = this.text
    //this.material.text_glow.value = this.text_glow
  }  

  set(mesh)
  {
    this.prepare_geometry(mesh.geometry)
    mesh.material = this.material
  }

  update(mesh,count)
  {
    mesh.material.uniforms.iFrame.value = count*0.01;
    mesh.material.uniforms.iTime.value = count*0.01;
    mesh.material.uniforms.iMouse.value = { x: mouseX*2, y: map_range(mouseY, 0, this.iResolution.x, this.iResolution.y, 0)*2};
    //mesh.material.uniforms.uvOffset.value = [this.uvOffset.x,this.uvOffset.y]
    // mesh.material.uniforms.uvRotatePivot.value = [this.uvRotatePivot.x,this.uvRotatePivot.y]
    // mesh.material.uniforms.uvOffsetRotate.value = this.uvOffsetRotate

    // mesh.material.uniforms.glow_power.value = this.glow_power
    // mesh.material.uniforms.blur_background.value = this.blur_background
    // mesh.material.uniforms.blur_background_samples_LOD.value = this.blur_background_samples_LOD
    // mesh.material.uniforms.glow_background_size.value = this.glow_background_size
    // mesh.material.uniforms.glow_background.value = this.glow_background
    // mesh.material.uniforms.background_transparency.value = this.bg_transparency

    // mesh.material.uniforms.boder_size.value = this.boder_size
    // mesh.material.uniforms.hatching_line.value = this.hatching_line

    mesh.material.uniforms.background_animation.value = 1.
    // mesh.material.uniforms.background_animation_offset.value = this.bg_animation_offset
    mesh.material.uniforms.background_grain.value = 1.
    mesh.material.uniforms.background_grain_scale.value = 4.
    mesh.material.uniforms.background_grid.value = 0.0
    mesh.material.uniforms.background_grid_scale.value =  10.0
    mesh.material.uniforms.background_grid_line_scale.value =  2.0
    mesh.material.uniforms.background_grid_point_scale.value =  2.0

    // mesh.material.uniforms.background_colorA.value = this.bg_colorA
    // mesh.material.uniforms.background_colorB.value = this.bg_colorB
    // mesh.material.uniforms.background_colorC.value = this.bg_colorC
    // mesh.material.uniforms.background_colorD.value = this.bg_colorD


    mesh.material.uniforms.background_typeA.value = mix_value_function(count*0.7,0  ,200,1000);
    mesh.material.uniforms.background_typeB.value = mix_value_function(count*0.7,200,200,1000);
    mesh.material.uniforms.background_typeC.value = mix_value_function(count*0.7,400,200,1000);
    mesh.material.uniforms.background_typeD.value = mix_value_function(count*0.7,600,200,1000);

    mesh.material.uniforms.background_type_discoTarget.value = mix_value_function(count*0.7,800,200,1000);
    mesh.material.uniforms.light_beam.value = 0.0

    // mesh.material.uniforms.glow_remove_white_original.value = this.glow_remove_white_original

    mesh.material.uniforms.debug.value = 0.0
  }

}



export var materials = {
  black: new three_material(new THREE.MeshBasicMaterial( { color: 'black' } )),
  white: new three_material(new THREE.MeshBasicMaterial( { color: 'white' } )),

  raw_shader_exemple: new material_raw_shader_exemple(),
  background_test : new material_background_test(),
  old_custom_exemple: new material_old_custom_exemple(),

  phong_yellow: new three_material(new THREE.MeshPhongMaterial(  { 
                                      side: THREE.DoubleSide, 
                                      color: convert_to_three_color('yellow'), 
                                      map: null, 
                                      transparent:0, 
                                      opacity: 1,
                                      shininess: 2030,//30
                                      specular:utils.color.white,
                                  } )),

  simple : {
      uv_grid_opengl_grey: new three_material(new THREE.MeshBasicMaterial( { map: get_texture('uv_grid_opengl_grey') } )),
      uv_grid_opengl: new three_material(new THREE.MeshBasicMaterial( { map: get_texture('uv_grid_opengl') } )),
      cyan_grid: new three_material(new THREE.MeshBasicMaterial( { map: get_texture('texture_cyan_grid') } )),
      gradient_blue_cyan_A: new three_material(new THREE.MeshBasicMaterial( { map: get_texture('texture_gradient_blue_cyan_A') } )),
      gradient_blue_pink_A: new three_material(new THREE.MeshBasicMaterial( { map: get_texture('texture_gradient_blue_pink_A') } )),
      gradient_blue_pink_B: new three_material(new THREE.MeshBasicMaterial( { map: get_texture('texture_gradient_blue_pink_B') } )),
      gradient_blue_pink_C: new three_material(new THREE.MeshBasicMaterial( { map: get_texture('texture_gradient_blue_pink_C') } )),
      gradient_blue_pink_D: new three_material(new THREE.MeshBasicMaterial( { map: get_texture('texture_gradient_blue_pink_D') } )),
      gradient_gold_red_A: new three_material(new THREE.MeshBasicMaterial( { map: get_texture('texture_gradient_gold_red_A') } )),
      gradient_yellow_green_oblique_line_A: new three_material(new THREE.MeshBasicMaterial( { map: get_texture('texture_gradient_yellow_green_oblique_line_A') } )),
      grainy_gradient_blue_cyan_A: new three_material(new THREE.MeshBasicMaterial( { map: get_texture('texture_grainy_gradient_blue_cyan_A') } )),
      grainy_gradient_blue_cyan_B: new three_material(new THREE.MeshBasicMaterial( { map: get_texture('texture_grainy_gradient_blue_cyan_B') } )),
  },
  background:{
      uv_grid_opengl_grey: new three_material(new THREE.MeshBasicMaterial( { map: get_texture('uv_grid_opengl_grey') } )),
      uv_grid_opengl: new three_material(new THREE.MeshBasicMaterial( { map: get_texture('uv_grid_opengl') } )),
      abstract_shape_grid : new three_material(new THREE.MeshBasicMaterial( { map: get_background('background_abstract_shape_grid') } )),
      big_spheres_grid    : new three_material(new THREE.MeshBasicMaterial( { map: get_background('background_big_spheres_grid') } )),
      coherence_the_set_generation: new three_material(new THREE.MeshBasicMaterial( { map: get_background('background_coherence_the_set_generation') } )),
      football_field     : new three_material(new THREE.MeshBasicMaterial( { map: get_background('background_football_field') } )),
      purple_sphere_grid : new three_material(new THREE.MeshBasicMaterial( { map: get_background('background_purple_sphere_grid') } )),
      space_grid         : new three_material(new THREE.MeshBasicMaterial( { map: get_background('background_space_grid') } )),
      squares_grey_blur  : new three_material(new THREE.MeshBasicMaterial( { map: get_background('background_squares_grey_blur') } )),            
  },

}




















/*


export class shader_build
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

  preload(p5)
  {
    this.shdr = p5.loadShader('shader.vert', 'shdr_body.frag');
  }

  setup(p5,resolution,canvas_resolution=null)
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
    this.canvas = p5.createGraphics(this.iResolution.x, this.iResolution.y, p5.WEBGL); // create renderer 
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



  as_texture( p5, out_canvas = null)
  {
    
    this.update()
    
    if( out_canvas == null)
      p5.texture(this.canvas);
    else
      out_canvas.texture(this.canvas);
      
    
  }
  as_image(p5, out_canvas = null)
  {
    
    this.update()
    if( out_canvas == null)
      p5.image(this.canvas,this.iResolution.x/2*-1,this.iResolution.y/2*-1,this.iResolution.x,this.iResolution.y) 
    else
      out_canvas.image(this.canvas,this.iResolution.x/2*-1,this.iResolution.y/2*-1,this.iResolution.x,this.iResolution.y)    
    
  }

}

*/