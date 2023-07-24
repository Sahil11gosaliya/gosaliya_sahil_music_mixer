// Variables
const audioElements = document.querySelectorAll('.audio');
const boxes = document.querySelectorAll('.box');
const dropZones = document.querySelectorAll('.drop-zone');
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');
const volumeSlider = document.getElementById('volume-slider');
let activeAudios = [];
let usedClips = []; // Array to keep track of used audio clips


// Function to start playing audio
function startAudio(audio, zone) {
    // Check if the maximum number of active audios (4) has been reached
    if (activeAudios.length >= 4 || !zone || zone.classList.contains('occupied')) {
        console.log('Cannot play audio. Maximum number of clips reached or drop zone is occupied.');
        return;
    }

    // Check if the clip has already been dropped
    if (usedClips.includes(audio.src)) {
        console.log('This clip has already been dropped.');
        return;
    }

    let newAudio = new Audio(audio.src);
    newAudio.loop = true;
    newAudio.play();
    newAudio.volume = volumeSlider.value / 100;

    // Mark the drop zone as occupied
    zone.classList.add('occupied');

    // Add the audio clip to the usedClips array
    usedClips.push(audio.src);

    // Active clip
    activeAudios.push(newAudio);

    // Show the SVG animation for the drop zone
    let svg = zone.querySelector('.drop-zone-svg');
    if (svg) {
        svg.style.display = 'block';
        svg.contentDocument.querySelector('svg').classList.add('animate');
    }

    // Add the "used" class to the box to make it black and white
    let box = document.getElementById(audio.id);
    box.classList.add('used');
}

// Function to reset the mixer
function resetMixer() {
    activeAudios.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
        audio.loop = false;
    });

    activeAudios = [];
    usedClips = [];

    // Reset the drag zone boxes
    boxes.forEach((box) => {
        box.classList.remove('blocked');
        box.classList.remove('used'); // Remove the "used" class to reset the color
    });

    // Reset the drop zones
    dropZones.forEach((zone) => {
        zone.classList.remove('occupied');
        let svg = zone.querySelector('.drop-zone-svg');
        if (svg) {
            svg.style.display = 'none';
            svg.contentDocument.querySelector('svg').classList.remove('animate');
        }
    });
}


// Setup drag and drop for all boxes
boxes.forEach((box) => {
    box.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', box.id);
    });

    // Function to block a dropped clip in the drag zone
    function blockClip() {
        box.classList.add('blocked');
    }

    box.addEventListener('drop', blockClip);
    box.addEventListener('dragend', blockClip);
});

// Setup drag and drop for all zones
dropZones.forEach((zone) => {
    zone.addEventListener('dragover', (e) => { e.preventDefault();});

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        let id = e.dataTransfer.getData('text/plain');
        let box = document.getElementById(id);
        let audio = box.querySelector('audio');
        startAudio(audio, zone);
    });
});

// Event Listeners
playButton.addEventListener('click', () => activeAudios.forEach((audio) => audio.play()));
pauseButton.addEventListener('click', () => activeAudios.forEach((audio) => audio.pause()));
resetButton.addEventListener('click', resetMixer);
volumeSlider.addEventListener('input', () => {
    let volume = volumeSlider.value / 100;
    activeAudios.forEach((audio) => (audio.volume = volume));
});