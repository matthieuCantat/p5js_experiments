
import * as THREE from 'three';
import Vector from './vector.js'
import { rad} from './utils.js';




export function line( pA, pB ) {
    let ctx = new THREE.Shape()
    ctx.moveTo( pA.x(), pA.y() );
    ctx.lineTo( pA.x(), pA.y() );
    ctx.lineTo( pB.x(), pB.y() );
    return ctx
}

export function rect( width, height ) {

    return roundedRect( width, height, 0 )
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
    group, 
    shape, 
    texture = null, 
    color = null, 
    transparency_activate = false, 
    transparency = 0.) {


    let geometry = new THREE.ShapeGeometry( shape );

    let mat_opt = { side: THREE.DoubleSide, color: null, map: null, transparent:transparency_activate, opacity: 1.-transparency }
    if( color != null )
        mat_opt.color = convert_to_three_color(color)
    if( texture != null )
        mat_opt.map = texture
    
    let mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( mat_opt ) );
    group.add( mesh );

    return mesh
}


export function addShape_line( 
    group, 
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
    group.add( mesh )    


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


export function convert_to_three_color(color_array)
{
    return new THREE.Color("rgb("+Math.floor(color_array[0])+", "+Math.floor(color_array[1])+", "+Math.floor(color_array[2])+")");
}