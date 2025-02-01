
import * as THREE from 'three';
import Vector from './vector.js'
import { 
    utils,
    rad, 
    convert_coords_matter_to_three, 
    isMousePressed, 
    isScreenTouched, 
    userIsInteracting, 
    mouseX, 
    mouseY, 
    Draw_text_debug} from './utils.js';




export function line( pA, pB ) {
    let ctx = new THREE.Shape()
    ctx.moveTo( pA.x(), pA.y() );
    ctx.lineTo( pA.x(), pA.y() );
    ctx.lineTo( pB.x(), pB.y() );
    return ctx
}

export function rect( width, height ) {
    let x = 0;
    let y = 0;
    let w = width/2.0;
    let h = height/2.0;

    let radius = 0
    
    let ctx = new THREE.Shape() 
    ctx.moveTo( x-w, y-h + radius );
    ctx.lineTo( x-w, y-h + height - radius );
    ctx.lineTo( x-w + width - radius, y-h + height );
    ctx.lineTo( x-w + width, y-h + radius );
    ctx.lineTo( x-w + radius, y-h );
    return ctx
  }

export function roundedRect( width, height, radius ) {

    let x = 0;
    let y = 0;
    let w = width/2.0;
    let h = height/2.0;
    
    let ctx = new THREE.Shape() 
    ctx.moveTo( x-w, y-h + radius );
    ctx.lineTo( x-w, y-h + height - radius );
    ctx.quadraticCurveTo( x-w, y-h + height, x-w + radius, y-h + height );
    ctx.lineTo( x-w + width - radius, y-h + height );
    ctx.quadraticCurveTo( x-w + width, y-h + height, x-w + width, y-h + height - radius );
    ctx.lineTo( x-w + width, y-h + radius );
    ctx.quadraticCurveTo( x-w + width, y-h, x-w + width - radius, y-h );
    ctx.lineTo( x-w + radius, y-h );
    ctx.quadraticCurveTo( x-w, y-h, x-w, y-h + radius );
    return ctx
}

export function roundedTrap( width, height, slop, radius ) {

    let w = width/2.0;
    let h = height/2.0;
    
    let ptA = new Vector(-w,  h)
    let ptB = new Vector(-w, -h)
    let ptC = new Vector( w, -h)
    let ptD = new Vector( w,  h)

    let vAB = ptA.getSub(ptB)
    let vDC = ptD.getSub(ptC)
    let slop_rad = rad(slop*-1)
    vAB.rotate(slop_rad)
    vDC.rotate(slop_rad*-1)
    vAB.normalize()
    vDC.normalize()
    let new_length = height/Math.cos(slop_rad)
    vAB.mult(new_length)
    vDC.mult(new_length)
    ptA = ptB.getAdd(vAB)
    ptD = ptC.getAdd(vDC)    


    let ctx = new THREE.Shape() 
    ctx.moveTo( ptB.x(), ptB.y() + radius );
    ctx.lineTo( ptA.x(), ptA.y() - radius );
    ctx.quadraticCurveTo( ptA.x(), ptA.y(), ptA.x() + radius, ptA.y() );
    ctx.lineTo( ptD.x() - radius, ptD.y() );
    ctx.quadraticCurveTo( ptD.x(), ptD.y(), ptD.x(), ptD.y() - radius );
    ctx.lineTo( ptC.x(), ptC.y() + radius );
    ctx.quadraticCurveTo( ptC.x(), ptC.y(), ptC.x() - radius, ptC.y() );
    ctx.lineTo( ptB.x() + radius, ptB.y() );
    ctx.quadraticCurveTo( ptB.x(), ptB.y(), ptB.x(), ptB.y() + radius );
    return ctx
}



export function circle( radius) {

    let ctx = new THREE.Shape()
    ctx.moveTo( 0, radius )

    let nbr_sample = 8*4
    let step = 3.14*2/nbr_sample
    let current = 0
    for( let i = 1; i < nbr_sample+1; i+=2)
    {
        current += step
        let pA = { x:Math.sin(current)*radius, y:Math.cos(current)*radius}
        current += step
        let pB = { x:Math.sin(current)*radius, y:Math.cos(current)*radius}
        ctx.quadraticCurveTo( pA.x, pA.y, pB.x, pB.y )
    }

    
    return ctx
}


