


var canvas = document.getElementById("myCanvas");
var c = canvas.getContext("2d"); // to do the 2d drawing later

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;

var simMinWidth = 20.0
var cScale = Math.min(canvas.width,canvas.height) / simMinWidth;
var simWidth = canvas.width / cScale;
var simHeight = canvas.height / cScale;

function cX(pos){
    return pos.x * cScale
}

function cY(pos){
    return  canvas.height - pos.y  * cScale // canvas.height - pos.y * cScale seems wrong
}


var gravity = { x : 0.0, y: -10.0 };
var timeStep = 1.0/60.0;

var ball = {
    radius : 0.2,
    pos : { x : 0.2, y : 0.2 },
    vel : { x : 10.0, y : 15.0 },
}





function draw(){

    c.clearRect(0,0,canvas.width,canvas.height);
    c.fillStyle = "#FF0000" // red

    // draw a cirle
    c.beginPath();
    c.arc(
        cX(ball.pos), cY(ball.pos), cScale *ball.radius, 0.0, 2.0 * Math.PI);
    c.closePath();
    c.fill();

}

function simulate(){

    /*
        // F = M*A
        // Fg = M*G
            
        x  = 0.0    // m
        v  = 10.0   // m/s
        g  = -10.0  // m/s^2
        dt = 1.0/60 // s

        // simulation: 
        // -Time integration method:
        //   the methode to compute velocity and position for the next time step with the current
        // -Sympletic euler:
        //   this simple way to do it
        // IMPORTANT: update the velocity before the position is important for the stability of the sim
 
        while
            v = v + g*dt
            v = x + v*dt
        // NOTE: 
        //    With that method, we assum that during the duration of timestep dt, v and g are not changing
        //    which can introdure small error at each step
        //    To minimize this error we can reduce dt

        n = 5
        sdt = dt / 5
        while
            for _ in n
                v = v + g*sdt
                v = x + v*sdt        
        
    */

    ball.vel.x += gravity.x*timeStep;
    ball.vel.y += gravity.y*timeStep;
    ball.pos.x += ball.vel.x*timeStep;
    ball.pos.y += ball.vel.y*timeStep;

    if( ball.pos.x < 0 )
    {
        ball.pos.x = 0;
        ball.vel.x *= -1;
    }

    if( simWidth < ball.pos.x )
    {
        ball.pos.x = simWidth;
        ball.vel.x *= -1;
    }

    if( ball.pos.y < 0 )
    {
        ball.pos.y = 0;
        ball.vel.y *= -1;
    }

}

function update(){
    simulate();
    draw();
    requestAnimationFrame(update);

    //requestAnimationFrame -> smoothly updating animations or visual changes on a web page
}

update();