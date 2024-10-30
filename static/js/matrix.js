class MatrixEffect {
    constructor() {
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
        this.elements = document.querySelectorAll('.matrix-text');
        this.init();
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
}

document.addEventListener('DOMContentLoaded', () => {
    new MatrixEffect();
});
