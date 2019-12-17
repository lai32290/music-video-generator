const image = require('./robots/image.js');
const text = require('./robots/text.js');
const setup = require('./robots/setup.js');
const youtube = require('./robots/youtube.js');
const video = require('./robots/video.js');
const { videos } = require('./config.js');

async function start() {
    try {
        await setup();
        await youtube(videos);
        await image();
        await text(videos);
        await video(videos);
    } catch(e) {
        console.log(e);
    }
}

start();
