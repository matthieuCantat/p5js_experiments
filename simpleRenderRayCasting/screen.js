

class Screen{

  constructor(){ 
  }
  
  show(particle){
    var screenSize = [400,800];
    var fov = 300;   

    noStroke()
    let pNbr = particle.closests.length;
    let incr = ( screenSize[1] - screenSize[0] ) / pNbr;

    for( let i = 0; i < pNbr; i++){
      let x = i*incr;
      
      let v1 = createVector( particle.closests[i].x - particle.pos.x, 
                            particle.closests[i].y - particle.pos.y );
      let dist = v1.mag();
      let s_fov = 1 - dist /fov;
      let c_fov = 255 - (dist /fov * 255 )
      
      let c = color(c_fov, c_fov, c_fov, 255);
      fill(c);    
      
      let rHeight = (screenSize[1]-screenSize[0])*s_fov;
      rect(screenSize[0]+x,
           (400 - rHeight)/2, 
           incr, 
           rHeight);
           
    }
    
    
  }
  
}