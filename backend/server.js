const express = require('express');
const fs = require('fs');
const busboy = require('connect-busboy');
const pdf = require('pdf-parse');
const app = express();
const port = 5000;

app.use(busboy());

app.post('/', async (req, res) => {
    const { user, pass, numOfJobs } = req.query;
    console.log(user, pass, numOfJobs);

    const getResumeData = async () => {
        let fstream;
        req.pipe(req.busboy);
        let resumeData = await new Promise((resolve, reject) => {
            req.busboy.on('file', (fieldname, file, filename) => {
                console.log(`Uploading: ${fieldname}: ${filename}`);
                let path = __dirname + '/files/' + filename;
                fstream = fs.createWriteStream(path);
                file.pipe(fstream);
                fstream.on('close', () => {
                    let dataBuffer = fs.readFileSync(path);
                    pdf(dataBuffer).then((data) => {
                        fs.unlinkSync(path);
                        resolve(data.text);
                    })
                })
            })
        })
        return resumeData;
    }
    let resumeData = await getResumeData();
    res.send(resumeData);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
