


export class Constraints_info
{
    constructor(User_interaction)
    {
        this.data = []
        this.User_interaction = User_interaction
    }

    setup(data)
    {
        this.data = data   
        // store offset
        for( let cns of this.data )
        {
            if(      cns.attrs[0] == 'r' )
            {
                let mOffset = cns.objs[1].m.getMult( cns.objs[0].m.getInverse())
                cns.offset = mOffset.getRotation()
            }
            else if( cns.attrs[0] == 'tx')
            {
                let vOffset = cns.objs[1].m.get_row(2).getSub( cns.objs[0].m.get_row(2))
                cns.offset = vOffset.x
            }
            else if( cns.attrs[0] == 'ty')
            {
                let vOffset = cns.objs[1].m.get_row(2).getSub( cns.objs[0].m.get_row(2))
                cns.offset = vOffset.y                
            }
        }
    }

    
	// CONSTRAINT
	update()
    {
        for( let cns of this.data )
        {
            // SWITCH INTERACTION WITH SELECTION
            if( (this.User_interaction.something_is_selected )&&(this.User_interaction.isInteracting))
            {
                if( cns.objs[1] == this.User_interaction.selection_info.obj)
                {
                    cns.objs = [ cns.objs[1], cns.objs[0]]
                    cns.mult = 1/cns.mult
                    cns.attrs = [ cns.attrs[1], cns.attrs[0]]
                    cns.offset *= -1
                }	
            }
    
            // MOVE TRANSFORM
            let value = 0
            
            if(      cns.attrs[0] == 'r' )value = cns.objs[0].m.getRotation()
            else if( cns.attrs[0] == 'tx')value = cns.objs[0].m.get_row(2).x
            else if( cns.attrs[0] == 'ty')value = cns.objs[0].m.get_row(2).y
            value *= cns.mult

            value+=cns.offset
        
            if( cns.attrs[1] == 'r')
                cns.objs[1].m.setRotation(value)
            else if( cns.attrs[1] == 'tx')
            {
                let p = cns.objs[1].m.get_row(2)
                p.x = value
                cns.objs[1].m.setRow(2,p)
            }	
            else if( cns.attrs[1] == 'ty')
            {
                let p = cns.objs[1].m.get_row(2)
                p.y = value
                cns.objs[1].m.setRow(2,p)		
            }	
    
        }
    }



}