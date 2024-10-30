class MatrixEffect {
    constructor() {
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
        this.elements = document.querySelectorAll('.matrix-text');
        this.loadingElements = document.querySelectorAll('.matrix-loading');
        this.init();
        this.initLoadingAnimations();
    }

    init() {
        this.elements.forEach(element => {
            this.animateText(element);
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
