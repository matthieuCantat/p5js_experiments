
let walls = [];
let particle;
let screen;
let xoff = 0;
let yoff = 100;
let angle = 0;
let mapSize = [0,400]

function setup() {
  createCanvas(800, 400);
  for( let i = 0; i < 4; i+=1 ){
    let wx1 = random(0,400);
    let wy1 = random(0,400);
    let wx2 = random(0,400);
    let wy2 = random(0,400);
    walls.push( new Boundary(wx1,wy1,wx2,wy2) );    
  }
  
  walls.push( new Boundary(0,0,0,mapSize[1]) ); 
  walls.push( new Boundary(0,mapSize[1],mapSize[1],mapSize[1]) ); 
  walls.push( new Boundary(mapSize[1],mapSize[1],mapSize[1],0) ); 
  walls.push( new Boundary(mapSize[1],0,0,0) ); 

      
  particle = new Particle(0 , 0);
  screen = new Screen();
  
}




function draw() {
  background(0);
  if(keyIsPressed){
    if (keyCode == RIGHT_ARROW)
      angle += PI/20;
    if (keyCode == LEFT_ARROW)
      angle -= PI/20;    
  }

  
  if(( 10 < mouseX)&&(mouseX < mapSize[1] )&&(10 < mouseY)&&(mouseY < mapSize[1]) ){
    particle.setPos(mouseX, mouseY);    
    particle.setAngle(angle); 
  }
  else{
    particle.setPos(noise(xoff) * mapSize[1], noise(yoff) * mapSize[1]);
    xoff +=0.01;
    yoff +=0.01;
  }
  
  
  
  for( let wall of walls){
    wall.show();   
  }
  particle.show(walls); 
  screen.show(particle);

  
  
  
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