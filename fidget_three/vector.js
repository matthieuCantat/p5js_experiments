import 'p5'
const createVector = p5.prototype.createVector;

class Matrix
{};

export default class Vector
{ 
    constructor(x,y)
    {
        this.v = null
        if (arguments.length === 0)
        {
            this.v = createVector(0,0)
        }
        if (arguments.length === 1)
        {
            let v = x
            this.v = createVector( v.v.x, v.v.y)
        }
        else if (arguments.length === 2)
        {
            this.v = createVector(x,y)	
        }
        else{
            this.v = createVector(0,0)
        }
    }

	set (x,y) {
		if (arguments.length === 0)
		{
            this.v = createVector(0,0)
		}
		else if (arguments.length === 1)
		{
            let v = x
            this.v = createVector(v.v.x,v.v.y)
		}
		else{
            this.v = createVector(x,y)	
		}

		return this;
	}

    ///////////////////////////
    normalize()
    {
        this.v = p5.Vector.normalize(this.v)
        return this
    }

    getNormalized()
    {
        let new_v = new Vector(this)
        new_v.normalize()
        return new_v
    }    
    ///////////////////////////
    mult(v) {
        if( v instanceof Vector)
        {
            this.v = p5.Vector.mult(this.v,v.v)
        }
        if( typeof v === 'number')
        {
            this.v = p5.Vector.mult(this.v,v)
        }        
        else
        {
            let m = v
            // position
            let p = m.get_row(2).v
            let x = m.get_row(0).v
            let y = m.get_row(1).v
            let vX = p5.Vector.mult( x, this.v.x)
            let vY = p5.Vector.mult( y, this.v.y)
            p = p5.Vector.add( p, vX)
            p = p5.Vector.add( p, vY)
            this.v = p
        }
        return this
    }

	getMult(v)
    {
        let new_v = new Vector(this)      
        new_v.mult(v)
        return new_v
	}
    ///////////////////////////
    add(v) {

        if( v instanceof Vector)
        {
            this.v = p5.Vector.add(this.v,v.v)
        }
        return this
    }

	getAdd(v)
    {
        let new_v = new Vector(this)
        new_v.add(v)
        return new_v
	}
    ///////////////////////////
    sub(v) {

        if( v instanceof Vector)
        {
            this.v = p5.Vector.sub(this.v,v.v)
        }
        return this
    }

	getSub(v)
    {
        let new_v = new Vector(this)
        new_v.sub(v)
        return new_v
	}

	///////////////////////////////////////////////////////////////////////////////////////////new
	getRotation(v)
    {
        return this.v.angleBetween(v.v)
    }
    
    rotate(angle) {
        this.v.rotate(angle) 
		return this;
	}

	setRotation(angle) {
		var cos = Math.cos(angle),
			sin = Math.sin(angle);
        this.v = createVector(cos, sin)	
		return this;
	}
	setRotationDeg(angle) {
		this.setRotation(angle/180*PI)
		return this;
	}	
	setScale(s) {
		this.normalize()
        this.mult(s)
		return this;
	}

	///////////////////////////////////////////////////////////////////////////////////////////new end
    x()
    {
        return this.v.x
    }
    y()
    {
        return this.v.y
    }
    get_value()
    {
        return {x: this.v.x , y: this.v.y}
    }
    dot(v)
    {
        return p5.Vector.dot(this.v,v.v)
    }
    mag()
    {
        return this.v.mag()
    }
	getNormal(other_side = false) {
        let new_v = new Vector()
        if(other_side)
        {
            new_v.v.x = this.v.y
            new_v.v.y = this.v.x*-1
        }
        else{
            new_v.v.x = this.v.y*-1
            new_v.v.y = this.v.x           
        }

        return new_v
	}

    log(title=null){
        if(title != null)
        {
            console.log( title, Math.round(this.v.x,2),Math.round(this.v.y,2))            
        }
        else{
            console.log( Math.round(this.v.x,2),Math.round(this.v.y,2))
        }

    }
	
	draw(p5,p=null,c=[255,0,0]) {
        let _w = 5
        let _h = 20


        if( p != null)
        {
            let v = new Vector(this)
            v.normalize().mult(_h)
            
            let vn = this.getNormal()
            vn.normalize().mult(_w)
            
            let pCenter = p.getAdd(v)
            

            let pA = pCenter.getSub(v).sub(vn)
            let pB = pCenter.getSub(v).add(vn)
            let pC = pCenter.getAdd(v).add(vn)
            let pD = pCenter.getAdd(v).sub(vn)

            p5.fill(c)
            p5.quad( 
                pA.v.x,pA.v.y,
                pB.v.x,pB.v.y,
                pC.v.x,pC.v.y,
                pD.v.x,pD.v.y,)
    
            p5.p.draw(p5)
        }
        else
        {
            p5.fill(255,255,255)
            p5.circle(this.v.x,this.v.y,10)            
        }

	}	
};