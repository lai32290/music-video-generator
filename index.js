const setup = require('./robots/setup.js');
const download = require('./robots/download.js');
const image = require('./robots/image.js');
const text = require('./robots/text.js');
const youtube = require('./robots/youtube.js');
const video = require('./robots/video.js');
const { videos } = require('./config.js');

const context = { videos };

async function start() {
    try {
		await setup();
		//await download(context);
		await image();
		await text(context);
		await video(context);
		await youtube(context);
    } catch(e) {
        console.log(e);
    }
}

start();