export function arc( radius,min_angle,max_angle ) {

    let ctx = new THREE.Shape()
    let pStart = { x:Math.sin(min_angle)*radius, y:Math.cos(min_angle)*radius}
    ctx.moveTo( pStart.x, pStart.y )   

    let nbr_sample = 8*4
    let step = 3.14*2/nbr_sample
    let current = 0
    for( let i = 0; i < nbr_sample+1; i+=2)
    {
        
        let pA = { x:Math.sin(current)*radius, y:Math.cos(current)*radius}
        current += step
        let pB = { x:Math.sin(current)*radius, y:Math.cos(current)*radius}
        current += step
        if(current < min_angle)
            continue
        if(max_angle < current)
            break

        ctx.quadraticCurveTo( pA.x, pA.y, pB.x, pB.y )
    }
    let pEnd = { x:Math.sin(max_angle)*radius, y:Math.cos(max_angle)*radius}
    ctx.quadraticCurveTo( pEnd.x, pEnd.y, pEnd.x, pEnd.y )

    
    return ctx
}


export function addShape_polygon( 
    shape,
    shape_type,
    m_ref,
    scale_ref, 
    material = null, 
    color = null, 
    transparency_activate = false, 
    transparency = 0.,
    castShadow = false,
    receiveShadow = false,
    bevel = 0,) {

    
    let geometry = null
    
    if( bevel == 0)
    {
        geometry = new THREE.ShapeGeometry( shape );
    }
    else
    {
        const extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: bevel*2, bevelThickness: bevel*2.5 };
        geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    }


    if( m_ref != null)
    {
        let scale_coef = 1.0
        if( shape_type == 1)//'circle'))
            scale_coef = 0.0099
        if( shape_type == 0)//'rectangle')
            scale_coef = 0.01

        let x_length = m_ref.get_row(0).mag()*scale_ref*scale_coef
        let y_length = m_ref.get_row(1).mag()*scale_ref*scale_coef
        
        let squash_to_fit = true
        if( squash_to_fit == false)
        {
            if( x_length < y_length )
                y_length = x_length
            else
                x_length = y_length
        }

        updateUVScale(geometry,new Vector(1/x_length,1/y_length))
        updateUVPosition(geometry,new Vector(50,50))
  
    }

    let mesh = null
    if(material == null)
    {  
        let mat_opt = { 
            side: THREE.DoubleSide, 
            color: null, 
            map: null, 
            transparent:transparency_activate, 
            opacity: 1.-transparency,
            shininess: 2030,//30
            specular:utils.color.white,
        }
        if( color != null )
            mat_opt.color = convert_to_three_color(color)
        
        mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( mat_opt ) );
    }
    else
    {
        material.prepare_geometry(geometry)
        mesh = new THREE.Mesh( geometry, material.material );
    }


    mesh.castShadow = castShadow; //default is false
    mesh.receiveShadow = receiveShadow; //default        

    return mesh
}


export function addShape_line( 
    shape, 
    color = null, 
    transparency_activate = false, 
    transparency = 0.) {

    shape.autoClose = false;
    const points = shape.getPoints();
    const geometryPoints = new THREE.BufferGeometry().setFromPoints( points );

    let mat_opt_line = { color: null ,linewidth: 1, transparent:transparency_activate, opacity: 1.-transparency  }
    if( color != null )
        mat_opt_line.color = convert_to_three_color(color)

    let mesh = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial( mat_opt_line ) );       

    return mesh
}

const loader = new THREE.TextureLoader();
export function get_texture_grid_checker()
{
    
    const textureA = loader.load( 'textures/uv_grid_opengl.jpg' );
    textureA.colorSpace = THREE.SRGBColorSpace;
    textureA.wrapS = textureA.wrapT = THREE.RepeatWrapping;
    textureA.repeat.set( 0.008, 0.008 );
    return textureA
}

export function get_texture_grid_checker_grey()
{
    const textureB = loader.load( 'textures/uv_grid_opengl_grey.jpg' );
    textureB.colorSpace = THREE.SRGBColorSpace;
    textureB.wrapS = textureB.wrapT = THREE.RepeatWrapping;
    textureB.repeat.set( 0.0005, 0.0005 );
    return textureB
}


