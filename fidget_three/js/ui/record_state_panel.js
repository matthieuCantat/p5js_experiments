
export default class Record_state_panel
{
    constructor(game_engine)
    {
        this.game_engine = game_engine

        this.record_panel = document.getElementById("record_state_control")

        document.getElementById("record_btn").addEventListener("click", () =>{this.record_btn()} );
        document.getElementById("play_btn").addEventListener("click", () =>{this.play_btn()} );
        document.getElementById("play_reverse_btn").addEventListener("click", () =>{this.play_reverse_btn()} );
        document.getElementById("delete_record_btn").addEventListener("click", () =>{this.delete_record_btn()} );
                
        this.game_engine.record_info.display_dom = document.getElementById("record_info")
        this.game_engine.record_info.display_dom.innerHTML = ""        
    }

    record_btn()
    {
        
        if( this.game_engine.record_info.state != "record" )
        {
            console.log("start recording")
            this.game_engine.record_info.state = "record"
        }
        else if( this.game_engine.record_info.state != "pause record" )
        {
            console.log("stop recording")
            this.game_engine.record_info.state = "pause record"
        }
        else if( this.game_engine.record_info.state != "record" )
        {
            console.log("restart recording")
            this.game_engine.record_info.state = "record"
        }
    }
    
    play_btn()
    {
        if( this.game_engine.record_info.state == "play" )
        {
            console.log("pause")
            this.game_engine.record_info.state = "pause"
        }
        else
        {
            console.log("play")
            this.game_engine.record_info.state = "play"
        }
        
    }
    
    play_reverse_btn()
    {
        if( this.game_engine.record_info.state == "play reverse" )
            {
                console.log("pause")
                this.game_engine.record_info.state = "pause"
            }
            else
            {
                console.log("play reverse")
                this.game_engine.record_info.state = "play reverse"
            }
    }
    
    delete_record_btn()
    {
        console.log("delete_record")
        this.game_engine.record_info.state = "delete"
    }    
}
