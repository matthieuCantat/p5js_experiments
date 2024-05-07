


let width       = 400
let height      = 400

var mA = null
var mB = null
var mB_local = null

var pA = null
var pA_local = null

var draw_count = 0
function setup() {

  createCanvas(width, height);

  mA = new Matrix()//new Matrix([context]);
  mA.setTranslation(200,200)

  mB = new Matrix()//new Matrix([context]);
  mB.setTranslation(230,230)
  mB.setRotationDeg(20)

  mB_local = mB.getMult(mA.getInverse())

  pA = new Vector(150,150)
  pA_local = pA.getMult(mA.getInverse())



  
}



var end_update_count = 0

function draw() {
  
  background(50)


  mA.setTranslation(new Vector(200,200+draw_count))
  mA.setRotation(draw_count/5)
  mA.draw()

  mB.setTransform( mB_local.getMult(mA) )
  mB.draw()

  pA.set( pA_local.getMult(mA) )
  pA.draw()
  
  draw_count += 1
}

