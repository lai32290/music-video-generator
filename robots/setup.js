const fs = require('fs');
const path = require('path');

async function robot() {
    await createFilesAndPaths();

    function createFilesAndPaths() {
        const directory = path.join(path.dirname(__filename), '../output');
        fs.mkdirSync(directory, { recursive: true });
    }
}

module.exports = robot;
