const path = require('path');
const moment = require('moment');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const gm = require('gm').subClass({ imageMagick: true });

const videosDirectory = path.join(path.dirname(__filename), '../output/videos');

async function robot() {
    const durations = await getVideosDuration();
    const formatedText = await formatText(durations);
    await insertText(formatedText);
    //

    async function getVideosDuration() {
        let durations = [];
        const videos = await getVideosPath();

        for (let video of videos) {
            const videoPath = path.join(videosDirectory, video);
            const duration = await getVideoDuration(videoPath);

            durations.push({
                path: videoPath,
                duration
            });
        }
        return durations;
    }

    async function getVideoDuration(videoPath) {
        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .ffprobe((err, data) => {
                    if (err) reject(err);

                    resolve(data.format.duration);
                });
        });
    }

    async function formatText(durations) {
        let startTime = 0;
        const formated = durations.map((video, i) => {
            const index = i + 1;
            const videoName = video.path.split('/').reverse()[ 0 ].replace(/\.(mp4)$/i, '');
            const startingAt = moment('2019-01-01 00:00:00').add(startTime, 'seconds').format('HH:mm:ss');
            startTime += video.duration;
            return `[${index}] ${startingAt} - ${videoName}`;
        });
        return formated.join('\n');
    }


    async function getVideosPath() {
        return new Promise((resolve, reject) => {
            fs.readdir(videosDirectory, (err, files) => {
                if (err) reject(err);

                resolve(files);
            });
        });
    }

    function insertText(text) {
        const inputPath = path.join(path.dirname(__filename), '../output/images/resized.png');
        const outputPath = path.join(path.dirname(__filename), '../output/images/resized.png');

        const gravity = 'NorthWest'
        const font = 'Arial';
        const fontSize = 30;
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
