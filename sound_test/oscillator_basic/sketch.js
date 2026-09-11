// crée un contexteaudio
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create Oscillator node
var oscillator = audioCtx.createOscillator();
const filter = audioCtx.createBiquadFilter();
const delay = audioCtx.createDelay();
const convolver = audioCtx.createConvolver();
const gainNode = audioCtx.createGain();
// 1. Low-pass filter

oscillator.connect(filter);
filter.connect(delay);
delay.connect(convolver);
convolver.connect(gainNode);
gainNode.connect(audioCtx.destination)

oscillator.type = "sine";//square, sine, sawtooth, triangle
oscillator.frequency.value = 0; // valeur en hertz


filter.type = "lowpass";
filter.frequency.value = 1500;

delay.delayTime.value = 0.1; // 250 ms echo


// Make a quick fake impulse response for demo
let numberOfChannels = 4;
let length = audioCtx.sampleRate * 0.4;
const impulse = audioCtx.createBuffer(numberOfChannels, length, audioCtx.sampleRate);

for (let channel = 0; channel < impulse.numberOfChannels; channel++) 
{
    let channelData = impulse.getChannelData(channel);
    for (let i = 0; i < channelData.length; i++)
    {
        channelData[i] = (Math.random() * 2 - 1) * (1 - i / channelData.length);
    }
}
convolver.buffer = impulse;

gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); //


var i = 0;

var wave_speed        = [0.05, 0.9, 0.01, 3.4];
var wave_amplitude    = [1.0 , 1.0, 0.01, 0.1,];
var wave_speed_offset = [0   ,0.2, 0.01, 0];

oscillator.start();

function updateSound()
{
    requestAnimationFrame(updateSound);
    // change la fréquence de l'oscillateur en fonction de la valeur du compteur
    let wave = 0;

    for( let j = 0; j < wave_speed.length; j++ )
    {
        wave += ( (Math.cos(i*wave_speed[j]+wave_speed_offset[j])+1)/2 )*wave_amplitude[j];
    }
    
    //wave = Math.min(1.3, wave);

    oscillator.frequency.value = wave * 440; // Hz (A4); // valeur en hertz
    i +=1;
}
updateSound();

