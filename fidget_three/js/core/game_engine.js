
import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import fidgets_sequence from '../assets/fidgets_sequence.js'
import Matrix from '../utils/matrix.js'
import {
    create_physics_engine,
    create_boundary_wall_collision,
    strictObject,
  } from '../utils/utils.js';
import { 
    Mouse_manager, 
    user_interaction_info
  } from '../core/mouse.js'

export default class Game_engine
{
    constructor( in_args )
    {
        // args
        const default_args = {
            dom_canvas : null,
            screen_dims :null,
            asset_name : null
        }

        this.args = {...default_args, ...in_args}
        // attribute
        this.name = 'three_scene'
        this.camera = null
        this.render_scene = null
        this.renderer = null
        this.matter_engine = null
        this.Mouse = null
        this.finalComposer = null
        this.bloomComposer = null
        this.light_lens_flare = null
        this.stats = null
        this.asset = null
        this.time = 0
        this.time_step = 1

        this.record_info = {
            state : null,
            state_last : null,
            play_start : null,
            play_current : null,
            display_dom : null,
            recording_size : 0,
        }

        this.debug = null

        //build
        this.debug_set_stats_windows()

        this.setup_render()
        this.setup_physics()
        

        this.setup_update_loop() 

        let asset = this.get_asset( this.args.asset_name )
        this.load_asset(asset)

        
    }

    set_debug(debug_options)
    {
        this.debug = debug_options
        this.asset.set_debug(this.debug)
    }

    debug_set_stats_windows()
    {
        // stats
        this.stats = new Stats();
        this.args.dom_canvas.appendChild( this.stats.dom );
    }
    
    setup_render()
    {
        if (!this.args.dom_canvas) {
            throw new Error("Container element not found!");
        }  


        // scene setup
        this.render_scene = new THREE.Scene();
        this.render_scene.background = new THREE.Color().setRGB( 0.5, 0.5, 0.5 );

        this.camera = new THREE.OrthographicCamera(
            this.args.screen_dims.x / -2, 
            this.args.screen_dims.x / 2, 
            this.args.screen_dims.y / 2, 
            this.args.screen_dims.y / -2, 
            1, 
            1000 );
        this.camera.position.set( 0, 0, 500 );  
        //let camera_far_dist = 1000 
        //this.camera = new THREE.PerspectiveCamera( 76, width / height, 1, camera_far_dist );
        //this.camera.position.set( 0, 0, 500 );
        //this.camera.rotation.set( 0, 0, 0 );
        
        this.render_scene.add( this.camera );

        //let light_group = new THREE.Group();
        //const light = new THREE.PointLight( 0xffffff, 2.5, 0, 0 );


        let light1 = new THREE.DirectionalLight( 0xffffff, 3.5 );
        //const sphere = new THREE.SphereGeometry( 2.5, 16, 8 );
        //light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );

        light1.position.x = 200*2
        light1.position.y = 200*2
        light1.position.z = 100*2

        this.render_scene.add( light1 );        

        ///////////////// render
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( this.args.screen_dims.pixelRatio );

        this.renderer.setSize( this.args.screen_dims.x, this.args.screen_dims.y );

        this.args.dom_canvas.appendChild( this.renderer.domElement );

        this.build_special_effects()
    }

    setup_physics()
    {
            
        this.matter_engine = create_physics_engine()
        create_boundary_wall_collision( this.matter_engine, 
                                        this.args.screen_dims.x,
                                        this.args.screen_dims.y,
                                        false)

        this.Mouse = strictObject(new Mouse_manager(    this.matter_engine, 
                                                        this.args.dom_canvas, 
                                                        this.args.screen_dims) )                                          
    }

    clean_physics()
    {
        this.Mouse.clean()
        Matter.Composite.clear(this.matter_engine.world, true);
        Matter.Events.off(this.matter_engine);  // Remove all events attached to the engine
        this.matter_engine = null
    }

    setup_update_loop()
    {
        this.renderer.setAnimationLoop( () => {this.update_loop() } );
    }


