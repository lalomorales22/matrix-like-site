class MatrixEffect {
    constructor() {
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
        this.elements = document.querySelectorAll('.matrix-text');
        this.loadingElements = document.querySelectorAll('.matrix-loading');
        this.init();
        this.initLoadingAnimations();
        this.initRainEffect();
        this.initInteractiveEffects();
    }

    init() {
        this.elements.forEach(element => {
            this.animateText(element);
            this.makeTextInteractive(element);
        });
    }

    animateText(element) {
        const originalText = element.textContent;
        const length = originalText.length;
        let iterations = 0;

        const interval = setInterval(() => {
            element.textContent = element.textContent
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return this.characters[Math.floor(Math.random() * this.characters.length)];
                })
                .join('');

            if (iterations >= length) {
                clearInterval(interval);
            }

            iterations += 1/3;
        }, 50);
    }

    initLoadingAnimations() {
        this.loadingElements.forEach(element => {
            this.startLoadingAnimation(element);
        });
    }

    startLoadingAnimation(element) {
        const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        let frameIndex = 0;

        setInterval(() => {
            element.textContent = frames[frameIndex];
            frameIndex = (frameIndex + 1) % frames.length;
        }, 100);
    }

    initRainEffect() {
        const container = document.createElement('div');
        container.className = 'matrix-rain';
        document.body.appendChild(container);

        for (let i = 0; i < 50; i++) {
            this.createRainDrop(container);
        }
    }

    createRainDrop(container) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${Math.random() * 2 + 1}s`;
        drop.textContent = this.characters[Math.floor(Math.random() * this.characters.length)];
        container.appendChild(drop);

        drop.addEventListener('animationend', () => {
            drop.remove();
            this.createRainDrop(container);
        });
    }

    makeTextInteractive(element) {
        element.addEventListener('mouseover', () => {
            const text = element.textContent;
            this.scrambleText(element, text);
        });
    }

    scrambleText(element, originalText) {
        let iterations = 0;
        const maxIterations = 10;

        const interval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char) => {
                    if (char === ' ') return char;
                    return this.characters[Math.floor(Math.random() * this.characters.length)];
                })
                .join('');

            if (iterations >= maxIterations) {
                clearInterval(interval);
                element.textContent = originalText;
            }
            iterations++;
        }, 50);
    }

    initInteractiveEffects() {
        document.querySelectorAll('.ascii-box').forEach(box => {
            box.addEventListener('click', () => {
                box.classList.add('ascii-pulse');
                setTimeout(() => box.classList.remove('ascii-pulse'), 500);
            });
        });
    }
}

// Initialize matrix effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MatrixEffect();
    
    // Add hover effects for matrix buttons
    document.querySelectorAll('.matrix-button').forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 0 10px var(--matrix-primary)';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = 'none';
        });
    });
});
