
class body_build{
  
    constructor( in_options ){
    // Default options
      const defaultOptions = {
        m: new Matrix(),
        m_offset: new Matrix(),
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        slop: 0,
        box: null,
        type: -1,
        rot: 0,
        limit_rot: null,
        collision: true,
        collision_category: utils.collision_category.default,
        collision_mask: utils.collision_category.default,
        fix_rot:false,
        color:utils.color.grey,
        shader:null,
        axe_constraint: null,
        density:0.001,
        mass:null,
      };
      const args = { ...defaultOptions, ...in_options };
      
      this.m = args.m
      this.m_offset = args.m_offset
      this.x = args.x
      this.y = args.y
      this.w = args.w
      this.h = args.h
      this.slop = args.slop
      this.rot = rad(args.rot)
      this.extra_rotation = 0
      this.rot_override = null
      this.limit_rot = args.limit_rot
      this.scale = 1.0
      this.fix_rot = args.fix_rot
      this.color = args.color
      this.color_base = args.color
      this.shader = args.shader
      this.collision = args.collision
      this.collision_category = args.collision_category
      this.collision_mask = args.collision_mask
      this.visibility = 1
      this.visibility_override = true
      this.density = args.density
      this.mass = args.mass
  
      this.constraints = []
      this.c_axe = null
      if(args.axe_constraint != null)
        this.c_axe = new cns_axe({ Follower: this, ...args.axe_constraint})
  
      var max_choice = 10
      if(args.type != -1)
        this.type = args.type
      else
        this.type = min(max(Math.round(Matter.Common.random(-1, max_choice+1)),0),max_choice)
  
      this.shape_vertices = Matter.Vertices.create([], Matter.Body)
  
      if( args.box != null )
      {
        this.x = args.box.body.position.x
        this.y = args.box.body.position.y
        this.w = args.box.w
        this.h = args.box.h
        this.type = args.box.type
        this.shape_vertices = args.box.shape_vertices
      }
      else
      {
        switch(this.type) {    
          case 1:
            this.w = args.w/2
            break;
          case 2:
            this.w = args.w/2
            break; 
          case 3:
            this.w = args.w/2
            break;  
          case 4:
            this.w = args.w/2
            break;               
          case 5:
            this.w = args.w/2
            var points_scale = []
            for(let i = 0; i < arrow.length;i+=2)
              points_scale.push( { x:arrow[i]*this.w, y:arrow[i+1]*this.w})
            this.shape_vertices = Matter.Vertices.create(points_scale, Matter.Body)      
            break;     
          case 6:
            this.w = args.w/2
            var points_scale = []
            for(let i = 0; i < chevron.length;i+=2)
              points_scale.push( { x:chevron[i]*this.w, y:chevron[i+1]*this.w})
            this.shape_vertices = Matter.Vertices.create(points_scale, Matter.Body)      
            break;    
          case 7:
            this.w = args.w/2
            var points_scale = []
            for(let i = 0; i < star.length;i+=2)
              points_scale.push( { x:star[i]*this.w, y:star[i+1]*this.w})
            this.shape_vertices = Matter.Vertices.create(points_scale, Matter.Body)      
            break;   
          case 8:
            this.w = args.w/2
            var points_scale = []
            for(let i = 0; i < horseShoe.length;i+=2)
              points_scale.push( { x:horseShoe[i]*this.w, y:horseShoe[i+1]*this.w})
            this.shape_vertices = Matter.Vertices.create(points_scale, Matter.Body)      
            break;
          case 10:
            //this.w = args.w/2
            //this.h = args.h/2
            break;                                                       
          }
      }
  
      let m_world = this.get_matrix()
      let p = m_world.get_row(2).get_value()
      switch(this.type) {
        case 0:
          this.body = Matter.Bodies.rectangle(p.x, p.y, this.w, this.h);
          Matter.Body.rotate(this.body, this.rot)
          break;
        case 1:
          this.body = Matter.Bodies.circle(p.x, p.y, this.w);
          Matter.Body.rotate(this.body, this.rot)
          break;
        case 2:
          this.body = Matter.Bodies.polygon(p.x, p.y, 3, this.w);
          Matter.Body.rotate(this.body, this.rot)
          break;
        case 3:
          this.body = Matter.Bodies.polygon(p.x, p.y, 5, this.w);
          Matter.Body.rotate(this.body, this.rot)
          break;     
        case 4:
          this.body = Matter.Bodies.polygon(p.x, p.y, 6, this.w);
          Matter.Body.rotate(this.body, this.rot)
          break;  
        case 5:    
          this.body = Matter.Bodies.fromVertices(p.x, p.y, this.shape_vertices)
          Matter.Body.rotate(this.body, this.rot)
          break;     
        case 6: 
          this.body = Matter.Bodies.fromVertices(p.x, p.y, this.shape_vertices)
          Matter.Body.rotate(this.body, this.rot)
          break;    
        case 7:     
          this.body = Matter.Bodies.fromVertices(p.x, p.y, this.shape_vertices)
          Matter.Body.rotate(this.body, this.rot)
          break;   
        case 8:     
          this.body = Matter.Bodies.fromVertices(p.x, p.y, this.shape_vertices)
          Matter.Body.rotate(this.body, this.rot)
          break;      
        case 9:  
          var bodyA = Matter.Bodies.rectangle(p.x, p.y, this.w, this.h/3);   
          var bodyB = Matter.Bodies.rectangle(p.x, p.y, this.w/3, this.h); 
          this.body = Matter.Body.create({parts: [bodyA, bodyB]});
          Matter.Body.rotate(this.body, this.rot)
          break; 
        case 10:  
          this.body = Matter.Bodies.trapezoid(p.x, p.y, this.w, this.h , rad(this.slop*2))
          Matter.Body.rotate(this.body, this.rot)
          break;        
        }
  
      Matter.Body.setDensity(this.body, this.density)
      if( this.mass != null )
        Matter.Body.setMass(this.body, this.mass)
  
      if(this.fix_rot)
      {
        var options = {
          bodyA: this.body,
          pA: { x: 0, y: 0 },
          pB: { x: p.x, y: p.y },
          stiffness: 1.0
        }
        this.constraints.push( new constraint_build(options) )
      }
      
  
      if( this.collision )
      {
        this.body.collisionFilter = {
          category:this.collision_category,
          group:0,
          mask:this.collision_mask ,
        }
      }
      else
      {
        this.body.collisionFilter = {
          category:0,
          group:-1,
          mask:-1,     
        }      
      }
  
  
      Matter.Composite.add( engine.world, this.body)
  
      //this.color = [100,100,100]
      this.colorStroke = [0,0,0]

      // shader

      this.draw_count = 0


      
      this.webgl_draw_coords_offset = createVector(-width/2,-height/2)
      if( use_webgl == false )
        this.webgl_draw_coords_offset = createVector(0,0)


      this.geo = null
    }