export function get_texture(file_name)
{
    
    const textureA = loader.load( 'textures/'+file_name+'.jpg' );
    textureA.colorSpace = THREE.SRGBColorSpace;
    textureA.wrapS = textureA.wrapT = THREE.RepeatWrapping;
    textureA.repeat.set( 0.01, 0.01 );
    return textureA
}


export function get_background(file_name)
{
    
    const textureA = loader.load( 'textures/'+file_name+'.jpg' );
    textureA.colorSpace = THREE.SRGBColorSpace;
    textureA.wrapS = textureA.wrapT = THREE.RepeatWrapping;
    textureA.repeat.set( 0.01, 0.01 );
    return textureA
}




export function convert_to_three_color(color_array)
{
    return new THREE.Color("rgb("+Math.floor(color_array[0])+", "+Math.floor(color_array[1])+", "+Math.floor(color_array[2])+")");
}


export class Mouse_manager
{
    constructor(mouse_constraint,screen_dims,fidget,debug)
    {
        this.mouse_constraint = mouse_constraint
        this.screen_dims = screen_dims
        this.fidget = fidget
        this.mesh_line = null

        this.p_mouse_grap_from_body = null
        this.mouse_lock_selection = false

        this.draw_text_debug = null
        this.set_debug(debug)
 
        this.update_count = 0 
        this.selected_body_last_eval_name = ''   
        this.z = 0
        this.circle_touch_radius = 20
        this.cross_apply_radius = 10
    }

    set_debug( debug )
    {
        this.debug = debug
        if(this.debug != false)
        {
            this.draw_text_debug = new Draw_text_debug(this.screen_dims)
            this.draw_text_debug.mouse_cns = this.mouse_constraint
        }     
    }

    setup(scene)
    {  
        let mouse_pos = new Vector( mouseX, mouseY) 
        let pos = new Vector( mouseX, mouseY) 
        
        let shape_coords = line( 
            convert_coords_matter_to_three(pos,this.screen_dims), 
            convert_coords_matter_to_three(mouse_pos,this.screen_dims) );
        this.mesh_line = addShape_line(  
            shape_coords, 
            [255,255,0])

        let shape_coords_touch = circle(this.circle_touch_radius)
        let mesh_circle = addShape_line(  
            shape_coords_touch, 
            [255,255,0])   
        this.group_circle = new THREE.Group();
        this.group_circle.add(mesh_circle)

        
        let shape_coords_cross_line_A = line( 
            new Vector(this.cross_apply_radius,this.cross_apply_radius), 
            new Vector(this.cross_apply_radius*-1,this.cross_apply_radius*-1))
        let mesh_cross_line_A = addShape_line(  
            shape_coords_cross_line_A, 
            [255,255,0])
        let shape_coords_cross_line_B = line( 
            new Vector(this.cross_apply_radius*-1,this.cross_apply_radius), 
            new Vector(this.cross_apply_radius   ,this.cross_apply_radius*-1))
        let mesh_cross_line_B = addShape_line(  
            shape_coords_cross_line_B, 
            [255,255,0])
        this.group_cross = new THREE.Group();
        this.group_cross.add(mesh_cross_line_A)
        this.group_cross.add(mesh_cross_line_B)

        this.group = new THREE.Group();

        this.group.add( this.mesh_line )
        this.group.add( this.group_circle )
        this.group.add( this.group_cross )
            
        scene.add( this.group )

        

        if(this.debug != false)
            this.draw_text_debug.setup_three(scene)        
    
    }

