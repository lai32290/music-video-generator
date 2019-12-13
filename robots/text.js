const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const gm = require('gm').subClass({ imageMagick: true });

const videosDirectory = path.join(path.dirname(__filename), '../output/videos');

async function robot() {
    const videosDuration = await getVideosDuration();
    console.log(videosDuration);
    //await insertText();

    async function getVideosDuration() {
        const videos = await getVideosPath();
        let durations = [];

        for (let video of videos) {
            const videoPath = path.join(videosDirectory, video);
            const duration = await getVideoDuration(videoPath);

            durations.push(duration);
        }
        return durations;
    }

    async function getVideoDuration(videoPath) {
        return new Promise((resolve, reject) => {
            console.log(videoPath)
            ffmpeg(videoPath)
                .ffprobe((err, data) => {
                    if (err) reject(err);

                    resolve(data.format.duration);
                });
        });
    }

    async function getVideosPath() {
        return new Promise((resolve, reject) => {
            fs.readdir(videosDirectory, (err, files) => {
                if (err) reject(err);

                resolve(files);
            });
        });
    }

    function insertText() {
        const inputPath = path.join(path.dirname(__filename), '../output/resized.png');
        const outputPath = path.join(path.dirname(__filename), '../output/resized.png');

        const gravity = 'NorthWest'
        const font = 'Arial';
        const fontSize = 50;
        const fontColor = '#FFFFFF';
        const x = 10;
        const y = 10;

        return new Promise((resolve, reject) => {
            gm()
                .in(inputPath)
                .font(font, fontSize)
                .fill(fontColor)
                .drawText(x, y, text, gravity)
                .write(outputPath, err => {
                    if (err) reject(err);

                    console.log("Text added.");
                    resolve();
                });
        });
    }
}

module.exports = robot;
