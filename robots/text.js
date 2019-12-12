const path = require('path');
const gm = require('gm').subClass({ imageMagick: true });

async function robot(text) {
    await insertText();

    function insertText() {
        const inputPath = path.join(path.dirname(__filename), '../images/resized.png');
        const outputPath = path.join(path.dirname(__filename), '../images/resized.png');
        //const text = 'Huehue';

        const gravity = 'NorthWest'
        const font = 'Arial';
        const fontSize = 50;
        const fontColor = '#FFFFFF';
        const x = 10;
        const y = 10;

        return new Promise((resolve, reject) => {
            gm()
                .in(inputPath)
                .font(font, fontSize)
                .fill(fontColor)
                .drawText(x, y, text, gravity)
                .write(outputPath, err => {
                    if (err) reject(err);

                    console.log("Text added.");
                    resolve();
                });
        });
    }
}

module.exports = robot;