    update()
    {
        this.group.visible = false

        if(this.mouse_lock_selection)
        {
            if(userIsInteracting == false)
                this.mouse_lock_selection = false
            else
                this.switch_selection( null) 
        }

        let p_mouse_current = new Vector( mouseX, mouseY) 
        //if( p_mouse_current.mag() == 0)
        //    return

        let p_mouse_grap = new Vector( mouseX, mouseY) 
        let selected_body = this.mouse_constraint.constraint.bodyB
        

        let delta = new Vector(0,0)
        let do_break = false
        let fidget_selected_body = null
        let m = null
        let do_save_p_mouse_grap_from_body = false

        let break_dist = 0
        if( userIsInteracting )
        {
            if( selected_body != null  )
            {
                fidget_selected_body = this.fidget.get_selected_body()

                if( fidget_selected_body != null)
                {
                    m = fidget_selected_body.get_out_matrix()
                    break_dist = fidget_selected_body.selection_break_length
    
                    do_save_p_mouse_grap_from_body = ((this.p_mouse_grap_from_body == null )||(this.selected_body_last_eval_name != fidget_selected_body.name))
                    if(do_save_p_mouse_grap_from_body)
                        this.p_mouse_grap_from_body = p_mouse_current.getMult(m.getInverse())
    
    
                    p_mouse_grap = this.p_mouse_grap_from_body.getMult(m)
                    delta = p_mouse_current.getSub(p_mouse_grap)
    
                    do_break = break_dist<delta.mag()
                    if(do_break)
                    {
                        this.mouse_lock_selection = true
                        this.switch_selection( null ) 
                        p_mouse_grap = p_mouse_current
                        this.p_mouse_grap_from_body = null 
                    } 

                    this.selected_body_last_eval_name = fidget_selected_body.name
                }
                else
                {
                    this.p_mouse_grap_from_body = null
                    this.selected_body_last_eval_name = ''                   
                } 

                this.group.visible = true
            }
            else{
                this.mouse_lock_selection = true
                this.selected_body_last_eval_name = ''
            }
          
        }
        else{
            this.p_mouse_grap_from_body = null
            this.selected_body_last_eval_name = ''
        }

        let p_mouse_grap_converted = convert_coords_matter_to_three(p_mouse_grap,this.screen_dims)
        let p_mouse_current_converted = convert_coords_matter_to_three(p_mouse_current,this.screen_dims)
        let shape_coords = line( 
            p_mouse_grap_converted, 
            p_mouse_current_converted)       
        this.mesh_line.geometry.setFromPoints(shape_coords.getPoints());

        this.group_cross.position.x = p_mouse_grap_converted.x()
        this.group_cross.position.y = p_mouse_grap_converted.y()

        this.group_circle.position.x = p_mouse_current_converted.x()
        this.group_circle.position.y = p_mouse_current_converted.y()

        this.group.position.z = this.z
        
        

        
        let fidget_skip = false
        if((this.debug !== true)&&(this.debug !== false)&&(this.debug !== this.fidget.fidget_sequence_i))
            fidget_skip = true


        if( (this.debug !== false)&&(fidget_skip === false) )
        {
          let p_mouse_grap_from_body = {x:0,y:0}
          if(this.p_mouse_grap_from_body != null)
            p_mouse_grap_from_body = this.p_mouse_grap_from_body.get_value()

          let body_name = 'null'
          let m_selected_body = {a:0,b:0,c:0,d:0,e:0,f:0}
          if( fidget_selected_body != null)
          {
            body_name = fidget_selected_body.name            
            m_selected_body = m
          }

            

          let texts_to_draw = [
                'selected_fidget : ' + this.fidget.fidget_sequence_i,
                'selected_body : ' + body_name,

                'update_count :' + this.update_count,
                'isMousePressed : ' + isMousePressed,
                'isScreenTouched : ' + isScreenTouched,
                'userIsInteracting : ' + userIsInteracting,

                'p_mouse_current : ' + Math.round(p_mouse_current.x()) + ' | ' + Math.round(p_mouse_current.y()),
                'p_mouse_current_coef : ' + Math.round(p_mouse_current.x()/this.screen_dims.x*100) + ' | ' + Math.round(p_mouse_current.y()/this.screen_dims.y*100),

                'm_selected_body : ' + Math.round(m_selected_body.a) + ' | ' + Math.round(m_selected_body.b) + ' | ' +Math.round(m_selected_body.c) + ' | ' +Math.round(m_selected_body.d) + ' | ' +Math.round(m_selected_body.e) + ' | ' +Math.round(m_selected_body.f),
                'p_selected_body : ' + Math.round(m_selected_body.e) + ' | ' +Math.round(m_selected_body.f),
                'p_selected_body_coef : ' + Math.round(m_selected_body.e/this.screen_dims.x*100) + ' | ' +Math.round(m_selected_body.f/this.screen_dims.y*100),

                'do_save_p_mouse_grap_from_body : ' + do_save_p_mouse_grap_from_body,
                'p_mouse_grap_from_body : ' + Math.round(p_mouse_grap_from_body.x) + ' | ' + Math.round(p_mouse_grap_from_body.y),
                
                'p_mouse_grap : ' + Math.round(p_mouse_grap.x()) + ' | ' + Math.round(p_mouse_grap.y()),
                'p_mouse_grap_coef : ' + Math.round(p_mouse_grap.x()/this.screen_dims.x*100) + ' | ' + Math.round(p_mouse_grap.y()/this.screen_dims.y*100),

                'dist : ' + Math.round(delta.mag()),
                'break_dist : ' + break_dist,
                'do_break : ' + do_break,
                'mouse_lock_selection : ' + this.mouse_lock_selection,
            ]   
            

          this.draw_text_debug.update_three(texts_to_draw)
        }  
        
        // next eval
        this.update_count += 1
    }


