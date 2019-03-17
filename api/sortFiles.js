const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');
const inputDir = 'source';
const outputDir = 'output';

module.exports = function (app) {
    app.get('/sortFiles', (req, res) => {
        try {
            fs.accessSync(outputDir);
        } catch (e) {
            fs.mkdirSync(outputDir);
        }
        parseDir(inputDir).then(() => {
            res.send("Sort complete!");
        });
    });
};

async function parseDir(dir) {
    let filesList = fs.readdirSync(dir);

    await filesList.forEach(async (file) => {
            const stats = fs.statSync(path.join(dir, file));
            if (!stats.isDirectory()) {
                const metadata = await mm.parseFile(path.join(dir, file));

                let artist = (metadata.common.artist || "unsorted").replace(/\?+/g, "");
                let title = (metadata.common.title || file).replace(/\?+/g, "");
                if (!title.endsWith(metadata.format.dataformat)) {
                    title += "." + metadata.format.dataformat;
                }

                putIntoDir(path.join(dir, file), artist, title);

            } else {
                parseDir(path.join(dir, file))
            }
        }
    );
}

function putIntoDir(fileName, targetPath, targetFileName) {
    try {
        fs.accessSync(path.join(outputDir, targetPath));
    } catch (e) {
        fs.mkdirSync(path.join(outputDir, targetPath));
    }
    fs.copyFileSync(fileName, path.join(outputDir, targetPath, targetFileName))
}