    preload()
    {
        console.log('preload : body')
    }

    setup()
    {
        console.log('setup : body')


        this.geo = new p5.Geometry();
        let pA = createVector(0, 0, 0);
        let pB = createVector(0, 0, 0);
        let pC = createVector(0, 0, 0);
        let pD = createVector(0, 0, 0);

        var pi2 = Math.PI*2
        switch(this.type) {
          case 0:
            // Create p5.Vector objects to position the vertices.
            pA = createVector( 0.5*this.w,  -0.5*this.h, 0);
            pB = createVector( 0.5*this.w, 0.5*this.h, 0);
            pC = createVector( -0.5*this.w, 0.5*this.h, 0);
            pD = createVector( -0.5*this.w,  -0.5*this.h, 0);
          
            // Add the vertices to the p5.Geometry object's vertices array.
            this.geo.vertices.push(pA, pB, pC); 
            this.geo.vertices.push(pA, pD, pC); 
            this.geo.faces.push([0, 1, 2]);
            this.geo.faces.push([3, 4, 5]);
            //this.geo.computeFaces(); 
            break
          case 1:
            // Create p5.Vector objects to position the vertices.
            pA = createVector(  0.5*this.w*2*this.scale, -0.5*this.w*2*this.scale, 0);
            pB = createVector(  0.5*this.w*2*this.scale,  0.5*this.w*2*this.scale, 0);
            pC = createVector( -0.5*this.w*2*this.scale,  0.5*this.w*2*this.scale, 0);
            pD = createVector( -0.5*this.w*2*this.scale, -0.5*this.w*2*this.scale, 0);
          
            // Add the vertices to the p5.Geometry object's vertices array.
            this.geo.vertices.push(pA, pB, pC); 
            this.geo.vertices.push(pA, pD, pC); 
            this.geo.faces.push([0, 1, 2]);
            this.geo.faces.push([3, 4, 5]);
            //this.geo.computeFaces(); 
            //circle(0,0,this.w*2*this.scale)
            break
          /*  
          case 2:
            pA = [cos(pi2*1/6)*this.w,sin(pi2*1/6)*this.w]
            pB = [cos(pi2*3/6)*this.w,sin(pi2*3/6)*this.w]
            pC = [cos(pi2*5/6)*this.w,sin(pi2*5/6)*this.w]
            triangle(pA[0], pA[1], pB[0], pB[1], pC[0], pC[1]);
            break
          case 3:
            beginShape(TESS);
            vertex(cos(pi2*1/10)*this.w,sin(pi2*1/10)*this.w);
            vertex(cos(pi2*3/10)*this.w,sin(pi2*3/10)*this.w);
            vertex(cos(pi2*5/10)*this.w,sin(pi2*5/10)*this.w);
            vertex(cos(pi2*7/10)*this.w,sin(pi2*7/10)*this.w);
            vertex(cos(pi2*9/10)*this.w,sin(pi2*9/10)*this.w);
            endShape(CLOSE);
            break    
          case 4:
            beginShape(TESS);
            vertex(cos(pi2*1/12)*this.w,sin(pi2*1/12)*this.w);
            vertex(cos(pi2*3/12)*this.w,sin(pi2*3/12)*this.w);
            vertex(cos(pi2*5/12)*this.w,sin(pi2*5/12)*this.w);
            vertex(cos(pi2*7/12)*this.w,sin(pi2*7/12)*this.w);
            vertex(cos(pi2*9/12)*this.w,sin(pi2*9/12)*this.w);
            vertex(cos(pi2*11/12)*this.w,sin(pi2*11/12)*this.w);
            endShape(CLOSE);
            break    
          case 5:     
            beginShape(TESS);
            for(let i = 0; i < this.shape_vertices.length;i++)
              vertex(this.shape_vertices[i].x, this.shape_vertices[i].y);
            endShape(CLOSE);
            break    
          case 6:     
            beginShape(TESS);
            for(let i = 0; i < this.shape_vertices.length;i++)
              vertex(this.shape_vertices[i].x, this.shape_vertices[i].y);
            endShape(CLOSE);
            break          
          case 7:        
            beginShape(TESS);
            for(let i = 0; i < this.shape_vertices.length;i++)
              vertex(this.shape_vertices[i].x, this.shape_vertices[i].y);
            endShape(CLOSE);
            break   
          case 8:     
            beginShape(TESS);
            for(let i = 0; i < this.shape_vertices.length;i++)
              vertex(this.shape_vertices[i].x, this.shape_vertices[i].y);
            endShape(CLOSE);
            break     
          case 9:       
            rectMode(CENTER)
            rect(0,0,this.w/3,this.h)
            rect(0,0,this.w,this.h/3)
            break;      
          case 10:       
            rectMode(CENTER)
            let w = this.w/2
            let h = this.h/2
            let ptA = new Vector(-w,  h)
            let ptB = new Vector(-w, -h)
            let ptC = new Vector( w, -h)
            let ptD = new Vector( w,  h)
            let vAB = ptB.getSub(ptA)
            let vDC = ptC.getSub(ptD)
            let slop_rad = rad(this.slop)
            vAB.rotate(slop_rad)
            vDC.rotate(slop_rad*-1)
            vAB.normalize()
            vDC.normalize()
            let new_length = this.h/cos(slop_rad)
            vAB.mult(new_length)
            vDC.mult(new_length)
            ptB = ptA.getAdd(vAB)
            ptC = ptD.getAdd(vDC)
    
            quad(ptA.x(), ptA.y(), ptB.x(), ptB.y(), ptC.x(), ptC.y(), ptD.x(), ptD.y());
            break;  
            */                                             
          }         


    }
   



