const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const videosDirectory = path.join(path.dirname(__filename), '../output/videos');
const mergedVideo = path.join(videosDirectory, 'mergedVideo.mp4');
const image = path.join(path.dirname(__filename), '../output/images/resied.png');

async function robot(videos) {
    await concatVideos();
    await removeVideo();

    async function concatVideos() {
        return new Promise(async (resolve, reject) => {
            const mergedFile = mergedVideo;
            const tempDir = path.join(videosDirectory, 'temp');

            let command = ffmpeg();

            videos.forEach(({name}) => {
                const file = path.join(videosDirectory, `${name}.mp4`);
                command.input(file);
            });

            command
                .on('start', () => {
                    process.stdout.write('Video concatenating');
                })
                .on('progress', () => {
                    process.stdout.write('.');
                })
                .on('end', () => {
                    process.stdout.write('\r');
                    resolve();
                })
                .on('error', err => reject(err.message))
                .mergeToFile(mergedFile, tempDir);
        });
    }

    async function removeVideo() {
        return new Promise((resolve, reject) => {
            ffmpeg(mergedVideo)
                .input(image)
                .videoCodec('libx264')
                .on('codecData', () => {
                    console.log('hihihi')
                })
                .on('progress', () => {
                    console.log('hu')
                })
                .complexFilter([
                    {
                        filter: 'overlay',
                        options: {
                            enable: 'between(t,2,4)',
                            x: '810',
                            y: '465'
                        },
                        inputs: '[0:v][1:v]',
                        outputs: 'tmp'
                    }
                ], mergedVideo)
                .run();
        });
    }
}

module.exports = robot;
