const express = require('express');
const path = require('path');

const IS_DEV = process.env.NODE_ENV === 'development';
const PORT = IS_DEV ? 8080 : 80;

const app = express();

app.use(express.static(__dirname));

app.get('/neon-golf', (req, res) => {
    res.send('<b>Neon Golf in development</b>');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(PORT, () => console.log('\x1b[36m%s\x1b[0m', '►  [Express] was started'));
