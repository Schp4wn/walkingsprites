// Define canvas and context
const canvas = document.getElementById('b');
const c = canvas.getContext('2d');

// Define constants
const MAX = 96 * 60;
const img = new Image();
img.src = 'sprites.png';

// Define variables for animation
let time = 0;
let frame = 0;
let timeNextFrame = 0;
let vines = [{x:0,y:0,a:0,ai:0,w:8,p:[],l:MAX}];

// Function to initialize audio context
let audioCtx = null;
function initAudioContext() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

// Define the melody

const newMelody = [
    { note: 'G4', duration: 2 },
    { note: 'D5', duration: 2 },
    { note: 'C5', duration: 2 },
    { note: 'G4', duration: 2 },
    { note: 'D5', duration: 2 },
    { note: 'C5', duration: 2 },
    { note: 'G4', duration: 2 },
    { note: 'D5', duration: 2 },
    { note: 'C5', duration: 2 },
    { note: 'G4', duration: 2 },
    { note: 'D5', duration: 2 },
    { note: 'C5', duration: 2 },
    { note: 'G4', duration: 2 },
    { note: 'D5', duration: 2 },
    { note: 'C5', duration: 2 },
    { note: 'G4', duration: 2 },
];

let melodyIndex = 0; // Variable to keep track of current note index
let noteStartTime = 0; // Variable to store the start time of the current note

// Function to play note
function playNote() {
    if (!audioCtx) return; // Check if audio context is initialized
    const note = newMelody[melodyIndex]; // Get the current note from the melody
    const frequency = noteToFrequency(note.note); // Convert note name to frequency
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine'; // You can change the waveform type here (sine, square, sawtooth, triangle)
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    const durationInSeconds = note.duration * 0.1; // Adjust duration (0.5 seconds for each note)
    oscillator.stop(audioCtx.currentTime + durationInSeconds); // Stop the oscillator after the note duration
    melodyIndex = (melodyIndex + 1) % newMelody.length; // Move to the next note in the melody
    noteStartTime = audioCtx.currentTime; // Reset the note start time
}

// Function to convert note name to frequency
function noteToFrequency(note) {
    const notes = {
        'A0': 27.50, 'A#0': 29.14, 'B0': 30.87,
        'C1': 32.70, 'C#1': 34.65, 'D1': 36.71, 'D#1': 38.89, 'E1': 41.20, 'F1': 43.65, 'F#1': 46.25, 'G1': 49.00, 'G#1': 51.91, 'A1': 55.00, 'A#1': 58.27, 'B1': 61.74,
        'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
        'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
        'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
        'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
        'C6': 1046.50, 'C#6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'A6': 1760.00, 'A#6': 1864.66, 'B6': 1975.53,
        'C7': 2093.00, 'C#7': 2217.46, 'D7': 2349.32, 'D#7': 2489.02, 'E7': 2637.02, 'F7': 2793.83, 'F#7': 2959.96, 'G7': 3135.96, 'G#7': 3322.44, 'A7': 3520.00, 'A#7': 3729.31, 'B7': 3951.07,
        'C8': 4186.01
    };
    return notes[note];
}


// Add event listener to canvas for mouse click
canvas.addEventListener('click', function() {
    if (!audioCtx) {
        initAudioContext();
        setInterval(playNote, 500); // Adjust the interval (in milliseconds) between each note
    }
});

img.onload = function update() {
    requestAnimationFrame(update);

    // time update
    const currentTime = performance.now() / 1000;
    while (time < currentTime) {
        while (time < timeNextFrame) {
            time += 1 / 16384;
        }
        frame++;
        timeNextFrame += 1 / 60;

        // update visual
        vines = vines.filter(v => v.l--);
        vines.forEach(v => {
            dx = Math.cos(v.a) * v.w / 2;
            dy = Math.sin(v.a) * v.w / 2;
            v.x += dx;
            v.y += dy;
            v.a += v.ai / v.w / 2;
            v.p.splice(0, v.p.length - v.l);
            v.p.splice(0, v.p.length - 60 * 5);
            v.p.push({x:v.x, y:v.y, dx:dx, dy:dy});
            if (frame % 30 ==0) {
                v.ai = Math.random()-.5;
            }
            if (v.w > 1 && Math.random() < v.l / 16384 / 2) {
                vines.push({x:v.x,y:v.y,a:v.a,ai:v.ai,w:v.w/2,p:[],l:Math.min(v.l, 0|v.w*32*(1+Math.random()))});    
            }
        });

        // render visual
        const H = canvas.height = 512;
        const W = canvas.width = 0 | H * innerWidth / innerHeight;
        c.translate(W/2, H/2)
        c.shadowBlur = 24;
        vines.forEach(v => {
            c.shadowColor = 
            c.strokeStyle = 'hsl('+(v.a*60|0)+',100%,'+(60+v.w*5)+'%)';
            if (v.w == 8) {
                c.rotate(v.a);
                c.drawImage(img,frame*4&112,0,16,24,-5,0,-16,-24)
                c.rotate(-v.a);
                c.translate(-v.x,-v.y); 
            }
            c.beginPath();
            const l=v.p.length-1;
            for(let i=l;p=v.p[i];i--) {
                c.lineTo(p.x,p.y);
            }
            //c.strokeText([W, H, frame], 0, 0);
            c.stroke();
        });
    }
}
