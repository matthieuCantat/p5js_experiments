
import * as THREE from 'three';
import Vector from './vector.js'
import { rad, convert_coords_matter_to_three, mouseX, mouseY, switch_selection, userIsInteracting, Draw_text_debug} from './utils.js';




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

        this.break_dist = 660.0
        this.selection_delta = null
        this.mouse_lock_selection = false

        this.draw_text_debug = null
        this.debug = debug
        if(this.debug)
        {
            this.draw_text_debug = new Draw_text_debug(this.screen_dims)
            this.draw_text_debug.mouse_cns = this.mouse_constraint
        }         
    }

    setup(scene)
    {  
        let mouse_pos = new Vector( mouseX, mouseY) 

        let pos = new Vector( mouseX, mouseY) 
        /*
        var selected_body = this.mouse_constraint.constraint.bodyB
        if( selected_body != null )
        {
            let fidget_selected_body = this.fidget.get_selected_body()
            if( fidget_selected_body != null)
            {
                let m = fidget_selected_body.get_out_matrix()

                let delta = new Vector()
                if(this.selection_delta != null)
                {
                    pos = this.selection_delta.getMult(m)
                }
                else{
                    //this.selection_delta = mouse_pos.getMult(m.getInverse())
                    pos = mouse_pos
                }
            }
        }
        else{
            this.selection_delta = null
        }
        */    
        
        let shape_coords = line( 
            convert_coords_matter_to_three(pos,this.screen_dims), 
            convert_coords_matter_to_three(mouse_pos,this.screen_dims) );
        this.mesh_line = addShape_line(  
            shape_coords, 
                [255,255,0])
    
        scene.add( this.mesh_line )

        if(this.debug)
            this.draw_text_debug.setup_three(scene)        
    
    }

    update()
    {
        if(this.mouse_lock_selection)
        {
            if(userIsInteracting == false)
            {
                this.mouse_lock_selection = false
            }
            else{
                switch_selection( this.mouse_constraint, null) 
            }
        }

        let mouse_pos = new Vector( mouseX, mouseY) 
        if( mouse_pos.mag() == 0)
            return

        let pos = new Vector( mouseX, mouseY) 
        var selected_body = this.mouse_constraint.constraint.bodyB

        let delta = new Vector(0,0)
        let do_break = false
        let fidget_selected_body = null
        let m = null
        if(selected_body != null  )
        {
            fidget_selected_body = this.fidget.get_selected_body()
            if( fidget_selected_body != null)
            {
                m = fidget_selected_body.get_out_matrix()

                if(this.selection_delta != null)
                {
                    //pos = this.selection_delta.getMult(m)
                }
                else{
                    this.selection_delta = mouse_pos.getMult(m.getInverse())
                    pos = mouse_pos
                }

                delta = mouse_pos.getSub(pos)

                do_break = this.break_dist<delta.mag()
                if(do_break)
                {
                    this.mouse_lock_selection = true
                    switch_selection( this.mouse_constraint, null) 
                    pos = mouse_pos
                    this.selection_delta = null 
                } 
            }           
        }
        else{
            this.selection_delta = null
        }


        let shape_coords = line( 
            convert_coords_matter_to_three(pos,this.screen_dims), 
            convert_coords_matter_to_three(mouse_pos,this.screen_dims) );        
        this.mesh_line.geometry.setFromPoints(shape_coords.getPoints());

       
        if(this.debug)
        {
          let selection_delta = {x:0,y:0}
          if(this.selection_delta != null)
            selection_delta = this.selection_delta.get_value()
            

          let texts_to_draw = []

          if(fidget_selected_body != null)
          {
            texts_to_draw = [
                'selected_body : ' + fidget_selected_body.name,
                'mouse_lock_selection : ' + this.mouse_lock_selection,
                'selection_delta : ' + Math.round(selection_delta.x) + ' | ' + Math.round(selection_delta.y),
                'm : ' + Math.round(m.a) + ' | ' + Math.round(m.b) + ' | ' +Math.round(m.c) + ' | ' +Math.round(m.d) + ' | ' +Math.round(m.e) + ' | ' +Math.round(m.f),
                'pos : ' + Math.round(pos.x()) + ' | ' + Math.round(pos.y()),
                'mouse_pos : ' + Math.round(mouse_pos.x()) + ' | ' + Math.round(mouse_pos.y()),
                'delta : ' + Math.round(delta.x()) + ' | ' + Math.round(delta.y()),
                'delta_length : ' + Math.round(delta.mag()),
                'break_dist : ' + this.break_dist,
                'do_break : ' + do_break,
            ]   
          }

          this.draw_text_debug.update_three(texts_to_draw)
        }        
    }
}
