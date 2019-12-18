const setup = require('./robots/setup.js');
const download = require('./robots/download.js');
const image = require('./robots/image.js');
const text = require('./robots/text.js');
const youtube = require('./robots/youtube.js');

const videos = [
    {
        name: 'Ed Sheeran - Shape of You',
        url: 'https://www.youtube.com/watch?v=JGwWNGJdvx8&list=PLaq655wqcKDkGZfYcXh2RGLj9jToo50Ev'
    },
    {
        name: 'Ed Sheeran - Shape of You 2',
        url: 'https://www.youtube.com/watch?v=JGwWNGJdvx8&list=PLaq655wqcKDkGZfYcXh2RGLj9jToo50Ev'
    }
];

async function start() {
    try {
		//await setup();
        //await download(videos);
        //await image();
        //await text();
		await youtube();
    } catch(e) {
        console.log(e);
    }
}

start();
