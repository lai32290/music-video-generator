const path = require('path');
const fs = require('fs');
const youtubedl = require('youtube-dl');

async function robot({ videos }) {
    await downloadVideos();

    async function downloadVideos() {
        for(let video of videos) {
            await download(video);
        }
    }

    async function download({ name, url }) {
        const outputPath = path.join(path.dirname(__filename), `../output/videos/${name}.mp4`);

        return new Promise((resolve, reject) => {
            let pos = 0;
            let size = 0;
            const video = youtubedl(url);
            video.pipe(fs.createWriteStream(outputPath));

            video.on('info', info => {
                size = info.size;
            });

            video.on('data', chunk => {
                pos += chunk.length;
                if (size) {
                    let percent = (pos / size * 100).toFixed(2);
                    process.stdout.cursorTo(0);
                    process.stdout.clearLine(1);
                    process.stdout.write(`Downloading ${name} - ${percent}%`);
                }
            })

            video.on('error', err => {
                console.log('Error on downloading video...', err);
                reject(err);
            });

            video.on('end', () => {
                console.log('\r');
                console.log(`Video ${name} downloaded.`);
                resolve();
            });
        });
    }
}

module.exports = robot;
