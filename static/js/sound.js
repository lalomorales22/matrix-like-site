class MatrixSoundEffects {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGainNode = this.audioContext.createGain();
        this.masterGainNode.connect(this.audioContext.destination);
        this.masterGainNode.gain.value = 0.3; // Set default volume
    }

    async createOscillator(frequency, duration, type = 'sine') {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playMatrixRain() {
        const baseFreq = 800 + Math.random() * 400;
        this.createOscillator(baseFreq, 0.1, 'sine');
    }

    playButtonClick() {
        this.createOscillator(600, 0.1, 'square');
    }

    playScramble() {
        const frequencies = [440, 466.16, 493.88, 523.25];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.createOscillator(freq, 0.05, 'sawtooth');
            }, index * 50);
        });
    }

    playThemeChange() {
        const frequencies = [300, 400, 500, 600];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.createOscillator(freq, 0.15, 'sine');
            }, index * 100);
        });
    }

    playAsciiGenerated() {
        const frequencies = [600, 800, 1000];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.createOscillator(freq, 0.2, 'triangle');
            }, index * 150);
        });
    }
}

// Initialize sound effects
const matrixSounds = new MatrixSoundEffects();

// Add sound effects to existing interactions
document.addEventListener('DOMContentLoaded', () => {
    // Matrix text hover sound
    document.querySelectorAll('.matrix-text').forEach(element => {
        element.addEventListener('mouseover', () => {
            matrixSounds.playMatrixRain();
        });
    });

    // Button click sounds
    document.querySelectorAll('.matrix-button').forEach(button => {
        button.addEventListener('click', () => {
            matrixSounds.playButtonClick();
        });
    });

    // Theme change sound
    const themeSelect = document.getElementById('theme');
    if (themeSelect) {
        themeSelect.addEventListener('change', () => {
            matrixSounds.playThemeChange();
        });
    }

    // ASCII art generation sound
    const asciiForm = document.querySelector('form');
    if (asciiForm && window.location.pathname === '/ascii-generator') {
        asciiForm.addEventListener('submit', () => {
            matrixSounds.playAsciiGenerated();
        });
    }

    // Add sound to matrix rain effect
    const originalCreateRainDrop = MatrixEffect.prototype.createRainDrop;
    MatrixEffect.prototype.createRainDrop = function(container) {
        originalCreateRainDrop.call(this, container);
        if (Math.random() < 0.1) { // Only play sound 10% of the time to avoid overwhelming
            matrixSounds.playMatrixRain();
        }
    };
});