    switch_selection( next_elem = null , hack = false)
    {
      if ( next_elem == null)
      {
        this.mouse_constraint.body = null
        this.mouse_constraint.constraint.bodyB = null
        this.mouse_constraint.constraint.pointB = null
        this.mouse_constraint.constraint.angleB = 0  
        return; 
      }
      
      let p = new Vector( 
        this.mouse_constraint.constraint.pointA.x - next_elem.body.position.x,
        this.mouse_constraint.constraint.pointA.y - next_elem.body.position.y)
    
    this.mouse_constraint.body = next_elem.body
    this.mouse_constraint.constraint.bodyB = next_elem.body
    this.mouse_constraint.constraint.pointB = {x: p.x() , y: p.y()}
      if(hack)
        this.mouse_constraint.constraint.pointB = {x: - p.y(), y: p.x()}
      this.mouse_constraint.constraint.angleB = 0
      
      this.fidget.mouse_select_highlight(this.mouse_constraint)
    
    }    
    
}


export const updateUVPosition = (geometry, v_to_move ) => {
    const att_uv = geometry.getAttribute('uv');
    let i = 0;
    while(i < att_uv.count){
        let p_init = new Vector( att_uv.getX(i), att_uv.getY(i) )
        let p = p_init.getAdd(v_to_move)

        att_uv.setXY( i, p.x(), p.y() );
        i += 1;
    }
    att_uv.needsUpdate = true;
};



export const updateUVScale = (geometry, v_to_scale ) => {
    const att_uv = geometry.getAttribute('uv');
    let i = 0;
    while(i < att_uv.count){
        let p = new Vector( att_uv.getX(i)*v_to_scale.x(), att_uv.getY(i)*v_to_scale.y() )

        att_uv.setXY( i, p.x(), p.y() );
        i += 1;
    }
    att_uv.needsUpdate = true;
};


export var three_utils = {
    texture : {
        simple : {
            uv_grid_opengl_grey: get_texture('uv_grid_opengl_grey'),
            uv_grid_opengl: get_texture('uv_grid_opengl'),
            cyan_grid: get_texture('texture_cyan_grid'),
            gradient_blue_cyan_A: get_texture('texture_gradient_blue_cyan_A'),
            gradient_blue_pink_A: get_texture('texture_gradient_blue_pink_A'),
            gradient_blue_pink_B: get_texture('texture_gradient_blue_pink_B'),
            gradient_blue_pink_C: get_texture('texture_gradient_blue_pink_C'),
            gradient_blue_pink_D: get_texture('texture_gradient_blue_pink_D'),
            gradient_gold_red_A: get_texture('texture_gradient_gold_red_A'),
            gradient_yellow_green_oblique_line_A: get_texture('texture_gradient_yellow_green_oblique_line_A'),
            grainy_gradient_blue_cyan_A: get_texture('texture_grainy_gradient_blue_cyan_A'),
            grainy_gradient_blue_cyan_B: get_texture('texture_grainy_gradient_blue_cyan_B'),
        },
        background:{
            uv_grid_opengl_grey: get_texture('uv_grid_opengl_grey'),
            uv_grid_opengl: get_texture('uv_grid_opengl'),
            abstract_shape_grid : get_background('background_abstract_shape_grid'),
            big_spheres_grid    : get_background('background_big_spheres_grid'),
            coherence_the_set_generation: get_background('background_coherence_the_set_generation'),
            football_field     : get_background('background_football_field'),
            purple_sphere_grid : get_background('background_purple_sphere_grid'),
            space_grid         : get_background('background_space_grid'),
            squares_grey_blur  : get_background('background_squares_grey_blur'),            
        }
      },
    material : {
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
    
 
}


 