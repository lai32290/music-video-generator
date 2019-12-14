const fs = require('fs');
const path = require('path');

async function robot() {
    await createFilesAndPaths();

    function createFilesAndPaths() {
        const images = path.join(path.dirname(__filename), '../output/images');
        const videos = path.join(path.dirname(__filename), '../output/videos');
        const temp = path.join(path.dirname(__filename), '../output/temp');
        fs.mkdirSync(images, { recursive: true });
        fs.mkdirSync(videos, { recursive: true });
        fs.mkdirSync(temp, { recursive: true });
    }
}

module.exports = robot;
