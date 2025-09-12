// crée un contexteaudio
var contexteAudio = new (window.AudioContext || window.webkitAudioContext)();

// create Oscillator node
var oscillator = contexteAudio.createOscillator();
oscillator.connect(contexteAudio.destination);
oscillator.type = "square";
oscillator.frequency.value = 0; // valeur en hertz


var counter = 0;


oscillator.start();

function updateSound()
{
    requestAnimationFrame(updateSound);
    // change la fréquence de l'oscillateur en fonction de la valeur du compteur
    let wave = (Math.cos(counter*0.05)+1)/2
    oscillator.frequency.value = wave*440; // valeur en hertz
    counter +=1;
    console.log( (Math.cos(counter*0.01)+1)/2 )
}
updateSound();

