const setup = require('./robots/setup.js');
const download = require('./robots/download.js');
const image = require('./robots/image.js');
const text = require('./robots/text.js');
const youtube = require('./robots/youtube.js');
const video = require('./robots/video.js');
const { videos } = require('./config.js');

async function start() {
    try {
        //await setup();
        //await youtube(videos);
        //await image();
        //await text(videos);
        //await video(videos);
		await youtube();
    } catch(e) {
        console.log(e);
    }
}

start();
