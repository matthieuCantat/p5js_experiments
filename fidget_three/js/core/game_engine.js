
import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';

export default class Game_engine
{
    constructor( in_args )
    {
        // args
        const default_args = {
            dom_canvas : null,
            screen_dims :null,
            debug : null
        }

        this.args = {...default_args, ...in_args}
        // attribute
        this.name = 'three_scene'
        this.camera = null
        this.scene = null
        this.renderer = null
        this.finalComposer = null
        this.bloomComposer = null
        this.light_lens_flare = null
        this.stats = null
        this.asset = null
        this.update_loop_eval_count = 0
        //build


        // scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color().setRGB( 0.5, 0.5, 0.5 );

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
        
        this.scene.add( this.camera );

        //let light_group = new THREE.Group();
        //const light = new THREE.PointLight( 0xffffff, 2.5, 0, 0 );


        let light1 = new THREE.DirectionalLight( 0xffffff, 3.5 );
        //const sphere = new THREE.SphereGeometry( 2.5, 16, 8 );
        //light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );

        light1.position.x = 200*2
        light1.position.y = 200*2
        light1.position.z = 100*2

        this.scene.add( light1 );

        this.build_special_effects()

        this.debug_set_stats_windows()

    }

    setup_asset(asset)
    {
        if(asset == null)
            return false

        this.asset = asset
        this.asset.setup(this.scene)
        this.setup_render()

        return true
    }

    remove_asset()
    {
        if( this.asset == null )
            return ;
        this.asset.clean_scene(this.scene)
        this.asset = null
        this.clean_render()
    }
  

    setup_render()
    {
        if (!this.args.dom_canvas) {
            throw new Error("Container element not found!");
        }  

        ///////////////// render
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( this.args.screen_dims.pixelRatio );

        this.renderer.setSize( this.args.screen_dims.x, this.args.screen_dims.y );
        this.renderer.setAnimationLoop( () => {this.update_loop_global() } );

        this.args.dom_canvas.appendChild( this.renderer.domElement );

        this.setup_render_special_effect()
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

        if(debug.do_bloom)
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
        if(this.args.debug.do_shadows)
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
            //this.scene.add( light2 );
        }

        if( this.args.debug.do_flare )
        {
            this.light_lens_flare = addLight( 0.995, 0.5, 0.9,100, 100, 100 )
            this.scene.add( this.light_lens_flare )
        }
    }


    setup_render_special_effect()
    {

        if(this.args.debug.do_shadows)
        {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        }

        if(this.args.debug.do_bloom)
        {
            //render pass
            const renderScene = new RenderPass( this.scene, this.camera );
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

    debug_set_stats_windows()
    {
        // stats
        this.stats = new Stats();
        this.args.dom_canvas.appendChild( this.stats.dom );
    }

    
    update_loop()
    {
        if( this.args.debug.do_flare )
        {
            // light - change position
            this.light_lens_flare.position.x = Math.sin(rad(45)+this.update_loop_eval_count*0.01)*120
            this.light_lens_flare.position.y = Math.cos(rad(45)+this.update_loop_eval_count*0.01)*120
        }        
    
        if( this.asset != null )
        {
            this.asset.update()
            this.asset.animate_three()
    
            //console.log('__________________' + animate_count)
            //console.log(`THREE Number of elements in the scene: ${countObjects(scene)}`);
            //console.log('Elements in the scene:', scene.children);
            //for( let F of current_asset.fidgets)
            //{
            //    //console.log( F.title , 'Mouse canvas element' , F.mouse_constraint.mouse.element);
            //    //console.log(F.mouse_constraint.world === F.matter_engine.world); // Should log true
            //}
                
        }
    
        //uniforms[ 'time' ].value = performance.now() / 1000;
        //current_asset.fidgets[0].bodies.geos.rectangle.mesh_three.shape.material.uniforms.time.value = performance.now() / 1000;
    
        if(this.args.debug.do_bloom)
        {
            let save_states = []
            for( let i = 0 ; i < this.asset.fidgets.length; i++)
                save_states.push( this.asset.fidgets[i].setup_bloom_pass() )
            this.bloomComposer.render()
            for( let i = 0 ; i < this.asset.fidgets.length; i++)
                this.asset.fidgets[i].clean_bloom_pass(save_states[i])
    
            this.finalComposer.render();
        }
        else
        {
            this.renderer.render( this.scene, this.camera );
        }
    
        if( this.stats != null)
            this.stats.update();
        
    }

    
    update_loop_global()
    {
        this.update_loop()
        this.update_loop_eval_count += 1
    }


}




