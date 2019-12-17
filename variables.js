const path = require('path');

const outputDir = path.join(path.dirname(__filename), 'output');
const videosDir = path.join(outputDir, 'videos');
const imagesDir = path.join(outputDir, 'images');
const tempDir = path.join(outputDir, 'temp');

module.exports = {
    outputDir,
    videosDir,
    imagesDir,
    tempDir
};
