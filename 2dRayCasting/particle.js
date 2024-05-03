class Particle{
  
    constructor(x,y){
     
      this.pos = createVector(x,y);
      this.rays = []
      
      let rayIncr = PI*2 / 200;
      for( let a = 0; a < PI*2; a+=rayIncr )
        this.rays.push( new Ray( this.pos, a ) );
      
      
    }
    
    setPos(x,y)
    {
      this.pos.x = x;
      this.pos.y = y;
      for( let ray of this.rays ){
        ray.pos.x = x;   
        ray.pos.y = y;
      }
    }
    
    look( walls ){
      for( let ray of this.rays ){
        let record  = Infinity;
        let closest = null;
        
        for( let wall of walls ){
          let pt = ray.cast(wall);
          if(pt){
            let dist = p5.Vector.dist(ray.pos,pt);
            if( dist < record){
              record = dist;
              closest = pt;
            }       
          }
        }
        
        if( closest){
          line(this.pos.x,this.pos.y,closest.x,closest.y);
        }
          
        
      }
      
    }
    
    show( walls ){
      fill(255);
      for( let ray of this.rays ){
        ray.show();
      }
      stroke(255,255,255,50);
      strokeWeight(4);
      
      this.look( walls );
    }
    
    
  }