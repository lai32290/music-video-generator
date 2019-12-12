const image = require('./robots/image.js');
const text = require('./robots/text.js');

async function start() {
    try {
        await image();
        await text('bababa');
    } catch(e) {
        console.log(e);
    }
}

start();
