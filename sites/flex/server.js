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
    try { await fs.appendFile('csv/' + name + '.csv', '\r\n' + content); } catch {}
}

const formatFileFriendly = (date) => {
  return `doc_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  + `_${date.getUTCHours()}-${date.getMinutes()}-${date.getSeconds()}`;
}

const sanitizeBody = (body) => {
    const neobody = {};
    for (let i in body) {
        neobody[i] = body[i].toString().replaceAll(';', '_')
    }
    return neobody;
}

const timeToMinutes = (t) => {
    const split = t.split(":");
    const [hours, minutes] = split;
    return parseInt(hours) * 60 + parseInt(minutes);
}

const minuteDifference = (before, after) => {
    return after - before;
}

const padUnit = (u) => {
    let sU = u.toString();
    while (sU.length < 2) {
        sU = '0' + sU;
    }
    return sU;
}

const minutesToTime = (m) => {
    const hours = Math.floor((m - (m % 60))/60);
    const minutesMinusHours = m - hours * 60;
    return `${padUnit(hours)}:${padUnit(minutesMinusHours)}`;
}

const main = async () => {

    const time = new Date();
    const filename = formatFileFriendly(time);

    await makeCsvDir();
    await makeCsvFile(filename, 'navn;dato;tjekket ind;tjekket ud;forskel');

    const app = express();
    app.use(cors(), express.json());

    app.get('/api/download', (req, res) => {
        res.sendFile(path.join(__dirname, `./csv/${filename}.csv`));
    })

    app.post('/api/add', (req, res) => {
        const { name, date, begin, end } = sanitizeBody(req.body);
        const beginMinutes = timeToMinutes(begin);
        const endMinutes = timeToMinutes(end);
        const diffMinutes = minuteDifference(beginMinutes, endMinutes);
        const diffTime = minutesToTime(diffMinutes);
        appendCsvFile(filename, `${name};${date};${begin};${end};${diffTime}`);
        res.status(200).json({
            message: 'added to file'
        });
    })

    app.listen(8001);
}

main();
