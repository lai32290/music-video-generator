const image = require('./robots/image.js');
const text = require('./robots/text.js');
const setup = require('./robots/setup.js');
const youtube = require('./robots/youtube.js');

const videos = [
    {
        name: '來自天堂的魔鬼',
        url: 'https://www.youtube.com/watch?v=FWtbGkpdoP4&list=PLChSKu6fwZb0RFqjOewHoqmoZ-pBNlQ23'
    }
];

async function start() {
    try {
        await setup();
        await youtube(videos);
        await image();
        await text('bababa');
    } catch(e) {
        console.log(e);
    }
}

start();
