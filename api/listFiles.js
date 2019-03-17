const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');
let filesStats = [];
module.exports = function (app) {
    app.get('/listFiles', (req, res) => {
        const inputDir = 'source';
        parseDir(inputDir).then(()=>{
            res.render('files', {filesList: filesStats});
        });
    });
};

async function parseDir(dir) {
    let filesList = fs.readdirSync(dir);

    await filesList.forEach((file) => {
            const stats = fs.statSync(path.join(dir, file));
            if (!stats.isDirectory()) {
              mm.parseFile(path.join(dir, file))
                    .then(metadata => {
                        filesStats.push(metadata.common.artist + "-" + metadata.common.title);
                    })
                    .catch(err => {
                        console.error('Error: ' + err.message);
                    });
            } else {
                parseDir(path.join(dir, file))
            }
        }
    );

}