    get_matrix()
    {
      return this.m_offset.getMult(this.m)
    }
  
  
  
    apply_scale( value )
    {
      this.scale = this.scale*value
      Matter.Body.scale( this.body, value, value, { x : this.body.position.x, y : this.body.position.y })
  
    }
  
    enable(value)
    {
      this.visibility = value
      if(this.visibility)
        this.body.collisionFilter.category = this.collision_category
      else
        this.body.collisionFilter.category = utils.collision_category.other
    }
  
    get_position()
    {
      return new Vector( this.body.position.x, this.body.position.y)
    }
  
    get_velocity()
    {
      return new Vector( this.body.velocity.x, this.body.velocity.y)
    }  
  
    set_position(v)
    {
      Matter.Body.setPosition(this.body, {x:v.v.x,y:v.v.y})
    }
  
    set_velocity(v)
    {
      Matter.Body.setVelocity(this.body, {x:v.v.x,y:v.v.y})
    }  
  
    set_angle(a)
    {
      Matter.Body.setAngle(this.body, this.rot+a)
    }
  
    set_anglular_velocity(a)
    {
      Matter.Body.setAngularVelocity(this.body, a)
    }
  
    apply_force(p,v)
    {
      Matter.Body.applyForce(this.body, p.v, v.v)
    }
  
  
    get_matrix()
    {
      return this.m_offset.getMult(this.m)
    }  
  
