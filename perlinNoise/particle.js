class particle{

    constructor(width , height)
    {
      this.width  = width
      this.height = height
      this.pos = createVector(random(0,this.width),random(0,this.height));
      this.vel = createVector(0,0);
      this.acc = createVector(0,0);
        
    }
    
    udpate( max_speed )
    {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);    
      
      if( max_speed < this.vel.mag() )
        this.vel.setMag(max_speed);
    }
  
    applyForce( force )
    {
      this.acc.add( force );  
    }
    
    edges()
    {
      if( this.width  < this.pos.x   ) this.pos.x = 0.0
      if( this.pos.x  < 0            ) this.pos.x = this.width-0.1 
      if( this.height < this.pos.y   ) this.pos.y = 0.0
      if( this.pos.y  < 0            ) this.pos.y = this.height-0.1  
    }
      
  
    
    show( color , size )
    {
      stroke(color.x,color.y,color.z);
      strokeWeight(size);
      point(this.pos.x,this.pos.y)
    }  
    
    
  }