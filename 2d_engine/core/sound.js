
var sounds_to_buffer = { 
    "sfx_wii_bell_long_01" : null,
    "ost_creature_04" : null,
    "sfx_wii_synth_bell_melodie_01": null,
    "sfx_wii_short_tick_02": null,
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


export function playSoundSample( name ) {
    if (!sounds_to_buffer[name]) {
        console.log("Sample not loaded yet!");
        return;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = sounds_to_buffer[name];
    source.connect(audioCtx.destination);
    source.start();
}
