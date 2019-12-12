const image = require('./robots/image.js');
const text = require('./robots/text.js');
const setup = require('./robots/setup.js');

async function start() {
    try {
        await setup();
        await image();
        await text('bababa');
    } catch(e) {
        console.log(e);
    }
}

start();
