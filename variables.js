const path = require('path');

const outputDir = path.join(path.dirname(__filename), 'output');
const videosDir = path.join(outputDir, 'videos');
const imagesDir = path.join(outputDir, 'images');
const tempDir = path.join(outputDir, 'temp');

// Input
const background = path.join(path.dirname(__filename), 'images/background.png');

// Output
const videoFileList = path.join(tempDir, 'video-file-list.txt');
const mergedVideo = path.join(tempDir, 'merged-video.mp4');
const videoImage = path.join(tempDir, 'video-image.mp4');
const audio = path.join(tempDir, 'audio.mp3');
const image = path.join(tempDir, 'resized-image.png');
const finalResultVideo = path.join(tempDir, 'final-result-video.mp4');

module.exports = {
    outputDir,
    videosDir,
    imagesDir,
    tempDir,

    background,

    videoFileList,
    mergedVideo,
    videoImage,
    audio,
    image,
    finalResultVideo
};
