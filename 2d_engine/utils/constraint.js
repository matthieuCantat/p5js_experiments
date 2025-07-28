


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
            cns.value_base = []
            for( let i = 0 ; i < cns.objs.length; i++)
            {
                if(  cns.attrs[i] == 'r' )
                    cns.value_base.push(cns.objs[i].m.getRotation())
                else if( cns.attrs[i] == 'tx')
                    cns.value_base.push(cns.objs[i].m.get_row(2).x)
                else if( cns.attrs[i] == 'ty')
                    cns.value_base.push(cns.objs[i].m.get_row(2).y)
            }

        }
    }

    
	// CONSTRAINT
	update()
    {
        for( let cns of this.data )
        {
            // GET INDEX OF SELECTED OBJ
            let iMaster = -1
            if( (this.User_interaction.something_is_selected )&&(this.User_interaction.isInteracting))
            {
                for( let i = 0; i < cns.objs.length; i++)
                {
                    if( cns.objs[i] == this.User_interaction.selection_info.obj)
                    {
                        iMaster = i
                        break
                    }
                }
            }

            if( iMaster == -1)
                iMaster = 0

            // GET DRIVER VALUE
            let driver_value = 0
            
            if(      cns.attrs[iMaster] == 'r' )driver_value = cns.objs[iMaster].m.getRotation()
            else if( cns.attrs[iMaster] == 'tx')driver_value = cns.objs[iMaster].m.get_row(2).x
            else if( cns.attrs[iMaster] == 'ty')driver_value = cns.objs[iMaster].m.get_row(2).y
            driver_value -= cns.value_base[iMaster]
            driver_value *= cns.mult

            // SET DRIVER VALUE
            for( let i = 0; i < cns.objs.length; i++)
            {
                if( i == iMaster)
                    continue

                if( cns.attrs[i] == 'r')
                    cns.objs[i].m.setRotation(cns.value_base[i]+driver_value)
                else if( cns.attrs[i] == 'tx')
                {
                    let p = cns.objs[i].m.get_row(2)
                    p.x = cns.value_base[i]+driver_value
                    cns.objs[i].m.setRow(2,p)
                }	
                else if( cns.attrs[i] == 'ty')
                {
                    let p = cns.objs[i].m.get_row(2)
                    p.y  = cns.value_base[i]+driver_value
                    cns.objs[i].m.setRow(2,p)		
                }	
            }

    
        }
    }



}