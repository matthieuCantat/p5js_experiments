
let walls = [];
let particle;
let xoff = 0;
let yoff = 100;

function setup() {
  createCanvas(400, 400);
  for( let i = 0; i < 4; i+=1 ){
    let wx1 = random(0,400);
    let wy1 = random(0,400);
    let wx2 = random(0,400);
    let wy2 = random(0,400);
    walls.push( new Boundary(wx1,wy1,wx2,wy2) );    
  }
  
  walls.push( new Boundary(0,0,0,width) ); 
  walls.push( new Boundary(0,width,width,width) ); 
  walls.push( new Boundary(width,width,width,0) ); 
  walls.push( new Boundary(width,0,0,0) ); 

      
  particle = new Particle(0 , 0);
  
}

function draw() {
  background(0);
  if(( 10 < mouseX)&&(mouseX < width )&&(10 < mouseY)&&(mouseY < height) ){
    particle.setPos(mouseX, mouseY);    
  }
  else{
    particle.setPos(noise(xoff) * width, noise(yoff) * height);
    xoff +=0.01;
    yoff +=0.01;
  }
  
  
  
  for( let wall of walls){
    wall.show();   
  }
  particle.show(walls); 

  
  
  
  //ray.show();
  //
  //ray.lookAt(mouseX, mouseY);
  //
  //let pt = ray.cast(wall);
  //if(pt){
  //  fill(255);
  //  ellipse(pt.x,pt.y,8,8);
  //}
  
}