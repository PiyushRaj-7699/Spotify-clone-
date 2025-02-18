const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.static('path_to_your_static_files'));

app.get('/songs', (req, res) => {
    const songsDirectory = path.join(__dirname, 'path_to_your_static_files');
    fs.readdir(songsDirectory, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory: ' + err);
        }
        const songs = files.filter(file => file.endsWith('.mp3'));
        res.json(songs);
    });
});

app.listen(8080, () => {
    console.log('Server is running on http://172.16.0.2:8080');
});