const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const videosDir = path.join(path.dirname(__filename), '../output/videos');
const merged = path.join(videosDir, 'merged.mp4');
const videoImage = path.join(path.dirname(__filename), '../output/temp/videoImage.mp4');
const audio = path.join(path.dirname(__filename), '../output/temp/audio.mp3');
const image = path.join(path.dirname(__filename), '../output/images/resized.png');

async function robot(videos) {
    await createVideoFromImage();
    await mergeVideos();
    await mergeVideoAndAudio();

    async function createVideoFromImage() {
        return new Promise((resolve, reject) => {
            ffmpeg(image)
                .loop(3)
                .fps(1)
                .on('error', err => reject(err.message))
                .on('end', resolve)
                .save(videoImage);
        });
    }

    async function mergeVideos() {
        return new Promise(async (resolve, reject) => {
            const tempDir = path.join(videosDir, '../temp');

            const files = videos.map(v => `file '${path.join(videosDir, `${v.name}.mp4`)}'`).join('\n');
            const fileList = path.join(tempDir, 'files.txt');
            fs.writeFileSync(fileList, files);

            let command = ffmpeg(fileList)
                .inputOptions(['-f concat', '-safe 0'])
                .outputOptions('-c copy')
                .on('start', () => {
                    process.stdout.write('Video merging');
                })
                .on('progress', () => {
                    process.stdout.write('.');
                })
                .on('end', () => {
                    process.stdout.write('\r');
                    resolve();
                })
                .on('error', err => reject(err.message))
                .save(path.join(videosDir, 'merged.mp4'));
        });
    }

    async function mergeVideos2() {
        return new Promise(async (resolve, reject) => {
            const tempDir = path.join(videosDir, 'temp');

            let command = ffmpeg();
            videos.forEach(({name}) => {
                const file = path.join(videosDir, `${name}.mp4`);
                command.input(file);
            });
            command
                .videoCodec('copy')
                .output('/tmp/huelll.mp4')
                .on('start', () => {
                    process.stdout.write('Video merging');
                })
                .on('progress', () => {
                    process.stdout.write('.');
                })
                .on('end', () => {
                    process.stdout.write('\r');
                    resolve();
                })
                .on('error', err => reject(err.message))
                .run();
        });
    }

    async function mergeVideoAndAudio() {
        return new Promise((resolve, reject) => {
            console.log('t2')
            ffmpeg(videoImage)
                .addInput(merged)
                .audioCodec('copy')
                .on('error', err => reject(err.message))
                .on('end', resolve)
                .save(path.join(videosDir, 'final_result.mp4'));
        });
    }

}

module.exports = robot;
