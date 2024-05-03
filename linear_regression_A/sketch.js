

let particles = [];

let height = 400;
let width = 400;

function setup() {
  createCanvas(width, height);
  particles = [];
}

function map_point_to_num(p){
  let x = map(p[0],0,width,0,1);
  let y = map(p[1],0,height,0,1);
  let out_p = [x,y];
  return out_p;  
}

function map_point_to_draw(p){
  let x = map(p[0],0,1,0,width);
  let y = map(p[1],0,1,0,height);
  let out_p = [x,y];
  return out_p;  
}

function mousePressed() {
  let p = [mouseX,mouseY]
  particles.push(map_point_to_num(p));
}

function compute_regression(){
 
  let x_mean = 0;
  let y_mean = 0;
  
  for( let p of particles)
  {
    x_mean += p[0];
    y_mean += p[1];
    
  }  

  x_mean /= particles.length;
  y_mean /= particles.length;

  let numerator = 0;
  let denominator = 0;
  for( let p of particles)
  {
    numerator += (p[0] - x_mean)*(p[1] - y_mean);
    denominator += (p[0] - x_mean)*(p[0] - x_mean);
  }   
  let slop = numerator/denominator;
  
  let y_start = y_mean - x_mean*slop;

  return [slop,y_start];
}

function draw() {
  background(100);

  circle(mouseX,mouseY,10);

  for( let p of particles)
  {
    let p_to_draw = map_point_to_draw(p);
    circle(p_to_draw[0],p_to_draw[1],10);
  }

  if( 1 < particles.length)
  {
    let line_equation = compute_regression();
    let line_pA = map_point_to_draw([0,line_equation[1]]);
    let line_pB = map_point_to_draw([1,line_equation[0]+line_equation[1]]);
    line(line_pA[0], line_pA[1], line_pB[0], line_pB[1]);
  }

 
  
}