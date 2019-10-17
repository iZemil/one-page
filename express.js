const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(80, () => console.log('\x1b[36m%s\x1b[0m', '►  [Express] was started'));
