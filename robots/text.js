const path = require('path');
const moment = require('moment');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const gm = require('gm').subClass({ imageMagick: true });
const {
	videosDir,
	image
} = require('../variables');

async function robot(videos) {
    const durations = await getVideosDuration();
    const formatedText = await formatText(durations);
    await insertText(formatedText);
    //

    async function getVideosDuration() {
        let durations = [];
        for (let video of videos) {
            const videoPath = path.join(videosDir, `${video.name}.mp4`);
            const duration = await getVideoDuration(videoPath);

            durations.push({
				name: video.name,
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
            const videoName = video.name;
            const startingAt = moment('2019-01-01 00:00:00').add(startTime, 'seconds').format('HH:mm:ss');
            startTime += video.duration;
            return `[${index}] ${startingAt} - ${videoName}`;
        });
        return formated.join('\n');
    }


    async function getVideosPath() {
        return new Promise((resolve, reject) => {
            fs.readdir(videosDir, (err, files) => {
                if (err) reject(err);

                resolve(files);
            });
        });
    }

    function insertText(text) {
        const inputPath = image;
        const outputPath = image;

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
