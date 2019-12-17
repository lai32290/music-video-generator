const fs = require('fs');
const path = require('path');

const {
	imagesDir,
	videosDir,
	tempDir
} = require('../variables');

async function robot() {
    await createFilesAndPaths();

    function createFilesAndPaths() {
        fs.mkdirSync(imagesDir, { recursive: true });
        fs.mkdirSync(videosDir, { recursive: true });
        fs.mkdirSync(tempDir, { recursive: true });
    }
}

module.exports = robot;
