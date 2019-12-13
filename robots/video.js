const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const videosDirectory = path.join(path.dirname(__filename), '../output/videos');

async function robot(videos) {
    await concatVideos();

    async function concatVideos() {
        return new Promise(async (resolve, reject) => {
            const mergedFile = path.join(videosDirectory, 'mergedVideo.mp4');
            const tempDir = path.join(videosDirectory, 'temp');

            let command = ffmpeg();

            videos.forEach(({name}) => {
                const file = path.join(videosDirectory, `${name}.mp4`);
                command.input(file);
            });

            command
                .on('error', err => reject(err.message))
                .on('end', resolve)
                .mergeToFile(mergedFile, tempDir);
        });
    }
}

module.exports = robot;
