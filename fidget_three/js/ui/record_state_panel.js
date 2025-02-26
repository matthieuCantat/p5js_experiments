
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
                
        this.game_engine.record_info_dom = document.getElementById("record_info")
        this.game_engine.record_info_dom.innerHTML = ""        
    }

    record_btn()
    {
        
        if( this.game_engine.record_state != "record" )
        {
            console.log("start recording")
            this.game_engine.record_state = "record"
        }
        else if( this.game_engine.record_state != "pause record" )
        {
            console.log("stop recording")
            this.game_engine.record_state = "pause record"
        }
        else if( this.game_engine.record_state != "record" )
        {
            console.log("restart recording")
            this.game_engine.record_state = "record"
        }
    }
    
    play_btn()
    {
        if( this.game_engine.record_state == "play" )
        {
            console.log("pause")
            this.game_engine.record_state = "pause"
        }
        else
        {
            console.log("play")
            this.game_engine.record_state = "play"
        }
        
    }
    
    play_reverse_btn()
    {
        if( this.game_engine.record_state == "play reverse" )
            {
                console.log("pause")
                this.game_engine.record_state = "pause"
            }
            else
            {
                console.log("play reverse")
                this.game_engine.record_state = "play reverse"
            }
    }
    
    delete_record_btn()
    {
        console.log("delete_record")
        this.game_engine.record_state = "delete"
    }    
}