    get_asset( asset_name )
    {
        const args = {
            nbr : 5,
            m : new Matrix().setTranslation(this.args.screen_dims.x/2, this.args.screen_dims.y/2 ),
            s : 2.2,
            dom_canvas : this.args.dom_canvas,
            screen_dims : this.args.screen_dims, 
            shdrs : [],
            //debug : this.args.debug,
        }

        let asset = null;
        if      (asset_name === 'fidgets_grid'    )asset = new fidgets_grid(args) 
        else if (asset_name === 'fidgets_sequence')asset = new fidgets_sequence(args)
        else if (asset_name === 'fidget_daft_i'   )asset = new fidgets_sequence({...args , ...{fidget_choice:'fidget_daft_i'}}  )
        else if (asset_name === 'fidget_windmill' )asset = new fidgets_sequence({...args , ...{fidget_choice:'fidget_windmill'}}  )
        else if (asset_name === 'fidget_simple_slide'    )asset = new fidgets_sequence({...args , ...{fidget_choice:'fidget_simple_slide'}}  )
        return asset
    }

    load_asset(asset)
    {
        
        //this.remove_asset()

        if(asset == null)
            return false

        this.asset = asset

        asset.setup(this)
        asset.set_game_engine_ref(this)
        if(this.debug!=null)
            asset.set_debug(this.debug)

        this.Mouse.fidget = asset

        return true
    }

   

    remove_asset()
    {
        if( this.asset == null )
            return ;
        this.asset.clean()
        this.asset = null
        this.clean_render()
        this.clean_physics()
    }
      
    clean_render()
    {
        this.renderer.dispose();
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }

    resize_render( new_width, new_height )
    {
        this.args.screen_dims.x = new_height
        this.args.screen_dims.y = new_width

        this.camera.aspect = this.args.screen_dims.x / this.args.screen_dims.y;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( this.args.screen_dims.x, this.args.screen_dims.y);

        if((this.debug != null)&&(this.debug.options.do_bloom))
        {
            this.bloomComposer.setSize( this.args.screen_dims.x, this.args.screen_dims.y );
            this.finalComposer.setSize( this.args.screen_dims.x, this.args.screen_dims.y );
        }
    }

