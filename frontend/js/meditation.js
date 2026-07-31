/**
 * MindWell - meditation.js
 * ------------------------
 * This file handles the logic for the interactive breathing exercise page.
 */

document.addEventListener('DOMContentLoaded', () => {
    const startStopBtn = document.getElementById('start-stop-btn');
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingText = document.getElementById('breathing-text');
    const audio = document.getElementById('peaceful-music');
    const audioSource = document.getElementById('audio-source');

    const sounds = {
        'sound-rain': 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_248c82eb5c.mp3?filename=gentle-rain-for-relaxation-and-sleep-337279.mp3',
        'sound-forest': 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_515949d06b.mp3?filename=forest-ambience-296528.mp3',
        'sound-ocean': 'https://cdn.pixabay.com/download/audio/2024/09/24/audio_34d1dd59a8.mp3?filename=ocean-waves-250310.mp3'
    };

    document.querySelectorAll('.sound-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            document.querySelectorAll('.sound-btn').forEach(b => {
                b.classList.remove('bg-white/20', 'border-white/50');
                b.classList.add('bg-white/10', 'border-white/30');
            });
            e.target.classList.remove('bg-white/10', 'border-white/30');
            e.target.classList.add('bg-white/20', 'border-white/50');

            // Change audio source
            audioSource.src = sounds[e.target.id];
            audio.load();
            if (isMeditating) {
                audio.play().catch(e => console.log('Audio playback blocked'));
            }
        });
    });

    let isMeditating = false;
    let intervalId = null;

    const startMeditation = () => {
        isMeditating = true;
        startStopBtn.textContent = 'Stop';
        breathingCircle.classList.add('animate');
        
        // Check if audio can be played
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("Audio playback failed:", error);
                // Audio playback might be blocked by the browser. 
                // You might want to show a message to the user to enable it.
            });
        }

        // Sync text with animation (8s duration)
        breathingText.textContent = 'Breathe In...';
        intervalId = setInterval(() => {
            breathingText.textContent = breathingText.textContent === 'Breathe In...' ? 'Breathe Out...' : 'Breathe In...';
        }, 4000); // Change text every 4 seconds
    };

    const stopMeditation = () => {
        isMeditating = false;
        startStopBtn.textContent = 'Start';
        breathingCircle.classList.remove('animate');
        audio.pause();
        audio.currentTime = 0; // Rewind audio
        clearInterval(intervalId);
        breathingText.textContent = 'Breathe In...';
    };

    startStopBtn.addEventListener('click', () => {
        if (isMeditating) {
            stopMeditation();
        } else {
            startMeditation();
        }
    });
});
