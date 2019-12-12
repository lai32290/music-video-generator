const image = require('./robos/image.js');
const text = require('./robos/text.js');

async function start() {
    try {
        await image();
        await text('bababa');
    } catch(e) {
        console.log(e);
    }
}

start();
