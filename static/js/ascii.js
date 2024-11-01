class ASCIIArt {
    static borderTypes = {
        single: ['┌', '─', '┐', '│', '└', '┘'],
        double: ['╔', '═', '╗', '║', '╚', '╝'],
        bold: ['┏', '━', '┓', '┃', '┗', '┛'],
        dashed: ['┌', '╌', '┐', '┊', '└', '┘']
    };

    static getCurrentBorderStyle() {
        const borderSelect = document.getElementById('border_style');
        return borderSelect ? borderSelect.value : 'double';
    }

    static createBox(content, type = null) {
        type = type || this.getCurrentBorderStyle();
        const borders = this.borderTypes[type] || this.borderTypes.double;
        const lines = content.split('\n');
        const width = Math.max(...lines.map(line => line.length));
        
        let box = `${borders[0]}${borders[1].repeat(width + 2)}${borders[2]}\n`;
        
        lines.forEach(line => {
            const padding = ' '.repeat(width - line.length);
            box += `${borders[3]} ${line}${padding} ${borders[3]}\n`;
        });
        
        box += `${borders[4]}${borders[1].repeat(width + 2)}${borders[5]}`;
        
        return box;
    }

    static wrapContent(element) {
        const content = element.textContent;
        element.innerHTML = `<pre>${this.createBox(content)}</pre>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.ascii-wrap').forEach(element => {
        ASCIIArt.wrapContent(element);
    });

    // Update ASCII boxes when theme changes
    const themeSelect = document.getElementById('theme');
    const borderSelect = document.getElementById('border_style');
    
    [themeSelect, borderSelect].forEach(select => {
        if (select) {
            select.addEventListener('change', () => {
                document.querySelectorAll('.ascii-wrap').forEach(element => {
                    ASCIIArt.wrapContent(element);
                });
            });
        }
    });
});
