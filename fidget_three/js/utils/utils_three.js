
import * as THREE from 'three';
import Vector from './vector.js'
import { 
    utils,
    rad} from './utils.js';




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



export function addLight( h, s, l, x, y, z )
{

    const loader = new THREE.TextureLoader();
    const textureFlare0 = loader.load( './textures/lensflare/lensflare0.png' );
    const textureFlare3 = loader.load( './textures/lensflare/lensflare3.png' );
    
    const light = new THREE.PointLight( 0xffffff, 1.5, 2000, 0 );
    light.color.setHSL( h, s, l );
    light.position.set( x, y, z );

    const lensflare = new Lensflare();
    lensflare.addElement( new LensflareElement( textureFlare0, 700*0.5, 0, light.color ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 60 *0.5, 0.6 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 70 *0.5, 0.7 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 120*0.5, 0.9 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 70 *0.5, 1 ) );
    light.add( lensflare );

    return light
}