    clean_velocity()
    {
      Matter.Body.setVelocity(this.body, {x:0,y:0}) 
      Matter.Body.setAngularVelocity(this.body, 0)    
    }
  
    update()
    {
      //let p = this.get_matrix().get_row(2)
      
  
      if(this.limit_rot!=null)
      {
        if( this.body.angle < this.limit_rot[0] )
        {
          Matter.Body.setAngle(this.body, this.limit_rot[0])
          Matter.Body.setAngularVelocity(this.body, 0)    
      
        }    
        if( this.limit_rot[1] < this.body.angle )
        {
          Matter.Body.setAngle(this.body, this.limit_rot[1])
          Matter.Body.setAngularVelocity(this.body, 0)      
        }    
      }
  
      if( this.c_axe != null )
        this.c_axe.apply()
   
  
      if(this.rot_override!=null)
        Matter.Body.setAngle(this.body, this.rot_override )
  
      for( let i = 0; i < this.constraints.length; i++)
      {
        let p = this.get_matrix().get_row(2).get_value()
        this.constraints[i].pB = p
        this.constraints[i].update()
      }
        
     
    }
  
    draw(){
      //
      if( (this.visibility == 0 )||(this.visibility_override == false)) 
        return
      push(); // Start a new drawing state
  
      
      if(this.debug)
      {
        if(( this.c_axe != null)&&(this.c_axe.debug_pts[0]!=null)&&(this.c_axe.enable == true ))
          line(this.c_axe.debug_pts[0].x(), this.c_axe.debug_pts[0].y(), this.c_axe.debug_pts[1].x(), this.c_axe.debug_pts[1].y());
      }
  
  
      fill(this.color)
      //strokeWeight(0);
      //stroke(this.colorStroke)
      
      if( this.shader != null)
      {
        this.shader.iFrame = this.draw_count;
        this.shader.iTime = millis() / 1000.0; 
        this.shader.iMouse = { x: 0, y: 0};
      
        this.shader.bg_animation = 1.
        this.shader.bg_grain = 1.
        this.shader.bg_grain_scale = 14.
        this.shader.bg_grid = 0.0
        this.shader.bg_grid_scale = 10.0
        this.shader.bg_grid_line_scale =  2.0
        this.shader.bg_grid_point_scale =  2.0
      
        this.shader.bg_typeA = 0.0;
        this.shader.bg_typeB = 0.0;
        this.shader.bg_typeC = 1.0;
        this.shader.bg_typeD = 0.;
        this.shader.bg_type_discoTarget= 0.;
      
        this.shader.light_beam = 0.0
        this.shader.debug = 0    
  
        this.shader.as_texture()
      }

      
      
  
      translate(this.webgl_draw_coords_offset.x+this.body.position.x,this.webgl_draw_coords_offset.y+this.body.position.y)
      rotate(this.body.angle);
  
      var pi2 = Math.PI*2
      switch(this.type) {
        case 0:
          if(use_webgl)
          {
            //model(this.geo)
            plane(this.w,this.h,);
          }
          else{
            rectMode(CENTER)
            let corner_radius = 2
            rect(0,0,this.w,this.h, corner_radius)
          }
          break
        case 1:
          if(use_webgl)
          {
            //model(this.geo)
            sphere(this.w*2*this.scale/2.,10, 7)
          }
          else{
            circle(0,0,this.w*2*this.scale)
          }
          break  
        case 2:
          let pA = [cos(pi2*1/6)*this.w,sin(pi2*1/6)*this.w]
          let pB = [cos(pi2*3/6)*this.w,sin(pi2*3/6)*this.w]
          let pC = [cos(pi2*5/6)*this.w,sin(pi2*5/6)*this.w]
          triangle(pA[0], pA[1], pB[0], pB[1], pC[0], pC[1]);
          break
        case 3:
          beginShape(TESS);
          vertex(cos(pi2*1/10)*this.w,sin(pi2*1/10)*this.w);
          vertex(cos(pi2*3/10)*this.w,sin(pi2*3/10)*this.w);
          vertex(cos(pi2*5/10)*this.w,sin(pi2*5/10)*this.w);
          vertex(cos(pi2*7/10)*this.w,sin(pi2*7/10)*this.w);
          vertex(cos(pi2*9/10)*this.w,sin(pi2*9/10)*this.w);
          endShape(CLOSE);
          break    
        case 4:
          beginShape(TESS);
          vertex(cos(pi2*1/12)*this.w,sin(pi2*1/12)*this.w);
          vertex(cos(pi2*3/12)*this.w,sin(pi2*3/12)*this.w);
          vertex(cos(pi2*5/12)*this.w,sin(pi2*5/12)*this.w);
          vertex(cos(pi2*7/12)*this.w,sin(pi2*7/12)*this.w);
          vertex(cos(pi2*9/12)*this.w,sin(pi2*9/12)*this.w);
          vertex(cos(pi2*11/12)*this.w,sin(pi2*11/12)*this.w);
          endShape(CLOSE);
          break    
        case 5:     
          beginShape(TESS);
          for(let i = 0; i < this.shape_vertices.length;i++)
            vertex(this.shape_vertices[i].x, this.shape_vertices[i].y);
          endShape(CLOSE);
          break    
        case 6:     
          beginShape(TESS);
          for(let i = 0; i < this.shape_vertices.length;i++)
            vertex(this.shape_vertices[i].x, this.shape_vertices[i].y);
          endShape(CLOSE);
          break          
        case 7:        
          beginShape(TESS);
          for(let i = 0; i < this.shape_vertices.length;i++)
            vertex(this.shape_vertices[i].x, this.shape_vertices[i].y);
          endShape(CLOSE);
          break   
        case 8:     
          beginShape(TESS);
          for(let i = 0; i < this.shape_vertices.length;i++)
            vertex(this.shape_vertices[i].x, this.shape_vertices[i].y);
          endShape(CLOSE);
          break     
        case 9:       
          rectMode(CENTER)
          rect(0,0,this.w/3,this.h)
          rect(0,0,this.w,this.h/3)
          break;      
        case 10: // trapezoid    
          if(use_webgl)
          {   
            plane(this.w,this.h,);
          }
          else{
            rectMode(CENTER)
            let w = this.w/2
            let h = this.h/2
            let ptA = new Vector(-w,  h)
            let ptB = new Vector(-w, -h)
            let ptC = new Vector( w, -h)
            let ptD = new Vector( w,  h)
            let vAB = ptB.getSub(ptA)
            let vDC = ptC.getSub(ptD)
            let slop_rad = rad(this.slop)
            vAB.rotate(slop_rad)
            vDC.rotate(slop_rad*-1)
            vAB.normalize()
            vDC.normalize()
            let new_length = this.h/cos(slop_rad)
            vAB.mult(new_length)
            vDC.mult(new_length)
            ptB = ptA.getAdd(vAB)
            ptC = ptD.getAdd(vDC)
    
            quad(ptA.x(), ptA.y(), ptB.x(), ptB.y(), ptC.x(), ptC.y(), ptD.x(), ptD.y());
          }

          break;  
                                                     
        } 
        
  
      if (this.debug)
      {
        let len = 10
        let wid = 2
        //strokeWeight(0);
        fill([255,0,0])
        rect( len/2.0, 0, len, wid)
        fill([0,255,0])
        rect( 0, len/2.0, wid, len)  
      }
  
  
      pop(); // Restore original state

      this.draw_count += 1
    }
  }
  


