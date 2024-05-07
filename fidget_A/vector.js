
 function Vector(x,y) {

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

Vector.prototype = {

	set: function(x,y) {
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
	},

    ///////////////////////////
    normalize:function()
    {
        this.v = p5.Vector.normalize(this.v)
        return this
    },

    getNormalized:function()
    {
        let new_v = new Vector(this)
        new_v.normalize()
        return new_v
    },    
    ///////////////////////////
    mult: function(v) {

        if( v instanceof Vector)
        {
            this.v = p5.Vector.mult(this.v,v.v)
        }
        else if( v instanceof Matrix)
        {
            let m = v
            // position
            let p = m.get_row(2).v
            p = p5.Vector.add( p, p5.Vector.mult( m.get_row(0).v, this.v.x))
            p = p5.Vector.add( p, p5.Vector.mult( m.get_row(1).v, this.v.y))
            this.v = p
        }
        else
        {
            this.v = p5.Vector.mult(this.v,v)
        }
        return this
    },

	getMult: function(v)
    {
        let new_v = new Vector(this)
        new_v.mult(v)
        return new_v
	},
    ///////////////////////////
    add: function(v) {

        if( v instanceof Vector)
        {
            this.v = p5.Vector.add(this.v,v.v)
        }
        return this
    },

	getAdd: function(v)
    {
        let new_v = new Vector(this)
        new_v.add(v)
        return new_v
	},
    ///////////////////////////
    sub: function(v) {

        if( v instanceof Vector)
        {
            this.v = p5.Vector.sub(this.v,v.v)
        }
        return this
    },

	getSub: function(v)
    {
        let new_v = new Vector(this)
        new_v.sub(v)
        return new_v
	},

	///////////////////////////////////////////////////////////////////////////////////////////new
	rotate: function(angle) {
        this.v.rotate(angle) 
		return this;
	},

	setRotation: function(angle) {
		var cos = Math.cos(angle),
			sin = Math.sin(angle);
        this.v = createVector(cos, sin)	
		return this;
	},
	setRotationDeg: function(angle) {
		this.setRotation(angle/180*PI)
		return this;
	},	
	setScale: function(s) {
		this.normalize()
        this.mult(s)
		return this;
	},

	///////////////////////////////////////////////////////////////////////////////////////////new end
    x()
    {
        return this.v.x
    },
    y()
    {
        return this.v.y
    },
    get_value()
    {
        return {x: this.v.x , y: this.v.y}
    },
    dot(v)
    {
        return p5.Vector.dot(this.v,v.v)
    },
    mag()
    {
        return this.v.mag()
    },
	getNormal: function(other_side = false) {
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
	},

    log:function(title=null)
    {
        if(title != null)
        {
            console.log( title, round(this.v.x,2),round(this.v.y,2))            
        }
        else{
            console.log( round(this.v.x,2),round(this.v.y,2))
        }

    },
	
	draw: function(p=null,c=[255,0,0]) {
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

            fill(c)
            quad( 
                pA.v.x,pA.v.y,
                pB.v.x,pB.v.y,
                pC.v.x,pC.v.y,
                pD.v.x,pD.v.y,)
    
            p.draw()
        }
        else
        {
            fill(255,255,255)
            circle(this.v.x,this.v.y,10)            
        }

	}	
};