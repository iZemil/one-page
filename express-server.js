const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.static('build'));

app.get('*', (req, res) => {
    res.sendFile(path.join(`${__dirname}/build/index.html`));
});

app.listen(PORT, () =>
    console.log('\x1b[36m%s\x1b[0m', `►  [Express] was started: http://localhost:${PORT}`)
);
