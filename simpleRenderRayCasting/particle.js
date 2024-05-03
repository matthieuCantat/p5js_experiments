class Particle{
  
    constructor(x,y){
     
      this.pos = createVector(x,y);
      this.rays = []
      this.closests = []
  
      
      this.rayIncr      = PI*2 / 200;
      this.rayConeSize  = PI*2/6;
      this.rayConeFront = 0.0;
      const aStart = this.rayConeFront-this.rayConeSize/2;
      const aEnd   = this.rayConeFront+this.rayConeSize/2;
  
      for( let a = aStart; a < aEnd; a+=this.rayIncr ){
        this.rays.push( new Ray( this.pos, a ) );
      }
  
      
      
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
  
    setAngle(angle)
    {
  
      this.rayConeFront = angle;
      let aStart = this.rayConeFront-this.rayConeSize/2.0;
      let aEnd   = this.rayConeFront+this.rayConeSize/2.0;
      let i = 0;
      for( let a = aStart; a < aEnd; a += this.rayIncr ){
        
        let vAngle = p5.Vector.fromAngle(a);
        this.rays[i].dir.x = vAngle.x;
        this.rays[i].dir.y = vAngle.y;
        i+=1;
      }
  
    }
      
    
    look( walls ){
      
      this.closests = [];
      
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
          this.closests.push(closest);
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