
class Matrix2d
{};

export default class Vector2d
{ 
    constructor(x,y)
    {
        this.x = 0
        this.y = 0
        if (arguments.length === 1)
        {
            let v = x
            this.x = v.x
            this.y = v.y
        }
        else if (arguments.length === 2)
        {
            this.x = x
            this.y = y	
        }
    }

	set(x,y) {

        this.x = 0
        this.y = 0
        if (arguments.length === 1)
        {
            let v = x
            this.x = v.x
            this.y = v.y
        }
        else if (arguments.length === 2)
        {
            this.x = x
            this.y = y	
        }

		return this;
	}

    ///////////////////////////
    normalize()
    {
        let length = this.mag()
        if( length === 0 )
            this.set(0,0)
        else
            this.mult( 1/length )
        return this
    }

    getNormalized()
    {
        let new_v = new Vector2d(this)
        new_v.normalize()
        return new_v
    }    

    ///////////////////////////
    mult(v) {
        if( v instanceof Vector2d)
        {
            this.x = this.x *v.x
            this.y = this.y *v.y
        }
        if( typeof v === 'number')
        {
            this.x *= v
            this.y *= v
        }        
        else
        {
            let m = v
            // position
            let p  = m.get_row(2)
            let vX = m.get_row(0)
            let vY = m.get_row(1)
            vX.mult(this.x)
            vY.mult(this.y)
            p.add( vX )
            p.add( vY )
            this.x = p.x
            this.y = p.y
        }
        return this
    }

	getMult(v)
    {
        let new_v = new Vector2d(this)      
        new_v.mult(v)
        return new_v
	}
    ///////////////////////////
    add(x,y) {

        if (arguments.length === 1)
        {
            let v = x
            this.x += v.x
            this.y += v.y
        }
        else if (arguments.length === 2)
        {
            this.x += x
            this.y += y
        }
        return this
    }

	getAdd(x,y)
    {
        let new_v = new Vector2d(this)
     
        if (arguments.length === 1)
        {
            let v = x
            new_v.add(v)
        }
        else if (arguments.length === 2)
        {
            new_v.add(x,y)   
        }
            
        return new_v
	}
    ///////////////////////////
    sub(v) {

        if( v instanceof Vector2d)
        {
            this.x -= v.x
            this.y -= v.y
        }
        return this
    }

	getSub(v)
    {
        let new_v = new Vector2d(this)
        new_v.sub(v)
        return new_v
	}

    getOrtho()
    {
        return new Vector2d(this.y,this.x*-1)
    }

	///////////////////////////////////////////////////////////////////////////////////////////new
	getRotation(vOther, clockwise = false)
    {
        //https://stackoverflow.com/questions/14066933/direct-way-of-computing-the-clockwise-angle-between-two-vectors
        let dot = this.x*vOther.x + this.y*vOther.y      // Dot product between [x1, y1] and [x2, y2]
        let det = this.x*vOther.y - this.y*vOther.x      // Determinant
        let angle = Math.atan2(det, dot)  // atan2(y, x) or atan2(sin, cos) 
        //let angle = this.v.angleBetween(v.v)
        if(clockwise)
        {
            let v_ortho = this.getOrtho()
            if(0 < v_ortho.dot(vOther) )
                angle = 2*Math.PI+angle
        }

        return angle
    }
    
    rotate(angle) {
        //this.v.rotate(angle) 

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        let x = this.x * cos - this.y * sin
        let y = this.x * sin + this.y * cos

        this.x = x
        this.y = y

		return this;
	}

    getRotated( angle ) {
        const v = new Vector2d(this);
        v.rotate(angle);
        return v
    }

	setRotation(angle) {
        let length = this.mag()
		this.x = Math.cos(angle) * length
		this.y =  Math.sin(angle) * length
		return this;
	}
	setRotationDeg(angle) {
		this.setRotation(angle/180*Math.PI)
		return this;
	}	
	setScale(s) {
		this.normalize()
        this.mult(s)
		return this;
	}

	///////////////////////////////////////////////////////////////////////////////////////////new end
    //x(){return this.x}
    //y(){ return this.y}
    get_value(){return {x: this.x , y: this.y }}
    dot(v)
    {
        return  this.x * v.x + this.y * v.y;
    }
    mag()
    {
        return Math.hypot(this.x, this.y)
    }
	getNormal(other_side = false) {
        let v = new Vector2d()
        if(other_side)
        {
            v.x = this.y
            v.y = this.x*-1
        }
        else{
            v.x = this.y*-1
            v.y = this.x           
        }

        return v
	}

    log(title=null){
        if(title != null)
        {
            console.log( title, Math.round(this.x,2),Math.round(this.y,2))            
        }
        else{
            console.log( Math.round(this.x,2),Math.round(this.y,2))
        }

    }
    
    is_equal_to(v)
    {
        if(this.x == v.x )
            if(this.y == v.y )
                return true
        return false
    }
	
    /*
	draw(p5,p=null,c=[255,0,0]) {
        let _w = 5
        let _h = 20


        if( p != null)
        {
            let v = new Vector2d(this)
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
        */	
};