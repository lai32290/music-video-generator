const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

const {
    videosDir,
    tempDir,
    imagesDir,

    videoFileList,
    mergedVideo,
    videoImage,
    audio,
    image,
    finalResultVideo
} = require('../variables');

async function robot(videos) {
    await createVideoFromImage();
    await generateMergeFileList();
    await mergeVideos();
    await mergeVideoAndAudio();

    async function createVideoFromImage() {
        return new Promise((resolve, reject) => {
            ffmpeg(image)
                .videoCodec('libx264')
                .outputOptions([
                    '-pix_fmt', 'yuv420p',
                    '-shortest'
                ])
                .loop(3)
                .fps(250)
                .on('error', err => reject(err.message))
                .on('end', resolve)
                .save(videoImage);
        });
    }

    async function generateMergeFileList() {
        const files = videos
            .map(v => `file '${path.join(videosDir, `${v.name}.mp4`)}'`)
            .join('\n');
        fs.writeFileSync(videoFileList, files);
    }

    async function mergeVideos() {
        return new Promise(async (resolve, reject) => {
            let command = ffmpeg(videoFileList)
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
                .save(mergedVideo);
        });
    }

    async function mergeVideoAndAudio() {
        return new Promise((resolve, reject) => {
            ffmpeg(mergedVideo)
                .addInput(videoImage)
                .audioCodec('copy')
                .on('error', err => reject(err.message))
                .on('end', resolve)
                .save(finalResultVideo);
        });
    }

}

module.exports = robot;
