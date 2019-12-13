const image = require('./robots/image.js');
const text = require('./robots/text.js');
const setup = require('./robots/setup.js');
const youtube = require('./robots/youtube.js');
const video = require('./robots/video.js');

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
        await setup();
        /*
        await youtube(videos);
        await image();
        await text();
        */
        await video(videos);
    } catch(e) {
        console.log(e);
    }
}

start();
