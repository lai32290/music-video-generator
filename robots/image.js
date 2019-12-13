const path = require('path');
const gm = require('gm').subClass({ imageMagick: true });

async function robot() {
    await resizeImage();

    function resizeImage() {
        const inputPath = path.join(path.dirname(__filename), '../images/background.png');
        const outputPath = path.join(path.dirname(__filename), '../output/images/resized.png');
        const width = 1280;
        const height = 720;

        return new Promise((resolve, reject) => {
            gm()
                .in(inputPath)
                .out('(')
                    .out('-clone')
                    .out('0')
                    .out('-blur', '0x9')
                    .out('-resize', `${width}x${height}^`)
                .out(')')
                .out('(')
                    .out('-clone')
                    .out('0')
                    .out('-resize', `${width * 0.9}x${height * 0.9}^`)
                .out(')')
                .out('-delete', '0')
                .out('-gravity', 'center')
                .out('-compose', 'over')
                .out('-composite')
                .out('-extent', `${width}x${height}`)
                .write(outputPath, err => {
                    if (err) reject(err);

                    console.log("Image resized.");
                    resolve();
                });
        });
    }
}

module.exports = robot;
