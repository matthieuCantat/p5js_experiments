
var sounds_to_buffer = { 
    "sfx_wii_bell_long_01" : null,
    "ost_creature_04" : null,
    "sfx_wii_synth_bell_melodie_01": null,
    "sfx_wii_short_tick_02": null,
    "sfx_occulus_artificial_close_01" : null,
    "sfx_creature_synth_03":null,
};


const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Load an audio file (e.g., a .wav or .mp3 in the same folder)
async function loadSamples() {

    for (const sound_name in sounds_to_buffer)
    {
        const url = `../../sounds/${sound_name}.mp3`; // Replace with the path to your audio file
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        sounds_to_buffer[sound_name] = await audioCtx.decodeAudioData(arrayBuffer);
    }
}

// Load sample at startup
loadSamples();


export function playSoundSample( sound_file_name, { volume = 1, fade_in_seconds = 0, loop = false } ) {
    
    if (!sounds_to_buffer[sound_file_name]) {
        console.log("Sample not loaded yet!");
        return;
    }
    console.log("playSoundSample")

    // create a buffer source, setup effect
    const source = audioCtx.createBufferSource();
    source.buffer = sounds_to_buffer[sound_file_name];
    source.loop = loop;
   
    const gainNode = audioCtx.createGain();
    
    source.connect( gainNode );
    
    gainNode.connect(audioCtx.destination);


    // play sound
    source.start();
    
    // set the volume fade in
    gainNode.gain.value = volume;
    if( 0 < fade_in_seconds )
    {
        
        const now = audioCtx.currentTime;

        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + fade_in_seconds);

    
    }
   
    

    source.onended = () => {
        console.log(' END')
      };

    return gainNode;
}


export class Sound {

    constructor( ) {
        this.gains = {}
    }
    
    start(name, sound_file_name, { fade_in_seconds = 0, loop = false }  ){
        console.log("Sound start")
        this.gains[name] = playSoundSample( sound_file_name, { volume : 1, fade_in_seconds : fade_in_seconds, loop : loop }  )
    }

    end( name, { fade_out_seconds = 0 } ) {
        
        if (!this.gains[name]) {
            console.log("Sound not found!");
            return;
        }
        let gainNode = this.gains[name]
        if( 0 < fade_out_seconds )
        {
            console.log("Sound end")
            const fadeOutDuration = fade_out_seconds;
            const now = audioCtx.currentTime;

            gainNode.gain.cancelScheduledValues(now);
            gainNode.gain.setValueAtTime(gainNode.gain.value, now);
            gainNode.gain.linearRampToValueAtTime(0, now + fadeOutDuration);

        }
        else
        {
            gainNode.gain.value = 0;
        }
     
    }


}