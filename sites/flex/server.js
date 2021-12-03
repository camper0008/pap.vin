const express = require('express');
const fs = require('fs/promises');
const cors = require('cors');
const path = require('path');

const makeCsvDir = async () => {
    try { await fs.mkdir('csv'); } catch {}
}

const makeCsvFile = async (name, content) => {
    try { await fs.writeFile('csv/' + name + '.csv', content); } catch {}
}

const appendCsvFile = async (name, content) => {
    try { await fs.appendFile('csv/' + name + '.csv', '\n' + content); } catch {}
}

const formatFileFriendly = (date) => {
  return `doc_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  + `_${date.getUTCHours()}-${date.getMinutes()}-${date.getSeconds()}`;
}

const sanitizeBody = (body) => {
    const neobody = {};
    for (let i in body) {
        neobody[i] = body[i].toString().replaceAll(',', '_')
    }
    return neobody;
}

const main = async () => {
    
    const time = new Date();
    const filename = formatFileFriendly(time);    
    
    await makeCsvDir();
    await makeCsvFile(filename, 'navn;dato;tjekket ind;tjekket ud');
    
    const app = express();
    app.use(cors(), express.json());

    app.get('/api/download', (req, res) => {
        res.sendFile(path.join(__dirname, `./csv/${filename}.csv`));
    })

    app.post('/api/add', (req, res) => {
        const { name, date, begin, end } = sanitizeBody(req.body);
        appendCsvFile(filename, `${name};${date};${begin};${end}`);
        res.status(200).json({
            message: 'added to file'
        })    
    })

    app.listen(8001);
}

main();