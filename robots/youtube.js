const path = require('path');
const fs = require('fs');
const youtubedl = require('youtube-dl');

async function robot(videos) {
    await downloadVideos();

    async function downloadVideos() {
        const inputPath = path.join(path.dirname(__filename), '../output/resized.png');
        const outputPath = path.join(path.dirname(__filename), '../output/resized.png');

        for(let video in videos) {
        }

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

    async download(video) {

    }
}

module.exports = robot;
