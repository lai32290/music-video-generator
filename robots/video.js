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
                .outputOptions([
                    '-pix_fmt', 'yuv420p',
                ])
                .loop(3)
                .fps(25)
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
            ffmpeg()
                .addInput(mergedVideo)
                .loop(1)
                .addInput(videoImage)
                .videoCodec('copy')
                .audioCodec('copy')
                .outputOptions([
                    '-pix_fmt', 'yuv420p',
                    '-shortest'
                ])
                .on('error', err => reject(err.message))
                .on('end', resolve)
                .save(finalResultVideo);
        });
    }

    async function mergeVideoAndAudio2() {
        return new Promise((resolve, reject) => {
            ffmpeg(image)
                .addInput(mergedVideo)
                .outputOptions([
                    '-pix_fmt', 'yuv420p',
                ])
                .filterComplex([
                    '[1:v][0:v]overlay'
                ])
                .videoCodec('libx264')
                .audioCodec('copy')
                .on('error', err => reject(err.message))
                .on('end', resolve)
                .save(finalResultVideo);
        });
    }

}

module.exports = robot;