    build_special_effects()
    {
        //light_group.add(light)
        //light.position.set( Math.sin(0*0.01)*100, Math.cos(0*0.01)*100, -200)
        //three_global_obj.camera.add( light1 );
        if((this.debug != null)&&(this.debug.options.do_shadows))
        {
            light1.castShadow = true
            //light1.shadow.radius = 5;  
            //light1.shadow.blurSamples = 250
            light1.shadow.camera.near = 0.5; // default
            light1.shadow.camera.far = 600*1.5; // default
            light1.shadow.camera.top = 200;
            light1.shadow.camera.bottom = -200;
            light1.shadow.camera.left = -200*0.5;
            light1.shadow.camera.right = 200*0.5;
            light1.shadow.mapSize.set( 200, 200 );

            //let light2 = new THREE.AmbientLight( 0xffffff, 0.2 );
            //this.render_scene.add( light2 );
        }

        if((this.debug != null)&&(this.debug.options.do_flare ))
        {
            this.light_lens_flare = addLight( 0.995, 0.5, 0.9,100, 100, 100 )
            this.render_scene.add( this.light_lens_flare )
        }
 

        if((this.debug != null)&&(this.debug.options.do_shadows))
        {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        }

        if((this.debug != null)&&(this.debug.options.do_bloom))
        {
            //render pass
            const renderScene = new RenderPass( this.render_scene, this.camera );
            const outputPass = new OutputPass();

            const bloomPass = new UnrealBloomPass( new THREE.Vector2( this.args.screen_dims.x, this.args.screen_dims.y ), 1.5, 0.4, 0.85 );
            bloomPass.threshold = 0;
            bloomPass.strength = 1;
            bloomPass.radius = 0.1;
            
            this.bloomComposer = new EffectComposer( this.renderer );
            this.bloomComposer.renderToScreen = false;
            this.bloomComposer.addPass( renderScene );
            this.bloomComposer.addPass( bloomPass );
            
            const mixPass = new ShaderPass(
                new THREE.ShaderMaterial( {
                    uniforms: {
                        baseTexture: { value: null },
                        bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
                    },
                    vertexShader: document.getElementById( 'bloom_mix_vertexShader' ).textContent,
                    fragmentShader: document.getElementById( 'bloom_mix_fragmentShader' ).textContent,
                    defines: {}
                } ), 'baseTexture'
            );
            mixPass.needsSwap = true;


            this.finalComposer = new EffectComposer( this.renderer );
            this.finalComposer.addPass( renderScene );
            //this.finalComposer.addPass( bloomPass );
            this.finalComposer.addPass( mixPass );
            this.finalComposer.addPass( outputPass );
        }        
    }


    
    update_loop()
    {
        if((this.debug != null)&&(this.debug.options.do_flare ))
        {
            // light - change position
            this.light_lens_flare.position.x = Math.sin(rad(45)+this.time*0.01)*120
            this.light_lens_flare.position.y = Math.cos(rad(45)+this.time*0.01)*120
        }     
        
        record_info_update( this.record_info, this.time )

        if( this.asset != null )
        {
            this.asset.physics.update(this.record_info)
            this.asset.render.update(this.record_info)           
            /*
            if(this.record_info.state == "record" )
            {
                this.asset.physics.update(this.record_info)
                this.asset.render.update()        
            }     
            else if ( 
                  ( this.record_info.state == "play" )
                ||( this.record_info.state == "play reverse" )
                ||( this.record_info.state == "pause" ))
            {
                this.asset.render.update(this.record_info)
            }  
            else if(this.record_info.state == "delete")
            {
                this.asset.physics.update()
                this.asset.render.update( this.record_info )   
            }
            else
            {
                this.asset.physics.update()
                this.asset.render.update()    
            }
            */        
        }
        
        this.record_info.state_last = this.record_info.state
    
        //uniforms[ 'time' ].value = performance.now() / 1000;
        //current_asset.fidgets[0].bodies.geos.rectangle.mesh_three.shape.material.uniforms.time.value = performance.now() / 1000;
    
        if((this.debug != null)&&(this.debug.options.do_bloom))
        {
            let save_states = []
            for( let i = 0 ; i < this.asset.fidgets.length; i++)
                save_states.push( this.asset.fidgets[i].render.setup_bloom_pass() )
            this.bloomComposer.render()
            for( let i = 0 ; i < this.asset.fidgets.length; i++)
                this.asset.fidgets[i].render.clean_bloom_pass(save_states[i])
    
            this.finalComposer.render();
        }
        else
        {
            this.renderer.render( this.render_scene, this.camera );
        }
    
        if( this.stats != null)
            this.stats.update();
        
        this.time += this.time_step
    }

    


}




function record_info_update(record_info,time)
{
    // record
    const delta = record_info.play_current - record_info.play_start
    if( record_info.state == "play" )
    {
        record_info.play_current += 1

        
        if( record_info.size < delta )
            record_info.play_current = delta % record_info.size + record_info.play_start
    }
    else if( record_info.state == "play reverse" )
    {
        record_info.play_current -= 1
        if( record_info.play_current < record_info.play_start )
            record_info.play_current = record_info.play_start + record_info.size  
    }
    
    if( record_info.display_dom != null )
        record_info.display_dom.innerHTML = ""

    if(record_info.state == "record" )
        {
            if( record_info.display_dom != null )
                record_info.display_dom.innerHTML = "recording... " + record_info.size
            record_info.size += 1 
            
            if( record_info.play_current == null)
            {
                record_info.play_start = time
                record_info.play_current = time
            }
                
        }     
        else if ( 
                ( record_info.state == "play" )
            ||( record_info.state == "play reverse" )
            ||( record_info.state == "pause" ))
        {
            if( record_info.display_dom != null )
                record_info.display_dom.innerHTML = "reading " + delta + " / "+ record_info.size
        }  
        else if(record_info.state == "delete")
        {
            record_info.size = 0
            record_info.state = null
            record_info.play_current = null
            record_info.play_start = null   
        }
        else
        {
            record_info.size = 0  
        }  

}